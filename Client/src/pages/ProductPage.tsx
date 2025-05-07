import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProduct, clearProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { product, isLoading, error } = useAppSelector(state => state.products);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
    
    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ productId: product.id, quantity }));
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!product) {
    return <Alert type="warning" message="Product not found" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Product Image */}
      <div className="flex justify-center">
        <img 
          src={product.image || "https://picsum.photos/600/400"} 
          alt={product.name} 
          className="rounded-lg shadow-lg object-cover max-h-96"
        />
      </div>
      
      {/* Product Details */}
      <div>
        <nav className="text-sm breadcrumbs mb-4">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li>{product.category}</li>
            <li className="text-primary">{product.name}</li>
          </ul>
        </nav>
        
        <h1 className="text-3xl font-bold">{product.name}</h1>
        
        <div className="mt-4">
          <span className="badge badge-outline">{product.category}</span>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="badge badge-warning ml-2">Only {product.stock} left</span>
          )}
          {product.stock === 0 && (
            <span className="badge badge-error ml-2">Out of stock</span>
          )}
        </div>
        
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</h2>
        </div>
        
        <div className="divider"></div>
        
        <p className="mt-4">{product.description}</p>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Availability</h3>
          <p>
            {product.stock > 0 
              ? `In Stock (${product.stock} available)` 
              : "Out of stock"}
          </p>
        </div>
        
        <div className="mt-8 flex items-center">
          <div className="join">
            <button 
              className="btn btn-sm join-item" 
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              -
            </button>
            <input 
              type="text" 
              className="input input-bordered input-sm join-item w-16 text-center" 
              value={quantity} 
              readOnly
            />
            <button 
              className="btn btn-sm join-item" 
              onClick={incrementQuantity}
              disabled={product.stock <= quantity}
            >
              +
            </button>
          </div>
          
          <button 
            className="btn btn-primary ml-4" 
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

export default ProductPage;
