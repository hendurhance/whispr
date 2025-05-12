import React from 'react';
import { useParams } from 'react-router-dom';
import PublicTemplate from '../templates/PublicTemplate';

const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  
  return (
    <PublicTemplate>
      <h1 className="text-3xl font-bold text-text-bright mb-8">
        Send anonymous messages to @{username}
      </h1>
      {/* Public profile message form will go here */}
    </PublicTemplate>
  );
};

export default PublicProfilePage;