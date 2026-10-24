"use server";

import { getAuthenticatedUser } from "@/lib/supabase/server";
import type { DocumentType } from "@/lib/supabase/database.types";

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Get all documents for the current user, optionally filtered by business.
 */
export async function getUserDocuments(businessId?: string) {
  const { supabase, user } = await getAuthenticatedUser();

  let query = supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (businessId) {
    query = query.eq("business_id", businessId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch documents:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Generate a signed URL for downloading/viewing a document.
 * URLs expire after 15 minutes (900 seconds).
 */
export async function getDocumentSignedUrl(
  storagePath: string
): Promise<{ url: string } | { error: string }> {
  try {
    const { supabase } = await getAuthenticatedUser();

    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(storagePath, 900); // 15 min expiry

    if (error || !data?.signedUrl) {
      return { error: error?.message ?? "Failed to generate URL" };
    }

    return { url: data.signedUrl };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Generate a shareable link with custom expiry (24h or 72h).
 */
export async function createShareableLink(
  storagePath: string,
  durationHours: 24 | 72
): Promise<{ url: string } | { error: string }> {
  try {
    const { supabase } = await getAuthenticatedUser();

    const expiresIn = durationHours * 60 * 60; // Convert to seconds

    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(storagePath, expiresIn);

    if (error || !data?.signedUrl) {
      return { error: error?.message ?? "Failed to generate share link" };
    }

    return { url: data.signedUrl };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Upload a document to the vault.
 */
export async function uploadDocument(
  formData: FormData
): Promise<ActionResult & { documentId?: string }> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    const file = formData.get("file") as File | null;
    const documentType = formData.get("documentType") as DocumentType | null;
    const businessId = formData.get("businessId") as string | null;
    const displayName = formData.get("displayName") as string | null;

    if (!file || !documentType) {
      return { success: false, error: "File and document type are required" };
    }

    // Validate file size (50MB max)
    if (file.size > 52428800) {
      return { success: false, error: "File must be under 50MB" };
    }

    // Validate MIME type
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "File type not allowed. Please upload PDF, PNG, JPG, or DOCX." };
    }

    const timestamp = Date.now();
    const folder = businessId ? `${user.id}/${businessId}` : user.id;
    const storagePath = `${folder}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(storagePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    // Create document record
    const { data: doc, error: insertError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        business_id: businessId || null,
        document_type: documentType,
        display_name: displayName || file.name,
        source: "user_uploaded",
        storage_path: storagePath,
        file_size_bytes: file.size,
        mime_type: file.type,
      })
      .select("id")
      .single();

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    return { success: true, documentId: doc?.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Upload failed" };
  }
}

/**
 * Delete a document from the vault.
 */
export async function deleteDocument(documentId: string): Promise<ActionResult> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Fetch the document to get storage path
    const { data: doc, error: fetchError } = await supabase
      .from("documents")
      .select("storage_path")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !doc) {
      return { success: false, error: "Document not found" };
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([doc.storage_path]);

    if (storageError) {
      console.error("Storage deletion failed:", storageError.message);
    }

    // Delete record
    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId)
      .eq("user_id", user.id);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Delete failed" };
  }
}
