export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  content: string; // HTML
}

export const CATEGORIES = [
  "All",
  "Visa Guides",
  "Getting Started",
  "Compliance",
  "State Guides",
  "Banking & Finance",
  "Tax Tips",
] as const;

export const posts: BlogPost[] = [
  {
    slug: "h1b-visa-start-business",
    title: "H-1B Visa Holders: Can You Start a Business in the US?",
    description: "Understanding the rules around side businesses, LLC ownership, and what USCIS allows while on an H-1B visa.",
    category: "Visa Guides",
    date: "April 8, 2026",
    readTime: "8 min read",
    content: `<h2>Can H-1B Visa Holders Own an LLC?</h2>
<p>Yes — H-1B visa holders can legally form and own an LLC in the United States. No immigration law prohibits owning a business entity. However, the critical distinction is between <strong>ownership</strong> and <strong>work</strong>.</p>

<h2>The Key Rule: Ownership vs. Active Work</h2>
<p>The H-1B visa is an employer-sponsored work visa that ties you to a specific employer and specific job duties. Here's what that means for business ownership:</p>

<h3>What you CAN do:</h3>
<ul>
<li>Form and own an LLC or corporation</li>
<li>Be a passive investor in the business</li>
<li>Receive dividends and distributions from the company</li>
<li>Hire employees or contractors to run the business</li>
<li>Make strategic decisions as an owner (not day-to-day operations)</li>
</ul>

<h3>What you CANNOT do:</h3>
<ul>
<li>Actively work for the LLC (this would violate your H-1B terms)</li>
<li>Perform services that generate revenue for the LLC</li>
<li>Manage day-to-day operations yourself</li>
<li>Replace your H-1B employment with self-employment</li>
</ul>

<h2>The Passive Income Exception</h2>
<p>The IRS and USCIS draw a clear line: you can earn <strong>passive income</strong> from your LLC — rental income, investment returns, or profits from a business run by others — but you cannot perform active work for it.</p>
<p>For example, if you own a rental property LLC, the rental income is passive. If you own an e-commerce LLC where contractors handle fulfillment and customer service, that's generally permissible as long as you're not doing the work yourself.</p>

<h2>What About an E-2 or O-1 Visa?</h2>
<p>If you want to actively work in your own business, you may need to consider changing your visa status:</p>
<ul>
<li><strong>E-2 Treaty Investor Visa:</strong> Allows you to invest in and actively manage a US business. Requires a "substantial" investment (typically $100,000+) and that you're a national of a treaty country.</li>
<li><strong>O-1 Visa:</strong> For individuals with extraordinary ability. If you can demonstrate extraordinary achievement in your field, you may qualify to work for your own company.</li>
<li><strong>EB-5 Immigrant Investor:</strong> For those investing $800,000+ in a new commercial enterprise that creates 10+ jobs.</li>
</ul>

<h2>Practical Steps for H-1B Holders</h2>
<ol>
<li>Consult an immigration attorney before forming any business entity</li>
<li>Form your LLC — this is perfectly legal regardless of visa status</li>
<li>Get your EIN — you'll need this for a bank account and tax filings</li>
<li>Hire others to handle active business operations</li>
<li>Keep detailed records showing your passive role</li>
<li>File all required taxes — Form 5472 if you're a foreign-owned LLC</li>
</ol>

<h2>Tax Obligations</h2>
<p>As an H-1B holder with an LLC, you'll have additional tax obligations:</p>
<ul>
<li>Form 1040 for personal income tax</li>
<li>Schedule C or K-1 for LLC income</li>
<li>Form 5472 if you have transactions with foreign related parties</li>
<li>State tax filings depending on where your LLC is formed</li>
</ul>

<h2>The Bottom Line</h2>
<p>Owning an LLC on an H-1B is legal. Working in it is not. The key is maintaining a strictly passive role and having others handle the active operations. When in doubt, always consult with an immigration attorney who specializes in business immigration.</p>
<p class="sources"><em>Sources: USCIS.gov, IRS Publication 519, 8 CFR § 214.2(h)</em></p>`,
  },
  {
    slug: "forming-llc-without-ssn",
    title: "The Complete Guide to Forming an LLC Without an SSN",
    description: "Step-by-step walkthrough for ITIN holders, non-residents, and immigrants who want to start a US business legally.",
    category: "Getting Started",
    date: "April 3, 2026",
    readTime: "10 min read",
    content: `<h2>Can You Form an LLC Without a Social Security Number?</h2>
<p>Absolutely. There is no federal or state requirement that LLC owners hold a Social Security Number. Non-US citizens, non-residents, ITIN holders, and individuals without any US tax identification number can all form LLCs in any of the 50 states.</p>

<h2>What You Need Instead of an SSN</h2>
<ul>
<li>A valid passport (from any country)</li>
<li>A US mailing address (can be your registered agent's address)</li>
<li>A registered agent in your state of formation (required by every state)</li>
<li>An EIN (Employer Identification Number) — obtained from the IRS without needing an SSN</li>
</ul>

<h2>Step-by-Step: Forming Your LLC</h2>

<h3>Step 1: Choose Your State</h3>
<p>Popular choices for non-residents:</p>
<ul>
<li><strong>Wyoming</strong> — $100 filing fee, $60/yr annual fee, no state income tax, strong privacy</li>
<li><strong>Delaware</strong> — $90 filing fee, $300/yr annual fee, business-friendly courts</li>
<li><strong>New Mexico</strong> — $50 filing fee, $0/yr annual fee, lowest cost</li>
<li><strong>Florida</strong> — $125 filing fee, $138.75/yr, large market, no state income tax</li>
</ul>
<p><strong>Pro tip:</strong> If you won't physically operate in any US state, Wyoming is often the best choice due to low fees, no state income tax, and strong privacy protections.</p>

<h3>Step 2: Choose a Name and Registered Agent</h3>
<p>Your LLC name must be unique in your state of formation. Every state requires a registered agent — a person or service with a physical address in the state who can receive legal documents on your behalf.</p>

<h3>Step 3: File Articles of Organization</h3>
<p>This is the document that officially creates your LLC. It typically includes LLC name, registered agent info, principal office address, member/manager names, and organizer signature.</p>

<h3>Step 4: Create an Operating Agreement</h3>
<p>While not required in every state, an Operating Agreement is essential. It defines ownership percentages, profit/loss distribution, management structure, and what happens if a member leaves.</p>

<h3>Step 5: Get Your EIN</h3>
<p>The EIN is your business's tax ID number. The IRS issues EINs to foreign-owned LLCs without requiring an SSN or ITIN.</p>
<p>How to apply without an SSN:</p>
<ul>
<li><strong>By fax:</strong> Complete Form SS-4, write "Foreign" in the SSN field, fax to (855) 641-6935. Response: 4-7 business days.</li>
<li><strong>By phone:</strong> Call (267) 941-1099, Monday-Friday 6am-11pm ET.</li>
<li><strong>Through a third-party designee:</strong> Services like MygrationStation apply on your behalf.</li>
</ul>

<h3>Step 6: Open a Business Bank Account</h3>
<p>With your Articles of Organization, EIN letter, Operating Agreement, and passport, you can open a US business bank account. Banks that work with non-residents include Mercury, Relay, Chase, and Bank of America (select branches).</p>

<h2>Common Mistakes to Avoid</h2>
<ul>
<li>Skipping the Operating Agreement</li>
<li>Using a home address as registered agent</li>
<li>Forgetting BOI reporting for foreign-owned LLCs</li>
<li>Missing Form 5472 annual filing</li>
</ul>

<h2>The Bottom Line</h2>
<p>Forming an LLC without an SSN is not only possible — it's a well-established process used by thousands of international entrepreneurs every year. The key is choosing the right state, using a reliable registered agent, and staying on top of your compliance obligations.</p>
<p class="sources"><em>Sources: IRS.gov Form SS-4 Instructions, SOS.wyo.gov, FinCEN.gov</em></p>`,
  },
  {
    slug: "boi-reporting-foreign-llc",
    title: "BOI Reporting: What Every Foreign-Owned LLC Must Know in 2025",
    description: "FinCEN's Beneficial Ownership Information reporting requirements, deadlines, and penalties — updated with the March 2025 rule changes.",
    category: "Compliance",
    date: "March 28, 2026",
    readTime: "7 min read",
    content: `<h2>What Is BOI Reporting?</h2>
<p>Beneficial Ownership Information (BOI) reporting is a requirement under the Corporate Transparency Act (CTA) that requires certain companies to report information about their beneficial owners to the Financial Crimes Enforcement Network (FinCEN).</p>

<h2>The March 2025 Rule Change — What Changed?</h2>
<p>On March 21, 2025, FinCEN announced a major update: <strong>All US-created companies and US persons are now EXEMPT</strong> from BOI reporting.</p>
<p>However, <strong>foreign-owned companies</strong> registered to do business in the United States are still required to report. If you're a non-resident or immigrant who formed an LLC in the US, you likely still need to file.</p>

<h2>Who Must File?</h2>
<p>Under the updated rules, only <strong>foreign reporting companies</strong> must file. A foreign reporting company is an entity that was formed under the laws of a foreign country AND has registered to do business in any US state.</p>

<h2>What Information Must Be Reported?</h2>
<p>For each beneficial owner (anyone who owns 25%+ or exercises substantial control):</p>
<ul>
<li>Full legal name</li>
<li>Date of birth</li>
<li>Current residential address</li>
<li>A unique identifying number from a passport, state ID, or driver's license</li>
<li>An image of the identifying document</li>
</ul>

<h2>Deadlines</h2>
<ul>
<li><strong>Existing companies</strong> (registered before March 26, 2025): 30 days from the final rule effective date</li>
<li><strong>New companies</strong> (registered on/after March 26, 2025): 30 days from registration</li>
<li><strong>Changes</strong> to reported information: 30 days from the change</li>
</ul>

<h2>Penalties for Non-Compliance</h2>
<ul>
<li><strong>Civil penalties:</strong> Up to $591 per day</li>
<li><strong>Criminal penalties:</strong> Up to $10,000 fine and/or 2 years imprisonment for willful violations</li>
</ul>

<h2>The Bottom Line</h2>
<p>While the March 2025 rule change exempted US-created companies and US persons, foreign-owned LLCs still have reporting obligations. File through FinCEN's BOI E-Filing System at boiefiling.fincen.gov (no fee).</p>
<p class="sources"><em>Sources: FinCEN.gov, 31 CFR Part 1010, Corporate Transparency Act (P.L. 117-259)</em></p>`,
  },
  {
    slug: "e2-treaty-investor-visa",
    title: "E-2 Treaty Investor Visa: Your Path to Running a US Business",
    description: "Everything you need to know about the E-2 visa — eligibility, investment requirements, application process, and which countries qualify.",
    category: "Visa Guides",
    date: "March 20, 2026",
    readTime: "9 min read",
    content: `<h2>What Is the E-2 Treaty Investor Visa?</h2>
<p>The E-2 visa allows nationals of certain treaty countries to enter and work in the United States based on a substantial investment in a US business. Unlike the H-1B, the E-2 lets you <strong>actively manage and operate</strong> your business.</p>

<h2>Key Advantages</h2>
<ul>
<li><strong>No annual cap</strong> — unlike H-1B, there's no lottery</li>
<li><strong>Active management</strong> — you can work in your own business</li>
<li><strong>Renewable indefinitely</strong> — initial 2-5 years, renewable in 2-year increments</li>
<li><strong>Spouse can work</strong> — E-2 dependent spouses receive unrestricted work authorization</li>
<li><strong>Relatively fast processing</strong> — typically 2-4 months</li>
</ul>

<h2>Eligibility Requirements</h2>
<ol>
<li><strong>Be a national of a treaty country</strong> — Over 80 countries qualify including UK, France, Germany, Japan, South Korea, Australia, Canada, Mexico, Turkey. Notable exclusions: China, India, Brazil, Russia, Vietnam.</li>
<li><strong>Make a "substantial" investment</strong> — Most successful applications involve $100,000+. Smaller investments ($50,000-$100,000) can work for service businesses.</li>
<li><strong>Develop and direct the business</strong> — Own at least 50% or have operational control.</li>
</ol>

<h2>Common E-2 Business Types</h2>
<ul>
<li>Restaurants and food service</li>
<li>Retail stores and franchises</li>
<li>Tech companies and SaaS businesses</li>
<li>Import/export businesses</li>
<li>Professional services (consulting, marketing)</li>
<li>E-commerce businesses</li>
</ul>

<h2>The Bottom Line</h2>
<p>The E-2 visa is one of the most practical paths for entrepreneurs who want to actively run a business in the US. The key requirements are being from a treaty country and making a substantial, at-risk investment.</p>
<p class="sources"><em>Sources: USCIS.gov, 8 CFR § 214.2(e), Department of State Treaty List</em></p>`,
  },
  {
    slug: "wyoming-vs-delaware",
    title: "Wyoming vs. Delaware: Which State Is Best for Your LLC?",
    description: "A detailed comparison of the two most popular states for non-resident LLC formation — costs, privacy, taxes, and practical considerations.",
    category: "State Guides",
    date: "March 15, 2026",
    readTime: "7 min read",
    content: `<h2>The Two Most Popular States for Non-Resident LLCs</h2>
<p>When non-residents form a US LLC, the conversation almost always comes down to Wyoming vs. Delaware. Both states have earned their reputation for being business-friendly, but they serve different needs.</p>

<h2>Why Choose Wyoming</h2>
<ol>
<li><strong>Lowest ongoing costs</strong> — $60/yr annual report vs Delaware's $300</li>
<li><strong>Strongest privacy</strong> — Members not listed publicly in Articles of Organization</li>
<li><strong>No state income tax</strong> — Personal or corporate</li>
<li><strong>Best asset protection</strong> — Strongest charging order protection in the US</li>
<li><strong>Modern LLC Act</strong> — Wyoming created the LLC structure in 1977</li>
</ol>

<h2>Why Choose Delaware</h2>
<ol>
<li><strong>Court of Chancery</strong> — Dedicated business court with expert handling</li>
<li><strong>Investor expectations</strong> — VCs and law firms prefer Delaware entities</li>
<li><strong>Established legal precedent</strong> — Decades of predictable case law</li>
<li><strong>Series LLC option</strong> — Create separate series within one LLC</li>
</ol>

<h2>Cost Comparison Over 5 Years</h2>
<ul>
<li><strong>Wyoming total:</strong> $900-$1,150 (formation + 5 years annual reports + registered agent)</li>
<li><strong>Delaware total:</strong> $2,090-$2,340</li>
<li><strong>Wyoming saves roughly $1,000-$1,200 over 5 years.</strong></li>
</ul>

<h2>Our Recommendation</h2>
<ul>
<li><strong>Choose Wyoming</strong> if you're a solopreneur, small business owner, or non-resident who values privacy and low costs.</li>
<li><strong>Choose Delaware</strong> if you're planning to raise venture capital or need the Court of Chancery.</li>
<li><strong>Choose your operating state</strong> if you'll have a physical office or employees there.</li>
</ul>
<p class="sources"><em>Sources: Wyoming Secretary of State (sos.wyo.gov), Delaware Division of Corporations (corp.delaware.gov)</em></p>`,
  },
  {
    slug: "get-ein-without-ssn",
    title: "How to Get an EIN Without an SSN: Step-by-Step for Non-Residents",
    description: "The IRS process for obtaining an Employer Identification Number when you don't have a Social Security Number — by fax, phone, or third-party designee.",
    category: "Getting Started",
    date: "March 10, 2026",
    readTime: "6 min read",
    content: `<h2>What Is an EIN and Why Do You Need One?</h2>
<p>An EIN is a 9-digit number issued by the IRS to identify your business. You need it to open a bank account, file taxes, hire employees, and establish business credit.</p>

<h2>Method 1: Apply by Fax (Recommended)</h2>
<ol>
<li>Download Form SS-4 from IRS.gov</li>
<li>Line 7b: Write "FOREIGN" in the SSN/ITIN field</li>
<li>Sign and date the form</li>
<li>Fax to: (855) 641-6935</li>
<li>Wait 4-7 business days for your CP 575 letter</li>
</ol>

<h2>Method 2: Apply by Phone</h2>
<p>Call (267) 941-1099 (not toll-free), Monday-Friday 6am-11pm ET. Have your completed SS-4 ready. You'll receive your EIN immediately on the call.</p>

<h2>Method 3: Third-Party Designee</h2>
<p>Authorize a service like MygrationStation to apply on your behalf. Fastest and most convenient — the service handles IRS communication and you receive your EIN in your document vault.</p>

<h2>Common Mistakes That Cause Rejections</h2>
<ul>
<li>Leaving the SSN field blank (write "FOREIGN")</li>
<li>Selecting the wrong entity type</li>
<li>Inconsistent information between LLC docs and SS-4</li>
<li>Missing the responsible party designation</li>
</ul>

<h2>Timeline Summary</h2>
<ul>
<li><strong>Fax:</strong> 4-7 business days (free)</li>
<li><strong>Phone:</strong> Same day (free + call charges)</li>
<li><strong>Third-party:</strong> 1-5 business days ($50-$150)</li>
</ul>
<p class="sources"><em>Sources: IRS.gov Form SS-4 Instructions, IRS Publication 1635</em></p>`,
  },
  {
    slug: "form-5472-foreign-llc",
    title: "Form 5472: The Annual Filing Every Foreign-Owned LLC Must Know",
    description: "If you own a US LLC as a non-resident, you must file Form 5472 annually. Here's what it is, when it's due, and the $25,000 penalty for not filing.",
    category: "Tax Tips",
    date: "March 5, 2026",
    readTime: "6 min read",
    content: `<h2>What Is Form 5472?</h2>
<p>Form 5472 is an IRS form that foreign-owned single-member LLCs must file annually — <strong>even if the LLC had no income</strong>.</p>

<h2>Who Must File?</h2>
<p>You must file if you own a US LLC (disregarded entity), you are a non-US person, and the LLC had any "reportable transactions" — which includes virtually everything: capital contributions, loans, payments, rent, and even the initial bank funding.</p>

<h2>The $25,000 Penalty</h2>
<p>The penalty for failing to file — or filing late — is <strong>$25,000 per form, per year</strong>. Additional $25,000 for each 30-day period of continued failure. No maximum cap.</p>

<h2>When Is It Due?</h2>
<p>Filed as an attachment to Form 1120 (pro forma). Due <strong>April 15</strong> of the following year. Extension available to October 15 via Form 7004.</p>

<h2>Practical Tips</h2>
<ul>
<li>File even if you had no revenue — any transaction triggers the requirement</li>
<li>Keep meticulous records of every transaction between you and your LLC</li>
<li>Use a tax professional given the $25,000 penalty</li>
<li>Set calendar reminders well before the deadline</li>
</ul>
<p class="sources"><em>Sources: IRS Form 5472 Instructions, IRC § 6038A</em></p>`,
  },
  {
    slug: "l1-visa-transfer-business",
    title: "L-1 Visa: Transferring Your Business to the United States",
    description: "How the L-1 intracompany transfer visa works for entrepreneurs who want to expand their existing foreign business to the US.",
    category: "Visa Guides",
    date: "February 28, 2026",
    readTime: "7 min read",
    content: `<h2>What Is the L-1 Visa?</h2>
<p>The L-1 visa allows companies operating in both the US and abroad to transfer employees to US offices. The <strong>L-1A</strong> (Manager/Executive) category is particularly relevant for entrepreneurs.</p>

<h2>Two Categories</h2>
<ul>
<li><strong>L-1A (Managers and Executives):</strong> Up to 7 years, direct green card path (EB-1C)</li>
<li><strong>L-1B (Specialized Knowledge):</strong> Up to 5 years, for employees with specialized company knowledge</li>
</ul>

<h2>L-1A Requirements</h2>
<ol>
<li>Qualifying relationship between US and foreign company (parent, subsidiary, affiliate, or branch)</li>
<li>Worked abroad for the company at least 1 continuous year in the last 3 years</li>
<li>Transferring to a managerial or executive role in the US</li>
</ol>

<h2>The Path to a Green Card</h2>
<p>The L-1A's biggest advantage is the <strong>EB-1C green card pathway</strong>. No PERM labor certification required, relatively short processing times, and you can become a permanent resident while continuing to manage your business.</p>

<h2>L-1 vs. E-2 Comparison</h2>
<ul>
<li><strong>L-1A:</strong> Requires existing foreign business, direct green card path, no country restrictions, up to 7 years</li>
<li><strong>E-2:</strong> No foreign business needed, indirect green card path, treaty countries only, unlimited renewals</li>
</ul>
<p class="sources"><em>Sources: USCIS.gov, 8 CFR § 214.2(l)</em></p>`,
  },
  {
    slug: "open-us-bank-account-non-resident",
    title: "How to Open a US Bank Account as a Non-Resident LLC Owner",
    description: "Which banks accept non-resident LLC owners, what documents you'll need, and how to navigate the process remotely.",
    category: "Banking & Finance",
    date: "February 20, 2026",
    readTime: "6 min read",
    content: `<h2>Why You Need a US Bank Account</h2>
<ul>
<li>Accepting payments from US customers</li>
<li>Paying US vendors and contractors</li>
<li>Maintaining the "corporate veil"</li>
<li>Filing accurate tax returns</li>
<li>Building US business credit</li>
</ul>

<h2>Online Banks (No US Visit Required)</h2>
<ul>
<li><strong>Mercury</strong> — $0 deposit, $0/mo, tech-forward with Stripe/PayPal integrations</li>
<li><strong>Relay</strong> — $0 deposit, $0/mo, multiple accounts, smart budgeting</li>
<li><strong>Wise Business</strong> — $0 deposit, $0/mo, multi-currency, low FX rates</li>
</ul>

<h2>Traditional Banks (May Require Visit)</h2>
<ul>
<li><strong>Chase</strong> — Largest branch network, $15/mo (waivable)</li>
<li><strong>Bank of America</strong> — International wires, $16/mo (waivable)</li>
</ul>

<h2>Required Documents</h2>
<ul>
<li>Articles of Organization</li>
<li>EIN Letter (CP 575)</li>
<li>Operating Agreement</li>
<li>Valid passport</li>
<li>Proof of address (can be from home country)</li>
</ul>

<h2>Tips for Success</h2>
<ul>
<li>Apply to multiple banks — not every application gets approved first try</li>
<li>Start with Mercury and Relay — most non-resident-friendly</li>
<li>Have a clear business description ready</li>
<li>Keep your account active with regular transactions</li>
</ul>
<p class="sources"><em>Sources: Mercury.com, Relay.com, Chase.com Business Banking</em></p>`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(currentSlug: string, limit = 2): BlogPost[] {
  const current = getPostBySlug(currentSlug);
  if (!current) return posts.slice(0, limit);
  return posts
    .filter((p) => p.slug !== currentSlug)
    .sort((a) => (a.category === current.category ? -1 : 1))
    .slice(0, limit);
}
