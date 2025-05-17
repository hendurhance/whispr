import React, { useState } from 'react';
import { useSocialLinks } from '../hooks/useSocialLinks';

interface SocialLinksManagerProps {
  className?: string;
}

const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({ className = '' }) => {
  const { 
    socialLinks, 
    isLoading, 
    error, 
    success, 
    addSocialLink, 
    deleteSocialLink, 
    getPlatformName,
    platformOptions 
  } = useSocialLinks();
  
  // Local form state
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  
  // Handle form submission
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If link was successfully added, reset form
    const added = await addSocialLink(newPlatform, newUrl);
    if (added) {
      setNewPlatform('');
      setNewUrl('');
    }
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
              <div className="overflow-hidden">
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
                onClick={() => deleteSocialLink(link.id)}
                disabled={isLoading}
                className="text-accent-pink hover:text-accent-pink/80 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-pink/50 rounded"
                aria-label={`Delete ${getPlatformName(link.platform)} link`}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
            className={`py-2 px-4 bg-gradient-primary text-white rounded-lg font-medium transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-glow'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
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