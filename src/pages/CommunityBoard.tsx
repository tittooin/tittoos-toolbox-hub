import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { setSEO } from "@/utils/seoUtils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  ArrowLeft, MessageSquare, Flame, ShieldCheck, ExternalLink, 
  Calendar, PlusCircle, AlertCircle, AlertTriangle, Eye, ThumbsUp, MessageCircle,
  Trash2, Image, Link2, MoreHorizontal, Bot, MessageSquareWarning, Search
} from 'lucide-react';
import { CuelinksService } from "@/modules/commerce/services/CuelinksService";
import { CommerceDiscoveryItem } from "@/modules/commerce/types/commerceDiscovery";
import { BotBadge } from "@/components/community/BotBadge";
import { RichCommerceCard, CommerceOfferPayload } from "@/components/community/RichCommerceCard";
import { RichMediaEngine } from "@/components/community/RichMediaEngine";
import { JoinCommunityModal } from "@/components/community/JoinCommunityModal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BoardLiveChat } from "@/components/community/BoardLiveChat";
import { Helmet } from 'react-helmet';
import DOMPurify from 'dompurify';
import { CreatePostModal } from '@/components/community/CreatePostModal';
import { useAuth } from "@/context/AuthContext";
interface BoardDetails {
  id: string;
  name: string;
  slug: string;
  description: string;
  board_type: string;
  visibility: string;
  status: string;
  icon_name: string;
  rules_text: string;
  is_locked: number;
  member_count: number;
  post_count: number;
}

interface PostItem {
  id: string;
  title: string;
  content: string;
  external_url: string | null;
  url_domain: string | null;
  embed_type: string;
  status: string;
  views_count: number;
  upvotes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  username: string;
  trust_level: number;
  is_automated?: number;
}

interface CurrentUser {
  id: string;
  username: string;
  email: string;
  platformRole: string;
  trustLevel: number;
  emailVerified?: boolean;
}

const getYoutubeVideoId = (url: string | null): string | null => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    
    if (hostname === 'youtu.be') {
      const path = parsed.pathname.substring(1);
      const cleanPath = path ? path.split('/')[0].split('?')[0] : null;
      if (cleanPath && cleanPath.length === 11) return cleanPath;
    }
    
    if (hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/shorts/')) {
        const parts = parsed.pathname.split('/');
        const cleanShort = parts[2] ? parts[2].split('?')[0] : null;
        if (cleanShort && cleanShort.length === 11) return cleanShort;
      }
      const v = parsed.searchParams.get('v');
      if (v && v.length === 11) return v;
      
      if (parsed.pathname.startsWith('/embed/')) {
        const parts = parsed.pathname.split('/');
        const cleanEmbed = parts[2] ? parts[2].split('?')[0] : null;
        if (cleanEmbed && cleanEmbed.length === 11) return cleanEmbed;
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
};

const getMerchantImage = (merchantName: string, existingLogo?: string): string => {
  if (existingLogo && existingLogo.startsWith('http') && !existingLogo.includes('clearbit') && !existingLogo.includes('favicons')) {
    return existingLogo;
  }
  const name = merchantName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const storeLogos: Record<string, string> = {
    klook: 'https://www.google.com/s2/favicons?domain=klook.com&sz=128',
    croma: 'https://www.google.com/s2/favicons?domain=croma.com&sz=128',
    levis: 'https://www.google.com/s2/favicons?domain=levi.in&sz=128',
    kapiva: 'https://www.google.com/s2/favicons?domain=kapiva.in&sz=128',
    perfora: 'https://www.google.com/s2/favicons?domain=perfora.co&sz=128',
    godrejinterio: 'https://www.google.com/s2/favicons?domain=godrejinterio.com&sz=128',
    appsumo: 'https://www.google.com/s2/favicons?domain=appsumo.com&sz=128',
    wellbeingnutrition: 'https://www.google.com/s2/favicons?domain=wellbeingnutrition.com&sz=128',
    plumgoodness: 'https://www.google.com/s2/favicons?domain=plumgoodness.com&sz=128',
    mivi: 'https://www.google.com/s2/favicons?domain=mivi.in&sz=128',
    dhoodhvalefarms: 'https://www.google.com/s2/favicons?domain=dhoodhvale.com&sz=128',
    quench: 'https://www.google.com/s2/favicons?domain=quenchbotanics.com&sz=128',
    digihaat: 'https://digihaat.in',
    fuelone: 'https://fuelone.in',
    hkvitals: 'https://www.hkvitals.com',
  };
  return storeLogos[name] || `https://www.google.com/s2/favicons?domain=${name}.com&sz=128`;
};

