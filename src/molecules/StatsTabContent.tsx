import React from 'react';

interface StatsData {
  totalViews: number;
  totalWhisprs: number;
  weeklyData: number[];
}

interface StatsTabContentProps {
  stats: StatsData;
}

const StatsTabContent: React.FC<StatsTabContentProps> = ({ stats }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
          <button className="text-primary text-sm">View more</button>
        </div>
        
        <div className="h-32 flex items-end justify-between">
          {stats.weeklyData.map((value, index) => (
            <div 
              key={index} 
              className="w-8 bg-gradient-primary rounded-t-sm" 
              style={{ height: `${value * 4}%` }}
            />
          ))}
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
    </div>
  );
};

export default StatsTabContent;