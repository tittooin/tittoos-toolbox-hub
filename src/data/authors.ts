export interface AuthorProfile {
  name: string;
  slug: string;
  bio: string;
  avatarUrl?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
}

export const AUTHORS: AuthorProfile[] = [
  {
    name: "Axevora Team",
    slug: "axevora-team",
    bio: "The Axevora editorial team researches, tests, and writes practical guides on online tools, workflow optimization, and digital productivity.",
    website: "https://axevora.com/",
    twitter: "https://twitter.com/Axevora",
    linkedin: "https://www.linkedin.com/company/axevora/",
  },
  {
    name: "Security Expert",
    slug: "security-expert",
    bio: "Security analyst focused on password hygiene, 2FA adoption, and user-driven cybersecurity practices for safer everyday computing.",
    twitter: "https://twitter.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Digital Workflow Specialist",
    slug: "digital-workflow-specialist",
    bio: "Process designer specializing in multimedia, document workflows, and cross-platform format optimization for teams.",
    twitter: "https://twitter.com/",
    linkedin: "https://www.linkedin.com/",
  },
];