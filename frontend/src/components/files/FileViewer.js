import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Trash2 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const FileViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/files/${id}`);
      setFile(data);
    } catch (error) {
      toast.error('Failed to load file details.');
      navigate('/files');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchFile();
  }, [fetchFile]);

  const handleDeleteAnalysis = async (analysisId) => {
      if (window.confirm('Are you sure you want to delete this analysis?')) {
          try {
              await api.delete(`/files/${id}/analyses/${analysisId}`);
              toast.success('Analysis deleted.');
              fetchFile();
          } catch (error) {
              toast.error('Failed to delete analysis.');
          }
      }
  }

  if (loading) return <div className="text-center p-8">Loading file...</div>;
  if (!file) return <div className="text-center p-8">File not found.</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{file.originalName}</h1>
            <p className="text-gray-500">Rows: {file.rowCount}, Columns: {file.metadata.columns}</p>
        </div>
        <Link to={`/files/${id}/chart`} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
            Create New Chart
        </Link>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Saved Analyses</h2>
      {file.analyses && file.analyses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {file.analyses.map(analysis => (
                  <div key={analysis._id} className="bg-white p-4 rounded-lg shadow relative">
                      <h3 className="font-semibold mb-2">{analysis.title || 'Untitled Analysis'}</h3>
                      <div className="h-64">
                          {analysis.chartType === 'bar' && <Bar data={analysis.chartData} options={{ responsive: true, maintainAspectRatio: false }} />}
                          {analysis.chartType === 'line' && <Line data={analysis.chartData} options={{ responsive: true, maintainAspectRatio: false }} />}
                          {analysis.chartType === 'pie' && <Pie data={analysis.chartData} options={{ responsive: true, maintainAspectRatio: false }} />}
                      </div>
                      <button onClick={() => handleDeleteAnalysis(analysis._id)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500">
                          <Trash2 size={16} />
                      </button>
                  </div>
              ))}
          </div>
      ) : (
          <p className="text-gray-500 bg-white p-4 rounded-lg shadow">No saved analyses for this file yet.</p>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Data Preview</h3>
        <div className="overflow-x-auto bg-white rounded-lg shadow-md max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>{file.headers.map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {file.data.slice(0, 20).map((row, i) => (
                <tr key={i}>{file.headers.map(h => <td key={h} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{String(row[h])}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FileViewer;