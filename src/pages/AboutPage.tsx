import { MainLayout } from "@/components/layout/MainLayout";
import { FileText, Image, Code, Film, Users, Target, Lightbulb } from "lucide-react";

const AboutPage = () => {
  return (
    <MainLayout>
      <div className="container py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Convertix
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A unified conversion studio where your work continues, not disappears. 
              Built by CropXon to transform how you handle documents, images, and data.
            </p>
          </div>

          {/* Mission */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Our Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We believe file conversion should be seamless, persistent, and unified. 
              Traditional tools create temporary, disposable work that disappears after download. 
              Convertix introduces the "Studio" concept—a permanent workspace where every action 
              builds upon the last, and your work is always accessible.
            </p>
          </section>

          {/* The Studios */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">The Studios</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: FileText, title: "Document Studio", desc: "Convert, compress, merge, and OCR documents" },
                { icon: Image, title: "Image Studio", desc: "Resize, compress, convert, and enhance images" },
                { icon: Code, title: "Developer Studio", desc: "JSON, YAML, Base64, and data transformations" },
                { icon: Film, title: "Media Studio", desc: "Video and audio format conversions" },
              ].map((studio, i) => (
                <div key={i} className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors">
                  <studio.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{studio.title}</h3>
                  <p className="text-sm text-muted-foreground">{studio.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* About CropXon */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">About CropXon</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              CropXon is a technology company focused on building tools that make 
              digital workflows more efficient. We create products that respect your time, 
              protect your data, and integrate seamlessly into your existing processes. 
              Convertix is our flagship conversion platform, designed for professionals 
              who need reliable, persistent, and powerful file transformation tools.
            </p>
          </section>

          {/* Contact */}
          <section className="p-8 rounded-xl border border-border bg-card/50 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">Get in Touch</h3>
            <p className="text-muted-foreground mb-2">
              Have questions or feedback? We'd love to hear from you.
            </p>
            <p className="text-primary">contact@cropxon.com</p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
