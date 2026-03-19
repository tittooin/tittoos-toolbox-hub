export interface WorkflowRecipe {
  id: string;
  title: string;
  description: string;
  category: "workflow" | "creator" | "pdf" | "battle" | "dev";
  samplePrompt: string;
  outcome: string;
  toolIds: string[];
  steps: string[];
  keywords: string[];
  estimatedMinutes: number;
}

export interface MarketplaceTemplate {
  id: string;
  title: string;
  description: string;
  category: "workflow" | "creator" | "pdf" | "battle" | "dev";
  badge: string;
  included: string[];
  recommendedFor: string;
  relatedToolIds: string[];
}

export interface CreatorPlaybook {
  id: string;
  title: string;
  description: string;
  goal: string;
  deliverables: string[];
  toolIds: string[];
  steps: string[];
}

export const workflowRecipes: WorkflowRecipe[] = [
  {
    id: "pdf-study-sprint",
    title: "PDF Study Sprint",
    description: "Turn a long PDF into notes, summary, and quiz questions in one focused flow.",
    category: "pdf",
    samplePrompt: "Is research paper ko summary, notes aur quiz me convert kar do",
    outcome: "A study-ready learning pack from a single document.",
    toolIds: ["smart-pdf-hub", "pdf-summarizer", "pdf-study-notes", "pdf-quiz-generator"],
    steps: [
      "Upload the PDF once in the hub and scan the key sections.",
      "Generate a high-level summary for quick understanding.",
      "Create study notes with the most important takeaways.",
      "Finish with a quiz to test retention."
    ],
    keywords: ["pdf", "study", "summary", "quiz", "notes", "exam", "research"],
    estimatedMinutes: 8
  },
  {
    id: "creator-reel-launch",
    title: "Creator Reel Launch",
    description: "Build a full short-form campaign with script, caption, hashtags, and thumbnail text.",
    category: "creator",
    samplePrompt: "Mere next reel ke liye full content pack bana do",
    outcome: "A ready-to-publish short video content pack.",
    toolIds: ["creator-studio", "ai-reel-script-generator", "ai-caption-generator", "ai-hashtag-generator", "ai-thumbnail-text-generator"],
    steps: [
      "Define the audience, tone, and publish platform.",
      "Generate a short-form script with a strong hook.",
      "Write a caption and matching hashtag set.",
      "Create thumbnail text and publishing checklist."
    ],
    keywords: ["creator", "reel", "caption", "hashtags", "thumbnail", "instagram", "youtube"],
    estimatedMinutes: 10
  },
  {
    id: "asset-polish-flow",
    title: "Asset Polish Flow",
    description: "Take a raw visual and prep it for social, thumbnails, and fast publishing.",
    category: "workflow",
    samplePrompt: "Image ko clean karke thumbnail-ready bana do",
    outcome: "A polished creative asset in multiple publishing formats.",
    toolIds: ["image-background-remover", "image-resizer", "image-compressor", "thumbnail-generator"],
    steps: [
      "Remove distractions or background from the raw image.",
      "Resize for the target platform or layout.",
      "Compress the final export for faster uploads.",
      "Use the thumbnail generator to finalize the presentation."
    ],
    keywords: ["image", "thumbnail", "background", "resize", "compress", "social"],
    estimatedMinutes: 6
  },
  {
    id: "battle-content-pack",
    title: "Battle Content Pack",
    description: "Create a comparison angle, verdict, and share copy from a single battle idea.",
    category: "battle",
    samplePrompt: "iPhone 16 vs S25 ka shareable battle pack banao",
    outcome: "A comparison card and social-ready opinion pack.",
    toolIds: ["battle-lab", "tech-versus", "ai-caption-generator"],
    steps: [
      "Pick the battle category and two items to compare.",
      "Generate the verdict and strongest differentiators.",
      "Create a social caption and share-ready summary."
    ],
    keywords: ["versus", "battle", "compare", "winner", "share", "tech"],
    estimatedMinutes: 7
  },
  {
    id: "dev-command-boost",
    title: "Dev Command Boost",
    description: "Move from plain-English tasks to ready commands, validation, and formatting.",
    category: "dev",
    samplePrompt: "Windows aur Linux commands ready karke do",
    outcome: "Command snippets plus clean developer-ready outputs.",
    toolIds: ["ai-command-center", "windows-cmd-gen", "linux-cmd-gen", "json-formatter"],
    steps: [
      "Describe the task in plain language.",
      "Generate platform-specific commands.",
      "Validate or format supporting config data.",
      "Save the flow for reuse in your workspace."
    ],
    keywords: ["command", "terminal", "windows", "linux", "mac", "developer", "json"],
    estimatedMinutes: 5
  }
];

