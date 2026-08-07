import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Camera, Mail, MapPin, Globe, Twitter, Github, Linkedin, Instagram, Youtube, CheckCircle, AlertCircle, Edit2, Loader2, Upload } from 'lucide-react';

interface ProfileData {
  display_name: string;
  bio: string;
  website_url: string;
  location: string;
  social_twitter: string;
  social_github: string;
  social_linkedin: string;
  social_instagram: string;
  social_youtube: string;
  avatar_url: string;
  cover_image: string;
  created_at: string;
  reputation_score: number;
  post_count: number;
}

export default function CommunityProfile() {
  const { user, loading: authLoading, checkAuth } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ProfileData>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Upload State
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/community?mode=login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/community/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setEditForm({
          display_name: data.profile.display_name || '',
          bio: data.profile.bio || '',
          location: data.profile.location || '',
          website_url: data.profile.website_url || '',
          social_twitter: data.profile.social_twitter || '',
          social_github: data.profile.social_github || '',
          social_linkedin: data.profile.social_linkedin || '',
          social_instagram: data.profile.social_instagram || '',
          social_youtube: data.profile.social_youtube || ''
        });
      } else {
        toast.error('Failed to load profile details');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/community/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      
      if (res.ok) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        fetchProfile();
        checkAuth(); // Refresh global auth state
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error saving profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File exceeds 5MB limit');
      return;
    }

    try {
      if (type === 'avatar') setIsUploadingAvatar(true);
      else setIsUploadingCover(true);

      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);

      const res = await fetch('/api/community/profile/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        toast.success(`${type === 'avatar' ? 'Profile picture' : 'Cover image'} updated`);
        fetchProfile();
        checkAuth(); // Refresh global auth state
      } else {
        const data = await res.json();
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error during upload');
    } finally {
      if (type === 'avatar') setIsUploadingAvatar(false);
      else setIsUploadingCover(false);
      
      // Reset input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };
  
  const calculateCompletion = () => {
    if (!profile) return 0;
    const fields = [
      profile.display_name,
      profile.bio,
      profile.location,
      profile.website_url,
      profile.avatar_url,
      profile.cover_image,
      profile.social_twitter || profile.social_github || profile.social_linkedin
    ];
    const filled = fields.filter(f => f && f.toString().trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  if (authLoading || loading || !user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const completionPercent = calculateCompletion();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Cover Image */}
      <div className="relative h-64 rounded-t-2xl overflow-hidden bg-slate-200 group">
        {profile.cover_image ? (
          <img src={profile.cover_image} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600" />
        )}
        
        {/* Cover Upload Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <input 
            type="file" 
            ref={coverInputRef} 
            className="hidden" 
            accept="image/jpeg,image/png,image/webp,image/avif" 
            onChange={(e) => handleImageUpload(e, 'cover')}
          />
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => coverInputRef.current?.click()}
            disabled={isUploadingCover}
            className="font-bold text-xs"
          >
            {isUploadingCover ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Camera className="w-4 h-4 mr-2" />}
            Change Cover
          </Button>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-slate-200 border-t-0 p-6 relative">
        
        {/* Avatar */}
        <div className="absolute -top-16 left-6 group">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-lg relative">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-4xl font-bold">
                {getInitials(profile.display_name || user.username)}
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
               {isUploadingAvatar ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Upload className="w-6 h-6 text-white" />}
            </div>
          </div>
          <input 
            type="file" 
            ref={avatarInputRef} 
            className="hidden" 
            accept="image/jpeg,image/png,image/webp,image/avif" 
            onChange={(e) => handleImageUpload(e, 'avatar')}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mb-4">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="font-bold">
              <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm" disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} size="sm" className="bg-indigo-600 text-white font-bold" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        {/* Profile Content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="col-span-2 space-y-6">
            {!isEditing ? (
              <>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">{profile.display_name || user.username}</h1>
                  <p className="text-sm font-medium text-slate-500">@{user.username}</p>
                </div>
                
                {profile.bio && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">About</h3>
                    <p className="text-slate-700 whitespace-pre-wrap text-sm">{profile.bio}</p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-4">
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
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Display Name</label>
                  <Input 
                    value={editForm.display_name || ''} 
                    onChange={e => setEditForm({...editForm, display_name: e.target.value})}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bio</label>
                  <Textarea 
                    value={editForm.bio || ''} 
                    onChange={e => setEditForm({...editForm, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                    <Input 
                      value={editForm.location || ''} 
                      onChange={e => setEditForm({...editForm, location: e.target.value})}
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Website URL</label>
                    <Input 
                      value={editForm.website_url || ''} 
                      onChange={e => setEditForm({...editForm, website_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {/* Identity & Status */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">Identity Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-2 text-slate-400" />
                  <span className="text-slate-600 truncate">{user.email}</span>
                </div>
                
                <div>
                  {user.emailVerified ? (
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none font-bold">
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Verified Email
                    </Badge>
                  ) : (
                    <div className="flex flex-col gap-2 items-start">
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none font-bold">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" /> Verification Pending
                      </Badge>
                      <Button variant="link" className="p-0 h-auto text-xs text-indigo-600 font-bold">
                        Resend Email
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Profile Completion</h3>
                <span className="text-xs font-bold text-indigo-600">{completionPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${completionPercent}%` }}></div>
              </div>
            </div>
            
            {/* Social Links */}
            <div>
               <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">Social Links</h3>
               {!isEditing ? (
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
                    {(!profile.social_twitter && !profile.social_github && !profile.social_linkedin) && (
                      <span className="text-xs text-slate-500 italic">No social links added</span>
                    )}
                 </div>
               ) : (
                 <div className="space-y-3">
                   <div className="flex items-center gap-2">
                     <Twitter className="w-4 h-4 text-slate-400" />
                     <Input 
                        placeholder="Twitter Handle" 
                        value={editForm.social_twitter || ''}
                        onChange={e => setEditForm({...editForm, social_twitter: e.target.value})}
                        className="h-8 text-xs"
                      />
                   </div>
                   <div className="flex items-center gap-2">
                     <Github className="w-4 h-4 text-slate-400" />
                     <Input 
                        placeholder="Github Username" 
                        value={editForm.social_github || ''}
                        onChange={e => setEditForm({...editForm, social_github: e.target.value})}
                        className="h-8 text-xs"
                      />
                   </div>
                   <div className="flex items-center gap-2">
                     <Linkedin className="w-4 h-4 text-slate-400" />
                     <Input 
                        placeholder="LinkedIn Profile" 
                        value={editForm.social_linkedin || ''}
                        onChange={e => setEditForm({...editForm, social_linkedin: e.target.value})}
                        className="h-8 text-xs"
                      />
                   </div>
                 </div>
               )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
