import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
      <p className="mb-8">You don't have permission to access this page.</p>
      <Link to="/" className="btn btn-primary">
        Back to Homepage
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
