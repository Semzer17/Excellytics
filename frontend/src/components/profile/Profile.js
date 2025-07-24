import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({ firstName: user?.profile?.firstName || '', lastName: user?.profile?.lastName || '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await updateProfile(formData);
        setLoading(false);
    };
    
    const formatBytes = (bytes, decimals = 2) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    if (!user) return null;

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-lg font-semibold text-gray-800">{user.username}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="mt-6 space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Files Uploaded</p>
                                <p className="text-2xl font-bold text-blue-600">{user.uploadCount}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Storage Used</p>
                                <p className="text-2xl font-bold text-blue-600">{formatBytes(user.storageUsed)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Information</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="mt-1 block w-full p-3 border-gray-300 rounded-md shadow-sm" />
                            <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="mt-1 block w-full p-3 border-gray-300 rounded-md shadow-sm" />
                            <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-bold">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
