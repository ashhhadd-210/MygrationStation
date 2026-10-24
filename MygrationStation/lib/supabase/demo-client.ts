/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Mock Supabase client for DEMO_MODE.
 * Returns static demo data for all queries so the app renders without a real database.
 */

import {
  DEMO_USER,
  DEMO_PROFILE,
  DEMO_BUSINESSES,
  DEMO_COMPLIANCE_EVENTS,
  DEMO_DOCUMENTS,
  DEMO_EIN_APPLICATIONS,
  DEMO_FORMATION_APPLICATIONS,
  DEMO_BANKING_APPLICATIONS,
  DEMO_REGISTERED_AGENTS,
} from "./demo-data";

// Maps table names → demo data arrays
const TABLE_DATA: Record<string, any[]> = {
  users: [{ id: DEMO_USER.id, ...DEMO_PROFILE, residency_status: "itin_holder" }],
  businesses: DEMO_BUSINESSES,
  compliance_events: DEMO_COMPLIANCE_EVENTS,
  documents: DEMO_DOCUMENTS,
  ein_applications: DEMO_EIN_APPLICATIONS,
  formation_applications: DEMO_FORMATION_APPLICATIONS,
  banking_applications: DEMO_BANKING_APPLICATIONS,
  registered_agents: DEMO_REGISTERED_AGENTS,
};

/** Chainable query builder that resolves to demo data */
function createQueryChain(tableName: string) {
  let data = [...(TABLE_DATA[tableName] ?? [])];
  let isSingle = false;
  let countMode = false;

  const chain: any = {
    select(_columns?: string) { return chain; },
    insert(_row: any) { return chain; },
    update(_row: any) { return chain; },
    delete() { data = []; return chain; },
    eq(col: string, val: any) {
      data = data.filter((r) => r[col] === val);
      return chain;
    },
    neq(col: string, val: any) {
      data = data.filter((r) => r[col] !== val);
      return chain;
    },
    in(col: string, vals: any[]) {
      data = data.filter((r) => vals.includes(r[col]));
      return chain;
    },
    order(_col: string, _opts?: any) { return chain; },
    limit(n: number) {
      data = data.slice(0, n);
      return chain;
    },
    single() {
      isSingle = true;
      return chain;
    },
    maybeSingle() {
      isSingle = true;
      return chain;
    },
    // Allow implicit resolution (Next.js server components await the chain)
    then(resolve: any, reject?: any) {
      try {
        let result: any;
        if (countMode) {
          result = { data: null, error: null, count: data.length };
        } else if (isSingle) {
          result = { data: data[0] ?? null, error: null };
        } else {
          result = { data, error: null };
        }
        resolve(result);
      } catch (err) {
        if (reject) reject(err);
      }
    },
  };

  // Allow .select("*", { count: "exact" }) pattern
  const origSelect = chain.select;
  chain.select = (_columns?: string, opts?: { count?: string }) => {
    if (opts?.count === "exact") countMode = true;
    return origSelect(_columns);
  };

  return chain;
}

/** Mock storage bucket */
function createStorageMock() {
  return {
    from(_bucket: string) {
      return {
        createSignedUrl(_path: string, _expiry: number) {
          return Promise.resolve({
            data: { signedUrl: "#demo-file" },
            error: null,
          });
        },
        upload(_path: string, _file: any) {
          return Promise.resolve({
            data: { path: "demo/uploaded-file" },
            error: null,
          });
        },
        remove(_paths: string[]) {
          return Promise.resolve({ data: [], error: null });
        },
      };
    },
  };
}

/** The mock Supabase client */
export function createDemoSupabaseClient() {
  return {
    auth: {
      getUser() {
        return Promise.resolve({
          data: { user: DEMO_USER as any },
          error: null,
        });
      },
      getSession() {
        return Promise.resolve({
          data: {
            session: {
              user: DEMO_USER,
              access_token: "demo-token",
              refresh_token: "demo-refresh",
            },
          },
          error: null,
        });
      },
      signOut() {
        return Promise.resolve({ error: null });
      },
    },
    from(table: string) {
      return createQueryChain(table);
    },
    storage: createStorageMock(),
  } as any;
}
