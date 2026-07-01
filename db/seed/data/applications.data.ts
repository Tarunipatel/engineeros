export type ApplicationSeed = {
  company: string;
  role: string;
  stage: "wishlist" | "applied" | "online_assessment" | "interview" | "offer" | "rejected";
  daysAgoApplied?: number;
  recruiterName?: string;
  referral?: boolean;
  salary?: string;
  notes?: string;
};

export const APPLICATIONS: ApplicationSeed[] = [
  { company: "Google", role: "Software Engineer II", stage: "interview", daysAgoApplied: 24, recruiterName: "Priya Nair", referral: true, salary: "$185k - $210k", notes: "Onsite loop scheduled, 4 rounds + hiring committee." },
  { company: "Stripe", role: "Backend Engineer", stage: "online_assessment", daysAgoApplied: 10, recruiterName: "Alex Chen", referral: false, salary: "$170k - $195k", notes: "OA due this week, HackerRank link sent." },
  { company: "Netflix", role: "Senior Software Engineer", stage: "wishlist", notes: "Waiting for referral from former teammate." },
  { company: "Amazon", role: "SDE II", stage: "rejected", daysAgoApplied: 40, recruiterName: "Sam Patel", referral: false, salary: "$160k - $180k", notes: "Passed phone screen, didn't clear onsite bar raiser round." },
  { company: "Airbnb", role: "Software Engineer, Infrastructure", stage: "applied", daysAgoApplied: 5, referral: true, notes: "Applied via referral, waiting to hear back." },
  { company: "Meta", role: "Software Engineer, Product", stage: "interview", daysAgoApplied: 18, recruiterName: "Jordan Blake", referral: true, salary: "$190k - $220k", notes: "Cleared 2 technical rounds, system design next." },
  { company: "Datadog", role: "Software Engineer, Backend", stage: "wishlist", notes: "Strong eng blog, want to apply after mocks improve." },
  { company: "Uber", role: "Software Engineer II", stage: "applied", daysAgoApplied: 3, notes: "Cold applied through careers page." },
  { company: "Microsoft", role: "Software Engineer II - Azure", stage: "online_assessment", daysAgoApplied: 7, recruiterName: "Lena Fischer", salary: "$165k - $190k", notes: "Codility assessment scheduled for Friday." },
  { company: "Bloomberg", role: "Software Engineer", stage: "offer", daysAgoApplied: 55, recruiterName: "Marcus Webb", referral: false, salary: "$175k base + bonus", notes: "Offer received, negotiating comp, deciding by next Friday." },
  { company: "Snowflake", role: "Software Engineer, Platform", stage: "rejected", daysAgoApplied: 35, notes: "Rejected after system design round, feedback: needed more depth on scaling tradeoffs." },
  { company: "Figma", role: "Software Engineer", stage: "wishlist", notes: "Waiting for a good referral connection." },
  { company: "LinkedIn", role: "Senior Software Engineer", stage: "applied", daysAgoApplied: 2, referral: true, notes: "Applied through employee referral portal." },
];
