import { Resend } from "resend";
import type { Locale } from "@/i18n/config";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@mygrationstation.com";

interface EmailOptions {
  to: string;
  locale: Locale;
}

/**
 * Localized subject lines for each email type.
 */
const SUBJECTS: Record<string, Record<string, string>> = {
  formation_submitted: {
    en: "Your LLC Formation Has Been Submitted",
    es: "Su formación de LLC ha sido enviada",
    zh: "您的LLC设立申请已提交",
    tl: "Ang iyong LLC Formation ay Naisumite na",
    vi: "Hồ sơ thành lập LLC của bạn đã được gửi",
    ar: "تم تقديم طلب تأسيس شركتك",
    fr: "Votre formation LLC a été soumise",
    ko: "LLC 설립 신청이 제출되었습니다",
    pt: "Sua formação de LLC foi enviada",
    hi: "आपका LLC गठन प्रस्तुत किया गया है",
  },
  formation_complete: {
    en: "Your LLC Has Been Formed!",
    es: "¡Su LLC ha sido formada!",
    zh: "您的LLC已成立！",
    tl: "Ang iyong LLC ay Na-form na!",
    vi: "LLC của bạn đã được thành lập!",
    ar: "!تم تأسيس شركتك",
    fr: "Votre LLC a été formée !",
    ko: "LLC가 설립되었습니다!",
    pt: "Sua LLC foi formada!",
    hi: "आपकी LLC बन गई है!",
  },
  ein_received: {
    en: "Your EIN Has Been Received",
    es: "Su EIN ha sido recibido",
    zh: "您的EIN已收到",
    tl: "Natanggap na ang iyong EIN",
    vi: "EIN của bạn đã được nhận",
    ar: "تم استلام رقم تعريف صاحب العمل الخاص بك",
    fr: "Votre EIN a été reçu",
    ko: "EIN이 수신되었습니다",
    pt: "Seu EIN foi recebido",
    hi: "आपका EIN प्राप्त हो गया है",
  },
  compliance_reminder: {
    en: "Compliance Deadline Approaching",
    es: "Fecha límite de cumplimiento acercándose",
    zh: "合规截止日期即将到来",
    tl: "Papalapit na ang deadline ng compliance",
    vi: "Hạn tuân thủ sắp đến",
    ar: "اقتراب الموعد النهائي للامتثال",
    fr: "Échéance de conformité approchante",
    ko: "규정 준수 기한이 다가오고 있습니다",
    pt: "Prazo de conformidade se aproximando",
    hi: "अनुपालन की समय सीमा निकट आ रही है",
  },
  document_request: {
    en: "MygrationStation Needs a Document From You",
    es: "MygrationStation necesita un documento suyo",
    zh: "MygrationStation需要您提供一份文件",
    tl: "Kailangan ng MygrationStation ang isang dokumento mula sa iyo",
    vi: "MygrationStation cần một tài liệu từ bạn",
    ar: "MygrationStation يحتاج إلى مستند منك",
    fr: "MygrationStation a besoin d'un document de votre part",
    ko: "MygrationStation에서 문서를 요청합니다",
    pt: "MygrationStation precisa de um documento seu",
    hi: "MygrationStation को आपसे एक दस्तावेज़ चाहिए",
  },
};

function getSubject(type: string, locale: Locale): string {
  const localized = SUBJECTS[type];
  if (!localized) return type;
  return localized[locale] ?? localized["en"] ?? type;
}

/**
 * Send formation submitted confirmation email.
 */
export async function sendFormationSubmittedEmail(
  options: EmailOptions & {
    businessName: string;
    stateCode: string;
    processingDays: number;
  }
): Promise<void> {
  const { to, locale, businessName, stateCode, processingDays } = options;

  await resend.emails.send({
    from: `MygrationStation <${FROM_EMAIL}>`,
    to,
    subject: getSubject("formation_submitted", locale),
    html: buildFormationSubmittedHtml(locale, businessName, stateCode, processingDays),
  });
}

/**
 * Send formation complete email with document links.
 */
export async function sendFormationCompleteEmail(
  options: EmailOptions & {
    businessName: string;
    stateCode: string;
    dashboardUrl: string;
  }
): Promise<void> {
  const { to, locale, businessName, stateCode, dashboardUrl } = options;

  await resend.emails.send({
    from: `MygrationStation <${FROM_EMAIL}>`,
    to,
    subject: getSubject("formation_complete", locale),
    html: buildFormationCompleteHtml(locale, businessName, stateCode, dashboardUrl),
  });
}

/**
 * Send EIN received notification.
 */
export async function sendEinReceivedEmail(
  options: EmailOptions & {
    businessName: string;
    dashboardUrl: string;
  }
): Promise<void> {
  const { to, locale, businessName, dashboardUrl } = options;

  await resend.emails.send({
    from: `MygrationStation <${FROM_EMAIL}>`,
    to,
    subject: getSubject("ein_received", locale),
    html: buildEinReceivedHtml(locale, businessName, dashboardUrl),
  });
}

/**
 * Send compliance deadline reminder.
 */
