import React from 'react';
import { Link } from 'react-router';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold mb-4">Доступ запрещен</h1>
      <p className="mb-8">У вас нет прав доступа к этой странице.</p>
      <Link to="/" className="btn btn-primary">
        На главную
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
