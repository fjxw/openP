import React, { useState, useEffect } from 'react';
import productService from '../../api/productService';

interface ProductImageProps {
  productId: number;
  alt: string;
  className?: string;
  fallbackImage?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({
  productId,
  alt,
  className = '',
  fallbackImage = "https://picsum.photos/300/300"
}) => {
  const [src, setSrc] = useState<string>(productService.getProductImage(productId));
  const [error, setError] = useState<boolean>(false);

  const handleError = () => {
    console.log(`Error loading image for product ${productId}, using fallback`);
    setError(true);
  };

  useEffect(() => {
    setSrc(productService.getProductImage(productId));
    setError(false);
  }, [productId]);

  return (
    <img
      src={error ? fallbackImage : src}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

export default ProductImage;
