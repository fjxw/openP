import React, { useState } from 'react';
import productService from '../../api/productService';

const AdminProductForm: React.FC<{ productId?: number }> = ({ productId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    setIsUploading(true);

    try {
      if (productId) {
        await productService.uploadProductImage(productId, file);

        const timestamp = new Date().getTime();
        setImageSrc(`${productService.getProductImage(productId)}?t=${timestamp}`);

        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error);
      setUploadError('Не удалось загрузить изображение.');
      setTimeout(() => setUploadError(null), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Изображение товара</span>
      </label>
      <input
        type="file"
        className="file-input file-input-bordered w-full"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={isUploading || !productId}
      />
      {isUploading && <span className="loading loading-spinner loading-md mt-2"></span>}
      {uploadSuccess && <div className="text-success mt-2">Изображение успешно загружено!</div>}
      {uploadError && <div className="text-error mt-2">{uploadError}</div>}
      {imageSrc && (
        <div className="mt-4">
          <img
            src={imageSrc}
            alt="Product"
            className="w-40 h-40 object-cover rounded-md border"
          />
        </div>
      )}
    </div>
  );
};

export default AdminProductForm;