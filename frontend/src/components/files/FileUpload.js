import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { UploadCloud } from 'lucide-react';

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('excelFile', file);
    setUploading(true);
    
    const toastId = toast.loading('Uploading and processing file...');

    try {
      const { data } = await api.post('/files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('File uploaded successfully!', { id: toastId });
      await refreshUser();
      navigate(`/files/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed.', { id: toastId });
    } finally {
      setUploading(false);
    }
  }, [navigate, refreshUser]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
  });

  return (
    <>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload New File</h1>
        <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}>
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
            {isDragActive ? 'Drop the file here ...' : "Drag 'n' drop an Excel file here, or click to select a file"}
            </p>
            <p className="text-xs text-gray-500">.XLS, .XLSX up to 10MB</p>
            {uploading && <p className="mt-2 text-sm text-blue-600">Processing...</p>}
        </div>
    </>
  );
};

export default FileUpload;