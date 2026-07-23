import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  Calendar, PlusCircle, AlertCircle, AlertTriangle, Eye, ThumbsUp, MessageCircle
} from "lucide-react";

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
}

interface CurrentUser {
  id: string;
  username: string;
  email: string;
  platformRole: string;
  trustLevel: number;
}

export default function CommunityBoard() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<BoardDetails | null>(null);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  
  // Pagination & Sorting
  const [sort, setSort] = useState<'newest' | 'popular' | 'discussed'>('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Post Creation Form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [rulesAgreed, setRulesAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (slug) {
      fetchBoardAndPosts();
    }
  }, [slug, sort, page]);

  const checkUser = async () => {
    try {
      const res = await fetch('/api/community/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        }
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const fetchBoardAndPosts = async () => {
    setPostsLoading(true);
    try {
      const res = await fetch(`/api/community/boards/${slug}?sort=${sort}&page=${page}&limit=10`);
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

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Title and Content are required");
      return;
    }
    if (!rulesAgreed) {
      toast.error("You must agree to the Board Guidelines and Rules");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/community/boards/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          externalUrl: newUrl
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Post created successfully!");
        setNewTitle('');
        setNewContent('');
        setNewUrl('');
        setRulesAgreed(false);
        setShowCreateModal(false);
        setPage(1);
        fetchBoardAndPosts();
      } else {
        toast.error(data.error || "Failed to submit post");
      }
    } catch (err) {
      toast.error("Network error during submission");
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
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Board Not Found</h1>
          <p className="text-muted-foreground max-w-md mb-6">
            The board you are looking for does not exist or has been locked.
          </p>
          <Link to="/community">
            <Button className="font-semibold">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Community Dashboard
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6">
          <Link to="/community" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5 w-fit">
            <ArrowLeft className="h-4 w-4" /> Back to Community Dashboard
          </Link>
        </div>

        {/* Board Header Card */}
        <Card className="border-border/60 shadow-lg bg-card/60 backdrop-blur mb-8">
          <CardHeader className="md:flex md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{board.name}</h1>
                <Badge className="bg-primary/15 text-primary border-none text-[10px] font-bold">OFFICIAL</Badge>
              </div>
              <p className="text-muted-foreground text-sm max-w-3xl leading-relaxed">{board.description}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-2 shrink-0">
              {user ? (
                <Button onClick={() => setShowCreateModal(true)} className="font-semibold flex items-center gap-1.5">
                  <PlusCircle className="h-4 w-4" /> Create Post
                </Button>
              ) : (
                <Link to="/community#join-section">
                  <Button className="font-semibold flex items-center gap-1.5">
                    <PlusCircle className="h-4 w-4" /> Sign In to Post
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent className="border-t border-border/40 pt-4 flex flex-wrap gap-6 text-xs text-muted-foreground font-medium">
            <div>Posts: <span className="text-foreground font-bold">{board.post_count}</span></div>
            <div>Visibility: <span className="text-foreground font-bold capitalize">{board.visibility}</span></div>
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
          </div>

          {/* Posts Feed (Right) */}
          <div className="lg:col-span-8 space-y-6">
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
                  {user && (
                    <Button onClick={() => setShowCreateModal(true)} size="sm" className="mt-2 font-semibold">
                      Create First Post
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <Card key={post.id} className="border-border/50 hover:border-border/80 shadow-sm transition-all bg-card hover:shadow-md">
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
                      
                      {post.external_url && (
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
                      <div className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {post.upvotes_count} upvotes</div>
                      <div className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {post.comments_count} comments</div>
                    </CardFooter>
                  </Card>
                ))}

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
          </div>
        </div>
      </main>

      {/* Create Post Dialog Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg border-border/80 shadow-2xl animate-scale-in">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Create Post in {board.name}</CardTitle>
              <CardDescription className="text-xs">
                Submit links, promotion profiles, or general posts. Follow the rules to avoid post removal.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleCreatePost}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="post-title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</Label>
                  <Input 
                    id="post-title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter post title (5-100 characters)"
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="post-content" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Content Details</Label>
                  <textarea 
                    id="post-content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Provide detailed description of your post (10-5000 characters)"
                    className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="post-url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    External URL <span className="text-[10px] font-normal text-muted-foreground">(Optional)</span>
                  </Label>
                  <Input 
                    id="post-url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="e.g. https://youtube.com/..."
                    type="url"
                  />
                  <p className="text-[9px] text-muted-foreground">Must be a secure HTTPS link to your video, profile, startup, or blog.</p>
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="agree-rules" 
                    checked={rulesAgreed}
                    onChange={(e) => setRulesAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="agree-rules" className="text-xs text-muted-foreground cursor-pointer select-none leading-relaxed">
                    I agree to the Board Guidelines and confirm that my link does not violate general platform rules (no phishing, scams, or malicious content).
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2.5">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="font-semibold">
                  {submitting ? 'Submitting...' : 'Submit Post'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}
