"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import {
  getDocumentSignedUrl,
  createShareableLink,
  uploadDocument,
  deleteDocument,
} from "./actions";
import type { DocumentType } from "@/lib/supabase/database.types";

interface Document {
  id: string;
  document_type: DocumentType;
  display_name: string;
  source: string;
  storage_path: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  expires_at: string | null;
  created_at: string;
  business_id: string | null;
}

interface Business {
  id: string;
  name: string;
}

interface DocumentVaultProps {
  documents: Document[];
  businesses: Business[];
  residencyStatus: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  articles_of_organization: "📄",
  operating_agreement: "📋",
  ein_letter: "🏛️",
  boi_confirmation: "🔍",
  form_5472_kit: "📊",
  annual_report: "📅",
  passport: "🛂",
  itin_letter: "💳",
  third_party_auth: "✍️",
  bank_statement: "🏦",
  business_license: "📜",
  contract: "📝",
  other: "📎",
};

/* ═══════════════════════════════════════════════
   REQUIRED DOCUMENTS CHECKLIST BY RESIDENCY TYPE
   ═══════════════════════════════════════════════ */

interface ChecklistItem {
  name: string;
  description: string;
  category: "formation" | "tax" | "compliance" | "identity";
  documentTypes: string[]; // matches against document_type or display_name
}

