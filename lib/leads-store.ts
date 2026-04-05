// In-memory lead store (persists until server restart/redeploy)
// All leads are also logged to Vercel console as backup

export interface Lead {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string | null;
  action: string;
  score: number;
  painLevel: string;
  infrastructure: string;
  authority: string;
  industry: string;
  summary: string;
  suggestedSolution: string;
  psychProfile: string;
  salesStrategy: string;
}

// Global store that persists across API calls (but not across deploys)
const globalStore = globalThis as unknown as { __proteusLeads?: Lead[] };
if (!globalStore.__proteusLeads) {
  globalStore.__proteusLeads = [];
}

export function addLead(lead: Lead) {
  globalStore.__proteusLeads!.push(lead);
}

export function getLeads(): Lead[] {
  return globalStore.__proteusLeads || [];
}