export async function sendComplianceReminderEmail(
  options: EmailOptions & {
    businessName: string;
    eventType: string;
    dueDate: string;
    daysRemaining: number;
    dashboardUrl: string;
  }
): Promise<void> {
  const { to, locale, businessName, eventType, dueDate, daysRemaining, dashboardUrl } = options;

  await resend.emails.send({
    from: `MygrationStation <${FROM_EMAIL}>`,
    to,
    subject: getSubject("compliance_reminder", locale),
    html: buildComplianceReminderHtml(locale, businessName, eventType, dueDate, daysRemaining, dashboardUrl),
  });
}

// ═══════════════════════════════════════════════════════
// HTML EMAIL BUILDERS (inline CSS for email client compat)
// ═══════════════════════════════════════════════════════

const DISCLAIMER: Record<string, string> = {
  en: "This is general information, not legal advice. Consult a licensed attorney or tax professional for your specific situation.",
  es: "Esta es información general, no asesoría legal. Consulta a un abogado o profesional fiscal autorizado para tu situación específica.",
};

function getDisclaimer(locale: Locale): string {
  return DISCLAIMER[locale] ?? DISCLAIMER["en"] ?? "";
}

function emailWrapper(locale: Locale, body: string): string {
  const dir = locale === "ar" ? "rtl" : "ltr";
  return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">
        <tr><td style="background:#1d4ed8;padding:20px 24px;">
          <span style="color:#ffffff;font-size:20px;font-weight:700;">MygrationStation</span>
        </td></tr>
        <tr><td style="padding:32px 24px;">${body}</td></tr>
        <tr><td style="padding:16px 24px;border-top:1px solid #e2e8f0;background:#f8fafc;">
          <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.5;">${getDisclaimer(locale)}</p>
          <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">MygrationStation never sells your data. MygrationStation never shares data with immigration enforcement agencies.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildFormationSubmittedHtml(
  locale: Locale,
  businessName: string,
  stateCode: string,
  processingDays: number
): string {
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:#0f172a;">Your LLC formation is underway</h1>
    <p style="margin:0 0 12px;color:#475569;line-height:1.6;">
      We've received your application to form <strong>${businessName} LLC</strong> in <strong>${stateCode}</strong>.
    </p>
    <p style="margin:0 0 12px;color:#475569;line-height:1.6;">Here's what happens next:</p>
    <ol style="margin:0 0 20px;padding-left:20px;color:#475569;line-height:1.8;">
      <li>Our team reviews your application (1-2 business days)</li>
      <li>We file your Articles of Organization with the Secretary of State</li>
      <li>Standard processing takes approximately ${processingDays} business days</li>
      <li>Your filed documents will appear in your MygrationStation vault</li>
    </ol>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/${locale}/dashboard"
       style="display:inline-block;background:#2563eb;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
      Go to Dashboard
    </a>`;
  return emailWrapper(locale, body);
}

function buildFormationCompleteHtml(
  locale: Locale,
  businessName: string,
  stateCode: string,
  dashboardUrl: string
): string {
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:#0f172a;">Congratulations! Your LLC is formed</h1>
    <p style="margin:0 0 12px;color:#475569;line-height:1.6;">
      <strong>${businessName} LLC</strong> has been officially formed in <strong>${stateCode}</strong>.
    </p>
    <p style="margin:0 0 12px;color:#475569;line-height:1.6;">
      Your Articles of Organization and Operating Agreement are now available in your document vault.
    </p>
    <a href="${dashboardUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
      View Your Documents
    </a>`;
  return emailWrapper(locale, body);
}

function buildEinReceivedHtml(
  locale: Locale,
  businessName: string,
  dashboardUrl: string
): string {
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:#0f172a;">Your EIN has been assigned</h1>
    <p style="margin:0 0 12px;color:#475569;line-height:1.6;">
      The IRS has assigned an Employer Identification Number (EIN) to <strong>${businessName} LLC</strong>.
    </p>
    <p style="margin:0 0 12px;color:#475569;line-height:1.6;">
      Your EIN confirmation letter (CP575) is now securely stored in your document vault. You can use this EIN to open a business bank account.
    </p>
    <a href="${dashboardUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
      View EIN Letter
    </a>`;
  return emailWrapper(locale, body);
}

function buildComplianceReminderHtml(
  locale: Locale,
  businessName: string,
  eventType: string,
  dueDate: string,
  daysRemaining: number,
  dashboardUrl: string
): string {
  const urgency = daysRemaining <= 7 ? "#dc2626" : daysRemaining <= 30 ? "#d97706" : "#2563eb";
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:#0f172a;">Compliance deadline approaching</h1>
    <div style="background:#fef2f2;border-left:4px solid ${urgency};padding:12px 16px;border-radius:4px;margin:0 0 16px;">
      <p style="margin:0;font-weight:600;color:${urgency};">${daysRemaining} days remaining</p>
    </div>
    <p style="margin:0 0 12px;color:#475569;line-height:1.6;">
      <strong>${businessName} LLC</strong> has an upcoming compliance deadline:
    </p>
    <table style="margin:0 0 20px;border-collapse:collapse;">
      <tr><td style="padding:4px 12px 4px 0;color:#94a3b8;font-size:13px;">Deadline:</td><td style="padding:4px 0;color:#0f172a;font-weight:600;">${eventType.replace(/_/g, " ")}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#94a3b8;font-size:13px;">Due Date:</td><td style="padding:4px 0;color:#0f172a;font-weight:600;">${dueDate}</td></tr>
    </table>
    <a href="${dashboardUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
      View Compliance Calendar
    </a>`;
  return emailWrapper(locale, body);
}
