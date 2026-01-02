import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Conversion {
  id: string;
  user_id: string;
  original_filename: string;
  original_format: string;
  output_format: string;
  file_size: number;
  output_size: number | null;
  status: "pending" | "processing" | "completed" | "failed";
  tool_used: string;
  created_at: string;
  completed_at: string | null;
}

export const useConversions = () => {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchConversions = async () => {
    if (!user) {
      setConversions([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("conversions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setConversions(data as Conversion[]);
    } catch (err) {
      console.error("Error fetching conversions:", err);
    } finally {
      setLoading(false);
    }
  };

  const addConversion = async (conversion: Omit<Conversion, "id" | "user_id" | "created_at" | "completed_at">) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("conversions")
        .insert({
          ...conversion,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setConversions(prev => [data as Conversion, ...prev]);
      return data as Conversion;
    } catch (err) {
      console.error("Error adding conversion:", err);
      return null;
    }
  };

  const updateConversion = async (id: string, updates: Partial<Conversion>) => {
    try {
      const { data, error } = await supabase
        .from("conversions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setConversions(prev => prev.map(c => c.id === id ? data as Conversion : c));
      return data as Conversion;
    } catch (err) {
      console.error("Error updating conversion:", err);
      return null;
    }
  };

  useEffect(() => {
    fetchConversions();
  }, [user]);

  return {
    conversions,
    loading,
    addConversion,
    updateConversion,
    refetch: fetchConversions,
  };
};