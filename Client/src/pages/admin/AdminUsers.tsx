import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import type { User } from '../../types';
import userService from '../../api/userService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import { translateRoleToRussian } from '../../utils/translations';

const AdminUsers: React.FC = () => {
  const { user: currentUser } = useAppSelector(state => state.auth);
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'User'  
  });
  const [updatingUser, setUpdatingUser] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'User' 
    });
    setSelectedUser(null);
  };
  
  const openModal = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (selectedUser) {
        const userId = selectedUser.userId;
        setUpdatingUser(userId);
        
        const result = await userService.updateUserById(
          userId,
          { role: formData.role }
        );
        
        setUsers(users.map(u => 
          u.userId === userId 
            ? {...u, role: formData.role} 
            : u
        ));
        
        closeModal();
      } else {
        const newUser = await userService.createUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        
        setUsers([...users, newUser]);
        closeModal();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save user');
    } finally {
      setIsLoading(false);
      setUpdatingUser(null);
    }
  };
  
  const handleDeleteUser = async (user: User) => {
    if (user.userId === currentUser?.userId) {
      setError("You cannot delete your own account");
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${user.username}?`)) {
      setIsLoading(true);
      setError(null);
      setUpdatingUser(user.userId);
      
      try {
        await userService.deleteUser(user.userId);
        setUsers(users.filter(u => u.userId !== user.userId));
      } catch (err: any) {
        setError(err.message || 'Failed to delete user');
      } finally {
        setIsLoading(false);
        setUpdatingUser(null);
      }
    }
  };

  if (isLoading && users.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление пользователями</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          Создать пользователя
        </button>
      </div>
      
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя пользователя</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.userId} className={user.userId === currentUser?.userId ? 'bg-base-200' : ''}>
                    <td>{user.userId.toString()}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className="badge badge-primary">{translateRoleToRussian(user.role)}</div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline" 
                          onClick={() => openModal(user)}
                          disabled={updatingUser === user.userId}
                        >
                          {updatingUser === user.userId ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            'Изменить'
                          )}
                        </button>
                        <button 
                          className="btn btn-sm btn-error" 
                          onClick={() => handleDeleteUser(user)}
                          disabled={user.userId === currentUser?.userId || updatingUser === user.userId}
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
        </div>
      </div>
      
      <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-xl mb-6">
            {selectedUser ? 'Изменить пользователя' : 'Создать пользователя'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <div className="text-sm font-medium mb-2">Имя пользователя</div>
              <input 
                type="text" 
                name="username" 
                className="input input-bordered w-full" 
                value={formData.username}
                onChange={handleChange}
                disabled={!!selectedUser}
                required
              />
            </div>
            
            <div className="form-control">
              <div className="text-sm font-medium mb-2">Email</div>
              <input 
                type="email" 
                name="email" 
                className="input input-bordered w-full" 
                value={formData.email}
                onChange={handleChange}
                disabled={!!selectedUser}
                required
              />
            </div>
            
            {!selectedUser && (
              <div className="form-control">
                <div className="text-sm font-medium mb-2">Пароль</div>
                <input 
                  type="password" 
                  name="password" 
                  className="input input-bordered w-full" 
                  value={formData.password}
                  onChange={handleChange}
                  required={!selectedUser}
                />
              </div>
            )}
            
            <div className="form-control">
              <div className="text-sm font-medium mb-2">Роль</div>
              <select 
                name="role" 
                className="select select-bordered w-full" 
                value={formData.role}
                onChange={handleChange}
                required
              >
                {['User', 'Admin'].map(role => (
                  <option key={role} value={role}>{translateRoleToRussian(role)}</option>
                ))}
              </select>
            </div>
            
            <div className="modal-action mt-8">
              <button type="button" className="btn" onClick={closeModal}>Отмена</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
        <div className="modal-backdrop" onClick={closeModal}></div>
      </div>
    </div>
  );
};

export default AdminUsers;
