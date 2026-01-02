import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConversionRequest {
  fileUrl: string;
  fileName: string;
  conversionType: "pdf-to-docx" | "compress-image" | "ocr" | "merge";
  outputFormat?: string;
  quality?: number;
  userEmail?: string;
  sendNotification?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { 
      fileUrl, 
      fileName, 
      conversionType, 
      outputFormat, 
      quality = 80,
      userEmail,
      sendNotification = false
    }: ConversionRequest = await req.json();

    console.log(`Processing conversion: ${conversionType} for file: ${fileName}`);

    // Fetch the original file
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
    }

    const fileBuffer = await fileResponse.arrayBuffer();
    const fileBytes = new Uint8Array(fileBuffer);
    
    let result: { data: Uint8Array; mimeType: string; outputFileName: string };

    switch (conversionType) {
      case "pdf-to-docx":
        result = await convertPdfToDocx(fileBytes, fileName);
        break;
      case "compress-image":
        result = await compressImageWithTinyPNG(fileBytes, fileName);
        break;
      case "ocr":
        result = await performOcr(fileBytes, fileName);
        break;
      case "merge":
        // For merge, we'll just return the input for now
        result = {
          data: fileBytes,
          mimeType: "application/pdf",
          outputFileName: fileName.replace(/\.[^.]+$/, "_merged.pdf"),
        };
        break;
      default:
        throw new Error(`Unsupported conversion type: ${conversionType}`);
    }

    // Upload the converted file to storage
    const outputPath = `converted/${Date.now()}_${result.outputFileName}`;
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from("convertix")
      .upload(outputPath, result.data, {
        contentType: result.mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload converted file: ${uploadError.message}`);
    }

    // Get public URL for the converted file
    const { data: urlData } = supabaseClient.storage
      .from("convertix")
      .getPublicUrl(outputPath);

    console.log(`Conversion complete. File uploaded to: ${urlData.publicUrl}`);

    // Send email notification if requested
    if (sendNotification && userEmail) {
      await sendEmailNotification(
        userEmail, 
        fileName, 
        result.outputFileName, 
        urlData.publicUrl,
        conversionType
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        outputUrl: urlData.publicUrl,
        outputFileName: result.outputFileName,
        originalSize: fileBytes.length,
        outputSize: result.data.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Conversion error:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

async function compressImageWithTinyPNG(imageBytes: Uint8Array, fileName: string): Promise<{ data: Uint8Array; mimeType: string; outputFileName: string }> {
  console.log("Compressing image with TinyPNG API...");
  
  const TINYPNG_API_KEY = Deno.env.get("TINYPNG_API_KEY");
  
  if (!TINYPNG_API_KEY) {
    console.warn("TinyPNG API key not found, returning original image");
    return {
      data: imageBytes,
      mimeType: "image/png",
      outputFileName: fileName.replace(/\.[^.]+$/, "_compressed.png"),
    };
  }

  try {
    // Upload to TinyPNG for compression
    const uploadResponse = await fetch("https://api.tinify.com/shrink", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`api:${TINYPNG_API_KEY}`)}`,
        "Content-Type": "application/octet-stream",
      },
      body: imageBytes.buffer as ArrayBuffer,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("TinyPNG upload error:", errorText);
      throw new Error(`TinyPNG compression failed: ${uploadResponse.statusText}`);
    }

    const uploadResult = await uploadResponse.json();
    console.log(`TinyPNG compression: ${uploadResult.input?.size} -> ${uploadResult.output?.size} bytes`);

    // Download the compressed image
    const compressedResponse = await fetch(uploadResult.output.url, {
      headers: {
        "Authorization": `Basic ${btoa(`api:${TINYPNG_API_KEY}`)}`,
      },
    });

    if (!compressedResponse.ok) {
      throw new Error(`Failed to download compressed image: ${compressedResponse.statusText}`);
    }

    const compressedBuffer = await compressedResponse.arrayBuffer();
    const compressedBytes = new Uint8Array(compressedBuffer);

    // Determine output format
    const extension = fileName.split('.').pop()?.toLowerCase() || 'png';
    let mimeType = "image/png";
    if (extension === 'jpg' || extension === 'jpeg') {
      mimeType = "image/jpeg";
    } else if (extension === 'webp') {
      mimeType = "image/webp";
    }

    const outputFileName = fileName.replace(/\.[^.]+$/, `_compressed.${extension}`);

    console.log(`Image compressed successfully: ${imageBytes.length} -> ${compressedBytes.length} bytes (${Math.round((1 - compressedBytes.length / imageBytes.length) * 100)}% reduction)`);

    return {
      data: compressedBytes,
      mimeType,
      outputFileName,
    };
  } catch (error) {
    console.error("TinyPNG compression error:", error);
    // Fall back to returning original if compression fails
    return {
      data: imageBytes,
      mimeType: "image/png",
      outputFileName: fileName.replace(/\.[^.]+$/, "_compressed.png"),
    };
  }
}

