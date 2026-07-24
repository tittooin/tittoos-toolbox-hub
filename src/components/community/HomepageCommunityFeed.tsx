import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, MessageSquare, ShieldCheck, Flame, ExternalLink } from "lucide-react";
import { BotBadge } from "@/components/community/BotBadge";
import { RichMediaEngine } from "@/components/community/RichMediaEngine";

export interface HomepageFeedItem {
  id: string;
  title: string;
  content: string;
  external_url: string | null;
  url_domain: string | null;
  embed_type: string;
  views_count: number;
  created_at: string;
  username: string;
  board_name: string;
  board_slug: string;
  is_automated?: number;
  feed_category?: string; // 'creator' | 'deal' | 'discussion' | 'bot'
}

export function HomepageCommunityFeed() {
  const [items, setItems] = useState<HomepageFeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomepageFeed();
  }, []);

  const fetchHomepageFeed = async () => {
    try {
      const res = await fetch('/api/community/homepage-feed');
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.items)) {
          setItems(data.items);
        }
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-12 bg-slate-50/50 border-y border-slate-200/60">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="text-xs text-slate-500 font-semibold mt-3">Loading Community Activity...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="w-full py-14 bg-slate-50/60 border-y border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold w-fit">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>LIVE COMMUNITY ACTIVITY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              What Creators & Founders Are Sharing
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl font-normal">
              Explore YouTube videos, SaaS launches, tech discussions, and verified deals from our moderated community.
            </p>
          </div>

          <Link to="/community">
            <Button className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 shrink-0 flex items-center gap-1.5">
              Explore All Boards <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mixed Feed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isBot = item.is_automated === 1 || item.embed_type === 'cuelinks_offer';

            return (
              <Card key={item.id} className="border border-slate-200/80 bg-white hover:bg-slate-50/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between">
                <CardHeader className="p-5 pb-3 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs font-bold text-slate-900 truncate">@{item.username}</span>
                      {isBot ? (
                        <BotBadge />
                      ) : (
                        <Badge variant="outline" className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border-indigo-200 px-1.5 py-0">Member</Badge>
                      )}
                    </div>

                    <Link to={`/community/boards/${item.board_slug}`}>
                      <Badge variant="outline" className="text-[10px] font-bold text-slate-600 bg-slate-100/80 border-slate-200 px-2 py-0.5 rounded-md hover:bg-slate-200 shrink-0">
                        {item.board_name}
                      </Badge>
                    </Link>
                  </div>

                  <Link to={`/community/boards/${item.board_slug}/posts/${item.id}`} className="block">
                    <CardTitle className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </CardTitle>
                  </Link>
                </CardHeader>

                <CardContent className="px-5 pb-5 pt-0 space-y-3">
                  {/* Media Engine Render */}
                  {item.external_url && (
                    <div className="pt-1">
                      <RichMediaEngine url={item.external_url} />
                    </div>
                  )}

                  {!item.external_url && item.content && (
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    <Link to={`/community/boards/${item.board_slug}/posts/${item.id}`} className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                      View Discussion <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
