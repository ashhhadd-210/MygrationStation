/**
 * US State configuration for LLC formation.
 *
 * 10 launch states fully populated: AZ, CA, TX, FL, NY, WY, DE, NV, WA, IL
 * Remaining 40 states have base info; filing details to be added as MygrationStation expands.
 *
 * Filing fees and processing times are current as of Q1 2025.
 * Source: individual Secretary of State websites.
 */

export interface StateConfig {
  /** Two-letter state code (ISO 3166-2) */
  stateCode: string;
  /** Full state name */
  stateName: string;
  /** LLC formation filing fee in cents */
  filingFeeCents: number;
  /** Standard processing time in business days */
  standardProcessingDays: number;
  /** Expedited processing time in business days (0 if not available) */
  expeditedProcessingDays: number;
  /** Human-readable description of annual report due date rule */
  annualReportDueRule: string;
  /** Annual report filing fee in cents */
  annualReportFilingFeeCents: number;
  /** Whether MygrationStation can file directly via API (vs. manual submission) */
  hasDirectFilingAPI: boolean;
  /** Whether this state is fully supported for filing in v1 */
  launchState: boolean;
  /** Secretary of State business search URL */
  sosSearchUrl: string;
  /** Additional state-specific notes */
  notes?: string;
}

export const STATES: Record<string, StateConfig> = {
  // ── LAUNCH STATES (fully populated) ────────────────────────────────

  AZ: {
    stateCode: "AZ",
    stateName: "Arizona",
    filingFeeCents: 5000,
    standardProcessingDays: 7,
    expeditedProcessingDays: 3,
    annualReportDueRule:
      "No annual report required. Arizona does not require LLCs to file an annual report.",
    annualReportFilingFeeCents: 0,
    hasDirectFilingAPI: false,
    launchState: true,
    sosSearchUrl:
      "https://ecorp.azcc.gov/EntitySearch/Index",
    notes:
      "Arizona has no annual report and no state income tax on LLCs taxed as disregarded entities or partnerships. One of the most favorable states for immigrant LLC formation.",
  },

  CA: {
    stateCode: "CA",
    stateName: "California",
    filingFeeCents: 7000,
    standardProcessingDays: 15,
    expeditedProcessingDays: 5,
    annualReportDueRule:
      "Statement of Information due within 90 days of formation and every 2 years thereafter, during the filing month.",
    annualReportFilingFeeCents: 2000,
    hasDirectFilingAPI: false,
    launchState: true,
    sosSearchUrl:
      "https://bizfileonline.sos.ca.gov/search/business",
    notes:
      "California imposes an $800 annual franchise tax on all LLCs (first year exempt for LLCs formed 2021-2023; check current exemption status). Gross receipts fee may apply above $250K revenue.",
  },

  TX: {
    stateCode: "TX",
    stateName: "Texas",
    filingFeeCents: 30000,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule:
      "Annual franchise tax report due May 15 each year. No-tax-due threshold is $2.47M total revenue.",
    annualReportFilingFeeCents: 0,
    hasDirectFilingAPI: true,
    launchState: true,
    sosSearchUrl:
      "https://mycpa.cpa.state.tx.us/coa/",
    notes:
      "Texas SOS offers SOSDirect for online filing. $300 filing fee is one of the higher ones. No state income tax. Franchise tax has high no-tax-due threshold.",
  },

  FL: {
    stateCode: "FL",
    stateName: "Florida",
    filingFeeCents: 12500,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule:
      "Annual report due by May 1 each year. $400 late fee if filed after May 1 but before the third Friday in September.",
    annualReportFilingFeeCents: 13875,
    hasDirectFilingAPI: true,
    launchState: true,
    sosSearchUrl:
      "https://search.sunbiz.org/Inquiry/CorporationSearch/ByName",
    notes:
      "Florida Sunbiz offers online filing. $125 filing fee includes $25 registered agent fee. Annual report is $138.75. No state income tax for individuals.",
  },

  NY: {
    stateCode: "NY",
    stateName: "New York",
    filingFeeCents: 20000,
    standardProcessingDays: 14,
    expeditedProcessingDays: 1,
    annualReportDueRule:
      "Biennial statement due every 2 years in the anniversary month of formation.",
    annualReportFilingFeeCents: 900,
    hasDirectFilingAPI: false,
    launchState: true,
    sosSearchUrl:
      "https://appext20.dos.ny.gov/corp_public/CORPSEARCH.ENTITY_SEARCH_ENTRY",
    notes:
      "New York requires publication in 2 newspapers within 120 days of formation (publication requirement). This can cost $300-$1500+ depending on county. Albany County is cheapest. Must be disclosed to users.",
  },

  WY: {
    stateCode: "WY",
    stateName: "Wyoming",
    filingFeeCents: 10000,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule:
      "Annual report due on the first day of the anniversary month of formation. Minimum $60 fee or $60 per $250,000 of assets in Wyoming.",
    annualReportFilingFeeCents: 6000,
    hasDirectFilingAPI: true,
    launchState: true,
    sosSearchUrl:
      "https://wyobiz.wyo.gov/Business/FilingSearch.aspx",
    notes:
      "Wyoming is very popular for non-resident LLCs. No state income tax, strong asset protection, low fees, no publication requirement. Lifetime proxy allows foreign owners to manage remotely.",
  },

  DE: {
    stateCode: "DE",
    stateName: "Delaware",
    filingFeeCents: 9000,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule:
      "Annual tax of $300 due June 1 each year.",
    annualReportFilingFeeCents: 30000,
    hasDirectFilingAPI: false,
    launchState: true,
    sosSearchUrl:
      "https://icis.corp.delaware.gov/ecorp/entitysearch/namesearch.aspx",
    notes:
      "Delaware is the gold standard for C-Corps but less advantageous for single-member LLCs unless planning to raise VC. $300 annual tax applies regardless of revenue. Court of Chancery is the key advantage for complex corporate disputes.",
  },

  NV: {
    stateCode: "NV",
    stateName: "Nevada",
    filingFeeCents: 42500,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule:
      "Annual list of managers/members due on the last day of the anniversary month. $150 fee.",
    annualReportFilingFeeCents: 15000,
    hasDirectFilingAPI: true,
    launchState: true,
    sosSearchUrl:
      "https://esos.nv.gov/EntitySearch/OnlineEntitySearch",
    notes:
      "Nevada has no state income tax and no franchise tax. However, the initial filing fee ($425) and annual list fee ($150) plus business license ($200/year) make it more expensive overall than Wyoming.",
  },

  WA: {
    stateCode: "WA",
    stateName: "Washington",
    filingFeeCents: 20000,
    standardProcessingDays: 7,
    expeditedProcessingDays: 2,
    annualReportDueRule:
      "Annual report due on the last day of the month of the LLC's formation anniversary.",
    annualReportFilingFeeCents: 7100,
    hasDirectFilingAPI: false,
    launchState: true,
    sosSearchUrl:
      "https://ccfs.sos.wa.gov/#/",
    notes:
      "Washington has no state income tax but does impose a Business & Occupation (B&O) tax on gross receipts. Annual report is $71.",
  },

  IL: {
    stateCode: "IL",
    stateName: "Illinois",
    filingFeeCents: 15000,
    standardProcessingDays: 10,
    expeditedProcessingDays: 1,
    annualReportDueRule:
      "Annual report due before the first day of the anniversary month of formation. $75 fee.",
    annualReportFilingFeeCents: 7500,
    hasDirectFilingAPI: false,
    launchState: true,
    sosSearchUrl:
      "https://www.ilsos.gov/corporatellc/CorporateLlcController",
    notes:
      "Illinois reduced its LLC filing fee from $500 to $150 in 2024. Annual report is $75. State has personal property replacement tax that may apply.",
  },

  // ── REMAINING STATES (base info, filing support pending) ───────────

  AL: {
    stateCode: "AL",
    stateName: "Alabama",
    filingFeeCents: 20800,
    standardProcessingDays: 10,
    expeditedProcessingDays: 0,
    annualReportDueRule: "Annual privilege tax return due April 15.",
    annualReportFilingFeeCents: 0,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://arc-sos.state.al.us/cgi/corpname.mbr/output",
  },
  AK: {
    stateCode: "AK",
    stateName: "Alaska",
    filingFeeCents: 25000,
    standardProcessingDays: 10,
    expeditedProcessingDays: 0,
    annualReportDueRule: "Biennial report due January 2 every two years.",
    annualReportFilingFeeCents: 10000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://www.commerce.alaska.gov/cbp/main/search/entities",
  },
  AR: {
    stateCode: "AR",
    stateName: "Arkansas",
    filingFeeCents: 4500,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual franchise tax report due May 1.",
    annualReportFilingFeeCents: 15000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://www.sos.arkansas.gov/corps/search_all.php",
  },
  CO: {
    stateCode: "CO",
    stateName: "Colorado",
    filingFeeCents: 5000,
    standardProcessingDays: 5,
    expeditedProcessingDays: 0,
    annualReportDueRule: "Periodic report due in anniversary month.",
    annualReportFilingFeeCents: 1000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://www.sos.state.co.us/biz/BusinessEntityCriteriaExt.do",
  },
  CT: {
    stateCode: "CT",
    stateName: "Connecticut",
    filingFeeCents: 12000,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due on anniversary of formation.",
    annualReportFilingFeeCents: 8000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://service.ct.gov/business/s/onlinebusinesssearch",
  },
  DC: {
    stateCode: "DC",
    stateName: "District of Columbia",
    filingFeeCents: 9900,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Biennial report due April 1 every two years.",
    annualReportFilingFeeCents: 30000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://corponline.dcra.dc.gov/Home.aspx",
  },
  GA: {
    stateCode: "GA",
    stateName: "Georgia",
    filingFeeCents: 10000,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual registration due April 1.",
    annualReportFilingFeeCents: 5000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://ecorp.sos.ga.gov/BusinessSearch",
  },
  HI: {
    stateCode: "HI",
    stateName: "Hawaii",
    filingFeeCents: 5000,
    standardProcessingDays: 10,
    expeditedProcessingDays: 3,
    annualReportDueRule: "Annual report due in anniversary quarter.",
    annualReportFilingFeeCents: 1500,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://hbe.ehawaii.gov/documents/search.html",
  },
  ID: {
    stateCode: "ID",
    stateName: "Idaho",
    filingFeeCents: 10000,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due in anniversary month.",
    annualReportFilingFeeCents: 0,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://sosbiz.idaho.gov/search/business",
  },
  IN: {
    stateCode: "IN",
    stateName: "Indiana",
    filingFeeCents: 9500,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Biennial report due in anniversary month every two years.",
    annualReportFilingFeeCents: 3200,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://bsd.sos.in.gov/PublicBusinessSearch",
  },
  IA: {
    stateCode: "IA",
    stateName: "Iowa",
    filingFeeCents: 5000,
    standardProcessingDays: 10,
    expeditedProcessingDays: 0,
    annualReportDueRule: "Biennial report due April 1 in odd-numbered years.",
    annualReportFilingFeeCents: 6000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://sos.iowa.gov/search/business/(S(...))/search.aspx",
  },
  KS: {
    stateCode: "KS",
    stateName: "Kansas",
    filingFeeCents: 16000,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due April 15.",
    annualReportFilingFeeCents: 5500,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://www.kansas.gov/bess/flow/main",
  },
  KY: {
    stateCode: "KY",
    stateName: "Kentucky",
    filingFeeCents: 4000,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due June 30.",
    annualReportFilingFeeCents: 1500,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://app.sos.ky.gov/ftsearch/",
  },
  LA: {
    stateCode: "LA",
    stateName: "Louisiana",
    filingFeeCents: 10000,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due on anniversary of formation.",
    annualReportFilingFeeCents: 3500,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://coraweb.sos.la.gov/CommercialSearch/CommercialSearch.aspx",
  },
  ME: {
    stateCode: "ME",
    stateName: "Maine",
    filingFeeCents: 17500,
    standardProcessingDays: 10,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due June 1.",
    annualReportFilingFeeCents: 8500,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://icrs.informe.org/nei-sos-icrs/ICRS",
  },
  MD: {
    stateCode: "MD",
    stateName: "Maryland",
    filingFeeCents: 10000,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due April 15.",
    annualReportFilingFeeCents: 30000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://egov.maryland.gov/BusinessExpress/EntitySearch",
  },
  MA: {
    stateCode: "MA",
    stateName: "Massachusetts",
    filingFeeCents: 50000,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due on anniversary of formation.",
    annualReportFilingFeeCents: 50000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://corp.sec.state.ma.us/CorpWeb/CorpSearch/CorpSearch.aspx",
  },
  MI: {
    stateCode: "MI",
    stateName: "Michigan",
    filingFeeCents: 5000,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual statement due February 15.",
    annualReportFilingFeeCents: 2500,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://cofs.lara.state.mi.us/SearchApi/Search/Search",
  },
  MN: {
    stateCode: "MN",
    stateName: "Minnesota",
    filingFeeCents: 15500,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual renewal due December 31.",
    annualReportFilingFeeCents: 0,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://mblsportal.sos.state.mn.us/Business/Search",
  },
  MS: {
    stateCode: "MS",
    stateName: "Mississippi",
    filingFeeCents: 5000,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due April 15.",
    annualReportFilingFeeCents: 0,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://corp.sos.ms.gov/corp/portal/c/page/corpBusinessIdSearch/portal.aspx",
  },
  MO: {
    stateCode: "MO",
    stateName: "Missouri",
    filingFeeCents: 5000,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule: "No annual report required for LLCs.",
    annualReportFilingFeeCents: 0,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://bsd.sos.mo.gov/BusinessEntity/BESearch.aspx",
  },
  MT: {
    stateCode: "MT",
    stateName: "Montana",
    filingFeeCents: 7000,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due April 15.",
    annualReportFilingFeeCents: 2000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://biz.sosmt.gov/search",
  },
  NE: {
    stateCode: "NE",
    stateName: "Nebraska",
    filingFeeCents: 10500,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Biennial report due April 1 of odd-numbered years.",
    annualReportFilingFeeCents: 1000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://www.nebraska.gov/sos/corp/corpsearch.cgi",
  },
  NH: {
    stateCode: "NH",
    stateName: "New Hampshire",
    filingFeeCents: 10000,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due April 1.",
    annualReportFilingFeeCents: 10000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://quickstart.sos.nh.gov/online/BusinessInquire",
  },
  NJ: {
    stateCode: "NJ",
    stateName: "New Jersey",
    filingFeeCents: 12500,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due on anniversary of formation.",
    annualReportFilingFeeCents: 7500,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://www.njportal.com/DOR/BusinessNameSearch",
  },
  NM: {
    stateCode: "NM",
    stateName: "New Mexico",
    filingFeeCents: 5000,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule: "No annual report required for domestic LLCs.",
    annualReportFilingFeeCents: 0,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://portal.sos.state.nm.us/BFS/online/CorporationBusinessSearch",
  },
  NC: {
    stateCode: "NC",
    stateName: "North Carolina",
    filingFeeCents: 12500,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due April 15.",
    annualReportFilingFeeCents: 20000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://www.sosnc.gov/online_services/search/by_title/_Business_Registration",
  },
  ND: {
    stateCode: "ND",
    stateName: "North Dakota",
    filingFeeCents: 13500,
    standardProcessingDays: 7,
    expeditedProcessingDays: 0,
    annualReportDueRule: "Annual report due November 15.",
    annualReportFilingFeeCents: 5000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://firststop.sos.nd.gov/search/business",
  },
  OH: {
    stateCode: "OH",
    stateName: "Ohio",
    filingFeeCents: 9900,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule: "No annual report required. Commercial Activity Tax (CAT) applies above threshold.",
    annualReportFilingFeeCents: 0,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://businesssearch.ohiosos.gov/",
  },
  OK: {
    stateCode: "OK",
    stateName: "Oklahoma",
    filingFeeCents: 10000,
    standardProcessingDays: 7,
    expeditedProcessingDays: 0,
    annualReportDueRule: "Annual certificate due on anniversary of formation.",
    annualReportFilingFeeCents: 2500,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://www.sos.ok.gov/corp/corpInquiryFind.aspx",
  },
  OR: {
    stateCode: "OR",
    stateName: "Oregon",
    filingFeeCents: 10000,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due on anniversary of formation.",
    annualReportFilingFeeCents: 10000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "http://egov.sos.state.or.us/br/pkg_web_name_srch_inq.login",
  },
  PA: {
    stateCode: "PA",
    stateName: "Pennsylvania",
    filingFeeCents: 12500,
    standardProcessingDays: 10,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Decennial report due every 10 years.",
    annualReportFilingFeeCents: 7000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://www.corporations.pa.gov/search/corpsearch",
  },
  RI: {
    stateCode: "RI",
    stateName: "Rhode Island",
    filingFeeCents: 15000,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due on anniversary of formation.",
    annualReportFilingFeeCents: 5000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "http://business.sos.ri.gov/CorpWeb/CorpSearch/CorpSearch.aspx",
  },
  SC: {
    stateCode: "SC",
    stateName: "South Carolina",
    filingFeeCents: 11000,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule: "No annual report required for LLCs.",
    annualReportFilingFeeCents: 0,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://businessfilings.sc.gov/BusinessFiling/Entity/Search",
  },
  SD: {
    stateCode: "SD",
    stateName: "South Dakota",
    filingFeeCents: 15000,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due on first day of anniversary month.",
    annualReportFilingFeeCents: 5000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://sosenterprise.sd.gov/BusinessServices/Business/FilingSearch.aspx",
  },
  TN: {
    stateCode: "TN",
    stateName: "Tennessee",
    filingFeeCents: 30000,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due April 1.",
    annualReportFilingFeeCents: 30000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://tnbear.tn.gov/ECommerce/FilingSearch.aspx",
  },
  UT: {
    stateCode: "UT",
    stateName: "Utah",
    filingFeeCents: 5400,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual renewal due on anniversary of formation.",
    annualReportFilingFeeCents: 1800,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://secure.utah.gov/bes/index.html",
  },
  VT: {
    stateCode: "VT",
    stateName: "Vermont",
    filingFeeCents: 12500,
    standardProcessingDays: 7,
    expeditedProcessingDays: 0,
    annualReportDueRule: "Annual report due on anniversary of formation.",
    annualReportFilingFeeCents: 3500,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://bizfilings.vermont.gov/online/BusinessInquire",
  },
  VA: {
    stateCode: "VA",
    stateName: "Virginia",
    filingFeeCents: 10000,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual registration fee due on last day of anniversary month.",
    annualReportFilingFeeCents: 5000,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://cis.scc.virginia.gov/EntitySearch.aspx",
  },
  WV: {
    stateCode: "WV",
    stateName: "West Virginia",
    filingFeeCents: 10000,
    standardProcessingDays: 7,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due July 1.",
    annualReportFilingFeeCents: 2500,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://apps.wv.gov/SOS/BusinessEntity/",
  },
  WI: {
    stateCode: "WI",
    stateName: "Wisconsin",
    filingFeeCents: 13000,
    standardProcessingDays: 5,
    expeditedProcessingDays: 1,
    annualReportDueRule: "Annual report due in anniversary quarter.",
    annualReportFilingFeeCents: 2500,
    hasDirectFilingAPI: false,
    launchState: false,
    sosSearchUrl: "https://www.wdfi.org/apps/CorpSearch/Search.aspx",
  },
} as const;

/**
 * Get a state config by code. Throws if state code is invalid.
 */
export function getStateConfig(stateCode: string): StateConfig {
  const config = STATES[stateCode];
  if (!config) {
    throw new Error(`Invalid state code: ${stateCode}`);
  }
  return config;
}

/**
 * Get all launch states (supported for v1 filing).
 */
export function getLaunchStates(): StateConfig[] {
  return Object.values(STATES).filter((s) => s.launchState);
}

/**
 * Get all states sorted alphabetically by name.
 */
export function getAllStatesSorted(): StateConfig[] {
  return Object.values(STATES).sort((a, b) =>
    a.stateName.localeCompare(b.stateName)
  );
}

/**
 * Popular states shown first in the state picker.
 */
export const POPULAR_STATE_CODES = ["WY", "DE", "FL", "TX", "NV"] as const;