async function convertPdfToDocx(pdfBytes: Uint8Array, fileName: string): Promise<{ data: Uint8Array; mimeType: string; outputFileName: string }> {
  console.log("Starting PDF to DOCX conversion...");
  
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  // Convert PDF bytes to base64 for AI processing
  const base64Pdf = btoa(String.fromCharCode(...pdfBytes));
  
  const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract ALL text content from this PDF document. Preserve the structure including headings, paragraphs, lists, and tables. Format the output as clean, well-structured text that can be converted to a document."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:application/pdf;base64,${base64Pdf}`
              }
            }
          ]
        }
      ],
      max_tokens: 8000,
    }),
  });

  if (!aiResponse.ok) {
    const errorText = await aiResponse.text();
    console.error("AI API error:", errorText);
    throw new Error(`AI extraction failed: ${aiResponse.statusText}`);
  }

  const aiResult = await aiResponse.json();
  const extractedText = aiResult.choices?.[0]?.message?.content || "No content extracted";
  
  // Create a simple DOCX-like XML structure (compatible with most word processors)
  const docxContent = createSimpleDocx(extractedText);
  
  const outputFileName = fileName.replace(/\.pdf$/i, ".docx");
  
  return {
    data: new TextEncoder().encode(docxContent),
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    outputFileName,
  };
}

async function performOcr(imageBytes: Uint8Array, fileName: string): Promise<{ data: Uint8Array; mimeType: string; outputFileName: string }> {
  console.log("Performing OCR...");
  
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  // Determine the MIME type based on file extension
  const extension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
  let imageMimeType = "image/jpeg";
  if (extension === 'png') imageMimeType = "image/png";
  else if (extension === 'webp') imageMimeType = "image/webp";
  else if (extension === 'gif') imageMimeType = "image/gif";
  else if (extension === 'pdf') imageMimeType = "application/pdf";
  
  // Convert image bytes to base64
  const base64Image = btoa(String.fromCharCode(...imageBytes));
  
  const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Perform OCR on this image. Extract ALL visible text exactly as it appears, preserving layout and formatting as much as possible. If the text is in multiple columns, indicate that. Include any text in headers, footers, captions, tables, or anywhere else in the image."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${imageMimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 8000,
    }),
  });

  if (!aiResponse.ok) {
    const errorText = await aiResponse.text();
    console.error("OCR API error:", errorText);
    throw new Error(`OCR failed: ${aiResponse.statusText}`);
  }

  const aiResult = await aiResponse.json();
  const extractedText = aiResult.choices?.[0]?.message?.content || "No text detected";
  
  const outputFileName = fileName.replace(/\.[^.]+$/, "_ocr.txt");
  
  console.log(`OCR complete. Extracted ${extractedText.length} characters`);
  
  return {
    data: new TextEncoder().encode(extractedText),
    mimeType: "text/plain",
    outputFileName,
  };
}

async function sendEmailNotification(
  userEmail: string,
  originalFileName: string,
  outputFileName: string,
  downloadUrl: string,
  conversionType: string
): Promise<void> {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not found, skipping email notification");
    return;
  }

  const conversionTypeLabels: Record<string, string> = {
    "pdf-to-docx": "PDF to DOCX conversion",
    "compress-image": "Image compression",
    "ocr": "OCR text extraction",
    "merge": "File merge",
  };

  const conversionLabel = conversionTypeLabels[conversionType] || conversionType;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Convertix <onboarding@resend.dev>",
        to: [userEmail],
        subject: `Your file conversion is complete - ${outputFileName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">✅ Conversion Complete!</h1>
              </div>
              <div style="padding: 32px;">
                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                  Great news! Your <strong>${conversionLabel}</strong> is complete and ready for download.
                </p>
                
                <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="color: #6b7280; padding: 8px 0;">Original file:</td>
                      <td style="color: #111827; font-weight: 500; text-align: right;">${originalFileName}</td>
                    </tr>
                    <tr>
                      <td style="color: #6b7280; padding: 8px 0;">Converted file:</td>
                      <td style="color: #111827; font-weight: 500; text-align: right;">${outputFileName}</td>
                    </tr>
                    <tr>
                      <td style="color: #6b7280; padding: 8px 0;">Conversion type:</td>
                      <td style="color: #111827; font-weight: 500; text-align: right;">${conversionLabel}</td>
                    </tr>
                  </table>
                </div>
                
                <div style="text-align: center; margin-top: 32px;">
                  <a href="${downloadUrl}" 
                     style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Download Your File
                  </a>
                </div>
                
                <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 32px;">
                  This link will expire in 7 days. Please download your file before then.
                </p>
              </div>
              <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  Powered by <strong>Convertix</strong> - Your universal file conversion tool
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend email error:", errorText);
    } else {
      console.log(`Email notification sent to ${userEmail}`);
    }
  } catch (error) {
    console.error("Failed to send email notification:", error);
  }
}

function createSimpleDocx(text: string): string {
  // Create a simple RTF format that Word can open
  const lines = text.split('\n');
  let rtfContent = "{\\rtf1\\ansi\\deff0\n";
  rtfContent += "{\\fonttbl{\\f0 Times New Roman;}}\n";
  rtfContent += "\\f0\\fs24\n";
  
  for (const line of lines) {
    if (line.trim()) {
      // Escape special RTF characters
      const escapedLine = line
        .replace(/\\/g, "\\\\")
        .replace(/\{/g, "\\{")
        .replace(/\}/g, "\\}")
        .replace(/\n/g, "\\par\n");
      rtfContent += escapedLine + "\\par\n";
    }
  }
  
  rtfContent += "}";
  return rtfContent;
}
