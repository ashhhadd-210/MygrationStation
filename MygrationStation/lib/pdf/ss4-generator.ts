import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { FormationMember } from "@/lib/supabase/database.types";

interface SS4Input {
  businessName: string;
  stateCode: string;
  members: FormationMember[];
  einPath: "online_self" | "phone_assisted" | "fax_assisted";
  responsiblePartyName: string;
  responsiblePartyItin?: string;
  responsiblePartySsn?: string;
  businessAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
  dateStarted?: string;
  closingMonthOfAccountingYear?: string;
}

interface GeneratedPDF {
  pdfBytes: Uint8Array;
  fileName: string;
}

/**
 * Generate a pre-filled IRS Form SS-4 (Application for EIN).
 *
 * The actual IRS SS-4 form is a fillable PDF. For production,
 * you would fetch the real IRS form and fill its fields.
 * This generates a clean reproduction with all required data
 * that can be faxed to the IRS at 855-641-6935.
 */
export async function generateSS4Form(input: SS4Input): Promise<GeneratedPDF> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle("Form SS-4 — Application for Employer Identification Number");
  pdfDoc.setAuthor("MygrationStation");

  const font = await pdfDoc.embedFont(StandardFonts.Courier);
  const fontLabel = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontLabelBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([612, 792]);
  let y = 740;
  const LEFT = 50;

  function label(text: string, x: number = LEFT): void {
    page.drawText(text, { x, y, size: 8, font: fontLabel, color: rgb(0.3, 0.3, 0.3) });
    y -= 12;
  }

  function field(lineNum: string, fieldLabel: string, value: string): void {
    page.drawText(`${lineNum}.`, { x: LEFT, y, size: 9, font: fontLabelBold, color: rgb(0, 0, 0) });
    page.drawText(fieldLabel, { x: LEFT + 20, y, size: 8, font: fontLabel, color: rgb(0.2, 0.2, 0.2) });
    y -= 14;
    // Draw field box
    page.drawRectangle({
      x: LEFT + 20,
      y: y - 2,
      width: 400,
      height: 16,
      borderColor: rgb(0.7, 0.7, 0.7),
      borderWidth: 0.5,
      color: rgb(0.98, 0.98, 0.98),
    });
    page.drawText(value, { x: LEFT + 24, y: y + 2, size: 10, font, color: rgb(0, 0, 0) });
    y -= 22;
  }

  function spacer(h: number): void {
    y -= h;
  }

  // ═══════════════════════════════════════
  // HEADER
  // ═══════════════════════════════════════

  page.drawText("Form SS-4", { x: LEFT, y, size: 20, font: fontLabelBold, color: rgb(0, 0, 0) });
  page.drawText("(Rev. December 2023)", { x: LEFT + 130, y: y + 2, size: 8, font: fontLabel, color: rgb(0.4, 0.4, 0.4) });
  y -= 16;
  page.drawText("Application for Employer Identification Number", {
    x: LEFT, y, size: 12, font: fontLabelBold, color: rgb(0, 0, 0),
  });
  y -= 14;
  page.drawText("Department of the Treasury — Internal Revenue Service", {
    x: LEFT, y, size: 8, font: fontLabel, color: rgb(0.4, 0.4, 0.4),
  });
  y -= 6;

  page.drawLine({
    start: { x: LEFT, y },
    end: { x: 562, y },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  y -= 16;

  // ═══════════════════════════════════════
  // FORM FIELDS
  // ═══════════════════════════════════════

  field("1", "Legal name of entity", `${input.businessName} LLC`);

  field("2", "Trade name of business (if different)", "");

  field(
    "3",
    "Executor, administrator, trustee, 'care of' name",
    input.responsiblePartyName
  );

  const addr = input.businessAddress;
  field(
    "4a",
    "Mailing address (street address, room, or suite no.)",
    [addr.line1, addr.line2].filter(Boolean).join(", ")
  );

  field("4b", "City, state, and ZIP code", `${addr.city}, ${addr.state} ${addr.zip}`);

  field("5a", "Street address (if different)", "Same as above");
  field("5b", "City, state, and ZIP code", "");

  field("6", "County and state where principal business is located", `${addr.state}`);

  field(
    "7a",
    "Name of responsible party",
    input.responsiblePartyName
  );

  // SSN or ITIN of responsible party
  const taxId = input.responsiblePartySsn
    ? `SSN: ${input.responsiblePartySsn}`
    : input.responsiblePartyItin
      ? `ITIN: ${input.responsiblePartyItin}`
      : "Applied for / None";
  field("7b", "SSN, ITIN, or EIN of responsible party", taxId);

  field("8a", "Is this a limited liability company (LLC)?", "Yes");
  field("8b", "Number of LLC members", String(input.members.length));

  field("9a", "Type of entity", "Limited Liability Company (LLC)");
  field("9b", "If LLC, state of organization", input.stateCode);

  field(
    "10",
    "Reason for applying",
    "Started new business"
  );

  field(
    "11",
    "Date business started or acquired",
    input.dateStarted ?? new Date().toLocaleDateString("en-US")
  );

  field(
    "12",
    "Closing month of accounting year",
    input.closingMonthOfAccountingYear ?? "December"
  );

  // ═══════════════════════════════════════
  // THIRD PARTY DESIGNEE
  // ═══════════════════════════════════════

  spacer(8);
  page.drawLine({
    start: { x: LEFT, y },
    end: { x: 562, y },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  });
  spacer(12);

  label("Third Party Designee");
  field("", "Designee's name", "MygrationStation LLC");
  field("", "Designee's telephone number", "(888) 000-0000"); // Replace with actual
  field("", "Designee's fax number", "(888) 000-0001"); // Replace with actual

  spacer(10);

  // Signature
  page.drawLine({
    start: { x: LEFT, y },
    end: { x: 562, y },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  });
  spacer(12);

  label("Signature");
  spacer(4);
  page.drawLine({
    start: { x: LEFT + 20, y },
    end: { x: 300, y },
    thickness: 0.75,
    color: rgb(0, 0, 0),
  });
  y -= 12;
  page.drawText(input.responsiblePartyName, {
    x: LEFT + 20, y, size: 9, font: fontLabel, color: rgb(0.3, 0.3, 0.3),
  });
  page.drawText(`Date: ${new Date().toLocaleDateString("en-US")}`, {
    x: 350, y, size: 9, font: fontLabel, color: rgb(0.3, 0.3, 0.3),
  });
  y -= 20;

  // Footer
  page.drawText(
    "Prepared by MygrationStation — document preparation service. This is not legal or tax advice.",
    { x: LEFT, y, size: 6, font: fontLabel, color: rgb(0.6, 0.6, 0.6) }
  );
  spacer(8);
  page.drawText(
    `Fax to IRS: 855-641-6935 | IRS International: 267-941-1099`,
    { x: LEFT, y, size: 6, font: fontLabel, color: rgb(0.6, 0.6, 0.6) }
  );

  const pdfBytes = await pdfDoc.save();
  const fileName = `ss4-${input.businessName.toLowerCase().replace(/\s+/g, "-")}.pdf`;

  return { pdfBytes, fileName };
}
