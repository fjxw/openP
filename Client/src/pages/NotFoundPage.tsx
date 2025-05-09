import React from 'react';
import { Link } from 'react-router';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center py-5">
        <h1 className="text-9xl font-bold mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-2">
          Страница не найдена
        </h2>
        <p className="text-base opacity-75 mb-8">
          Запрашиваемая страница не существует или была перемещена.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
