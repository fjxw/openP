import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { User } from '../../types';
import userService from '../../api/userService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';

const AdminUsers: React.FC = () => {
  const dispatch = useAppDispatch();
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
    role: UserRole.USER
  });
  
  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await userService.getAllUsers();
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
      role: UserRole.USER
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
      [name]: name === 'role' ? value as UserRole : value 
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (selectedUser) {
        // Update user role
        const updatedUser = await userService.updateUserRole(
          selectedUser.id, 
          formData.role
        );
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      } else {
        // Create new user
        const newUser = await userService.createUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        setUsers([...users, newUser]);
      }
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Failed to save user');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteUser = async (user: User) => {
    // Don't allow deleting yourself
    if (user.id === currentUser?.id) {
      setError("You cannot delete your own account");
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${user.username}?`)) {
      setIsLoading(true);
      setError(null);
      
      try {
        await userService.deleteUser(user.id);
        setUsers(users.filter(u => u.id !== user.id));
      } catch (err: any) {
        setError(err.message || 'Failed to delete user');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading && users.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          Create User
        </button>
      </div>
      
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className={user.id === currentUser?.id ? 'bg-base-200' : ''}>
                    <td>{user.id.substring(0, 8)}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className="badge badge-primary">{user.role}</div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline" 
                          onClick={() => openModal(user)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-error" 
                          onClick={() => handleDeleteUser(user)}
                          disabled={user.id === currentUser?.id}
                        >
                          Delete
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
      
      {/* User Form Modal */}
      <dialog id="user_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {selectedUser ? 'Edit User' : 'Create User'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input 
                type="text" 
                name="username" 
                className="input input-bordered" 
                value={formData.username}
                onChange={handleChange}
                disabled={!!selectedUser}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                name="email" 
                className="input input-bordered" 
                value={formData.email}
                onChange={handleChange}
                disabled={!!selectedUser}
                required
              />
            </div>
            
            {!selectedUser && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input 
                  type="password" 
                  name="password" 
                  className="input input-bordered" 
                  value={formData.password}
                  onChange={handleChange}
                  required={!selectedUser}
                />
              </div>
            )}
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select 
                name="role" 
                className="select select-bordered" 
                value={formData.role}
                onChange={handleChange}
                required
              >
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div className="modal-action">
              <button type="button" className="btn" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Save'}
              </button>
            </div>
          </form>
        </div>
        <div className="modal-backdrop" onClick={closeModal}></div>
      </dialog>
    </div>
  );
};

export default AdminUsers;
