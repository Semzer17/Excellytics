import { useAuth } from '../../context/AuthContext';
import FileList from '../files/FileList';

const Dashboard = () => {
    const { user } = useAuth();
    
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user.profile.firstName || user.username}!</h1>
            <p className="text-gray-600 mb-6">Here's a summary of your activity.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
                    <h3 className="text-lg font-semibold text-gray-500">Files Uploaded</h3>
                    <p className="text-3xl font-bold text-blue-600">{user.uploadCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
                    <h3 className="text-lg font-semibold text-gray-500">Storage Used</h3>
                    <p className="text-3xl font-bold text-blue-600">{formatBytes(user.storageUsed)}</p>
                </div>
            </div>
            
            <FileList />
        </>
    );
};

export default Dashboard;