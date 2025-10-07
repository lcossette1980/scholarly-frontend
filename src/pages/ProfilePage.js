// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import {
  User,
  CreditCard,
  Shield,
  Trash2,
  Edit,
  Save,
  X,
  Settings,
  Crown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createCustomerPortalSession, manuallyActivateSubscription, fixSubscription, SUBSCRIPTION_PLANS } from '../services/stripe';
import { getUserBibliographyEntries } from '../services/bibliography';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { currentUser, userDocument, refreshUserDocument } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    researchFocus: userDocument?.preferences?.researchFocus || '',
    notificationsEnabled: userDocument?.preferences?.notificationsEnabled ?? true
  });

  // Fetch user entries for stats
  useEffect(() => {
    const fetchEntries = async () => {
      if (!currentUser) return;

      try {
        const response = await getUserBibliographyEntries(currentUser.uid, 100); // Get up to 100 for accurate stats
        if (response?.success && response?.entries) {
          setEntries(response.entries);
        } else {
          setEntries([]);
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
        setEntries([]);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchEntries();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: formData.displayName
      });

      // Update Firestore user document
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        'preferences.researchFocus': formData.researchFocus,
        'preferences.notificationsEnabled': formData.notificationsEnabled,
        updatedAt: new Date()
      });

      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      await createCustomerPortalSession(currentUser.uid);
    } catch (error) {
      console.error('Error opening billing portal:', error);
      toast.error('Failed to open billing portal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFixSubscription = async () => {
    setIsLoading(true);
    try {
      const result = await fixSubscription(currentUser.uid);

      if (result.status === 'fixed') {
        toast.success('Subscription fixed! Refreshing...');
        await refreshUserDocument();
        window.location.reload(); // Force page reload to show updated data
      } else if (result.status === 'already_fixed') {
        toast.success('Subscription already has unlimited entries!');
      } else {
        toast.info(result.message);
      }
    } catch (error) {
      console.error('Error fixing subscription:', error);
      toast.error('Failed to fix subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      displayName: currentUser?.displayName || '',
      researchFocus: userDocument?.preferences?.researchFocus || '',
      notificationsEnabled: userDocument?.preferences?.notificationsEnabled ?? true
    });
    setIsEditing(false);
  };



  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date.seconds * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal font-playfair mb-2">
            Profile Settings
          </h1>
          <p className="text-charcoal/70 font-lato">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-chestnut/10 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-chestnut" />
                  </div>
                  <h2 className="text-xl font-bold text-charcoal font-playfair">
                    Basic Information
                  </h2>
                </div>
                
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="btn btn-outline"
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="form-label">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="displayName"
                      className="form-input"
                      value={formData.displayName}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-charcoal font-lato py-2">
                      {currentUser?.displayName || 'Not set'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="form-label">Email Address</label>
                  <p className="text-charcoal font-lato py-2">
                    {currentUser?.email}
                  </p>
                  <p className="text-sm text-charcoal/60 font-lato">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <div>
                  <label className="form-label">Research Focus</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="researchFocus"
                      className="form-input"
                      placeholder="e.g., AI Leadership, Digital Transformation"
                      value={formData.researchFocus}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-charcoal font-lato py-2">
                      {userDocument?.preferences?.researchFocus || 'Not set'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="form-label">Account Created</label>
                  <p className="text-charcoal font-lato py-2">
                    {formatDate(userDocument?.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-chestnut/10 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-chestnut" />
                </div>
                <h2 className="text-xl font-bold text-charcoal font-playfair">
                  Preferences
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-charcoal font-lato">Email Notifications</h3>
                    <p className="text-sm text-charcoal/60 font-lato">
                      Receive updates about your bibliography entries and account
                    </p>
                  </div>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      name="notificationsEnabled"
                      className="w-4 h-4 text-chestnut border-khaki/30 rounded focus:ring-chestnut"
                      checked={formData.notificationsEnabled}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      userDocument?.preferences?.notificationsEnabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {userDocument?.preferences?.notificationsEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  )}
                </div>
              </div>
            </div>


            {/* Danger Zone */}
            <div className="card border-red-200 bg-red-50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-red-800 font-playfair">
                  Danger Zone
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-red-700 font-lato">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="btn bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Info */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-chestnut/10 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-chestnut" />
                </div>
                <h3 className="text-lg font-bold text-charcoal font-playfair">
                  Subscription
                </h3>
              </div>

              {userDocument?.subscription && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-charcoal/60 font-lato">Current Plan</p>
                    <p className="font-semibold text-charcoal font-lato capitalize">
                      {userDocument.subscription.plan}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-charcoal/60 font-lato">Usage this month</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 bg-khaki/30 rounded-full h-2">
                        <div
                          className="bg-chestnut h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              (userDocument.subscription.entriesUsed / userDocument.subscription.entriesLimit) * 100,
                              100
                            )}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-charcoal">
                        {userDocument.subscription.entriesUsed} / {
                          userDocument.subscription.entriesLimit === -1 
                            ? '∞' 
                            : userDocument.subscription.entriesLimit
                        }
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleManageBilling}
                    disabled={isLoading}
                    className="btn btn-outline w-full"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Billing
                  </button>

                  {/* Fix Subscription Button - for paid users with old limits */}
                  {(userDocument.subscription.plan === 'student' || userDocument.subscription.plan === 'researcher') &&
                   userDocument.subscription.entriesLimit !== -1 && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 mb-2 font-semibold">⚠️ Subscription Limit Issue Detected</p>
                      <p className="text-xs text-yellow-700 mb-3">
                        Your paid plan should have unlimited entries, but it's showing a limit. Click below to fix this.
                      </p>
                      <button
                        onClick={handleFixSubscription}
                        disabled={isLoading}
                        className="btn btn-sm bg-yellow-600 hover:bg-yellow-700 text-white w-full"
                      >
                        {isLoading ? 'Fixing...' : 'Fix My Subscription'}
                      </button>
                    </div>
                  )}

                  {/* Temporary manual activation for debugging */}
                  {process.env.NODE_ENV === 'development' && userDocument.subscription.plan === 'trial' && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 mb-2">Debug: Manual Subscription Activation</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              await manuallyActivateSubscription(currentUser.uid, 'student');
                              await refreshUserDocument();
                              toast.success('Student subscription activated!');
                            } catch (error) {
                              toast.error('Failed to activate subscription');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                          className="btn btn-sm btn-outline"
                          disabled={isLoading}
                        >
                          Activate Student
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              await manuallyActivateSubscription(currentUser.uid, 'researcher');
                              await refreshUserDocument();
                              toast.success('Researcher subscription activated!');
                            } catch (error) {
                              toast.error('Failed to activate subscription');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                          className="btn btn-sm btn-outline"
                          disabled={isLoading}
                        >
                          Activate Researcher
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-bold text-charcoal font-playfair mb-4">
                Quick Stats
              </h3>

              {statsLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="flex justify-between">
                    <div className="h-4 bg-khaki/20 rounded w-24"></div>
                    <div className="h-4 bg-khaki/20 rounded w-8"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-khaki/20 rounded w-24"></div>
                    <div className="h-4 bg-khaki/20 rounded w-8"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-khaki/20 rounded w-24"></div>
                    <div className="h-4 bg-khaki/20 rounded w-16"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-charcoal/70 font-lato">Total Entries</span>
                    <span className="font-semibold text-charcoal">{entries.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/70 font-lato">This Month</span>
                    <span className="font-semibold text-charcoal">
                      {entries.filter(entry => {
                        const entryDate = new Date(entry.createdAt);
                        const now = new Date();
                        return entryDate.getMonth() === now.getMonth() &&
                               entryDate.getFullYear() === now.getFullYear();
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/70 font-lato">Last Entry</span>
                    <span className="font-semibold text-charcoal">
                      {entries.length > 0
                        ? (() => {
                            const sortedEntries = [...entries].sort((a, b) =>
                              new Date(b.createdAt) - new Date(a.createdAt)
                            );
                            const lastEntry = sortedEntries[0];
                            const daysDiff = Math.floor(
                              (new Date() - new Date(lastEntry.createdAt)) / (1000 * 60 * 60 * 24)
                            );
                            if (daysDiff === 0) return 'Today';
                            if (daysDiff === 1) return 'Yesterday';
                            if (daysDiff < 7) return `${daysDiff} days ago`;
                            if (daysDiff < 30) return `${Math.floor(daysDiff / 7)} weeks ago`;
                            return `${Math.floor(daysDiff / 30)} months ago`;
                          })()
                        : 'No entries'
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>


            {/* Account Security */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-chestnut/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-chestnut" />
                </div>
                <h3 className="text-lg font-bold text-charcoal font-playfair">
                  Security
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-charcoal/70 font-lato">Two-Factor Auth</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    Not Setup
                  </span>
                </div>
                <button className="btn btn-outline w-full text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;