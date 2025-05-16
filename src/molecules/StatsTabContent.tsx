import React, { useState } from 'react';
import GenericModal from '../atoms/GenericModal';

interface StatsData {
  totalViews: number;
  totalWhisprs: number;
  weeklyData: number[];
}

interface StatsTabContentProps {
  stats: StatsData;
}

const StatsTabContent: React.FC<StatsTabContentProps> = ({ stats }) => {
  const [showModal, setShowModal] = useState(false);
  
  // Fixed day labels in the original order
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Get the max value for percentage calculation
  const maxValue = Math.max(...stats.weeklyData, 1); // Use at least 1 to avoid division by zero
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-background-darkest rounded-lg p-4">
          <p className="text-text-muted text-sm mb-1">Total Views</p>
          <p className="text-2xl font-bold text-text-bright">{stats.totalViews}</p>
        </div>
        <div className="bg-background-darkest rounded-lg p-4">
          <p className="text-text-muted text-sm mb-1">Whisprs Received</p>
          <p className="text-2xl font-bold text-text-bright">{stats.totalWhisprs}</p>
        </div>
      </div>
      
      <div className="bg-background-darkest rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-text-muted text-sm">Last 7 days</p>
          <button 
            className="text-primary text-sm"
            onClick={() => setShowModal(true)}
          >
            View more
          </button>
        </div>
        
        <div className="h-32 flex items-end justify-between">
          {stats.weeklyData.map((value, index) => {
            const percentage = value === 0 ? 0 : Math.max(4, (value / maxValue) * 100);
            return (
              <div 
                key={index} 
                className="w-8 bg-gradient-primary rounded-t-sm" 
                style={{ height: `${percentage}%` }}
              />
            );
          })}
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-text-muted">
          {daysOfWeek.map(day => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
      
      <p className="text-text-muted text-sm">
        Upgrade to Whispr Pro to access detailed analytics and performance data.
      </p>
      
      {/* Coming Soon Modal */}
      {showModal && (
        <GenericModal
          title="Coming Soon"
          onCancel={() => setShowModal(false)}
          cancelText="Close"
        >
          <div className="text-center">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-text-bright mb-2">Detailed Analytics</p>
            <p className="text-text-muted">
              Advanced analytics and detailed reports will be available in the next update. 
            Stay tuned for more powerful insights!
            </p>
          </div>
        </GenericModal>
      )}
    </div>
  );
};

export default StatsTabContent;