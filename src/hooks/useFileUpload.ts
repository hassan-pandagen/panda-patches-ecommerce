"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface UploadedFile {
  name: string;
  url: string;
}

export function useFileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // Legacy single-file compat (used by localStorage in ComplexCalculator)
  const fileName = files[0]?.name || "";
  const fileUrl = files[0]?.url || "";
  const setFileName = (name: string) => {
    if (!name) { setFiles([]); return; }
    setFiles(prev => prev.length ? [{ ...prev[0], name }, ...prev.slice(1)] : [{ name, url: "" }]);
  };
  const setFileUrl = (url: string) => {
    if (!url) { setFiles([]); return; }
    setFiles(prev => prev.length ? [{ name: prev[0].name, url }, ...prev.slice(1)] : [{ name: "", url }]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (files.length >= 2) return; // max 2 files

    setUploading(true);

    try {
      const timestamp = Date.now();
      const fileExt = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
      const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
      const uniqueFileName = `artwork-${randomId}-${timestamp}.${fileExt}`;

      const { error } = await supabase.storage
        .from("order-attachments")
        .upload(uniqueFileName, file, { cacheControl: "3600", upsert: false });

      if (error) {
        console.error("Upload error:", error);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("order-attachments")
        .getPublicUrl(uniqueFileName);

      setFiles(prev => [...prev, { name: file.name, url: urlData.publicUrl }]);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      e.target.value = ""; // reset so same file can be re-selected
    }
  };

  return { files, setFiles, fileName, setFileName, fileUrl, setFileUrl, uploading, handleFileUpload, removeFile };
}
