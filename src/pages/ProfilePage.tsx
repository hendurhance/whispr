import React from 'react';
import DashboardTemplate from '../templates/DashboardTemplate';

const ProfilePage: React.FC = () => (
  <DashboardTemplate>
    <h1 className="text-3xl font-bold text-text-bright mb-8">Your Profile</h1>
    {/* Profile content will go here */}
  </DashboardTemplate>
);

export default ProfilePage;