const getRelevantDeals = (boardSlug: string, items: CommerceDiscoveryItem[]): CommerceDiscoveryItem[] => {
  if (!items || items.length === 0) return [];
  
  const keywords: Record<string, string[]> = {
    'creator-promotion': ['creator', 'tool', 'design', 'software', 'host', 'domain', 'saas', 'electronics', 'camera', 'microphone', 'audio', 'editor'],
    'youtube-promotion': ['creator', 'video', 'youtube', 'camera', 'audio', 'microphone', 'design', 'tool', 'electronics', 'software', 'edit'],
    'social-media-promotion': ['marketing', 'social', 'creator', 'tool', 'fashion', 'lifestyle', 'software', 'design', 'brand'],
    'websites-blogs': ['host', 'domain', 'saas', 'software', 'tech', 'cloud', 'server', 'web', 'developer'],
    'business-promotion': ['business', 'saas', 'productivity', 'tech', 'software', 'finance', 'office', 'marketing'],
    'ai-technology': ['ai', 'artificial', 'software', 'tech', 'electronics', 'cloud', 'developer', 'saas', 'data'],
    'gaming': ['game', 'gaming', 'play', 'console', 'xbox', 'playstation', 'nintendo', 'electronics', 'accessory', 'headset', 'mouse', 'keyboard', 'entertainment'],
    'deals-offers': [],
    'general-discussion': []
  };

  const boardKeywords = keywords[boardSlug] || [];
  
  if (boardSlug === 'deals-offers') {
    return items.slice(0, 10);
  }

  const filtered = items.filter(item => {
    const textToMatch = `${item.merchantName} ${item.title} ${item.description || ''} ${item.category || ''}`.toLowerCase();
    if (boardSlug === 'general-discussion') {
      return item.discountText?.includes('%') || item.couponCode;
    }
    return boardKeywords.some(keyword => textToMatch.includes(keyword));
  });

  if (filtered.length < 3 && boardSlug !== 'general-discussion') {
    const generalDeals = items.filter(item => item.discountText?.includes('%') || item.couponCode);
    const filteredIds = new Set(filtered.map(x => x.id));
    for (const deal of generalDeals) {
      if (!filteredIds.has(deal.id)) {
        filtered.push(deal);
        filteredIds.add(deal.id);
        if (filtered.length >= 5) break;
      }
    }
  }

  return filtered.slice(0, 8);
};

