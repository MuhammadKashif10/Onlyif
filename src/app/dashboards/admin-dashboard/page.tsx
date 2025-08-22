'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Navbar, NotificationPanel } from '@/components';
import {
  Button,
  InputField,
  SearchBar,
  FilterBar,
  Pagination,
  Modal,
  Alert,
  Badge,
  Loader,
  Toggle
} from '@/components/reusable';
import { adminApi } from '@/api/admin';
import { AdminAnalytics, AdminUser, AdminListing, FlaggedContent, PaymentRecord, Assignment, TermsLog } from '@/types/api';
import { ADMIN_ROLES, FLAG_TYPES, FLAG_STATUS, PAYMENT_STATUS, PAYMENT_TYPES } from '@/utils/constants';

interface TabConfig {
  id: string;
  label: string;
  icon: string;
  color: string;
}

const TABS: TabConfig[] = [
  { id: 'analytics', label: 'Analytics Overview', icon: '📊', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'users', label: 'User Management', icon: '👥', color: 'bg-green-50 text-green-700 border-green-200' },
  { id: 'listings', label: 'Listing Management', icon: '🏠', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'flags', label: 'Flagged Content', icon: '🚩', color: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'payments', label: 'Payments', icon: '💳', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { id: 'assignments', label: 'Assignments', icon: '📋', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'terms', label: 'Terms & Conditions Logs', icon: '📄', color: 'bg-gray-50 text-gray-700 border-gray-200' }
];

function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data states
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [flags, setFlags] = useState<FlaggedContent[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [termsLogs, setTermsLogs] = useState<TermsLog[]>([]);

  // Filter states
  const [userFilters, setUserFilters] = useState({ role: '', q: '', sort: 'createdAt', page: 1 });
  const [listingFilters, setListingFilters] = useState({ status: '', q: '', sort: 'createdAt', page: 1 });
  const [flagFilters, setFlagFilters] = useState({ type: '', status: '', page: 1 });
  const [paymentFilters, setPaymentFilters] = useState({ status: '', from: '', to: '', page: 1 });
  const [assignmentFilters, setAssignmentFilters] = useState({ type: '', page: 1 });
  const [termsFilters, setTermsFilters] = useState({ role: '', version: '', page: 1 });

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login');
      return;
    }
    loadData();
  }, [isAdmin, activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      switch (activeTab) {
        case 'analytics':
          const analyticsRes = await adminApi.getAnalytics(user?.role);
          setAnalytics(analyticsRes.data);
          break;
        case 'users':
          const usersRes = await adminApi.getUsers(userFilters);
          setUsers(usersRes.data.users);
          break;
        case 'listings':
          const listingsRes = await adminApi.getListings(listingFilters);
          setListings(listingsRes.data.listings);
          break;
        case 'flags':
          const flagsRes = await adminApi.getFlags(flagFilters);
          setFlags(flagsRes.data.flags);
          break;
        case 'payments':
          const paymentsRes = await adminApi.getPayments(paymentFilters);
          setPayments(paymentsRes.data.payments);
          break;
        case 'assignments':
          const assignmentsRes = await adminApi.getAssignments(assignmentFilters);
          setAssignments(assignmentsRes.data.assignments);
          break;
        case 'terms':
          const termsRes = await adminApi.getTermsLogs(termsFilters);
          setTermsLogs(termsRes.data.logs);
          break;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action: string, userId: string, data?: any) => {
    try {
      setLoading(true);
      switch (action) {
        case 'suspend':
          await adminApi.suspendUser(userId, !data.active);
          setSuccess('User status updated successfully');
          break;
        case 'delete':
          await adminApi.deleteUser(userId);
          setSuccess('User deleted successfully');
          break;
      }
      loadData();
    } catch (err) {
      setError('Action failed');
    } finally {
      setLoading(false);
    }
  };

  const handleListingAction = async (action: string, listingId: string, data?: any) => {
    try {
      setLoading(true);
      switch (action) {
        case 'updateStatus':
          await adminApi.updateListingStatus(listingId, data.status);
          setSuccess('Listing status updated successfully');
          break;
        case 'delete':
          await adminApi.deleteListing(listingId);
          setSuccess('Listing deleted successfully');
          break;
      }
      loadData();
    } catch (err) {
      setError('Action failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFlagAction = async (flagId: string, action: string, reason: string) => {
    try {
      setLoading(true);
      await adminApi.handleFlag(flagId, action, reason);
      setSuccess('Flag handled successfully');
      loadData();
    } catch (err) {
      setError('Action failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentUpdate = async (assignmentId: string, data: any) => {
    try {
      setLoading(true);
      await adminApi.updateAssignment(assignmentId, data);
      setSuccess('Assignment updated successfully');
      loadData();
    } catch (err) {
      setError('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const renderAnalytics = () => (
    <div className="space-y-8">
      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Total Users</h3>
              <p className="text-3xl font-bold text-blue-900 mt-2">{analytics?.totalUsers.total || '1,247'}</p>
              <div className="mt-3 text-sm text-blue-700">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                    Buyers: {analytics?.totalUsers.buyers || '856'}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Sellers: {analytics?.totalUsers.sellers || '234'}
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                    Agents: {analytics?.totalUsers.agents || '157'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-4xl opacity-20">👥</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wide">Active Listings</h3>
              <p className="text-3xl font-bold text-green-900 mt-2">{analytics?.activeListings || '342'}</p>
              <p className="text-sm text-green-700 mt-3 flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Pending: {analytics?.pendingListings || '28'}
              </p>
            </div>
            <div className="text-4xl opacity-20">🏠</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Total Payments</h3>
              <p className="text-3xl font-bold text-purple-900 mt-2">${analytics?.totalPayments?.toLocaleString() || '125,670'}</p>
              <p className="text-sm text-purple-700 mt-3">This month</p>
            </div>
            <div className="text-4xl opacity-20">💳</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-lg border border-red-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide">Suspended Accounts</h3>
              <p className="text-3xl font-bold text-red-900 mt-2">{analytics?.suspendedAccounts || '12'}</p>
              <p className="text-sm text-red-700 mt-3">Requires attention</p>
            </div>
            <div className="text-4xl opacity-20">⚠️</div>
          </div>
        </div>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">User Growth</h3>
            <div className="text-2xl opacity-30">📈</div>
          </div>
          <div className="space-y-4">
            {(analytics?.userGrowth || [
              { date: '2024-01', buyers: 45, sellers: 12, agents: 8 },
              { date: '2024-02', buyers: 67, sellers: 18, agents: 11 },
              { date: '2024-03', buyers: 89, sellers: 25, agents: 15 },
              { date: '2024-04', buyers: 123, sellers: 35, agents: 19 },
              { date: '2024-05', buyers: 156, sellers: 42, agents: 23 },
              { date: '2024-06', buyers: 189, sellers: 48, agents: 28 }
            ]).map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium text-gray-700">{item.date}</span>
                <div className="flex space-x-6 text-sm">
                  <span className="flex items-center text-blue-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Buyers: {item.buyers}
                  </span>
                  <span className="flex items-center text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Sellers: {item.sellers}
                  </span>
                  <span className="flex items-center text-purple-600">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Agents: {item.agents}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Listings by Status</h3>
            <div className="text-2xl opacity-30">📊</div>
          </div>
          <div className="space-y-4">
            {(analytics?.listingsByStatus || [
              { status: 'public', count: 342 },
              { status: 'private', count: 89 },
              { status: 'draft', count: 23 },
              { status: 'sold', count: 156 }
            ]).map((item, index) => {
              const statusColors = {
                public: 'bg-green-100 text-green-800 border-green-200',
                private: 'bg-blue-100 text-blue-800 border-blue-200',
                draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                sold: 'bg-gray-100 text-gray-800 border-gray-200'
              };
              return (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full border ${statusColors[item.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                  <span className="text-lg font-bold text-gray-900">{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={userFilters.role}
            onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value, page: 1 })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Roles</option>
            <option value="buyer">Buyers</option>
            <option value="seller">Sellers</option>
            <option value="agent">Agents</option>
          </select>
          <SearchBar
            value={userFilters.q}
            onChange={(value) => setUserFilters({ ...userFilters, q: value, page: 1 })}
            placeholder="Search users..."
          />
          <select
            value={userFilters.sort}
            onChange={(e) => setUserFilters({ ...userFilters, sort: e.target.value, page: 1 })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="createdAt">Date Created</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
          </select>
          <Button onClick={loadData} variant="primary">Apply Filters</Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={user.type === 'agent' ? 'info' : 'default'}>
                    {user.type}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={user.active ? 'success' : 'error'}>
                    {user.active ? 'Active' : 'Suspended'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={user.active ? 'danger' : 'success'}
                      onClick={() => handleUserAction('suspend', user.id, user)}
                    >
                      {user.active ? 'Suspend' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setSelectedItem(user);
                        setModalType('deleteUser');
                        setShowModal(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderListings = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={listingFilters.status}
            onChange={(e) => setListingFilters({ ...listingFilters, status: e.target.value, page: 1 })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="sold">Sold</option>
          </select>
          <SearchBar
            value={listingFilters.q}
            onChange={(value) => setListingFilters({ ...listingFilters, q: value, page: 1 })}
            placeholder="Search listings..."
          />
          <select
            value={listingFilters.sort}
            onChange={(e) => setListingFilters({ ...listingFilters, sort: e.target.value, page: 1 })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="createdAt">Date Created</option>
            <option value="price">Price</option>
            <option value="title">Title</option>
          </select>
          <Button onClick={loadData} variant="primary">Apply Filters</Button>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {listings.map((listing) => (
              <tr key={listing.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                    <div className="text-sm text-gray-500">{listing.address}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{listing.ownerName}</td>
                <td className="px-6 py-4">
                  <Badge variant={listing.status === 'public' ? 'success' : listing.status === 'pending' ? 'warning' : 'default'}>
                    {listing.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">${listing.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleListingAction('updateStatus', listing.id, { status: e.target.value });
                          e.target.value = '';
                        }
                      }}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="">Change Status</option>
                      <option value="public">Approve</option>
                      <option value="private">Make Private</option>
                      <option value="pending">Set Pending</option>
                    </select>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setSelectedItem(listing);
                        setModalType('deleteListing');
                        setShowModal(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFlags = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={flagFilters.type}
            onChange={(e) => setFlagFilters({ ...flagFilters, type: e.target.value, page: 1 })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Types</option>
            {Object.values(FLAG_TYPES).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={flagFilters.status}
            onChange={(e) => setFlagFilters({ ...flagFilters, status: e.target.value, page: 1 })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Status</option>
            {Object.values(FLAG_STATUS).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <Button onClick={loadData} variant="primary">Apply Filters</Button>
        </div>
      </div>

      {/* Flags Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reporter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {flags.map((flag) => (
              <tr key={flag.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{flag.contentTitle}</div>
                    <div className="text-sm text-gray-500">{flag.reason}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="warning">{flag.type}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{flag.reporterName}</td>
                <td className="px-6 py-4">
                  <Badge variant={flag.status === 'resolved' ? 'success' : flag.status === 'dismissed' ? 'default' : 'warning'}>
                    {flag.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {flag.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleFlagAction(flag.id, 'approve', 'Content approved by admin')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleFlagAction(flag.id, 'remove', 'Content removed due to violation')}
                      >
                        Remove
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleFlagAction(flag.id, 'dismiss', 'Flag dismissed as invalid')}
                      >
                        Dismiss
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={paymentFilters.status}
            onChange={(e) => setPaymentFilters({ ...paymentFilters, status: e.target.value, page: 1 })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Status</option>
            {Object.values(PAYMENT_STATUS).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <InputField
            type="date"
            value={paymentFilters.from}
            onChange={(e) => setPaymentFilters({ ...paymentFilters, from: e.target.value, page: 1 })}
            placeholder="From Date"
          />
          <InputField
            type="date"
            value={paymentFilters.to}
            onChange={(e) => setPaymentFilters({ ...paymentFilters, to: e.target.value, page: 1 })}
            placeholder="To Date"
          />
          <Button onClick={loadData} variant="primary">Apply Filters</Button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{payment.transactionId}</div>
                    <div className="text-sm text-gray-500">{payment.type}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{payment.userName}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">${payment.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <Badge variant={payment.status === 'completed' ? 'success' : payment.status === 'failed' ? 'danger' : 'warning'}>
                    {payment.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={assignmentFilters.type}
            onChange={(e) => setAssignmentFilters({ ...assignmentFilters, type: e.target.value, page: 1 })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Types</option>
            <option value="inspection">Inspections</option>
            <option value="valuation">Valuations</option>
            <option value="listing">Listings</option>
          </select>
          <Button onClick={loadData} variant="primary">Apply Filters</Button>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{assignment.type}</div>
                    <div className="text-sm text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{assignment.agentName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{assignment.propertyAddress}</td>
                <td className="px-6 py-4">
                  <Badge variant={assignment.status === 'completed' ? 'success' : assignment.status === 'in_progress' ? 'warning' : 'secondary'}>
                    {assignment.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAssignmentUpdate(assignment.id, { status: e.target.value });
                        e.target.value = '';
                      }
                    }}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="">Change Status</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTermsLogs = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={termsFilters.role}
            onChange={(e) => setTermsFilters({ ...termsFilters, role: e.target.value, page: 1 })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Roles</option>
            <option value="buyer">Buyers</option>
            <option value="seller">Sellers</option>
            <option value="agent">Agents</option>
          </select>
          <InputField
            value={termsFilters.version}
            onChange={(e) => setTermsFilters({ ...termsFilters, version: e.target.value, page: 1 })}
            placeholder="Version"
          />
          <Button onClick={loadData} variant="primary">Apply Filters</Button>
        </div>
      </div>

      {/* Terms Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {termsLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                    <div className="text-sm text-gray-500">{log.userRole}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{log.version}</td>
                <td className="px-6 py-4">
                  <Badge variant={log.action === 'accepted' ? 'success' : 'warning'}>
                    {log.action}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(log.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics': return renderAnalytics();
      case 'users': return renderUsers();
      case 'listings': return renderListings();
      case 'flags': return renderFlags();
      case 'payments': return renderPayments();
      case 'assignments': return renderAssignments();
      case 'terms': return renderTermsLogs();
      default: return renderAnalytics();
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar
        logo="/logo.svg"
        logoText=""
        navigationItems={[
          { label: 'Dashboard', href: '/dashboards/admin-dashboard', active: true },
          { label: 'Settings', href: '/admin/settings' },
          { label: 'Logout', href: '/admin/login' }
        ]}
      />

      {/* Enhanced main container with better spacing */}
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with better typography */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-lg text-gray-600">Manage users, listings, and platform operations</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Welcome back, <span className="font-semibold text-gray-900">{user?.name || 'Admin User'}</span>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Alerts with better styling */}
        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError('')} 
            className="mb-8 shadow-lg border-l-4 border-red-500" 
          />
        )}
        {success && (
          <Alert 
            type="success" 
            message={success} 
            onClose={() => setSuccess('')} 
            className="mb-8 shadow-lg border-l-4 border-green-500" 
          />
        )}

        {/* Enhanced Tabs with modern design */}
        <div className="mb-10">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2">
            <nav className="flex space-x-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3 text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Enhanced Content with better loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader />
            <p className="text-gray-500 mt-4">Loading dashboard data...</p>
          </div>
        ) : (
          <div className="animate-fadeIn">
            {renderTabContent()}
          </div>
        )}

        {/* Enhanced Confirmation Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Confirm Action"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Are you sure?</h3>
                <p className="text-gray-600 mt-1">
                  {modalType === 'deleteUser' && `This will permanently delete user "${selectedItem?.name}". This action cannot be undone.`}
                  {modalType === 'deleteListing' && `This will permanently delete listing "${selectedItem?.title}". This action cannot be undone.`}
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setShowModal(false)}
                className="px-6 py-2"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (modalType === 'deleteUser') {
                    handleUserAction('delete', selectedItem.id);
                  } else if (modalType === 'deleteListing') {
                    handleListingAction('delete', selectedItem.id);
                  }
                  setShowModal(false);
                }}
                className="px-6 py-2"
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </Modal>
      </div>

      <NotificationPanel />
      
      {/* Add custom styles */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;