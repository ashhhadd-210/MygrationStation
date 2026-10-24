import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib";
import type { FormationMember } from "@/lib/supabase/database.types";

interface OperatingAgreementInput {
  businessName: string;
  stateCode: string;
  stateName: string;
  members: FormationMember[];
  memberType: "single" | "multi";
  foreignOwned: boolean;
  effectiveDate?: string;
}

interface GeneratedPDF {
  pdfBytes: Uint8Array;
  fileName: string;
}

const MARGIN = 72;
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

/**
 * Generate an Operating Agreement PDF for the LLC.
 * Produces single-member or multi-member variant based on input.
 */
export async function generateOperatingAgreement(
  input: OperatingAgreementInput
): Promise<GeneratedPDF> {
  const pdfDoc = await PDFDocument.create();
  const isSingle = input.memberType === "single";
  const llcName = `${input.businessName} LLC`;
  const dateStr = input.effectiveDate ?? new Date().toLocaleDateString("en-US");

  pdfDoc.setTitle(`Operating Agreement — ${llcName}`);
  pdfDoc.setAuthor("MygrationStation");

  const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  function ensureSpace(needed: number): void {
    if (y - needed < MARGIN) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
  }

  function drawText(
    text: string,
    opts: {
      font?: PDFFont;
      size?: number;
      indent?: number;
      align?: "left" | "center";
    } = {}
  ): void {
    const font = opts.font ?? fontRegular;
    const size = opts.size ?? 10;
    const maxWidth = CONTENT_WIDTH - (opts.indent ?? 0);

    const words = text.split(" ");
    let line = "";
    const lines: string[] = [];
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);

    for (const l of lines) {
      ensureSpace(size + 3);
      let x = MARGIN + (opts.indent ?? 0);
      if (opts.align === "center") {
        x = (PAGE_WIDTH - font.widthOfTextAtSize(l, size)) / 2;
      }
      page.drawText(l, { x, y, size, font, color: rgb(0, 0, 0) });
      y -= size + 3;
    }
  }

  function spacer(h: number): void {
    y -= h;
  }

  function heading(text: string): void {
    spacer(8);
    drawText(text, { font: fontBold, size: 11 });
    spacer(4);
  }

  // ═══════════════════════════════════════
  // TITLE PAGE
  // ═══════════════════════════════════════

  drawText("OPERATING AGREEMENT", { font: fontBold, size: 18, align: "center" });
  spacer(6);
  drawText("OF", { font: fontRegular, size: 12, align: "center" });
  spacer(6);
  drawText(llcName.toUpperCase(), { font: fontBold, size: 16, align: "center" });
  spacer(6);
  drawText(
    isSingle
      ? "A Single-Member Limited Liability Company"
      : "A Multi-Member Limited Liability Company",
    { font: fontItalic, size: 11, align: "center" }
  );
  spacer(6);
  drawText(`Organized under the laws of the State of ${input.stateName}`, {
    font: fontItalic, size: 10, align: "center",
  });
  spacer(6);
  drawText(`Effective Date: ${dateStr}`, { size: 10, align: "center" });
  spacer(20);

  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  spacer(20);

  // ═══════════════════════════════════════
  // ARTICLE I — FORMATION
  // ═══════════════════════════════════════

  heading("ARTICLE I — FORMATION");
  drawText(
    `1.1 Formation. ${llcName} (the "Company") is a limited liability company organized under the laws of the State of ${input.stateName}. The Articles of Organization were filed with the ${input.stateName} Secretary of State.`
  );
  spacer(6);
  drawText(
    `1.2 Name. The name of the Company is ${llcName}.`
  );
  spacer(6);
  drawText(
    `1.3 Purpose. The Company is formed for the purpose of engaging in any lawful business activity permitted under the laws of ${input.stateName}.`
  );
  spacer(6);
  drawText(
    "1.4 Duration. The Company shall have perpetual existence unless dissolved in accordance with this Agreement or applicable law."
  );
  spacer(6);
  drawText(
    `1.5 Registered Agent. The Company shall maintain a registered agent in the State of ${input.stateName} as required by law.`
  );

  // ═══════════════════════════════════════
  // ARTICLE II — MEMBERS AND CAPITAL
  // ═══════════════════════════════════════

  heading("ARTICLE II — MEMBERS AND CAPITAL CONTRIBUTIONS");

  if (isSingle && input.members[0]) {
    const m = input.members[0];
    drawText(
      `2.1 Sole Member. The sole member of the Company is ${m.fullName}, residing at ${m.addressLine1}, ${m.city}, ${m.stateProvince} ${m.zipPostal}, ${m.country} (the "Member").`
    );
    spacer(6);
    drawText(
      "2.2 Capital Contributions. The Member shall contribute capital to the Company as the Member deems necessary for the operations of the Company."
    );
  } else {
    drawText("2.1 Members. The members of the Company are as follows:");
    spacer(6);
    for (const m of input.members) {
      drawText(
        `• ${m.fullName} — ${m.ownershipPercentage}% membership interest — ${m.city}, ${m.country}`,
        { indent: 20 }
      );
      spacer(2);
    }
    spacer(6);
    drawText(
      "2.2 Capital Contributions. Each Member shall contribute capital as determined by unanimous agreement of the Members."
    );
    spacer(6);
    drawText(
      "2.3 Additional Contributions. No Member shall be required to make additional capital contributions without their written consent."
    );
  }

  // ═══════════════════════════════════════
  // ARTICLE III — MANAGEMENT
  // ═══════════════════════════════════════

  heading("ARTICLE III — MANAGEMENT AND OPERATIONS");

  if (isSingle) {
    drawText(
      "3.1 Management. The Company shall be managed by its sole Member, who shall have full authority to manage the business and affairs of the Company."
    );
  } else {
    drawText(
      "3.1 Management. The Company shall be managed by its Members. All decisions regarding the ordinary course of business may be made by a majority vote of Members based on their membership interests."
    );
    spacer(6);
    drawText(
      "3.2 Major Decisions. The following actions require the unanimous written consent of all Members: (a) admission of a new member; (b) sale of all or substantially all Company assets; (c) merger or dissolution; (d) amendment of this Agreement; (e) incurring debt exceeding $10,000."
    );
  }
  spacer(6);
  drawText(
    `${isSingle ? "3.2" : "3.3"} Banking. The Company shall maintain bank accounts as necessary. ${
      isSingle ? "The Member" : "Any Member authorized by majority vote"
    } may sign checks and authorize transactions on behalf of the Company.`
  );

  // ═══════════════════════════════════════
  // ARTICLE IV — DISTRIBUTIONS AND TAXATION
  // ═══════════════════════════════════════

  heading("ARTICLE IV — DISTRIBUTIONS AND TAXATION");

  if (isSingle) {
    drawText(
      "4.1 Tax Treatment. The Company shall be treated as a disregarded entity for federal income tax purposes. All income, losses, deductions, and credits of the Company shall be reported on the Member's individual tax return."
    );
  } else {
    drawText(
      "4.1 Tax Treatment. The Company shall be treated as a partnership for federal income tax purposes unless the Members unanimously elect otherwise."
    );
    spacer(6);
    drawText(
      "4.2 Allocations. Net profits and losses shall be allocated to the Members in proportion to their membership interests."
    );
  }
  spacer(6);
  drawText(
    `${isSingle ? "4.2" : "4.3"} Distributions. Distributions shall be made at such times and in such amounts as ${
      isSingle ? "the Member" : "the Members"
    } shall determine, subject to the Company's obligation to retain sufficient funds for operations and liabilities.`
  );

  if (input.foreignOwned) {
    spacer(6);
    drawText(
      `${isSingle ? "4.3" : "4.4"} Foreign Ownership Compliance. The Company acknowledges that as a foreign-owned entity, it is subject to additional tax reporting requirements including, but not limited to, IRS Form 5472 and a pro-forma Form 1120, due annually by April 15.`,
      { font: fontBold, size: 10 }
    );
  }

  // ═══════════════════════════════════════
  // ARTICLE V — DISSOLUTION
  // ═══════════════════════════════════════

  heading("ARTICLE V — DISSOLUTION");
  drawText(
    `5.1 Events of Dissolution. The Company shall be dissolved upon: (a) the written ${
      isSingle ? "decision of the Member" : "consent of all Members"
    }; (b) entry of a judicial decree of dissolution; or (c) any event that makes it unlawful for the Company to continue.`
  );
  spacer(6);
  drawText(
    "5.2 Winding Up. Upon dissolution, the Company's assets shall be distributed in the following order: (a) to creditors in satisfaction of Company debts; (b) to establish reserves for contingent liabilities; (c) to Members in proportion to their capital account balances."
  );

  // ═══════════════════════════════════════
  // ARTICLE VI — MISCELLANEOUS
  // ═══════════════════════════════════════

  heading("ARTICLE VI — MISCELLANEOUS");
  drawText(
    `6.1 Governing Law. This Agreement shall be governed by the laws of the State of ${input.stateName}.`
  );
  spacer(6);
  drawText(
    "6.2 Amendments. This Agreement may be amended only by a written instrument signed by all Members."
  );
  spacer(6);
  drawText(
    "6.3 Severability. If any provision of this Agreement is held to be invalid, the remaining provisions shall continue in full force and effect."
  );
  spacer(6);
  drawText(
    "6.4 Entire Agreement. This Agreement constitutes the entire agreement among the Members with respect to the subject matter hereof."
  );

  // ═══════════════════════════════════════
  // SIGNATURE BLOCK
  // ═══════════════════════════════════════

  spacer(30);
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  spacer(15);

  drawText(
    "IN WITNESS WHEREOF, the undersigned have executed this Operating Agreement as of the date first written above.",
    { font: fontItalic, size: 10 }
  );
  spacer(20);

  for (const m of input.members) {
    ensureSpace(60);
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: MARGIN + 250, y },
      thickness: 0.75,
      color: rgb(0, 0, 0),
    });
    y -= 14;
    drawText(`${m.fullName}`, { size: 10 });
    drawText(`Ownership: ${m.ownershipPercentage}%`, {
      font: fontItalic,
      size: 9,
    });
    spacer(20);
  }

  // Disclaimer
  spacer(10);
  drawText(
    "Prepared by MygrationStation — document preparation service. This document does not constitute legal advice. Consult a licensed attorney for your specific situation.",
    { font: fontItalic, size: 7 }
  );

  const pdfBytes = await pdfDoc.save();
  const suffix = isSingle ? "single-member" : "multi-member";
  const fileName = `operating-agreement-${suffix}-${input.businessName.toLowerCase().replace(/\s+/g, "-")}.pdf`;

  return { pdfBytes, fileName };
}
