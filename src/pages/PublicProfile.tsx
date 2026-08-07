import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, MapPin, Globe, Twitter, Github, Linkedin, Calendar, MessageSquare, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PublicProfileData {
  username: string;
  display_name: string;
  bio: string;
  website_url: string;
  location: string;
  social_twitter: string;
  social_github: string;
  social_linkedin: string;
  avatar_url: string;
  cover_image: string;
  created_at: string;
  post_count: number;
  reputation_score: number;
  platform_role: string;
}

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      fetchPublicProfile(username);
    }
  }, [username]);

  const fetchPublicProfile = async (uname: string) => {
    try {
      setLoading(true);
      // NOTE: Using a generic mock/fetch for now until a public endpoint exists
      // We assume /api/community/profile/public/:username will be created or exists
      const res = await fetch(`/api/community/profile/public/${uname}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      } else {
        if (res.status === 404) {
          setError('Profile not found');
        } else {
          setError('Failed to load profile');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <Globe className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">User Not Found</h1>
        <p className="text-slate-500 max-w-md mb-6">{error || 'The profile you are looking for does not exist or may have been deleted.'}</p>
        <Button asChild>
          <Link to="/community">Return to Community</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Cover Image */}
      <div className="h-64 rounded-t-2xl overflow-hidden bg-slate-200">
        {profile.cover_image ? (
          <img src={profile.cover_image} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-slate-700 to-slate-900" />
        )}
      </div>

      {/* Profile Info Section */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-slate-200 border-t-0 p-6 relative">
        
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-lg">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-4xl font-bold">
                {getInitials(profile.display_name || profile.username)}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mb-4 h-10">
          {/* Action buttons could go here like 'Follow' */}
        </div>

        {/* Profile Content */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                {profile.display_name || profile.username}
                {profile.platform_role !== 'user' && (
                  <span className="text-[10px] uppercase font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                    {profile.platform_role}
                  </span>
                )}
              </h1>
              <p className="text-sm font-medium text-slate-500">@{profile.username}</p>
            </div>
            
            {profile.bio && (
              <div>
                <p className="text-slate-700 whitespace-pre-wrap text-sm">{profile.bio}</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-sm text-slate-600 font-medium">
                <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
                Joined {formatDate(profile.created_at)}
              </div>
              
              {profile.location && (
                <div className="flex items-center text-sm text-slate-600 font-medium">
                  <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                  {profile.location}
                </div>
              )}
              {profile.website_url && (
                <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-indigo-600 hover:underline font-medium">
                  <Globe className="w-4 h-4 mr-1.5 text-indigo-500" />
                  Website
                </a>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Community Stats */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-4">Community Stats</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <MessageSquare className="w-5 h-5 text-indigo-500 mb-1" />
                  <span className="text-lg font-extrabold text-slate-900">{profile.post_count || 0}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Posts</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <Award className="w-5 h-5 text-amber-500 mb-1" />
                  <span className="text-lg font-extrabold text-slate-900">{profile.reputation_score || 0}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Reputation</span>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            {(profile.social_twitter || profile.social_github || profile.social_linkedin) && (
              <div>
                 <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">Connect</h3>
                 <div className="flex flex-wrap gap-2">
                    {profile.social_twitter && (
                      <a href={`https://twitter.com/${profile.social_twitter}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-slate-600 hover:bg-[#1DA1F2] hover:text-white rounded-lg transition-colors">
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {profile.social_github && (
                      <a href={`https://github.com/${profile.social_github}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-slate-600 hover:bg-[#333] hover:text-white rounded-lg transition-colors">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {profile.social_linkedin && (
                      <a href={`https://linkedin.com/in/${profile.social_linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-slate-600 hover:bg-[#0077B5] hover:text-white rounded-lg transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                 </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
