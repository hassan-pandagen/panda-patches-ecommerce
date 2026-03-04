"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useFileUpload() {
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);

    try {
      const timestamp = Date.now();
      const fileExt = file.name.split(".").pop();
      const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
      const uniqueFileName = `artwork-${randomId}-${timestamp}.${fileExt}`;

      const { error } = await supabase.storage
        .from("order-attachments")
        .upload(uniqueFileName, file, { cacheControl: "3600", upsert: false });

      if (error) {
        console.error("Upload error:", error);
        alert("Failed to upload file. Please try again.");
        setFileName("");
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("order-attachments")
        .getPublicUrl(uniqueFileName);

      setFileUrl(urlData.publicUrl);
      setUploading(false);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file. Please try again.");
      setFileName("");
      setUploading(false);
    }
  };

  return { fileName, setFileName, fileUrl, setFileUrl, uploading, handleFileUpload };
}
