import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib";
import {
  getArticlesTemplate,
} from "./templates/articles-configs";
import type { FormationDraft, FormationMember } from "@/lib/supabase/database.types";

interface ArticlesGenerationInput {
  draft: FormationDraft;
  businessName: string;
  stateCode: string;
  members: FormationMember[];
  registeredAgentName: string;
  registeredAgentAddress: string;
  organizerName: string;
  filingDate?: string;
}

interface GeneratedPDF {
  pdfBytes: Uint8Array;
  fileName: string;
}

// Layout constants
const MARGIN_LEFT = 72; // 1 inch
const MARGIN_RIGHT = 72;
const MARGIN_TOP = 72;
const MARGIN_BOTTOM = 72;
const PAGE_WIDTH = 612; // Letter size
const PAGE_HEIGHT = 792;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

const COLOR_BLACK = rgb(0, 0, 0);
const COLOR_GRAY = rgb(0.4, 0.4, 0.4);
const COLOR_LIGHT_GRAY = rgb(0.85, 0.85, 0.85);

/**
 * Generate Articles of Organization PDF for a given state.
 * Uses pdf-lib for programmatic creation — no external templates needed.
 */
export async function generateArticlesOfOrganization(
  input: ArticlesGenerationInput
): Promise<GeneratedPDF> {
  const template = getArticlesTemplate(input.stateCode);
  const pdfDoc = await PDFDocument.create();

  pdfDoc.setTitle(`${template.documentTitle} — ${input.businessName} LLC`);
  pdfDoc.setAuthor("MygrationStation");
  pdfDoc.setSubject("Articles of Organization");
  pdfDoc.setCreator("MygrationStation Document Generator");

  const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN_TOP;

  // Helper: add new page if needed
  function ensureSpace(needed: number): void {
    if (y - needed < MARGIN_BOTTOM) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN_TOP;
    }
  }

  // Helper: draw text and return new Y
  function drawText(
    text: string,
    options: {
      font?: PDFFont;
      size?: number;
      color?: ReturnType<typeof rgb>;
      x?: number;
      maxWidth?: number;
      align?: "left" | "center";
    } = {}
  ): void {
    const font = options.font ?? fontRegular;
    const size = options.size ?? 11;
    const color = options.color ?? COLOR_BLACK;
    const maxWidth = options.maxWidth ?? CONTENT_WIDTH;

    // Simple word wrapping
    const words = text.split(" ");
    let line = "";
    const lines: string[] = [];

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, size);
      if (testWidth > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);

    for (const lineText of lines) {
      ensureSpace(size + 4);

      let x = options.x ?? MARGIN_LEFT;
      if (options.align === "center") {
        const lineWidth = font.widthOfTextAtSize(lineText, size);
        x = (PAGE_WIDTH - lineWidth) / 2;
      }

      page.drawText(lineText, { x, y, size, font, color });
      y -= size + 4;
    }
  }

  function drawLine(): void {
    ensureSpace(10);
    page.drawLine({
      start: { x: MARGIN_LEFT, y },
      end: { x: PAGE_WIDTH - MARGIN_RIGHT, y },
      thickness: 0.5,
      color: COLOR_LIGHT_GRAY,
    });
    y -= 15;
  }

  function drawSpacer(height: number): void {
    y -= height;
  }

  // ═══════════════════════════════════════════
  // DOCUMENT HEADER
  // ═══════════════════════════════════════════

  // State filing authority
  drawText(template.filingAuthority, {
    font: fontRegular,
    size: 9,
    color: COLOR_GRAY,
    align: "center",
  });
  drawSpacer(4);

  // Document title
  drawText(template.documentTitle, {
    font: fontBold,
    size: 16,
    align: "center",
  });
  drawSpacer(8);

  // Statutory reference
  drawText(`Pursuant to ${template.statutoryReference}`, {
    font: fontItalic,
    size: 9,
    color: COLOR_GRAY,
    align: "center",
  });
  drawSpacer(12);

  drawLine();

  // ═══════════════════════════════════════════
  // ARTICLE I — NAME
  // ═══════════════════════════════════════════

  drawText("ARTICLE I — NAME", { font: fontBold, size: 12 });
  drawSpacer(6);
  drawText(
    `The name of the Limited Liability Company is: ${input.businessName} LLC`
  );
  drawSpacer(12);

  // ═══════════════════════════════════════════
  // ARTICLE II — REGISTERED AGENT
  // ═══════════════════════════════════════════

  drawText("ARTICLE II — REGISTERED AGENT AND OFFICE", {
    font: fontBold,
    size: 12,
  });
  drawSpacer(6);
  drawText(
    `The name of the registered agent is: ${input.registeredAgentName}`
  );
  drawSpacer(4);
  drawText(
    `The address of the registered office is: ${input.registeredAgentAddress}`
  );
  drawSpacer(12);

  // ═══════════════════════════════════════════
  // ARTICLE III — PURPOSE
  // ═══════════════════════════════════════════

  drawText("ARTICLE III — PURPOSE", { font: fontBold, size: 12 });
  drawSpacer(6);
  drawText(
    `The purpose of the Limited Liability Company is to engage in any lawful act or activity for which a limited liability company may be organized under the laws of the State of ${template.stateName}.`
  );
  drawSpacer(12);

  // ═══════════════════════════════════════════
  // ARTICLE IV — MANAGEMENT
  // ═══════════════════════════════════════════

  const isMemberManaged =
    (input.draft.memberType ?? "single") === "single" ||
    input.members.length <= 2;
  const managementType = isMemberManaged ? "member-managed" : "manager-managed";

  drawText("ARTICLE IV — MANAGEMENT", { font: fontBold, size: 12 });
  drawSpacer(6);
  drawText(
    `The Limited Liability Company shall be ${managementType}. ${
      isMemberManaged
        ? "The management of the LLC is vested in its member(s)."
        : "The management of the LLC is vested in one or more managers."
    }`
  );
  drawSpacer(12);

  // ═══════════════════════════════════════════
  // ARTICLE V — MEMBERS / ORGANIZER
  // ═══════════════════════════════════════════

  drawText("ARTICLE V — ORGANIZER", { font: fontBold, size: 12 });
  drawSpacer(6);
  drawText(
    `The name and address of the organizer of this Limited Liability Company is:`
  );
  drawSpacer(4);
  drawText(`Name: ${input.organizerName}`, { x: MARGIN_LEFT + 20 });

  if (input.members[0]) {
    const m = input.members[0];
    const addr = [m.addressLine1, m.addressLine2, m.city, m.stateProvince, m.zipPostal, m.country]
      .filter(Boolean)
      .join(", ");
    drawText(`Address: ${addr}`, { x: MARGIN_LEFT + 20 });
  }
  drawSpacer(12);

  // ═══════════════════════════════════════════
  // ARTICLE VI — DURATION
  // ═══════════════════════════════════════════

  drawText("ARTICLE VI — DURATION", { font: fontBold, size: 12 });
  drawSpacer(6);
  drawText(
    "The duration of the Limited Liability Company shall be perpetual."
  );
  drawSpacer(12);

  // ═══════════════════════════════════════════
  // ARTICLE VII — EFFECTIVE DATE
  // ═══════════════════════════════════════════

  drawText("ARTICLE VII — EFFECTIVE DATE", { font: fontBold, size: 12 });
  drawSpacer(6);
  drawText(
    input.filingDate
      ? `These Articles of Organization shall be effective as of ${input.filingDate}.`
      : "These Articles of Organization shall be effective upon filing with the Secretary of State."
  );
  drawSpacer(20);

  // ═══════════════════════════════════════════
  // SIGNATURE BLOCK
  // ═══════════════════════════════════════════

  drawLine();
  drawSpacer(8);

  drawText("IN WITNESS WHEREOF, the undersigned has executed these Articles of Organization.", {
    font: fontItalic,
    size: 10,
  });
  drawSpacer(30);

  // Signature line
  page.drawLine({
    start: { x: MARGIN_LEFT, y },
    end: { x: MARGIN_LEFT + 250, y },
    thickness: 0.75,
    color: COLOR_BLACK,
  });
  y -= 14;
  drawText(`Signature of Organizer: ${input.organizerName}`, {
    size: 10,
  });
  drawSpacer(20);

  // Date line
  page.drawLine({
    start: { x: MARGIN_LEFT, y },
    end: { x: MARGIN_LEFT + 180, y },
    thickness: 0.75,
    color: COLOR_BLACK,
  });
  y -= 14;
  drawText(`Date: ${new Date().toLocaleDateString("en-US")}`, { size: 10 });
  drawSpacer(30);

  // ═══════════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════════

  // Publication notice (if required)
  if (template.requiresPublication && template.publicationNotes) {
    drawLine();
    drawText("IMPORTANT — PUBLICATION REQUIREMENT", {
      font: fontBold,
      size: 9,
      color: COLOR_GRAY,
    });
    drawSpacer(4);
    drawText(template.publicationNotes, {
      font: fontItalic,
      size: 8,
      color: COLOR_GRAY,
    });
    drawSpacer(12);
  }

  // Disclaimer footer
  drawText(template.footerDisclaimer, {
    font: fontItalic,
    size: 8,
    color: COLOR_GRAY,
  });
  drawSpacer(4);
  drawText(
    "Prepared by MygrationStation — document preparation service. This document does not constitute legal advice.",
    {
      font: fontItalic,
      size: 7,
      color: COLOR_GRAY,
    }
  );

  const pdfBytes = await pdfDoc.save();
  const fileName = `articles-of-organization-${input.businessName.toLowerCase().replace(/\s+/g, "-")}-${input.stateCode.toLowerCase()}.pdf`;

  return { pdfBytes, fileName };
}
