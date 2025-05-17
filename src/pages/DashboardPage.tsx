import React, { useState, useEffect } from 'react';
import DashboardTemplate from '../templates/DashboardTemplate';
import DashboardHeader from '../molecules/DashboardHeader';
import { useAuth } from '../context/auth';
import supabase from '../lib/supabase';
import { 
  Whispr, 
  WhisprType, 
  WhisprStats, 
  ViewMode, 
  SortOption 
} from '../types/whispr';
import MobileWhisprView from '../organisms/Dashboard/MobileWhisprView';
import WhisprList from '../organisms/Dashboard/WhisprList';
import WhisprSwipeCard from '../molecules/WhisprSwipeCard';
import FilterControls from '../molecules/FilterControl';
import ViewWhisprModal from '../molecules/ViewWhisprModal';
import { toast } from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedType, setSelectedType] = useState<WhisprType | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption['value']>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [whisprs, setWhisprs] = useState<Whispr[]>([]);
  const [filteredWhisprs, setFilteredWhisprs] = useState<Whispr[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedWhispr, setSelectedWhispr] = useState<Whispr | null>(null);
  
  // Base URL for the profile (for sharing)
  const baseProfileUrl = window.location.origin;
  
  // Calculate stats with CORRECTED total count - IMPORTANT FIX
  const calculateTypeCountTotal = () => {
    // Count the total number from the byType counts to match the "All" filter badge
    if (whisprs.length === 0) return 0;
    
    const typeCount = Object.values(
      whisprs.reduce((acc, whispr) => {
        acc[whispr.type] = (acc[whispr.type] || 0) + 1;
        return acc;
      }, {} as Record<WhisprType, number>)
    ).reduce((sum, count) => sum + count, 0);
    
    return typeCount;
  };
  
  // Calculate stats with the corrected total that matches the sum of individual type counts
  const stats: WhisprStats = {
    // Use the actual number of whisprs
    total: calculateTypeCountTotal(),
    unread: whisprs.filter(w => !w.isRead).length,
    byType: whisprs.reduce((acc, whispr) => {
      acc[whispr.type] = (acc[whispr.type] || 0) + 1;
      return acc;
    }, {} as Record<WhisprType, number>)
  };
  
  // Generate type options for filters
  const typeOptions = Object.entries(stats.byType).map(([type, count]) => ({
    type: type as WhisprType,
    count
  }));
  
  useEffect(() => {
    // Fetch actual whisprs from Supabase
    const fetchWhisprs = async () => {
      setIsLoading(true);
      try {
        if (!user) return;
        
        const { data, error } = await supabase
          .from('whisprs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching whisprs:', error);
          toast.error('Failed to load whisprs');
          return;
        }
        
        // Transform the data to match our Whispr interface
        const transformedData: Whispr[] = data.map(whispr => ({
          id: whispr.id,
          content: whispr.content,
          type: whispr.type as WhisprType,
          createdAt: whispr.created_at,
          isRead: whispr.is_read,
          metadata: whispr.metadata || {},
          username: profile?.username || user?.user_metadata?.username || 'user'
        }));
        
        setWhisprs(transformedData);
      } catch (error) {
        console.error('Error in fetchWhisprs:', error);
        toast.error('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user && user.user_metadata?.profile_setup) {
      fetchWhisprs();
    } else {
      setIsLoading(false);
    }
    
    // Check if mobile view
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [user, profile]);
  
  // Filter and sort whisprs
  useEffect(() => {
    let filtered = [...whisprs];
    
    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(whispr => whispr.type === selectedType);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(whispr => 
        whispr.content.toLowerCase().includes(term)
      );
    }
    
    // Sort
    switch (sortOption) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'type':
        filtered.sort((a, b) => a.type.localeCompare(b.type));
        break;
      default:
        break;
    }
    
    setFilteredWhisprs(filtered);
  }, [whisprs, selectedType, sortOption, searchTerm]);
  
  // Mark whispr as read
  const markAsRead = async (whisprId: string) => {
    try {
      const { error } = await supabase
        .from('whisprs')
        .update({ is_read: true })
        .eq('id', whisprId);
      
      if (error) {
        console.error('Error marking whispr as read:', error);
        return;
      }
      
      // Update local state
      setWhisprs(whisprs.map(w => 
        w.id === whisprId ? { ...w, isRead: true } : w
      ));
    } catch (error) {
      console.error('Error in markAsRead:', error);
    }
  };
  
  // Handle view whispr
  const handleView = (whispr: Whispr) => {
    // If whispr is not read, mark it as read
    if (!whispr.isRead) {
      markAsRead(whispr.id);
    }
    
    // Open view modal
    setSelectedWhispr(whispr);
    setViewModalOpen(true);
  };
  
  // Handle share whispr
  const handleShare = (whispr: Whispr) => {
    // If whispr is not read, mark it as read
    if (!whispr.isRead) {
      markAsRead(whispr.id);
    }
    
    // Open view modal with share intent
    setSelectedWhispr(whispr);
    setViewModalOpen(true);
    
    // After a slight delay, trigger the share function in the modal
    // This is handled within the ViewWhisprModal component
  };
  
  // Handle delete whispr - using the new modal confirmation
  const handleDelete = async (whisprId: string) => {
    try {
      const { error } = await supabase
        .from('whisprs')
        .delete()
        .eq('id', whisprId);
      
      if (error) {
        console.error('Error deleting whispr:', error);
        toast.error('Failed to delete whispr');
        return;
      }
      
      // Update local state
      setWhisprs(whisprs.filter(w => w.id !== whisprId));
      toast.success('Whispr deleted successfully');
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast.error('Something went wrong');
    }
  };
  
  // Default display name and avatar fallbacks if profile is loading
  const displayName = profile?.display_name || user?.user_metadata?.username || 'User';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || '';
  const username = profile?.username || user?.user_metadata?.username || 'user';
  const profileUrl = `${baseProfileUrl}/${username}`;
  
  // Mobile view
  if (isMobile) {
    return (
      <>
        <div className="md:hidden h-screen">
          <MobileWhisprView
            whisprs={whisprs}
            stats={stats}
            displayName={displayName}
            avatarUrl={avatarUrl}
            onView={handleView}
            onShare={handleShare}
            onDelete={handleDelete}
          />
        </div>
        
        {/* View Modal */}
        {selectedWhispr && (
          <ViewWhisprModal
            whispr={selectedWhispr}
            isOpen={viewModalOpen}
            onClose={() => setViewModalOpen(false)}
            username={username}
            profileUrl={profileUrl}
          />
        )}
      </>
    );
  }
  
  // Desktop view
  return (
    <>
      <DashboardTemplate unreadCount={stats.unread}>
        <div className="flex flex-col h-full">
          <DashboardHeader
            displayName={displayName}
            unreadCount={stats.unread}
            avatarUrl={avatarUrl}
          />
          <div className="sticky top-0 pt-2 z-10 bg-white/1 backdrop-blur-sm transition-all">
            <div className="mb-4">
              <FilterControls
                viewMode={viewMode}
                setViewMode={setViewMode}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                sortOption={sortOption}
                setSortOption={setSortOption}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                typeOptions={typeOptions}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {viewMode === 'card' ? (
              <WhisprSwipeCard
                whisprs={filteredWhisprs}
                onView={handleView}
                onShare={handleShare}
                onDelete={handleDelete}
              />
            ) : (
              <WhisprList
                whisprs={filteredWhisprs}
                viewMode={viewMode}
                onView={handleView}
                onShare={handleShare}
                onDelete={handleDelete}
                isLoading={isLoading}
                searchTerm={searchTerm}
                totalWhisprs={stats.total}
              />
            )}
          </div>
        </div>
      </DashboardTemplate>
      
      {/* View Modal */}
      {selectedWhispr && (
        <ViewWhisprModal
          whispr={selectedWhispr}
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          username={username}
          profileUrl={profileUrl}
        />
      )}
    </>
  );
};

export default DashboardPage;