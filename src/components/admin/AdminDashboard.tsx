import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';
import {
  Users, Upload, Activity, BarChart3, HardDrive, TrendingUp,
  UserX, Shield, Eye, Trash2, RefreshCw, CheckCircle, Database,
  Clock, Download, File
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FirestoreUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt?: { toDate?: () => Date } | Date;
  lastLogin?: { toDate?: () => Date } | Date;
  photoURL?: string;
}

interface FirestoreUpload {
  id: string;
  userId: string;
  userEmail: string;
  fileName: string;
  fileSize: number;
  rows: number;
  columns: number;
  uploadDate?: { toDate?: () => Date } | Date;
  storageUrl?: string;
  datasetId: string;
}

function toDate(val: unknown): Date {
  if (!val) return new Date();
  if (val instanceof Date) return val;
  if (typeof val === 'object' && 'toDate' in (val as object) && typeof (val as { toDate: unknown }).toDate === 'function') {
    return (val as { toDate: () => Date }).toDate();
  }
  return new Date();
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [uploads, setUploads] = useState<FirestoreUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'uploads'>('overview');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [usersSnap, uploadsSnap] = await Promise.all([
        getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'uploads'), orderBy('uploadDate', 'desc'))),
      ]);
      setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() } as FirestoreUser)));
      setUploads(uploadsSnap.docs.map(d => ({ id: d.id, ...d.data() } as FirestoreUpload)));
    } catch (err) {
      console.error('Admin load error:', err);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast.success('Data refreshed!');
  };

  const handlePromote = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as 'user' | 'admin' } : u));
      toast.success(`User ${newRole === 'admin' ? 'promoted to admin' : 'demoted to user'}`);
    } catch { toast.error('Failed to update role'); }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!window.confirm(`Delete user "${name}"? This removes their profile from the database.`)) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('User deleted from database');
    } catch { toast.error('Failed to delete user'); }
  };

  const handleDeleteUpload = async (uploadId: string, fileName: string) => {
    if (!window.confirm(`Delete upload record for "${fileName}"?`)) return;
    try {
      await deleteDoc(doc(db, 'uploads', uploadId));
      setUploads(prev => prev.filter(u => u.id !== uploadId));
      toast.success('Upload record deleted');
    } catch { toast.error('Failed to delete upload'); }
  };

  const totalStorage = uploads.reduce((sum, u) => sum + (u.fileSize || 0), 0);
  const activeUsers = users.filter(u => {
    const d = toDate(u.lastLogin);
    return Date.now() - d.getTime() < 24 * 60 * 60 * 1000;
  }).length;

  const statCards = [
    { title: 'Total Users', value: users.length, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/20', border: 'border-indigo-500/30', trend: `${users.filter(u => u.role === 'admin').length} admins` },
    { title: 'Total Uploads', value: uploads.length, icon: Upload, color: 'text-violet-400', bg: 'bg-violet-500/20', border: 'border-violet-500/30', trend: `${formatBytes(totalStorage)} total` },
    { title: 'Active Today', value: activeUsers, icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', trend: 'last 24 hours' },
    { title: 'Storage Used', value: formatBytes(totalStorage), icon: HardDrive, color: 'text-pink-400', bg: 'bg-pink-500/20', border: 'border-pink-500/30', trend: `${uploads.length} files` },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto" />
          <p className="text-slate-400">Loading admin data from Firebase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-slate-400">Real-time data from Firebase Firestore</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="flex items-center space-x-2">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-400">Admin Access</span>
          </div>
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-medium">Firebase Connected — System Operational</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center space-x-1">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>Firestore: Online</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Access Info */}
      <Card className="border-indigo-500/40 bg-indigo-500/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-white font-semibold mb-1">🔐 Admin Panel Access</p>
              <p className="text-slate-400">The Admin tab is visible only to users with <code className="bg-indigo-500/20 text-indigo-300 px-1 rounded">role: "admin"</code> in Firestore.</p>
              <p className="text-slate-400 mt-1">To promote a user to admin: Go to <strong className="text-white">Users</strong> tab → click the <Shield className="w-3 h-3 inline text-indigo-400" /> button next to any user. The email <code className="bg-indigo-500/20 text-indigo-300 px-1 rounded">vansh6dec@gmail.com</code> is automatically admin on first login.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-indigo-500/20">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'users', label: `Users (${users.length})`, icon: Users },
            { id: 'uploads', label: `Uploads (${uploads.length})`, icon: Upload },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === tab.id
                  ? 'border-indigo-400 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${stat.bg} border ${stat.border}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.trend}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Uploads */}
          <Card>
            <CardHeader>
              <CardTitle>Recent File Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uploads.slice(0, 5).map((upload) => (
                  <div key={upload.id} className="flex items-center justify-between p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                    <div className="flex items-center space-x-3">
                      <File className="w-8 h-8 text-indigo-400" />
                      <div>
                        <p className="font-medium text-white text-sm">{upload.fileName}</p>
                        <p className="text-xs text-slate-400">{upload.userEmail} · {upload.rows} rows · {formatBytes(upload.fileSize)}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{formatDistanceToNow(toDate(upload.uploadDate), { addSuffix: true })}</span>
                  </div>
                ))}
                {uploads.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No uploads yet</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {selectedTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>User Management — Firebase Auth + Firestore</CardTitle>
            <p className="text-sm text-slate-400">All registered users from Firestore /users collection</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-indigo-500/20">
                    {['User', 'Role', 'Joined', 'Last Login', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 font-medium text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isOnline = Date.now() - toDate(user.lastLogin).getTime() < 30 * 60 * 1000;
                    return (
                      <tr key={user.id} className="border-b border-indigo-500/10 hover:bg-indigo-500/5 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="text-slate-400 text-xs">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-500/20 text-slate-400'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-xs">{formatDistanceToNow(toDate(user.createdAt), { addSuffix: true })}</td>
                        <td className="py-3 px-4 text-slate-400 text-xs">{formatDistanceToNow(toDate(user.lastLogin), { addSuffix: true })}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`} />
                            <span className={`text-xs ${isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>{isOnline ? 'Online' : 'Offline'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handlePromote(user.id, user.role)} title={user.role === 'admin' ? 'Demote to user' : 'Promote to admin'}>
                              <Shield className="w-4 h-4" />
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id, user.name)} title="Delete user">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-center text-slate-500 py-8">No users registered yet</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploads Tab */}
      {selectedTab === 'uploads' && (
        <Card>
          <CardHeader>
            <CardTitle>File Upload History — Firebase Storage + Firestore</CardTitle>
            <p className="text-sm text-slate-400">All uploaded files from Firestore /uploads collection</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploads.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between p-4 glass rounded-xl border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                      <BarChart3 className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{upload.fileName}</p>
                      <p className="text-sm text-slate-400">{upload.userEmail} · {upload.rows?.toLocaleString()} rows · {upload.columns} cols · {formatBytes(upload.fileSize)}</p>
                      <p className="text-xs text-slate-500">{formatDistanceToNow(toDate(upload.uploadDate), { addSuffix: true })}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {upload.storageUrl && (
                      <Button variant="outline" size="sm" onClick={() => window.open(upload.storageUrl, '_blank')} title="Download file">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => toast.info(`Dataset ID: ${upload.datasetId}`)} title="View details">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteUpload(upload.id, upload.fileName)} title="Delete record">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {uploads.length === 0 && <p className="text-center text-slate-500 py-8">No files uploaded yet</p>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};