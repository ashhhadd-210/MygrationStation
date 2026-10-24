/**
 * State-specific Articles of Organization template configurations.
 *
 * Each state has different requirements for what must appear in
 * the Articles of Organization. This config drives the PDF generator.
 *
 * Sources: Individual state SOS websites and filing instructions.
 */

export interface ArticlesTemplateConfig {
  stateCode: string;
  stateName: string;
  documentTitle: string;
  filingAuthority: string;
  filingAuthorityAddress: string[];
  requiredFields: ArticlesField[];
  statutoryReference: string;
  footerDisclaimer: string;
  /** Some states require specific formatting (e.g., legal paper size) */
  pageFormat: "letter" | "legal";
  /** Whether state requires notarization */
  requiresNotarization: boolean;
  /** Whether state requires publication after filing */
  requiresPublication: boolean;
  publicationNotes?: string;
}

export interface ArticlesField {
  id: string;
  label: string;
  type: "text" | "textarea" | "address" | "date" | "checkbox";
  required: boolean;
  maxLength?: number;
  instructions?: string;
}

const COMMON_FIELDS: ArticlesField[] = [
  {
    id: "llc_name",
    label: "Name of Limited Liability Company",
    type: "text",
    required: true,
    maxLength: 200,
    instructions: "Must include 'LLC', 'L.L.C.', or 'Limited Liability Company'",
  },
  {
    id: "principal_address",
    label: "Principal Office Address",
    type: "address",
    required: true,
  },
  {
    id: "registered_agent_name",
    label: "Registered Agent Name",
    type: "text",
    required: true,
  },
  {
    id: "registered_agent_address",
    label: "Registered Agent Address",
    type: "address",
    required: true,
    instructions: "Must be a physical street address in the state of formation",
  },
  {
    id: "organizer_name",
    label: "Organizer Name",
    type: "text",
    required: true,
  },
  {
    id: "organizer_signature",
    label: "Organizer Signature",
    type: "text",
    required: true,
  },
  {
    id: "effective_date",
    label: "Effective Date",
    type: "date",
    required: false,
    instructions: "Leave blank for immediate effectiveness upon filing",
  },
];

