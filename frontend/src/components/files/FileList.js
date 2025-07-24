import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Eye } from 'lucide-react';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const fetchFiles = useCallback(async () => {
    try {
      const { data } = await api.get('/files');
      setFiles(data);
    } catch (error) {
      toast.error('Failed to fetch file history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleDelete = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      try {
        await api.delete(`/files/${fileId}`);
        toast.success('File deleted successfully.');
        await refreshUser();
        fetchFiles();
      } catch (error) {
        toast.error('Failed to delete file.');
      }
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Files</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {loading ? (
            <li><p className="p-4 text-center">Loading files...</p></li>
          ) : files.length > 0 ? (
            files.map((file) => (
              <li key={file._id} className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-blue-600 truncate">{file.originalName}</p>
                  <p className="text-sm text-gray-500">Uploaded on {new Date(file.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => navigate(`/files/${file._id}`)} className="p-2 text-gray-500 hover:text-blue-600" title="View Details"><Eye size={18} /></button>
                  <button onClick={() => handleDelete(file._id)} className="p-2 text-gray-500 hover:text-red-600" title="Delete File"><Trash2 size={18} /></button>
                </div>
              </li>
            ))
          ) : (
            <li><p className="p-4 text-center text-gray-500">No files uploaded yet. <Link to="/upload" className="text-blue-600">Upload one now!</Link></p></li>
          )}
        </ul>
      </div>
    </>
  );
};

export default FileList;