const CHECKLISTS: Record<string, { title: string; items: ChecklistItem[] }> = {
  ssn_holder: {
    title: "U.S. Resident (SSN Holder)",
    items: [
      { name: "Articles of Organization", description: "Filed with the state to form your LLC", category: "formation", documentTypes: ["articles_of_organization"] },
      { name: "Operating Agreement", description: "Governs LLC management and member roles", category: "formation", documentTypes: ["operating_agreement"] },
      { name: "EIN Confirmation (CP 575)", description: "IRS letter confirming your Employer ID Number", category: "formation", documentTypes: ["ein_letter"] },
      { name: "Form 1040 (Individual Tax Return)", description: "Annual federal income tax return — report LLC income on Schedule C", category: "tax", documentTypes: ["form_1040", "tax_return"] },
      { name: "Schedule C (Profit or Loss)", description: "Attach to Form 1040 to report LLC business income", category: "tax", documentTypes: ["schedule_c"] },
      { name: "Quarterly Estimated Taxes (1040-ES)", description: "Pay quarterly if you expect to owe $1,000+ in taxes", category: "tax", documentTypes: ["1040_es", "quarterly_tax"] },
      { name: "Annual State Report", description: "Filed annually with your state — keeps LLC in good standing", category: "compliance", documentTypes: ["annual_report"] },
      { name: "Business Bank Statements", description: "Keep monthly records for tax preparation and audits", category: "compliance", documentTypes: ["bank_statement"] },
    ],
  },
  itin_holder: {
    title: "ITIN Holder",
    items: [
      { name: "Articles of Organization", description: "Filed with the state to form your LLC", category: "formation", documentTypes: ["articles_of_organization"] },
      { name: "Operating Agreement", description: "Governs LLC management and member roles", category: "formation", documentTypes: ["operating_agreement"] },
      { name: "EIN Confirmation (CP 575)", description: "IRS letter confirming your Employer ID Number", category: "formation", documentTypes: ["ein_letter"] },
      { name: "ITIN Letter (CP 565)", description: "Your IRS-issued Individual Tax ID confirmation", category: "identity", documentTypes: ["itin_letter"] },
      { name: "Form 1040 or 1040-NR", description: "Federal tax return — use 1040 if resident alien, 1040-NR if non-resident", category: "tax", documentTypes: ["form_1040", "1040_nr", "tax_return"] },
      { name: "Form 5472 (Foreign-Owned LLC)", description: "Report transactions between you and your LLC if foreign-owned", category: "tax", documentTypes: ["form_5472_kit", "form_5472"] },
      { name: "Pro-Forma 1120", description: "Filed alongside Form 5472 for foreign-owned single-member LLCs", category: "tax", documentTypes: ["form_1120", "pro_forma"] },
      { name: "BOI Report (FinCEN)", description: "Beneficial Ownership Information — due within 30 days of formation", category: "compliance", documentTypes: ["boi_confirmation"] },
      { name: "Annual State Report", description: "Filed annually with your state — keeps LLC in good standing", category: "compliance", documentTypes: ["annual_report"] },
      { name: "Quarterly Estimated Taxes (1040-ES)", description: "Pay quarterly if you expect to owe $1,000+ in taxes", category: "tax", documentTypes: ["1040_es", "quarterly_tax"] },
      { name: "Passport Copy", description: "Required for EIN application and banking setup", category: "identity", documentTypes: ["passport"] },
    ],
  },
  non_resident: {
    title: "Non-Resident (No SSN/ITIN)",
    items: [
      { name: "Articles of Organization", description: "Filed with the state to form your LLC", category: "formation", documentTypes: ["articles_of_organization"] },
      { name: "Operating Agreement", description: "Governs LLC management and member roles", category: "formation", documentTypes: ["operating_agreement"] },
      { name: "EIN Confirmation (CP 575)", description: "IRS letter confirming your Employer ID Number", category: "formation", documentTypes: ["ein_letter"] },
      { name: "Passport Copy", description: "Primary ID for EIN application (SS-4 fax/phone path)", category: "identity", documentTypes: ["passport"] },
      { name: "Form 5472 (Foreign-Owned LLC)", description: "Annual report of transactions between you and your LLC — due April 15", category: "tax", documentTypes: ["form_5472_kit", "form_5472"] },
      { name: "Pro-Forma 1120", description: "Filed alongside Form 5472 for foreign-owned single-member LLCs", category: "tax", documentTypes: ["form_1120", "pro_forma"] },
      { name: "BOI Report (FinCEN)", description: "Beneficial Ownership Information — due within 30 days of formation", category: "compliance", documentTypes: ["boi_confirmation"] },
      { name: "Annual State Report", description: "Filed annually with your state — keeps LLC in good standing", category: "compliance", documentTypes: ["annual_report"] },
      { name: "Third-Party Designee Authorization", description: "Authorizes MygrationStation to contact IRS on your behalf for EIN", category: "formation", documentTypes: ["third_party_auth"] },
      { name: "Registered Agent Confirmation", description: "Proof of registered agent service in your LLC state", category: "compliance", documentTypes: ["registered_agent"] },
      { name: "Business Bank Statements", description: "Keep monthly records for tax preparation", category: "compliance", documentTypes: ["bank_statement"] },
    ],
  },
};

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  formation: { label: "Formation", color: "text-gold-400 bg-gold-400/10 border-gold-400/20" },
  tax: { label: "Tax", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  compliance: { label: "Compliance", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  identity: { label: "Identity", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
};

export function DocumentVault({ documents, businesses, residencyStatus }: DocumentVaultProps) {
  const t = useTranslations("documents");
  const common = useTranslations("common");
  const router = useRouter();

  const [filter, setFilter] = useState<DocumentType | "all">("all");
  const [showUpload, setShowUpload] = useState(false);
  const [showChecklist, setShowChecklist] = useState(true);
  const [isPending, startTransition] = useTransition();

  const filtered =
    filter === "all"
      ? documents
      : documents.filter((d) => d.document_type === filter);

  const categories = Array.from(
    new Set(documents.map((d) => d.document_type))
  );

  const checklist = CHECKLISTS[residencyStatus] ?? CHECKLISTS.non_resident!;

  // Check which checklist items are fulfilled
  function isDocumentUploaded(item: ChecklistItem): boolean {
    return documents.some((doc) =>
      item.documentTypes.some(
        (dt) =>
          doc.document_type === dt ||
          doc.display_name.toLowerCase().includes(dt.replace(/_/g, " "))
      )
    );
  }

  const completedCount = checklist.items.filter(isDocumentUploaded).length;
  const totalCount = checklist.items.length;

  async function handleView(storagePath: string) {
    startTransition(async () => {
      const result = await getDocumentSignedUrl(storagePath);
      if ("url" in result) {
        window.open(result.url, "_blank");
      }
    });
  }

  async function handleShare(storagePath: string, hours: 24 | 72) {
    startTransition(async () => {
      const result = await createShareableLink(storagePath, hours);
      if ("url" in result) {
        await navigator.clipboard.writeText(result.url);
        alert(`Link copied! Expires in ${hours} hours.`);
      }
    });
  }

  async function handleDelete(documentId: string) {
    if (!confirm("Are you sure you want to delete this document?")) return;
    startTransition(async () => {
      const result = await deleteDocument(documentId);
      if (result.success) {
        router.refresh();
      }
    });
  }

  function formatSize(bytes: number | null): string {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  return (
    <div className="mt-6">
      {/* ─── REQUIRED DOCUMENTS CHECKLIST ─── */}
      <div className="mb-6 rounded-2xl border border-white/[0.06] bg-neutral-900/60 p-5">
        <button
          onClick={() => setShowChecklist(!showChecklist)}
          className="flex w-full items-center justify-between"
        >
          <div>
            <h3 className="text-base font-semibold text-white">
              Required Documents — {checklist.title}
            </h3>
            <p className="mt-0.5 text-sm text-neutral-500">
              {completedCount} of {totalCount} documents uploaded
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Progress ring */}
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 rounded-full bg-neutral-800">
                <div
                  className="h-2 rounded-full bg-gold-400 transition-all"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gold-400">
                {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
              </span>
            </div>
            <svg
              className={`h-5 w-5 text-neutral-500 transition-transform ${showChecklist ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </button>

        {showChecklist && (
          <div className="mt-4 space-y-2">
            {checklist.items.map((item) => {
              const done = isDocumentUploaded(item);
              const cat = CATEGORY_LABELS[item.category]!;
              return (
                <div
                  key={item.name}
                  className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
                    done
                      ? "border-emerald-500/20 bg-emerald-900/10"
                      : "border-white/[0.04] bg-neutral-950/50"
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded ${
                    done ? "bg-emerald-500" : "border border-neutral-600"
                  }`}>
                    {done && (
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${done ? "text-neutral-500 line-through" : "text-white"}`}>
                        {item.name}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${cat.color}`}>
                        {cat.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── TOOLBAR ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === "all"
                ? "bg-gold-400 text-black"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
            }`}
          >
            All ({documents.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === cat
                  ? "bg-gold-400 text-black"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
              }`}
            >
              {CATEGORY_ICONS[cat] ?? "📎"}{" "}
              {t(`categories.${cat}` as Parameters<typeof t>[0])}
            </button>
          ))}
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowUpload(!showUpload)}>
          {showUpload ? common("cancel") : t("upload")}
        </Button>
      </div>

      {/* Upload form */}
      {showUpload && (
        <UploadForm businesses={businesses} onComplete={() => { setShowUpload(false); router.refresh(); }} />
      )}

      {/* Document list */}
      {filtered.length === 0 ? (
        <div className="mt-8 py-12 text-center">
          <p className="text-sm text-neutral-500">{t("noDocuments")}</p>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {filtered.map((doc) => {
            const isExpiring =
              doc.expires_at &&
              new Date(doc.expires_at).getTime() - Date.now() < 60 * 24 * 60 * 60 * 1000;

            return (
              <div
                key={doc.id}
                className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-neutral-900/60 p-4 transition-all hover:border-white/10"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{CATEGORY_ICONS[doc.document_type] ?? "📎"}</span>
                  <div>
                    <p className="font-medium text-white">{doc.display_name}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                      <span>{t(`categories.${doc.document_type}` as Parameters<typeof t>[0])}</span>
                      <span>&middot;</span>
                      <span>{formatSize(doc.file_size_bytes)}</span>
                      <span>&middot;</span>
                      <span>{formatDate(doc.created_at)}</span>
                      {doc.source === "system_generated" && (
                        <>
                          <span>&middot;</span>
                          <span className="rounded border border-blue-400/20 bg-blue-400/10 px-1.5 py-0.5 text-blue-400">Auto-generated</span>
                        </>
                      )}
                      {isExpiring && (
                        <>
                          <span>&middot;</span>
                          <span className="rounded border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 text-amber-400">{t("expiringSoon")}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="ghost" size="sm" loading={isPending} onClick={() => handleView(doc.storage_path)}>{common("view")}</Button>
                  <DropdownShare onShare24h={() => handleShare(doc.storage_path, 24)} onShare72h={() => handleShare(doc.storage_path, 72)} label={t("share")} />
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>{common("delete")}</Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function UploadForm({ businesses, onComplete }: { businesses: Business[]; onComplete: () => void }) {
  const t = useTranslations("documents");
  const common = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await uploadDocument(formData);
      if (!result.success) { setError(result.error ?? "Upload failed"); return; }
      onComplete();
    });
  }

  const docTypes: DocumentType[] = ["passport", "itin_letter", "bank_statement", "business_license", "contract", "other"];

  return (
    <form action={handleSubmit} className="mt-4 rounded-xl border border-white/[0.06] bg-neutral-900/60 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-neutral-400">File *</label>
          <input name="file" type="file" required accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx" className="mt-1 block w-full text-sm text-neutral-400 file:mr-3 file:rounded-lg file:border-0 file:bg-gold-400/10 file:px-4 file:py-2 file:text-xs file:font-medium file:text-gold-400 hover:file:bg-gold-400/20" />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-400">Document Type *</label>
          <select name="documentType" required className="mt-1 block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white">
            {docTypes.map((type) => (<option key={type} value={type}>{t(`categories.${type}` as Parameters<typeof t>[0])}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-400">Business</label>
          <select name="businessId" className="mt-1 block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white">
            <option value="">None</option>
            {businesses.map((b) => (<option key={b.id} value={b.id}>{b.name} LLC</option>))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-neutral-400">Display Name</label>
          <input name="displayName" type="text" placeholder="Optional custom name" className="mt-1 block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-600" />
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      <div className="mt-4 flex gap-2">
        <Button type="submit" loading={isPending} size="sm">{common("upload")}</Button>
      </div>
    </form>
  );
}

function DropdownShare({ onShare24h, onShare72h, label }: { onShare24h: () => void; onShare72h: () => void; label: string }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("documents");

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}>{label}</Button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute end-0 z-20 mt-1 w-40 rounded-xl border border-white/[0.06] bg-neutral-900 py-1 shadow-lg">
            <button onClick={() => { onShare24h(); setOpen(false); }} className="block w-full px-3 py-1.5 text-start text-xs text-neutral-300 hover:bg-neutral-800">{t("share24h")}</button>
            <button onClick={() => { onShare72h(); setOpen(false); }} className="block w-full px-3 py-1.5 text-start text-xs text-neutral-300 hover:bg-neutral-800">{t("share72h")}</button>
          </div>
        </>
      )}
    </div>
  );
}
