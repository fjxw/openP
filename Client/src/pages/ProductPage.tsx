import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProductById, clearError } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentProduct, isLoading, error } = useAppSelector(state => state.products);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }
    
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(addToCart({ productId: currentProduct.id, quantity }));
    }
  };

  const incrementQuantity = () => {
    if (currentProduct && quantity < currentProduct.quantity) {
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

  if (!currentProduct) {
    return <Alert type="warning" message="Product not found" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Product Image */}
      <div className="flex justify-center">
        <img 
          src={currentProduct.image || "https://picsum.photos/600/400"} 
          alt={currentProduct.name} 
          className="rounded-lg shadow-lg object-cover max-h-96"
        />
      </div>
      
      {/* Product Details */}
      <div>
        <nav className="text-sm breadcrumbs mb-4">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li>{currentProduct.category}</li>
            <li className="text-primary">{currentProduct.name}</li>
          </ul>
        </nav>
        
        <h1 className="text-3xl font-bold">{currentProduct.name}</h1>
        
        <div className="mt-4">
          <span className="badge badge-outline">{currentProduct.category}</span>
          {currentProduct.quantity <= 5 && currentProduct.quantity > 0 && (
            <span className="badge badge-warning ml-2">Only {currentProduct.quantity} left</span>
          )}
          {currentProduct.quantity === 0 && (
            <span className="badge badge-error ml-2">Out of quantity</span>
          )}
        </div>
        
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-primary">${currentProduct.price.toFixed(2)}</h2>
        </div>
        
        <div className="divider"></div>
        
        <p className="mt-4">{currentProduct.description}</p>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Availability</h3>
          <p>
            {currentProduct.quantity > 0 
              ? `In quantity (${currentProduct.quantity} available)` 
              : "Out of quantity"}
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
              disabled={currentProduct.quantity <= quantity}
            >
              +
            </button>
          </div>
          
          <button 
            className="btn btn-primary ml-4" 
            onClick={handleAddToCart}
            disabled={currentProduct.quantity === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
