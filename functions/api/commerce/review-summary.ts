import { parseSearchIntent } from './search';

export interface StructuredReviewSummary {
  title: string;
  verdict: string;
  keyCheckpoints: string[];
  bestFor: string;
  budgetInsight: string;
  comparisonPoints?: { label: string; mainstream: string; budget: string; impact: string }[];
}

export const onRequestGet = async (context: { request: Request; env?: Record<string, unknown> }) => {
  const { request } = context;
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || url.searchParams.get('query') || 'Best Tablet under 6000';

  const cleanQ = query.trim();
  const parsed = parseSearchIntent(cleanQ);
  const qLower = cleanQ.toLowerCase();

  let summary: StructuredReviewSummary;

  if (parsed.category === 'tablets') {
    if (parsed.budgetMax && parsed.budgetMax <= 8000) {
      summary = {
        title: `Best Tablets Under ₹${parsed.budgetMax.toLocaleString('en-IN')}`,
        verdict: `In the sub-₹${parsed.budgetMax.toLocaleString('en-IN')} entry segment, prioritize minimum 2GB-3GB RAM, HD IPS displays, and certified eye-care modes for smooth e-learning, document viewing, and YouTube streaming.`,
        keyCheckpoints: [
          'Memory & Performance: Seek minimum 2GB to 3GB RAM to prevent app stuttering during video calls.',
          'Display Quality: Ensure an HD IPS panel with 350+ nits brightness for wide viewing angles without color distortion.',
          'Storage Expansion: Look for a dedicated microSD card slot since base internal storage is typically 32GB.',
          'Battery Endurance: Prioritize 3,500mAh to 5,000mAh battery packs delivering 6+ hours of video playback.'
        ],
        bestFor: 'Kids Learning, E-Book Reading, Zoom Classes & Media Streaming',
        budgetInsight: `At ₹${parsed.budgetMax.toLocaleString('en-IN')}, devices are tuned for lightweight daily apps. Heavy 3D gaming is not recommended in this tier.`
      };
    } else if (parsed.budgetMax && parsed.budgetMax <= 20000) {
      summary = {
        title: `Best Study & Work Tablets Under ₹${parsed.budgetMax.toLocaleString('en-IN')}`,
        verdict: 'In the ₹10,000 to ₹20,000 mid-range tier, 90Hz 2K screens, quad stereo speakers with Dolby Atmos, and large 7,000mAh+ batteries offer outstanding study and entertainment value.',
        keyCheckpoints: [
          'High Refresh Display: 90Hz to 120Hz 2K panels provide butter-smooth scrolling and reduced eye fatigue.',
          'Processing Power: Snapdragon 680/695 or Helio G99 chips ensure seamless multitasking and light gaming.',
          'Quad Speakers: Dedicated 4-speaker setups with Dolby Atmos provide classroom-filling audio clarity.',
          'Desktop Multitasking: Look for models supporting split-screen multitasking (like Samsung DeX or HyperOS Workstation).'
        ],
        bestFor: 'College Note-Taking, Binge-Watching, Office Documents & Productivity',
        budgetInsight: 'This is the sweet spot for students needing reliable daily performance without flagship prices.'
      };
    } else {
      summary = {
        title: 'Premium Tablet Intelligence & Buying Guide',
        verdict: 'Flagship tablets combine PC-grade processors (Apple M-Series or Snapdragon 8-Series) with low-latency active styluses and color-calibrated displays for professional digital creators.',
        keyCheckpoints: [
          'Stylus Latency: Magnetic active styluses with sub-9ms latency for natural handwriting and precision sketching.',
          'Display Precision: 120Hz OLED or Liquid Retina panels with wide DCI-P3 color gamut.',
          'Silicon Longevity: High-bandwidth unified memory for 4K video timeline scrubbing and 3D modeling.'
        ],
        bestFor: 'Digital Artists, Software Developers, Executives & Creative Professionals',
        budgetInsight: 'Flagship models deliver 4-5+ years of software support and superior resale retention.'
      };
    }
  } else if (parsed.category === 'laptops') {
    if (parsed.priority === 'gaming' || qLower.includes('gaming') || (parsed.budgetMax && parsed.budgetMax <= 65000)) {
      summary = {
        title: `Best Gaming Laptops Under ₹${(parsed.budgetMax || 60000).toLocaleString('en-IN')}`,
        verdict: `In the sub-₹${(parsed.budgetMax || 60000).toLocaleString('en-IN')} gaming laptop tier, maximize dedicated GPU wattage (TGP) and prioritize dedicated NVIDIA GeForce RTX 3050 graphics paired with a 144Hz high-refresh IPS display.`,
        keyCheckpoints: [
          'Dedicated GPU: Prioritize NVIDIA RTX 3050 (6GB/4GB) with higher TGP (75W-95W) for DLSS and ray-tracing.',
          'CPU Architecture: Minimum 6-core Intel Core i5 (12th/13th Gen) or AMD Ryzen 5/7 for steady frametimes.',
          'Dual-Channel RAM: 16GB DDR4/DDR5 is essential to eliminate 1% low frame stuttering in modern games.',
          'Cooling Design: Dual-fan dual-exhaust thermal architecture to maintain boost clocks without thermal throttling.'
        ],
        bestFor: 'Competitive Esports (Valorant, CS2, GTA V), Video Editing & 3D Rendering',
        budgetInsight: 'Upgrading from 8GB to 16GB dual-channel memory yields up to 15% higher gaming framerates.'
      };
    } else {
      summary = {
        title: 'Laptop Buying Intelligence & Performance Analysis',
        verdict: 'Evaluate laptops based on battery longevity, display color accuracy, keyboard ergonomics, and PCIe Gen4 SSD response times.',
        keyCheckpoints: [
          'Processor Tier: Modern 4nm/6nm silicon ensures 12+ hours of real-world battery endurance.',
          'Display Quality: 100% sRGB IPS or OLED panels protect your eyes during long work sessions.',
          'Build Materials: Aluminum unibody construction provides structural rigidity and long-term durability.'
        ],
        bestFor: 'Office Productivity, Coding, Business & Remote Work',
        budgetInsight: 'Prioritize laptops with upgradable RAM slots or generous 16GB unified memory configurations.'
      };
    }
  } else if (parsed.category === 'phones') {
    summary = {
      title: 'Smartphone Intelligence & Hardware Analysis',
      verdict: 'Prioritize optical image stabilization (OIS) on the primary camera, 120Hz AMOLED outdoor brightness (1500+ nits), and multi-year software update commitments.',
      keyCheckpoints: [
        'Camera System: Dedicated Optical Image Stabilization (OIS) prevents blurry night shots and shaky video.',
        'Display Quality: 120Hz AMOLED with HDR10+ and high PWM dimming to reduce eye strain in low light.',
        'Fast Charging & Battery: 5,000 mAh battery paired with 45W+ fast charging for quick top-ups.',
        'Software Longevity: 3 to 7 years of promised security and OS updates for lasting device value.'
      ],
      bestFor: 'Mobile Photography, Social Media Creation, Everyday Multitasking & Gaming',
      budgetInsight: 'Upper mid-range phones now offer 90% of flagship camera performance at half the price.'
    };
  } else if (parsed.category === 'tvs') {
    summary = {
      title: '4K Smart TV Purchase Checkpoints',
      verdict: 'A true home-theater experience requires dedicated picture processing engines (like Sony X1 or Samsung Quantum 4K), HDR10+/Dolby Vision decoding, and low-latency HDMI eARC ports.',
      keyCheckpoints: [
        'Resolution & Contrast: 4K UHD (3840x2160) panel with high native contrast for deep cinematic blacks.',
        'Image Processing: Dedicated hardware AI processor dynamically upscales 1080p broadcast TV to crisp 4K.',
        'Acoustic Output: 20W to 30W stereo speakers supporting Dolby Audio or DTS:X spatial sound.',
        'Smart OS: Google TV or Samsung Tizen OS for seamless voice search and universal OTT streaming apps.'
      ],
      bestFor: 'Home Theaters, Live Sports, OTT Binge-Watching & Console Gaming',
      budgetInsight: 'For gaming consoles like PS5, check for Auto Low Latency Mode (ALLM) and MEMC motion compensation.'
    };
  } else {
    summary = {
      title: 'Premium Audio & Noise Cancellation Guide',
      verdict: 'For commuters and audiophiles, dual-processor Active Noise Cancellation (ANC) combined with high-bitrate codecs (LDAC/AAC) delivers immersive acoustic clarity with all-day comfort.',
      keyCheckpoints: [
        'ANC Depth: Multi-microphone dual processors isolate low-frequency aircraft hum and urban chatter.',
        'Driver Engineering: Custom 40mm carbon-fiber drivers for clean bass response without muddy mids.',
        'Battery Life: 30+ hours of continuous ANC playback with rapid 3-minute quick charging.',
        'Multipoint Bluetooth: Seamless auto-switching between your laptop and smartphone.'
      ],
      bestFor: 'Office Focus, Frequent Commuters, Gym Workouts & High-Fidelity Listening',
      budgetInsight: 'Over-ear headphones provide superior passive isolation and battery life compared to compact earbuds.'
    };
  }

  return new Response(
    JSON.stringify({
      ok: true,
      query: cleanQ,
      data: summary,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
};