export default function CommunityBoard() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<BoardDetails | null>(null);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  
  // Pagination & Sorting
  const [sort, setSort] = useState<'newest' | 'popular' | 'discussed'>('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Post Creation Form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Guest join / unverified modal
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isUnverifiedModal, setIsUnverifiedModal] = useState(false);
  const [joinActionName, setJoinActionName] = useState('');

  const requireAuth = (action: string, callback: () => void) => {
    if (!user) {
      setIsUnverifiedModal(false);
      setJoinActionName(action);
      setShowJoinModal(true);
    } else if (user.emailVerified === false) {
      setIsUnverifiedModal(true);
      setJoinActionName(action);
      setShowJoinModal(true);
    } else {
      callback();
    }
  };

  // Commerce/Monetization states
  const [deals, setDeals] = useState<CommerceDiscoveryItem[]>([]);
  const [dealsLoading, setDealsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchBoardAndPosts();
    }
  }, [slug, sort, page]);

  useEffect(() => {
    if (board?.slug) {
      setDealsLoading(true);
      CuelinksService.getDeals()
        .then((res) => {
          if (res && res.items) {
            const mapped = getRelevantDeals(board.slug, res.items);
            setDeals(mapped);
          }
        })
        .catch((err) => {
          console.warn("Failed to load community deals:", err);
        })
        .finally(() => {
          setDealsLoading(false);
        });
    } else {
      setDeals([]);
    }
  }, [board?.slug]);

  const handleDealClick = (deal: CommerceDiscoveryItem) => {
    const url = deal.trackingUrl || deal.destinationUrl;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenShare = (deal: CommerceDiscoveryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = deal.trackingUrl || deal.destinationUrl;
    if (!url) return;
    const text = `🔥 ${deal.merchantName} Deal: ${deal.title} on Axevora! Check it out here:`;
    
    if (navigator.share && typeof navigator.share === 'function') {
      navigator.share({
        title: deal.title,
        text: text,
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      toast.success("Share text copied to clipboard!");
    }
  };

  const handleCopyLink = (deal: CommerceDiscoveryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = deal.trackingUrl || deal.destinationUrl;
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(deal.id);
    toast.success("Affiliate link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchBoardAndPosts = async (resetPage?: boolean) => {
    setPostsLoading(true);
    try {
      const res = await fetch(`/api/community/boards/${slug}?sort=${sort}&page=${resetPage ? 1 : page}&limit=10`);
      if (res.status === 404) {
        setBoard(null);
        setLoading(false);
        setPostsLoading(false);
        return;
      }
      
      if (res.ok) {
        const data = await res.json();
        setBoard(data.board);
        setPosts(data.posts);
        setTotalPages(data.pagination.totalPages || 1);
        
        setSEO({
          title: `${data.board.name} - Axevora Community`,
          description: data.board.description,
          url: window.location.href,
          type: 'website'
        });
      } else {
        toast.error("Failed to load board posts");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
      setPostsLoading(false);
    }
  };

  const handleCreatePost = async (title: string, content: string, externalUrl: string, imageObjectKey: string | null) => {
    if (!board || !user) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/community/boards/${board.slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          externalUrl,
          imageObjectKey
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Post created successfully!");
        setShowCreateModal(false);
        fetchBoardAndPosts(true); // Refresh
      } else {
        toast.error(data.error || "Failed to create post.");
      }
    } catch (err) {
      console.error("Create post error:", err);
      toast.error("Failed to communicate with server.");
    } finally {
      setSubmitting(false);
    }
  };

  // Get board-specific rules
  const getBoardRules = (slug: string) => {
    switch (slug) {
      case 'youtube-promotion':
        return 'Allowed: YouTube videos, Shorts, and channel pages. Prohibited: Fake views or subscriber schemes.';
      case 'social-media-promotion':
        return 'Allowed: Instagram Reels, X posts, TikTok links. Prohibited: Follow-for-follow spam.';
      case 'websites-blogs':
        return 'Allowed: Websites, portfolios, SaaS products, blogs. Prohibited: Localhost/malicious domains.';
      case 'business-promotion':
        return 'Allowed: Legitimate startups, products, brand launches. Prohibited: Multi-level marketing (MLM).';
      case 'deals-offers':
        return 'Allowed: Valid coupons, shopping deals, sales. Prohibited: Referral spam, fake pricing.';
      case 'ai-technology':
        return 'Allowed: AI tools, dev projects, tech trends. Prohibited: AI-generated low quality spam posts.';
      case 'gaming':
        return 'Allowed: Gaming clips, esports talk, strategies. Prohibited: Cheat codes/hacks/cracked games.';
      case 'creator-promotion':
        return 'Allowed: Portfolios, design work, profiles. Prohibited: Spamming the same link repeatedly.';
      default:
        return 'Allowed: General discussion. Prohibited: Off-topic spam and direct advertising.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground font-medium">Loading Board details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!board) {
    return <Navigate to="/community" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50/40 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6">
          <Link to="/community" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1.5 w-fit">
            <ArrowLeft className="h-4 w-4" /> Back to Community Dashboard
          </Link>
        </div>

        {/* Board Header Card */}
        <Card className="border border-slate-200/80 shadow-sm bg-white rounded-2xl mb-8 overflow-hidden">
          <CardHeader className="p-6 md:flex md:flex-row md:items-start justify-between gap-4 pb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">{board.name}</h1>
                <Badge variant="outline" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-100/80 border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-indigo-600" />
                  OFFICIAL
                </Badge>
              </div>
              <p className="text-slate-600 text-sm max-w-3xl leading-relaxed font-normal">{board.description}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-2 shrink-0">
              <Button
                onClick={() => requireAuth('create a post', () => setShowCreateModal(true))}
                className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="h-4 w-4" /> {user ? 'Create Post' : 'Sign In to Post'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="border-t border-slate-100 p-6 py-3 flex flex-wrap gap-6 text-xs text-slate-500 font-medium bg-slate-50/50">
            <div>Posts: <span className="text-slate-900 font-bold">{board.post_count}</span></div>
            <div>Visibility: <span className="text-slate-900 font-bold capitalize">{board.visibility}</span></div>
          </CardContent>
        </Card>

        {/* Guidelines / Rules and Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Rules Panel (Left) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-border/50 shadow bg-card/80">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-sm font-extrabold tracking-wider uppercase text-violet-500">Board Rules</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs leading-relaxed text-muted-foreground">
                <div>
                  <h4 className="font-bold text-foreground mb-1">Board Specific Rule:</h4>
                  <p className="bg-primary/5 p-2.5 rounded-lg border border-primary/10 text-foreground">
                    {getBoardRules(board.slug)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">Global Platform Rules:</h4>
                  <ul className="list-disc pl-4 space-y-1.5">
                    <li>No spamming or duplicate promotion.</li>
                    <li>No adult, pornographic, or offensive content.</li>
                    <li>No phishing, malware, or scam links.</li>
                    <li>No illegal content or harassment.</li>
                    <li>Verify your links before submitting.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Deals Section */}
            {!dealsLoading && deals.length > 0 && (
              <Card className="border-border/60 shadow bg-card/80">
                <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-extrabold tracking-wider uppercase text-violet-500">
                    Recommended Deals
                  </CardTitle>
                  <Badge className="bg-violet-600 text-white border-none text-[8px] font-bold">SPONSORED</Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-3">
                    {deals.map(deal => (
                      <div key={deal.id} className="p-2.5 rounded-lg border border-border/50 bg-background/50 hover:border-border/80 transition-all flex flex-col gap-2">
                        <div className="flex gap-2">
                          <div className="h-8 w-8 shrink-0 rounded bg-white border border-border/40 p-0.5 flex items-center justify-center">
                            <img 
                              src={getMerchantImage(deal.merchantName, deal.merchantLogo)} 
                              alt={deal.merchantName} 
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="min-w-0 flex-grow">
                            <h5 className="text-[10px] font-bold text-foreground line-clamp-1">{deal.title}</h5>
                            <p className="text-[9px] text-muted-foreground line-clamp-1">{deal.merchantName}</p>
                          </div>
                        </div>
                        {deal.discountText && (
                          <Badge variant="outline" className="w-fit text-[8px] font-bold text-violet-500 border-violet-500/20 bg-violet-500/5 px-1 py-0 h-4">
                            {deal.discountText}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1.5 mt-1 pt-1.5 border-t border-border/20">
                          <Button 
                            size="sm" 
                            onClick={() => handleDealClick(deal)}
                            className="flex-grow h-6 text-[9px] font-bold gap-1 px-2"
                          >
                            Shop Now <ExternalLink className="h-2.5 w-2.5" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={(e) => handleOpenShare(deal, e)}
                            className="h-6 w-6 p-0 shrink-0"
                            title="Share Deal"
                          >
                            <Share2 className="h-2.5 w-2.5" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={(e) => handleCopyLink(deal, e)}
                            className="h-6 w-6 p-0 shrink-0"
                            title="Copy Link"
                          >
                            {copiedId === deal.id ? <Check className="h-2.5 w-2.5 text-green-500" /> : <Copy className="h-2.5 w-2.5" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-muted-foreground/70 text-center leading-relaxed">
                    Axevora may earn a commission when you purchase through eligible partner links, at no extra cost to you.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Feed and Chat Area (Right) */}
          <div className="lg:col-span-8 space-y-6">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-6 bg-slate-100/50 p-1 border border-slate-200 rounded-xl h-12">
                <TabsTrigger 
                  value="posts" 
                  className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-700 transition-all"
                >
                  Board Posts
                </TabsTrigger>
                <TabsTrigger 
                  value="chat" 
                  className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-700 transition-all flex items-center gap-2 justify-center"
                >
                  <MessageSquare className="w-4 h-4" /> Live Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="m-0 space-y-6 animate-in fade-in-50 duration-500">
                {/* Sorting Toolbar */}
                <div className="flex justify-between items-center bg-card border border-border/50 p-2.5 rounded-xl">
              <div className="flex gap-1">
                <Button 
                  variant={sort === 'newest' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => { setSort('newest'); setPage(1); }}
                  className="font-bold text-xs"
                >
                  Newest
                </Button>
                <Button 
                  variant={sort === 'popular' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => { setSort('popular'); setPage(1); }}
                  className="font-bold text-xs"
                >
                  Popular
                </Button>
                <Button 
                  variant={sort === 'discussed' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => { setSort('discussed'); setPage(1); }}
                  className="font-bold text-xs"
                >
                  Most Discussed
                </Button>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono font-semibold">Page {page} of {totalPages}</Badge>
            </div>

            {/* Posts List */}
            {postsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-muted-foreground text-xs">Loading posts feed...</p>
              </div>
            ) : posts.length === 0 ? (
              <Card className="border-dashed border-border/70 py-16 text-center">
                <CardContent className="space-y-3">
                  <AlertCircle className="h-10 w-10 text-muted-foreground/60 mx-auto" />
                  <h3 className="text-base font-bold text-foreground">No Posts Yet</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Be the first to share your content in the {board.name} board!
                  </p>
                  {/* Show Create First Post for all visitors */}
                  <Button
                    onClick={() => requireAuth('create the first post', () => setShowCreateModal(true))}
                    size="sm" className="mt-2 font-semibold"
                  >
                    {user ? 'Create First Post' : 'Join to Post'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post, idx) => {
                  const youtubeId = getYoutubeVideoId(post.external_url);
                  const isBotPost = post.is_automated === 1 || post.embed_type === 'cuelinks_offer';
                  let offerSnapshot: CommerceOfferPayload | null = null;

                  if (isBotPost && post.content) {
                    try {
                      offerSnapshot = JSON.parse(post.content);
                    } catch {
                      offerSnapshot = {
                        title: post.title,
                        merchant: post.url_domain || 'Partner Store',
                        description: post.content,
                        tracking_url: post.external_url || '',
                      };
                    }
                  }

                  return (
                    <React.Fragment key={post.id}>
                      <Card className="border-border/50 hover:border-border/80 shadow-sm transition-all bg-card hover:shadow-md overflow-hidden">
                        {isBotPost && offerSnapshot ? (
                          <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-border/40">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-foreground">@{post.username || 'Axevora Bot'}</span>
                                <BotBadge />
                              </div>
                              <span className="text-[10px] text-muted-foreground">{new Date(post.created_at + ' Z').toLocaleString()}</span>
                            </div>
                            <RichCommerceCard offer={offerSnapshot} />
                          </div>
                        ) : (
                          <>
                            {post.external_url && (
                              <div className="px-4 pt-3">
                                <RichMediaEngine url={post.external_url} />
                              </div>
                            )}
                            <CardHeader className="p-4 pb-2">
                              <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground mb-1.5 font-medium">
                                <span className="font-bold text-foreground">@{post.username || 'Anonymous'}</span>
                                <Badge variant="outline" className="text-[8px] font-bold px-1 py-0 h-3.5 flex items-center">
                                  <Flame className="h-2 w-2 mr-0.5 text-orange-500 fill-orange-500/20" /> Level {post.trust_level || 1}
                                </Badge>
                                <span>•</span>
                                <span>{new Date(post.created_at + ' Z').toLocaleString()}</span>
                              </div>
                              
                              <Link to={`/community/boards/${board.slug}/posts/${post.id}`}>
                                <CardTitle className="text-base font-extrabold text-foreground hover:text-primary transition-colors line-clamp-1 cursor-pointer">
                                  {post.title}
                                </CardTitle>
                              </Link>
                            </CardHeader>
                            
                            <CardContent className="px-4 pb-3 pt-0">
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {post.content}
                          </p>
                          
                          {post.external_url && !youtubeId && (
                            <div className="mt-3 p-3 rounded-lg border border-border/60 bg-muted/30 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="p-2 bg-background rounded border border-border/80 text-muted-foreground shrink-0">
                                  {post.embed_type === 'instagram' && <Instagram className="h-4 w-4 text-pink-500" />}
                                  {post.embed_type === 'twitter' && <Twitter className="h-4 w-4 text-sky-500" />}
                                  {post.embed_type === 'tiktok' && <Video className="h-4 w-4 text-teal-500" />}
                                  {post.embed_type === 'website' && <Globe className="h-4 w-4 text-indigo-500" />}
                                </div>
                                <div className="min-w-0 flex-grow">
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    {post.embed_type} Link
                                  </p>
                                  <h4 className="text-xs font-bold text-foreground truncate">{post.url_domain}</h4>
                                </div>
                              </div>
                              <a 
                                href={post.external_url} 
                                target="_blank" 
                                rel="nofollow ugc noopener noreferrer"
                                className="shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold gap-1 px-2.5">
                                  Visit Link <ExternalLink className="h-3 w-3" />
                                </Button>
                              </a>
                            </div>
                          )}

                          {post.external_url && youtubeId && (
                            <div className="mt-2.5 flex items-center gap-1">
                              <Badge variant="secondary" className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/10 text-[9px] py-0.5">
                                <ExternalLink className="h-2.5 w-2.5 mr-1" />
                                <a 
                                  href={post.external_url} 
                                  target="_blank" 
                                  rel="nofollow ugc noopener noreferrer" 
                                  onClick={(e) => e.stopPropagation()}
                                  className="hover:underline font-mono text-[9px]"
                                >
                                  {post.url_domain}
                                </a>
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                        
                        <CardFooter className="px-4 py-2 border-t border-border/30 bg-muted/20 flex gap-4 text-[10px] text-muted-foreground font-semibold">
                          <div className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {post.views_count} views</div>
                          <div className="flex items-center gap-1"><Flame className="h-3.5 w-3.5" /> 💥 Boom {post.upvotes_count}</div>
                          <div className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {post.comments_count} comments</div>
                        </CardFooter>
                      </>
                    )}
                  </Card>

                      {idx === 4 && feedDeal && (
                        <Card key={`feed-affiliate-deal`} className="border-violet-500/20 bg-violet-500/5 hover:border-violet-500/35 transition-all shadow-sm">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-center justify-between text-[10px] font-bold text-violet-500 tracking-wide uppercase mb-1">
                              <span className="flex items-center gap-1">
                                <Badge className="bg-violet-600 text-white border-none text-[8px] px-1 py-0 h-4">Sponsored</Badge>
                                <span>Partner Offer</span>
                              </span>
                              <span className="text-[9px] text-muted-foreground capitalize font-normal">
                                Via {feedDeal.merchantName}
                              </span>
                            </div>
                            <CardTitle className="text-sm font-extrabold text-foreground leading-snug">
                              {feedDeal.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-4 pb-3 pt-0">
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {feedDeal.description || `Get the best deals and verified coupons for ${feedDeal.merchantName}.`}
                            </p>
                            {feedDeal.discountText && (
                              <div className="mt-2.5">
                                <Badge variant="outline" className="text-[9px] font-bold text-violet-500 border-violet-500/20 bg-violet-500/5">
                                  {feedDeal.discountText}
                                </Badge>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="px-4 py-2.5 border-t border-border/30 bg-violet-500/10 flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={(e) => handleOpenShare(feedDeal, e)}
                                className="h-7 text-[10px] hover:bg-violet-500/15 gap-1.5 px-2.5 text-foreground"
                              >
                                <Share2 className="h-3 w-3" /> Share
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={(e) => handleCopyLink(feedDeal, e)}
                                className="h-7 text-[10px] hover:bg-violet-500/15 gap-1.5 px-2.5 text-foreground"
                              >
                                {copiedId === feedDeal.id ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />} Copy Link
                              </Button>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => handleDealClick(feedDeal)}
                              className="h-7 text-[10px] font-bold gap-1 bg-violet-600 hover:bg-violet-700 text-white border-none px-3"
                            >
                              Shop Now <ExternalLink className="h-3 w-3" />
                            </Button>
                          </CardFooter>
                        </Card>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Pagination Toolbar */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 pt-4">
                    <Button 
                      disabled={page === 1} 
                      onClick={() => setPage(p => p - 1)} 
                      variant="outline" 
                      size="sm"
                      className="font-semibold text-xs"
                    >
                      Previous
                    </Button>
                    <Button 
                      disabled={page === totalPages} 
                      onClick={() => setPage(p => p + 1)} 
                      variant="outline" 
                      size="sm"
                      className="font-semibold text-xs"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
              </TabsContent>

              <TabsContent value="chat" className="m-0 animate-in fade-in-50 duration-500">
                <BoardLiveChat boardSlug={board.slug} user={user} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Create Post Dialog Modal */}
      {showCreateModal && (
        <CreatePostModal 
           boardName={board.name}
           onClose={() => setShowCreateModal(false)}
           onSubmit={handleCreatePost}
           submitting={submitting}
        />
      )}

      {/* Guest Join Modal */}
      <JoinCommunityModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        actionName={joinActionName}
        isUnverifiedUser={user ? user.emailVerified === false : false}
        userEmail={user?.email}
      />

      <Footer />
    </div>
  );
}
