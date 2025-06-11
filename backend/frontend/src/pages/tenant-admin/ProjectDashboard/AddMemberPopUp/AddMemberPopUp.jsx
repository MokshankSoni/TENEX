import React, { useState, useEffect } from 'react';
import { FaTimes, FaSearch, FaUser, FaEnvelope, FaUserTag, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { AUTH_ENDPOINTS } from '../../../../config/apiEndpoints';
import { getToken, getTenantId } from '../../../../utils/storageUtils';
import './AddMemberPopUp.css';

const AddMemberPopUp = ({ onClose, onAddMember, existingAssignments = [] }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUserRole, setSelectedUserRole] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const fetchUsers = async () => {
    try {
      const token = getToken();
      const tenantId = getTenantId();
      
      const response = await axios.get(AUTH_ENDPOINTS.GET_ALL_USERS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-ID': tenantId
        }
      });
      
      // Debug logging
      console.log('Existing assignments:', existingAssignments);
      console.log('All users from API:', response.data);
      
      // Filter out users who are already assigned to the project
      // The userAssignments array contains objects with username and roleInProject
      const assignedUsernames = existingAssignments.map(assignment => {
        console.log('Assignment:', assignment);
        return assignment.username;
      });
      
      console.log('Assigned usernames:', assignedUsernames);
      
      const availableUsers = response.data.filter(user => {
        const isAssigned = assignedUsernames.includes(user.username);
        console.log(`User ${user.username} is assigned: ${isAssigned}`);
        return !isAssigned;
      });
      
      console.log('Available users after filtering:', availableUsers);
      
      setUsers(availableUsers);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleFilter = (e) => {
    setSelectedRole(e.target.value);
  };

  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'all' || 
                         user.roles.some(role => role.toLowerCase().includes(selectedRole.toLowerCase()));
      return matchesSearch && matchesRole;
    });
  };

  const formatRole = (roles) => {
    return roles.map(role => {
      const roleName = role.replace('ROLE_', '').toLowerCase();
      switch (roleName) {
        case 'tenant_admin':
          return 'Tenant Admin';
        case 'project_manager':
          return 'Project Manager';
        case 'team_member':
          return 'Team Member';
        case 'client':
          return 'Client';
        default:
          return roleName;
      }
    }).join(', ');
  };

  const getRoleColor = (roles) => {
    const role = roles[0]?.toLowerCase() || '';
    if (role.includes('tenant_admin')) return '#4CAF50';
    if (role.includes('project_manager')) return '#2196F3';
    if (role.includes('team_member')) return '#FF9800';
    if (role.includes('client')) return '#9C27B0';
    return '#718096';
  };

  const handleAddMember = (user) => {
    // Get the selected role or default to ROLE_TEAM_MEMBER
    const roleInProject = selectedUserRole[user.id] || 'ROLE_TEAM_MEMBER';
    onAddMember({ ...user, roleInProject });
  };

  const handleRoleSelect = (userId, role) => {
    setSelectedUserRole(prev => ({
      ...prev,
      [userId]: role
    }));
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ROLE_TENANT_ADMIN':
        return 'Tenant Admin';
      case 'ROLE_PROJECT_MANAGER':
        return 'Project Manager';
      case 'ROLE_TEAM_MEMBER':
        return 'Team Member';
      case 'ROLE_CLIENT':
        return 'Client';
      default:
        return role.replace('ROLE_', '');
    }
  };

  return (
    <div className="add-member-popup">
      <div className="popup-header">
        <h2>Add Team Member</h2>
        <button className="close-button" onClick={handleClose}>
          <FaTimes />
        </button>
      </div>
      
      <div className="popup-content">
        <div className="filters">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <select 
            className="role-filter"
            value={selectedRole}
            onChange={handleRoleFilter}
          >
            <option value="all">All Roles</option>
            <option value="ROLE_TENANT_ADMIN">Tenant Admin</option>
            <option value="ROLE_PROJECT_MANAGER">Project Manager</option>
            <option value="ROLE_TEAM_MEMBER">Team Member</option>
            <option value="ROLE_CLIENT">Client</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchUsers}>Retry</button>
          </div>
        ) : (
          <div className="users-list">
            {getFilteredUsers().map(user => (
              <div key={user.id} className="user-card">
                <div className="user-avatar">
                  <FaUser />
                </div>
                <div className="user-info">
                  <div className="user-header">
                    <h3>{user.username}</h3>
                    <span 
                      className="role-badge"
                      style={{ backgroundColor: getRoleColor(user.roles) }}
                    >
                      {formatRole(user.roles)}
                    </span>
                  </div>
                  <div className="user-details">
                    <div className="detail-item">
                      <FaEnvelope className="detail-icon" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div className="role-selection">
                    <select
                      value={selectedUserRole[user.id] || 'ROLE_TEAM_MEMBER'}
                      onChange={(e) => handleRoleSelect(user.id, e.target.value)}
                      className="role-select"
                    >
                      <option value="ROLE_TEAM_MEMBER">Team Member</option>
                      <option value="ROLE_PROJECT_MANAGER">Project Manager</option>
                      <option value="ROLE_CLIENT">Client</option>
                    </select>
                  </div>
                </div>
                <button 
                  className="add-button"
                  onClick={() => handleAddMember(user)}
                  title="Add to project"
                >
                  <FaPlus />
                  <span>Add</span>
                </button>
              </div>
            ))}
            {getFilteredUsers().length === 0 && (
              <div className="no-users-message">
                <FaUser className="no-users-icon" />
                <p>No users found matching your search criteria</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMemberPopUp; 