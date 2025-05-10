import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchProducts, 
  fetchCategories, 
  createProduct, 
  updateProduct,
  deleteProduct,
  clearError,
  uploadProductImage
} from '../../store/slices/productsSlice';
import type { Product } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import productService from '../../api/productService';
import { translateCategoryToRussian } from '../../utils/translations';

const AdminProducts: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, categories, isLoading, error } = useAppSelector(state => state.products);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    image: null as File | null
  });
  
  useEffect(() => {
    dispatch(fetchProducts({ pageNumber: 1, pageSize: 100 }));
    dispatch(fetchCategories());
  }, [dispatch]);
  
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      category: '',
      image: null
    });
    setSelectedProduct(null);
  };
  
  const openModal = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        category: product.category,
        image: null
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category
      };
      
      let productId;
      
      if (selectedProduct) {
        // Обновляем информацию о продукте
        const result = await dispatch(updateProduct({
          id: selectedProduct.productId,
          productData: productData
        }));
        
        // Получаем ID продукта из результата
        if (updateProduct.fulfilled.match(result)) {
          productId = result.payload.productId;
        }
      } else {
        // Создаем новый продукт
        const result = await dispatch(createProduct(productData));
        
        // Получаем ID продукта из результата
        if (createProduct.fulfilled.match(result)) {
          productId = result.payload.productId;
        }
      }
      
      // Загружаем изображение, если оно выбрано и у нас есть ID продукта
      if (formData.image && productId) {
        await dispatch(uploadProductImage({
          id: productId,
          imageFile: formData.image
        }));
      }
      
      closeModal();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  const handleDelete = async (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      await dispatch(deleteProduct(product.productId));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление товарами</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          Добавить товар
        </button>
      </div>
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => dispatch(clearError())} 
        />
      )}
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Изображение</th>
                <th>Название</th>
                <th>Категория</th>
                <th>Цена</th>
                <th>Количество</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.productId}>
                  <td>
                    <div className="avatar">
                      <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                        <img 
                          src={productService.getProductImage(product.productId) || "https://picsum.photos/100/100"} 
                          alt={product.name}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-bold">{product.name}</div>
                    <div className="text-sm line-clamp-1">{product.description}</div>
                  </td>
                  <td>{translateCategoryToRussian(product.category)}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <div className="flex gap-2">
                      <button 
                        className="btn btn-sm btn-outline" 
                        onClick={() => openModal(product)}
                      >
                        Изменить
                      </button>
                      <button 
                        className="btn btn-sm btn-error" 
                        onClick={() => handleDelete(product)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Product Form Modal */}
      <dialog id="product_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg">
            {selectedProduct ? 'Изменить товар' : 'Добавить товар'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Название товара</span>
              </label>
              <input 
                type="text" 
                name="name" 
                className="input input-bordered" 
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Описание</span>
              </label>
              <textarea 
                name="description" 
                className="textarea textarea-bordered h-24" 
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Цена</span>
                </label>
                <input 
                  type="number" 
                  name="price" 
                  step="0.01" 
                  min="0" 
                  className="input input-bordered" 
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Количество</span>
                </label>
                <input 
                  type="number" 
                  name="quantity" 
                  min="0" 
                  className="input input-bordered" 
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Категория</span>
              </label>
              <select 
                name="category" 
                className="select select-bordered" 
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Выберите категорию</option>
                {(categories || []).map(category => (
                  <option key={category} value={category}>
                    {translateCategoryToRussian(category)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Изображение</span>
              </label>
              <input 
                type="file" 
                className="file-input file-input-bordered" 
                accept="image/*"
                onChange={handleImageChange}
                required={!selectedProduct}
              />
              {selectedProduct && !formData.image && (
                <label className="label">
                  <span className="label-text-alt">Оставьте пустым, чтобы сохранить текущее изображение</span>
                </label>
              )}
            </div>
            
            <div className="modal-action">
              <button type="button" className="btn" onClick={closeModal}>Отмена</button>
              <button type="submit" className="btn btn-primary">Сохранить</button>
            </div>
          </form>
        </div>
        <div className="modal-backdrop" onClick={closeModal}></div>
      </dialog>
    </div>
  );
};

export default AdminProducts;
