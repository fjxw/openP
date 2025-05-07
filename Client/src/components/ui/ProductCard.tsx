import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
        <img 
          src={product.image || "https://picsum.photos/300/200"} 
          alt={product.name} 
          className="h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {product.name}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="badge badge-warning">Low stock</div>
          )}
          {product.stock === 0 && (
            <div className="badge badge-error">Out of stock</div>
          )}
        </h2>
        <p className="text-sm line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">{product.category}</span>
        </div>
        <div className="card-actions justify-end mt-3">
          <Link to={`/products/${product.id}`} className="btn btn-sm btn-outline">
            Details
          </Link>
          <button 
            className="btn btn-sm btn-primary" 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