export const ARTICLES_TEMPLATES: Record<string, ArticlesTemplateConfig> = {
  AZ: {
    stateCode: "AZ",
    stateName: "Arizona",
    documentTitle: "Articles of Organization",
    filingAuthority: "Arizona Corporation Commission",
    filingAuthorityAddress: [
      "Arizona Corporation Commission",
      "1300 W. Washington St.",
      "Phoenix, AZ 85007",
    ],
    requiredFields: [
      ...COMMON_FIELDS,
      {
        id: "management_type",
        label: "Management Structure",
        type: "text",
        required: true,
        instructions: "Manager-managed or Member-managed",
      },
      {
        id: "member_names",
        label: "Names and Addresses of Members/Managers",
        type: "textarea",
        required: true,
      },
      {
        id: "statutory_agent_acceptance",
        label: "Statutory Agent Acceptance",
        type: "checkbox",
        required: true,
        instructions: "The statutory agent must sign accepting the appointment",
      },
    ],
    statutoryReference: "A.R.S. § 29-3201",
    footerDisclaimer:
      "Filed pursuant to Arizona Revised Statutes Title 29, Chapter 7.",
    pageFormat: "letter",
    requiresNotarization: false,
    requiresPublication: true,
    publicationNotes:
      "Arizona requires publication of Articles of Organization in a newspaper of general circulation in the county of the known place of business within 60 days of filing.",
  },

  CA: {
    stateCode: "CA",
    stateName: "California",
    documentTitle: "Articles of Organization — Limited Liability Company (LLC-1)",
    filingAuthority: "California Secretary of State",
    filingAuthorityAddress: [
      "California Secretary of State",
      "Business Programs Division",
      "P.O. Box 944228",
      "Sacramento, CA 94244-2280",
    ],
    requiredFields: [
      ...COMMON_FIELDS,
      {
        id: "purpose",
        label: "Purpose",
        type: "textarea",
        required: true,
        instructions:
          "The purpose of the LLC is to engage in any lawful act or activity for which a limited liability company may be organized under the California Revised Uniform Limited Liability Company Act.",
      },
      {
        id: "agent_for_service",
        label: "Agent for Service of Process",
        type: "text",
        required: true,
      },
    ],
    statutoryReference: "California Corporations Code § 17702.01",
    footerDisclaimer:
      "Filed pursuant to the California Revised Uniform Limited Liability Company Act.",
    pageFormat: "letter",
    requiresNotarization: false,
    requiresPublication: false,
  },

  TX: {
    stateCode: "TX",
    stateName: "Texas",
    documentTitle: "Certificate of Formation — Limited Liability Company",
    filingAuthority: "Texas Secretary of State",
    filingAuthorityAddress: [
      "Secretary of State",
      "P.O. Box 13697",
      "Austin, TX 78711-3697",
    ],
    requiredFields: [
      ...COMMON_FIELDS,
      {
        id: "purpose",
        label: "Purpose",
        type: "textarea",
        required: true,
        instructions: "The purpose for which the LLC is formed.",
      },
      {
        id: "duration",
        label: "Duration",
        type: "text",
        required: true,
        instructions: "Perpetual or specific date of dissolution",
      },
      {
        id: "governing_authority",
        label: "Governing Authority",
        type: "textarea",
        required: true,
        instructions: "Names and addresses of initial managers or governing persons",
      },
    ],
    statutoryReference: "Texas Business Organizations Code § 3.005",
    footerDisclaimer:
      "Filed pursuant to the Texas Business Organizations Code.",
    pageFormat: "letter",
    requiresNotarization: false,
    requiresPublication: false,
  },

  FL: {
    stateCode: "FL",
    stateName: "Florida",
    documentTitle: "Articles of Organization — Florida Limited Liability Company",
    filingAuthority: "Florida Department of State, Division of Corporations",
    filingAuthorityAddress: [
      "Division of Corporations",
      "Clifton Building",
      "2661 Executive Center Circle",
      "Tallahassee, FL 32301",
    ],
    requiredFields: [
      ...COMMON_FIELDS,
      {
        id: "mailing_address",
        label: "Mailing Address of LLC",
        type: "address",
        required: true,
      },
      {
        id: "management_type",
        label: "Management",
        type: "text",
        required: true,
        instructions: "Manager-managed or Member-managed",
      },
    ],
    statutoryReference: "Florida Statutes § 605.0201",
    footerDisclaimer:
      "Filed pursuant to the Florida Revised Limited Liability Company Act.",
    pageFormat: "letter",
    requiresNotarization: false,
    requiresPublication: false,
  },

  NY: {
    stateCode: "NY",
    stateName: "New York",
    documentTitle: "Articles of Organization of a New York Limited Liability Company",
    filingAuthority: "New York Department of State, Division of Corporations",
    filingAuthorityAddress: [
      "NYS Department of State",
      "Division of Corporations",
      "One Commerce Plaza",
      "99 Washington Avenue",
      "Albany, NY 12231",
    ],
    requiredFields: [
      ...COMMON_FIELDS,
      {
        id: "county",
        label: "County within New York",
        type: "text",
        required: true,
        instructions: "The county in which the office of the LLC is to be located",
      },
      {
        id: "dos_process_address",
        label: "Address for Secretary of State to Forward Process",
        type: "address",
        required: true,
      },
    ],
    statutoryReference: "NY LLC Law § 203",
    footerDisclaimer:
      "Filed pursuant to Section 203 of the New York Limited Liability Company Law.",
    pageFormat: "letter",
    requiresNotarization: false,
    requiresPublication: true,
    publicationNotes:
      "New York requires publication in 2 newspapers (one daily, one weekly) in the county of formation within 120 days. Cost varies by county ($300-$1500+). Albany County is typically cheapest.",
  },

  WY: {
    stateCode: "WY",
    stateName: "Wyoming",
    documentTitle: "Articles of Organization — Wyoming Limited Liability Company",
    filingAuthority: "Wyoming Secretary of State",
    filingAuthorityAddress: [
      "Wyoming Secretary of State",
      "Herschler Building East, Suite 101",
      "122 W. 25th Street",
      "Cheyenne, WY 82002-0020",
    ],
    requiredFields: [
      ...COMMON_FIELDS,
      {
        id: "mailing_address",
        label: "Mailing Address",
        type: "address",
        required: true,
      },
    ],
    statutoryReference: "Wyoming Statutes § 17-29-201",
    footerDisclaimer:
      "Filed pursuant to the Wyoming Limited Liability Company Act.",
    pageFormat: "letter",
    requiresNotarization: false,
    requiresPublication: false,
  },

  DE: {
    stateCode: "DE",
    stateName: "Delaware",
    documentTitle: "Certificate of Formation of a Limited Liability Company",
    filingAuthority: "Delaware Division of Corporations",
    filingAuthorityAddress: [
      "Delaware Division of Corporations",
      "John G. Townsend Building",
      "401 Federal Street, Suite 4",
      "Dover, DE 19901",
    ],
    requiredFields: [
      {
        id: "llc_name",
        label: "Name of Limited Liability Company",
        type: "text",
        required: true,
        maxLength: 200,
      },
      {
        id: "registered_agent_name",
        label: "Registered Agent Name",
        type: "text",
        required: true,
      },
      {
        id: "registered_agent_address",
        label: "Registered Agent Address in Delaware",
        type: "address",
        required: true,
      },
      {
        id: "organizer_name",
        label: "Authorized Person Name",
        type: "text",
        required: true,
      },
      {
        id: "organizer_signature",
        label: "Authorized Person Signature",
        type: "text",
        required: true,
      },
    ],
    statutoryReference: "Delaware LLC Act § 18-201",
    footerDisclaimer:
      "Filed pursuant to the Delaware Limited Liability Company Act, 6 Del. C. § 18-201.",
    pageFormat: "letter",
    requiresNotarization: false,
    requiresPublication: false,
  },

  NV: {
    stateCode: "NV",
    stateName: "Nevada",
    documentTitle: "Articles of Organization — Nevada Limited-Liability Company",
    filingAuthority: "Nevada Secretary of State",
    filingAuthorityAddress: [
      "Nevada Secretary of State",
      "202 N. Carson Street",
      "Carson City, NV 89701",
    ],
    requiredFields: [
      ...COMMON_FIELDS,
      {
        id: "management_type",
        label: "Management Structure",
        type: "text",
        required: true,
        instructions: "Manager-managed or Member-managed",
      },
      {
        id: "managers_or_members",
        label: "Names of Managers or Managing Members",
        type: "textarea",
        required: true,
      },
    ],
    statutoryReference: "NRS Chapter 86",
    footerDisclaimer:
      "Filed pursuant to Nevada Revised Statutes Chapter 86.",
    pageFormat: "letter",
    requiresNotarization: false,
    requiresPublication: false,
  },

  WA: {
    stateCode: "WA",
    stateName: "Washington",
    documentTitle: "Certificate of Formation — Washington Limited Liability Company",
    filingAuthority: "Washington Secretary of State, Corporations Division",
    filingAuthorityAddress: [
      "Corporations Division",
      "801 Capitol Way S.",
      "P.O. Box 40234",
      "Olympia, WA 98504-0234",
    ],
    requiredFields: [
      ...COMMON_FIELDS,
      {
        id: "effective_date",
        label: "Effective Date",
        type: "date",
        required: false,
      },
      {
        id: "duration",
        label: "Duration",
        type: "text",
        required: false,
        instructions: "Perpetual unless otherwise specified",
      },
    ],
    statutoryReference: "RCW 25.15.071",
    footerDisclaimer:
      "Filed pursuant to the Washington Limited Liability Company Act.",
    pageFormat: "letter",
    requiresNotarization: false,
    requiresPublication: false,
  },

  IL: {
    stateCode: "IL",
    stateName: "Illinois",
    documentTitle: "Articles of Organization — Illinois Limited Liability Company (LLC-5.5)",
    filingAuthority: "Illinois Secretary of State, Department of Business Services",
    filingAuthorityAddress: [
      "Illinois Secretary of State",
      "Department of Business Services",
      "501 S. Second Street, Suite 328",
      "Springfield, IL 62756",
    ],
    requiredFields: [
      ...COMMON_FIELDS,
      {
        id: "purpose",
        label: "Purpose",
        type: "textarea",
        required: true,
        instructions: "Transaction of any or all lawful purposes",
      },
      {
        id: "management_type",
        label: "Management",
        type: "text",
        required: true,
        instructions: "Manager-managed or Member-managed",
      },
    ],
    statutoryReference: "805 ILCS 180/5-1",
    footerDisclaimer:
      "Filed pursuant to the Illinois Limited Liability Company Act.",
    pageFormat: "letter",
    requiresNotarization: false,
    requiresPublication: false,
  },
};

export function getArticlesTemplate(stateCode: string): ArticlesTemplateConfig {
  const template = ARTICLES_TEMPLATES[stateCode];
  if (!template) {
    throw new Error(
      `No Articles of Organization template for state: ${stateCode}`
    );
  }
  return template;
}
