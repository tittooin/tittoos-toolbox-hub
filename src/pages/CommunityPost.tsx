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
  Calendar, Edit, Trash2, AlertTriangle, AlertCircle
} from "lucide-react";
import { BotBadge } from "@/components/community/BotBadge";
import { RichCommerceCard, CommerceOfferPayload } from "@/components/community/RichCommerceCard";
import { RichMediaEngine } from "@/components/community/RichMediaEngine";
import { JoinCommunityModal } from "@/components/community/JoinCommunityModal";

interface PostDetails {
  id: string;
  board_id: string;
  user_id: string | null;
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
  board_name: string;
  board_slug: string;
  is_automated?: number;
}

interface CurrentUser {
  id: string;
  username: string;
  email: string;
  platformRole: string;
  trustLevel: number;
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

export default function CommunityPost() {
  const { slug, postId } = useParams<{ slug: string; postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetails | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Edit Form
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [updating, setUpdating] = useState(false);
  
  // Report Form
  const [reportReason, setReportReason] = useState('spam');
  const [reportDetails, setReportDetails] = useState('');
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    checkUser();
    if (postId) {
      fetchPost();
    }
  }, [postId]);

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

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}`);
      if (res.status === 404) {
        setPost(null);
        return;
      }
      
      if (res.ok) {
        const data = await res.json();
        setPost(data.post);
        setEditTitle(data.post.title);
        setEditContent(data.post.content);
        setEditUrl(data.post.external_url || '');
        
        setSEO({
          title: `${data.post.title} - ${data.post.board_name}`,
          description: data.post.content.substring(0, 160),
          url: window.location.href,
          type: 'article'
        });
      } else {
        toast.error("Failed to load post details");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Title and Content are required");
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          externalUrl: editUrl
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Post updated successfully!");
        setShowEditModal(false);
        fetchPost();
      } else {
        toast.error(data.error || "Failed to update post");
      }
    } catch (err) {
      toast.error("Network error during update");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this post?")) {
      return;
    }

    try {
      const res = await fetch(`/api/community/posts/${postId}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Post deleted successfully!");
        navigate(`/community/boards/${post?.board_slug}`);
      } else {
        toast.error(data.error || "Failed to delete post");
      }
    } catch (err) {
      toast.error("Network error during delete");
    }
  };

  const handleReportPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setReporting(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: reportReason,
          details: reportDetails
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Report submitted successfully.");
        setShowReportModal(false);
        setReportDetails('');
      } else {
        toast.error(data.error || "Failed to submit report");
      }
    } catch (err) {
      toast.error("Network error during report");
    } finally {
      setReporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground font-medium">Loading post details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <AlertCircle className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Post Not Found</h1>
          <p className="text-muted-foreground max-w-md mb-6">
            The post you are looking for has been removed or is unavailable.
          </p>
          <Link to="/community">
            <Button className="font-semibold">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isAuthor = post.user_id === user?.id;
  const isPrivileged = user?.platformRole === 'platform_admin' || user?.platformRole === 'platform_moderator';
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
    <div className="min-h-screen bg-slate-50/40 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Navigation & Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link to={`/community/boards/${post.board_slug}`} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1.5 w-fit">
            <ArrowLeft className="h-4 w-4" /> Back to {post.board_name}
          </Link>
          
          <div className="flex gap-2">
            {user && (isAuthor || isPrivileged) && (
              <>
                <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)} className="text-xs font-semibold flex items-center gap-1 rounded-xl">
                  <Edit className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDeletePost} className="text-xs font-semibold flex items-center gap-1 rounded-xl">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </>
            )}
            
            {user && !isAuthor && (
              <Button variant="outline" size="sm" onClick={() => setShowReportModal(true)} className="text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1 rounded-xl">
                <AlertTriangle className="h-3.5 w-3.5 text-red-600" /> Report
              </Button>
            )}
          </div>
        </div>

        {/* Post Detail Card */}
        <Card className="border border-slate-200/80 shadow-md bg-white rounded-2xl overflow-hidden">
          <CardHeader className="p-6 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-medium mb-2">
              <span className="font-bold text-foreground">@{post.username || 'Anonymous'}</span>
              {isBotPost ? (
                <BotBadge />
              ) : (
                <Badge variant="outline" className="text-[9px] font-bold px-1 py-0 h-4 flex items-center">
                  <Flame className="h-2.5 w-2.5 mr-0.5 text-orange-500 fill-orange-500/20" /> Level {post.trust_level || 1}
                </Badge>
              )}
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(post.created_at + ' Z').toLocaleString()}</span>
              <span>•</span>
              <Link to={`/community/boards/${post.board_slug}`}>
                <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20 text-[9px] font-bold">
                  {post.board_name}
                </Badge>
              </Link>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              {post.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="py-6 space-y-6">
            {isBotPost && offerSnapshot ? (
              <RichCommerceCard offer={offerSnapshot} />
            ) : (
              <>
                {/* Main post text content */}
                <p className="text-sm md:text-base text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>

                {/* Universal Rich Media Engine */}
                {post.external_url && (
                  <div className="pt-2">
                    <RichMediaEngine url={post.external_url} />
                  </div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="py-4 border-t border-border/40 bg-muted/10 text-xs text-muted-foreground flex gap-4 font-semibold">
            <div>Views: <span className="text-foreground">{post.views_count}</span></div>
            <div>Upvotes: <span className="text-foreground">{post.upvotes_count}</span></div>
          </CardFooter>
        </Card>
      </main>

      {/* Edit Post Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg border-border/80 shadow-2xl animate-scale-in">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Edit Post</CardTitle>
              <CardDescription className="text-xs">Update your post title, details, or external URL link.</CardDescription>
            </CardHeader>
            <form onSubmit={handleEditPost}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</Label>
                  <Input 
                    id="edit-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="edit-content" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Content Details</Label>
                  <textarea 
                    id="edit-content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">External URL (Optional)</Label>
                  <Input 
                    id="edit-url"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    type="url"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2.5">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updating} className="font-semibold">
                  {updating ? 'Updating...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      {/* Report Post Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-border/80 shadow-2xl animate-scale-in">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-1.5 text-destructive">
                <AlertTriangle className="h-5 w-5" /> Report Post
              </CardTitle>
              <CardDescription className="text-xs">
                Help us keep Axevora Community safe. Select a reason for reporting this post.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleReportPost}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="report-reason" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reason</Label>
                  <select 
                    id="report-reason"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                  >
                    <option value="spam" className="bg-card">Spam / Excessive Self Promotion</option>
                    <option value="adult_content" className="bg-card">Adult or Sexually Explicit Content</option>
                    <option value="scam" className="bg-card">Scam, Fraud, or Fake Offers</option>
                    <option value="malware" className="bg-card">Malicious / Phishing Links</option>
                    <option value="harassment" className="bg-card">Harassment, Hate Speech, or Threats</option>
                    <option value="impersonation" className="bg-card">Misleading Impersonation</option>
                    <option value="illegal_content" className="bg-card">Illegal Activity / Content</option>
                    <option value="other" className="bg-card">Other Guideline Violation</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="report-details" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Additional Details (Optional)</Label>
                  <textarea 
                    id="report-details"
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide context for our moderation team (max 500 characters)"
                    className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2.5">
                <Button type="button" variant="outline" onClick={() => setShowReportModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={reporting} className="font-semibold bg-destructive hover:bg-destructive/90 text-white border-none">
                  {reporting ? 'Submitting...' : 'Submit Report'}
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
