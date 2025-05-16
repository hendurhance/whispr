import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/auth';
import supabase from '../lib/supabase';
import { SocialLink } from '../types';

interface SocialLinksManagerProps {
  className?: string;
}

const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Platform options
  const platformOptions = [
    { id: 'instagram', name: 'Instagram' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'tiktok', name: 'TikTok' },
    { id: 'youtube', name: 'YouTube' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'github', name: 'GitHub' },
    { id: 'website', name: 'Website' }
  ];
  
  // Memoize fetchSocialLinks to ensure it doesn't change on every render
  const fetchSocialLinks = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('user_id', user.id)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      setSocialLinks(data || []);
    } catch (error) {
      console.error('Error fetching social links:', error);
      setError('Failed to load social links');
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Include user in dependencies
  
  // Fetch social links when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchSocialLinks();
    }
  }, [user, fetchSocialLinks]); // Include fetchSocialLinks in dependencies
  
  // Add a new social link
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    if (!newPlatform || !newUrl) {
      setError('Please provide both platform and URL');
      return;
    }
    
    // Basic URL validation
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }
    
    setIsAdding(true);
    setError(null);
    
    try {
      // Get next display order
      const nextOrder = socialLinks.length > 0
        ? Math.max(...socialLinks.map(link => link.display_order)) + 1
        : 0;
      
      // Insert new link
      const { error } = await supabase
        .from('social_links')
        .insert([{
          user_id: user.id,
          platform: newPlatform,
          url: newUrl,
          display_order: nextOrder
        }]);
      
      if (error) throw error;
      
      // Refetch links
      await fetchSocialLinks();
      
      // Reset form
      setNewPlatform('');
      setNewUrl('');
      setSuccess('Social link added successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error adding social link:', error);
      setError('Failed to add social link');
    } finally {
      setIsAdding(false);
    }
  };
  
  // Delete a social link
  const handleDeleteLink = async (id: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Extra safety check
      
      if (error) throw error;
      
      // Update local state
      setSocialLinks(prevLinks => prevLinks.filter(link => link.id !== id));
      
      setSuccess('Social link removed');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error deleting social link:', error);
      setError('Failed to delete social link');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get platform display name
  const getPlatformName = (platformId: string) => {
    const platform = platformOptions.find(p => p.id === platformId);
    return platform ? platform.name : platformId;
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-lg font-medium text-text-bright">Social Media Links</h3>
      
      {/* List of current links */}
      {socialLinks.length > 0 ? (
        <div className="space-y-3">
          {socialLinks.map(link => (
            <div 
              key={link.id} 
              className="flex items-center justify-between bg-background-darkest p-3 rounded-lg"
            >
              <div>
                <p className="text-text-bright font-medium">{getPlatformName(link.platform)}</p>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary text-sm hover:underline truncate max-w-[200px] inline-block"
                >
                  {link.url}
                </a>
              </div>
              <button
                onClick={() => handleDeleteLink(link.id)}
                disabled={isLoading}
                className="text-accent-pink hover:text-accent-pink/80 transition-colors"
                aria-label="Delete link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-text-muted italic">No social links added yet.</p>
      )}
      
      {/* Add new link form */}
      <form onSubmit={handleAddLink} className="space-y-4 pt-4 border-t border-overlay-light">
        <div>
          <label htmlFor="platform" className="block text-sm text-text-bright mb-1">
            Platform
          </label>
          <select
            id="platform"
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-background-darkest border border-overlay-light focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-text-bright"
            disabled={isAdding}
            required
          >
            <option value="">Select platform</option>
            {platformOptions.map(platform => (
              <option key={platform.id} value={platform.id}>{platform.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="url" className="block text-sm text-text-bright mb-1">
            URL
          </label>
          <input
            id="url"
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://example.com/your-profile"
            className="w-full px-4 py-2 rounded-lg bg-background-darkest border border-overlay-light focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-text-bright"
            disabled={isAdding}
            required
          />
        </div>
        
        {error && (
          <div className="bg-accent-pink/10 text-accent-pink rounded-lg p-3 text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-accent-green/10 text-accent-green rounded-lg p-3 text-sm">
            {success}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isAdding || isLoading}
            className={`py-2 px-4 bg-gradient-primary text-white rounded-lg font-medium transition-all ${(isAdding || isLoading) ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-glow'}`}
          >
            {isAdding ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : (
              'Add Link'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialLinksManager;