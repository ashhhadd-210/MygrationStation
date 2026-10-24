/**
 * DocuSeal integration for e-signatures.
 * Uses DocuSeal Cloud API (https://www.docuseal.co/docs/api).
 *
 * Flow:
 * 1. Upload the generated Articles PDF as a DocuSeal template
 * 2. Create a submission with the signer's email
 * 3. Redirect user to the signing URL
 * 4. DocuSeal webhook notifies us when signature is complete
 * 5. Download the signed PDF and store in Supabase vault
 */

const DOCUSEAL_API_URL =
  process.env.DOCUSEAL_API_URL ?? "https://api.docuseal.co";
const DOCUSEAL_API_KEY = process.env.DOCUSEAL_API_KEY ?? "";

interface DocuSealError {
  error: string;
}

interface TemplateCreateResponse {
  id: number;
  name: string;
  created_at: string;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
  }>;
}

interface SubmissionCreateResponse {
  id: number;
  status: string;
  submitters: Array<{
    id: number;
    uuid: string;
    email: string;
    slug: string;
    embed_src: string;
  }>;
}

interface SubmissionStatusResponse {
  id: number;
  status: "pending" | "completed" | "expired";
  completed_at: string | null;
  documents: Array<{
    name: string;
    url: string;
  }>;
  submitters: Array<{
    id: number;
    email: string;
    status: string;
    completed_at: string | null;
  }>;
}

function getHeaders(): Record<string, string> {
  if (!DOCUSEAL_API_KEY) {
    throw new Error("DOCUSEAL_API_KEY environment variable is not set");
  }
  return {
    "X-Auth-Token": DOCUSEAL_API_KEY,
    "Content-Type": "application/json",
  };
}

/**
 * Create a DocuSeal template from an uploaded PDF.
 * The PDF should already have signature placeholder areas.
 */
export async function createTemplateFromPdf(
  pdfBase64: string,
  name: string
): Promise<TemplateCreateResponse> {
  const response = await fetch(`${DOCUSEAL_API_URL}/templates/pdf`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      name,
      documents: [
        {
          name: `${name}.pdf`,
          file: pdfBase64,
          fields: [
            {
              name: "organizer_signature",
              type: "signature",
              required: true,
              areas: [
                {
                  page: 0,
                  x: 0.1,
                  y: 0.85,
                  w: 0.35,
                  h: 0.04,
                },
              ],
            },
            {
              name: "date_signed",
              type: "date",
              required: true,
              areas: [
                {
                  page: 0,
                  x: 0.1,
                  y: 0.9,
                  w: 0.25,
                  h: 0.03,
                },
              ],
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as DocuSealError;
    throw new Error(`DocuSeal template creation failed: ${errorData.error}`);
  }

  return (await response.json()) as TemplateCreateResponse;
}

/**
 * Create a submission (signing request) for a template.
 * Returns a URL where the signer can sign the document.
 */
export async function createSubmission(
  templateId: number,
  signerEmail: string,
  signerName: string,
  options: {
    sendEmail?: boolean;
    completedRedirectUrl?: string;
  } = {}
): Promise<{
  submissionId: number;
  signingUrl: string;
  embedUrl: string;
}> {
  const response = await fetch(`${DOCUSEAL_API_URL}/submissions`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      template_id: templateId,
      send_email: options.sendEmail ?? false,
      completed_redirect_url: options.completedRedirectUrl,
      submitters: [
        {
          email: signerEmail,
          name: signerName,
          role: "Organizer",
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as DocuSealError;
    throw new Error(`DocuSeal submission creation failed: ${errorData.error}`);
  }

  const data = (await response.json()) as SubmissionCreateResponse;
  const submitter = data.submitters[0];

  if (!submitter) {
    throw new Error("No submitter returned from DocuSeal");
  }

  return {
    submissionId: data.id,
    signingUrl: `${DOCUSEAL_API_URL}/s/${submitter.slug}`,
    embedUrl: submitter.embed_src,
  };
}

/**
 * Check the status of a submission.
 */
export async function getSubmissionStatus(
  submissionId: number
): Promise<SubmissionStatusResponse> {
  const response = await fetch(
    `${DOCUSEAL_API_URL}/submissions/${submissionId}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    const errorData = (await response.json()) as DocuSealError;
    throw new Error(`DocuSeal status check failed: ${errorData.error}`);
  }

  return (await response.json()) as SubmissionStatusResponse;
}

/**
 * Download the signed PDF document.
 * Returns the raw PDF bytes.
 */
export async function downloadSignedDocument(
  documentUrl: string
): Promise<Uint8Array> {
  const response = await fetch(documentUrl, {
    headers: {
      "X-Auth-Token": DOCUSEAL_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download signed document: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

/**
 * Full signing flow for Articles of Organization.
 * 1. Upload PDF as template
 * 2. Create submission
 * 3. Return signing URL
 */
export async function initiateArticlesSigning(
  pdfBytes: Uint8Array,
  businessName: string,
  signerEmail: string,
  signerName: string,
  completedRedirectUrl: string
): Promise<{
  submissionId: number;
  signingUrl: string;
  embedUrl: string;
  templateId: number;
}> {
  const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

  const template = await createTemplateFromPdf(
    pdfBase64,
    `Articles of Organization — ${businessName} LLC`
  );

  const submission = await createSubmission(template.id, signerEmail, signerName, {
    sendEmail: false,
    completedRedirectUrl,
  });

  return {
    ...submission,
    templateId: template.id,
  };
}
