import React, { useState } from 'react';
import { ExternalLink, Youtube, Instagram, Twitter, Music2, Github, Video, Globe, Play, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface NormalizedMedia {
  platform: 'youtube' | 'instagram' | 'twitter' | 'tiktok' | 'spotify' | 'github' | 'vimeo' | 'website';
  rawUrl: string;
  id?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  title?: string;
  domain?: string;
}

export interface MediaRenderOptions {
  onPlayClick?: () => void;
  compact?: boolean;
}

export interface MediaProvider {
  id: string;
  name: string;
  match: (url: string) => boolean;
  normalize: (url: string) => NormalizedMedia;
  render: (media: NormalizedMedia, options?: MediaRenderOptions) => React.ReactNode;
}

// ---------------- 1. YOUTUBE PROVIDER ----------------
const YouTubeProvider: MediaProvider = {
  id: 'youtube',
  name: 'YouTube',
  match: (url: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes('youtube.com') || lower.includes('youtu.be');
  },
  normalize: (url: string) => {
    let videoId: string | undefined = undefined;
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();

      if (host === 'youtu.be') {
        const path = parsed.pathname.substring(1).split('/')[0].split('?')[0];
        if (path && path.length === 11) videoId = path;
      } else if (host.includes('youtube.com')) {
        if (parsed.pathname.startsWith('/shorts/')) {
          const parts = parsed.pathname.split('/');
          const clean = parts[2] ? parts[2].split('?')[0] : null;
          if (clean && clean.length === 11) videoId = clean;
        } else if (parsed.pathname.startsWith('/live/')) {
          const parts = parsed.pathname.split('/');
          const clean = parts[2] ? parts[2].split('?')[0] : null;
          if (clean && clean.length === 11) videoId = clean;
        } else if (parsed.pathname.startsWith('/embed/')) {
          const parts = parsed.pathname.split('/');
          const clean = parts[2] ? parts[2].split('?')[0] : null;
          if (clean && clean.length === 11) videoId = clean;
        } else {
          const v = parsed.searchParams.get('v');
          if (v && v.length === 11) videoId = v;
        }
      }
    } catch {
      // ignore
    }

    return {
      platform: 'youtube',
      rawUrl: url,
      id: videoId,
      embedUrl: videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0` : undefined,
      thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined,
      domain: 'youtube.com'
    };
  },
  render: (media: NormalizedMedia, options?: MediaRenderOptions) => {
    const [iframeError, setIframeError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    if (!media.id || iframeError) {
      // Fallback Card
      return (
        <Card className="border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                <Youtube className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">YouTube Video</span>
                  <Badge variant="outline" className="text-[9px] font-bold text-red-600 bg-red-50 border-red-200 px-1.5 py-0">YouTube</Badge>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{media.rawUrl}</p>
              </div>
            </div>
            <a href={media.rawUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="h-8 text-xs font-bold text-slate-700 rounded-xl shrink-0">
                Watch <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </a>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-900 shadow-sm transition-all group">
        {!isPlaying ? (
          <div className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer" onClick={() => { setIsPlaying(true); options?.onPlayClick?.(); }}>
            <img 
              src={media.thumbnailUrl} 
              alt="YouTube Video Thumbnail" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              loading="lazy"
              onError={() => setIframeError(true)}
            />
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
            </div>
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-600 text-white border-none font-extrabold text-[10px] px-2 py-0.5 flex items-center gap-1 shadow-md">
                <Youtube className="w-3 h-3" /> YOUTUBE
              </Badge>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video w-full">
            <iframe
              src={media.embedUrl}
              title="YouTube Video Player"
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              onError={() => setIframeError(true)}
            />
          </div>
        )}
      </div>
    );
  }
};

// ---------------- 2. INSTAGRAM PROVIDER ----------------
const InstagramProvider: MediaProvider = {
  id: 'instagram',
  name: 'Instagram',
  match: (url: string) => !!url && url.toLowerCase().includes('instagram.com'),
  normalize: (url: string) => ({
    platform: 'instagram',
    rawUrl: url,
    domain: 'instagram.com'
  }),
  render: (media: NormalizedMedia) => (
    <Card className="border border-pink-200/80 bg-gradient-to-r from-pink-50/50 via-white to-purple-50/50 rounded-2xl overflow-hidden shadow-2xs">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-pink-100/80 border border-pink-200 flex items-center justify-center text-pink-600 shrink-0">
            <Instagram className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 truncate">Instagram Media</span>
              <Badge variant="outline" className="text-[9px] font-bold text-pink-600 bg-pink-50 border-pink-200 px-1.5 py-0">Instagram</Badge>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{media.rawUrl}</p>
          </div>
        </div>
        <a href={media.rawUrl} target="_blank" rel="noopener noreferrer">
          <Button size="sm" className="h-8 text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white rounded-xl shrink-0">
            View on Instagram <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </a>
      </CardContent>
    </Card>
  )
};

// ---------------- 3. TWITTER / X PROVIDER ----------------
const TwitterProvider: MediaProvider = {
  id: 'twitter',
  name: 'X (Twitter)',
  match: (url: string) => !!url && (url.toLowerCase().includes('twitter.com') || url.toLowerCase().includes('x.com')),
  normalize: (url: string) => ({
    platform: 'twitter',
    rawUrl: url,
    domain: 'x.com'
  }),
  render: (media: NormalizedMedia) => (
    <Card className="border border-slate-200/80 bg-slate-50/50 rounded-2xl overflow-hidden shadow-2xs">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <Twitter className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 truncate">X (Twitter) Post</span>
              <Badge variant="outline" className="text-[9px] font-bold text-slate-700 bg-slate-100 border-slate-300 px-1.5 py-0">X Post</Badge>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{media.rawUrl}</p>
          </div>
        </div>
        <a href={media.rawUrl} target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="outline" className="h-8 text-xs font-bold text-slate-800 rounded-xl shrink-0 border-slate-300 hover:bg-slate-100">
            Read Post <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </a>
      </CardContent>
    </Card>
  )
};

// ---------------- 4. GITHUB PROVIDER ----------------
const GitHubProvider: MediaProvider = {
  id: 'github',
  name: 'GitHub',
  match: (url: string) => !!url && url.toLowerCase().includes('github.com'),
  normalize: (url: string) => ({
    platform: 'github',
    rawUrl: url,
    domain: 'github.com'
  }),
  render: (media: NormalizedMedia) => (
    <Card className="border border-slate-200/90 bg-white rounded-2xl overflow-hidden shadow-2xs">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <Github className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 truncate">GitHub Repository</span>
              <Badge variant="outline" className="text-[9px] font-bold text-slate-700 bg-slate-100 border-slate-200 px-1.5 py-0">Open Source</Badge>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{media.rawUrl}</p>
          </div>
        </div>
        <a href={media.rawUrl} target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="outline" className="h-8 text-xs font-bold text-slate-800 rounded-xl shrink-0 border-slate-200">
            View Code <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </a>
      </CardContent>
    </Card>
  )
};

// ---------------- 5. SPOTIFY PROVIDER ----------------
const SpotifyProvider: MediaProvider = {
  id: 'spotify',
  name: 'Spotify',
  match: (url: string) => !!url && url.toLowerCase().includes('spotify.com'),
  normalize: (url: string) => ({
    platform: 'spotify',
    rawUrl: url,
    domain: 'spotify.com'
  }),
  render: (media: NormalizedMedia) => (
    <Card className="border border-emerald-200/80 bg-emerald-50/40 rounded-2xl overflow-hidden shadow-2xs">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Music2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 truncate">Spotify Audio</span>
              <Badge variant="outline" className="text-[9px] font-bold text-emerald-700 bg-emerald-100 border-emerald-200 px-1.5 py-0">Spotify</Badge>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{media.rawUrl}</p>
          </div>
        </div>
        <a href={media.rawUrl} target="_blank" rel="noopener noreferrer">
          <Button size="sm" className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shrink-0">
            Listen <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </a>
      </CardContent>
    </Card>
  )
};

// ---------------- 6. GENERAL WEBSITE RICH PREVIEW PROVIDER ----------------
const WebsitePreviewProvider: MediaProvider = {
  id: 'website',
  name: 'Website',
  match: () => true, // Fallback provider
  normalize: (url: string) => {
    let domain = 'external-website';
    try {
      domain = new URL(url).hostname.replace(/^www\./, '');
    } catch {
      // ignore
    }
    return {
      platform: 'website',
      rawUrl: url,
      domain,
      thumbnailUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    };
  },
  render: (media: NormalizedMedia) => {
    const [faviconErr, setFaviconErr] = useState(false);

    return (
      <Card className="border border-slate-200/80 bg-white hover:bg-slate-50/50 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-600 shrink-0 overflow-hidden">
              {!faviconErr ? (
                <img 
                  src={media.thumbnailUrl} 
                  alt={media.domain} 
                  className="w-5 h-5 object-contain"
                  onError={() => setFaviconErr(true)}
                />
              ) : (
                <Globe className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 truncate capitalize">{media.domain}</span>
                <Badge variant="outline" className="text-[9px] font-extrabold text-slate-600 bg-slate-50 border-slate-200 px-1.5 py-0">Web Link</Badge>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">{media.rawUrl}</p>
            </div>
          </div>
          <a href={media.rawUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="h-8 text-xs font-bold text-slate-800 rounded-xl shrink-0 border-slate-200">
              Visit <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </a>
        </CardContent>
      </Card>
    );
  }
};

// ---------------- PROVIDER REGISTRY ARCHITECTURE ----------------
const PROVIDER_REGISTRY: MediaProvider[] = [
  YouTubeProvider,
  InstagramProvider,
  TwitterProvider,
  GitHubProvider,
  SpotifyProvider,
  WebsitePreviewProvider
];

export interface RichMediaEngineProps {
  url: string | null | undefined;
  onPlayClick?: () => void;
}

export function RichMediaEngine({ url, onPlayClick }: RichMediaEngineProps) {
  if (!url || typeof url !== 'string' || !url.trim()) return null;

  const cleanUrl = url.trim();
  const matchedProvider = PROVIDER_REGISTRY.find(p => p.match(cleanUrl)) || WebsitePreviewProvider;
  const normalized = matchedProvider.normalize(cleanUrl);

  return matchedProvider.render(normalized, { onPlayClick });
}
