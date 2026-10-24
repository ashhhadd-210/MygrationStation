import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { downloadSignedDocument } from "@/lib/docuseal";
import type { FormationDraft } from "@/lib/supabase/database.types";

interface DocuSealWebhookPayload {
  event_type: "form.completed" | "form.started" | "form.viewed";
  timestamp: string;
  data: {
    id: number;
    submission_id: number;
    email: string;
    status: string;
    documents: Array<{
      name: string;
      url: string;
    }>;
    values: Array<{
      field: string;
      value: string;
    }>;
  };
}

export async function POST(request: NextRequest) {
  let payload: DocuSealWebhookPayload;

  try {
    payload = (await request.json()) as DocuSealWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Only process completion events
  if (payload.event_type !== "form.completed") {
    return NextResponse.json({ received: true });
  }

  const supabase = createAdminClient();
  const submissionId = payload.data.submission_id;

  // Find the business with this DocuSeal submission ID
  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, user_id, name, formation_draft")
    .eq("formation_status", "draft");

  if (!businesses || businesses.length === 0) {
    console.error("No draft businesses found for DocuSeal submission:", submissionId);
    return NextResponse.json({ received: true });
  }

  // Find the business whose draft has this submission ID
  const matchedBusiness = businesses.find((biz) => {
    const draft = biz.formation_draft as FormationDraft | null;
    return draft?.docusealSubmissionId === String(submissionId);
  });

  if (!matchedBusiness) {
    console.error("No business matched DocuSeal submission:", submissionId);
    return NextResponse.json({ received: true });
  }

  const draft = matchedBusiness.formation_draft as FormationDraft;

  // Download and store the signed document
  const signedDoc = payload.data.documents[0];
  if (signedDoc) {
    try {
      const pdfBytes = await downloadSignedDocument(signedDoc.url);
      const storagePath = `${matchedBusiness.user_id}/${matchedBusiness.id}/signed-articles-of-organization.pdf`;

      await supabase.storage
        .from("documents")
        .upload(storagePath, pdfBytes, {
          contentType: "application/pdf",
          upsert: true,
        });

      // Create document record
      await supabase.from("documents").insert({
        user_id: matchedBusiness.user_id,
        business_id: matchedBusiness.id,
        document_type: "articles_of_organization",
        display_name: `Signed Articles of Organization — ${matchedBusiness.name} LLC`,
        source: "system_generated",
        storage_path: storagePath,
        file_size_bytes: pdfBytes.length,
        mime_type: "application/pdf",
      });
    } catch (err) {
      console.error("Failed to download/store signed document:", err);
    }
  }

  // Update the draft to mark signature as completed
  await supabase
    .from("businesses")
    .update({
      formation_draft: {
        ...draft,
        signatureCompleted: true,
      },
    })
    .eq("id", matchedBusiness.id);

  return NextResponse.json({ received: true });
}