export const creatorPlaybooks: CreatorPlaybook[] = [
  {
    id: "reel-pack",
    title: "Reel Pack Builder",
    description: "Build a complete reel pack from idea to publishing assets.",
    goal: "Ship one polished short-form post fast.",
    deliverables: ["Hook + script", "Caption", "Hashtags", "Thumbnail text"],
    toolIds: ["ai-reel-script-generator", "ai-caption-generator", "ai-hashtag-generator", "ai-thumbnail-text-generator"],
    steps: [
      "Start with the reel script generator for the narrative.",
      "Turn the script into a stronger publish caption.",
      "Generate hashtags tuned to the topic and audience.",
      "Finish with thumbnail text for better click-through."
    ]
  },
  {
    id: "channel-identity",
    title: "Channel Identity Kit",
    description: "Create your public-facing creator identity in one sitting.",
    goal: "Set up profile, voice, and brand presentation.",
    deliverables: ["Bio", "Prompt bank", "Thumbnail style direction"],
    toolIds: ["ai-bio-generator", "ai-prompt-assistant", "thumbnail-generator"],
    steps: [
      "Draft a creator bio with the tone you want.",
      "Save reusable prompts for future content ideation.",
      "Design thumbnail direction aligned with your niche."
    ]
  },
  {
    id: "blog-repurpose",
    title: "Blog Repurpose Engine",
    description: "Convert one long-form idea into multiple creator outputs.",
    goal: "Get more mileage out of one topic.",
    deliverables: ["Blog draft", "Caption", "Visual asset prompts"],
    toolIds: ["ai-blog-generator", "ai-caption-generator", "text-to-image"],
    steps: [
      "Generate the long-form blog or article draft.",
      "Extract a social caption from the main angle.",
      "Create visual concepts or supporting promotional assets."
    ]
  }
];

export const marketplaceTemplates: MarketplaceTemplate[] = [
  {
    id: "install-pdf-growth-pack",
    title: "PDF Growth Pack",
    description: "A starter kit for education, research, and document-heavy workflows.",
    category: "pdf",
    badge: "Most Practical",
    included: ["Smart PDF hub", "Summary flow", "Study notes flow", "Quiz flow"],
    recommendedFor: "Students, educators, researchers, and ops teams.",
    relatedToolIds: ["smart-pdf-hub", "pdf-summarizer", "pdf-study-notes", "pdf-quiz-generator"]
  },
  {
    id: "install-creator-launch-pack",
    title: "Creator Launch Pack",
    description: "A campaign-ready bundle for creators who publish every week.",
    category: "creator",
    badge: "Weekly Publishing",
    included: ["Creator studio", "Reel script flow", "Caption flow", "Hashtag flow"],
    recommendedFor: "Instagram, YouTube Shorts, and personal brand creators.",
    relatedToolIds: ["creator-studio", "ai-reel-script-generator", "ai-caption-generator", "ai-hashtag-generator"]
  },
  {
    id: "install-command-stack",
    title: "Command Stack",
    description: "A developer-focused kit for generating commands and cleaning payloads.",
    category: "dev",
    badge: "Builder Ready",
    included: ["AI command center", "Windows command generator", "Linux command generator", "JSON formatter"],
    recommendedFor: "Developers, sysadmins, and technical support flows.",
    relatedToolIds: ["ai-command-center", "windows-cmd-gen", "linux-cmd-gen", "json-formatter"]
  },
  {
    id: "install-battle-publisher",
    title: "Battle Publisher",
    description: "Create comparison content with verdicts and shareable follow-up assets.",
    category: "battle",
    badge: "Trend Friendly",
    included: ["Battle lab", "Versus tools", "Share copy helpers"],
    recommendedFor: "Affiliate, comparison, and creator-led content sites.",
    relatedToolIds: ["battle-lab", "tech-versus", "software-versus", "nutrition-versus"]
  },
  {
    id: "install-automation-playbooks",
    title: "Automation Playbooks",
    description: "Ready-made multi-step flows you can save and revisit from the workspace.",
    category: "workflow",
    badge: "Fastest ROI",
    included: ["Workflow recipes", "Saved favorites", "Recent jobs", "Reusable stacks"],
    recommendedFor: "Teams or solo operators who want repeatable execution.",
    relatedToolIds: ["workspace", "ai-command-center", "template-marketplace"]
  }
];
