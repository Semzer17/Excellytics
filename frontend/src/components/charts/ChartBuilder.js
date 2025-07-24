import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';

const ChartBuilder = () => {
  const { id: fileId } = useParams();
  const navigate = useNavigate();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartConfig, setChartConfig] = useState({
    type: 'bar',
    xAxis: '',
    yAxis: '',
    title: ''
  });

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const { data } = await api.get(`/files/${fileId}`);
        setFileData(data);
        if (data.headers.length >= 2) {
          setChartConfig(prev => ({ ...prev, xAxis: data.headers[0], yAxis: data.headers[1] }));
        } else if (data.headers.length > 0) {
          setChartConfig(prev => ({ ...prev, xAxis: data.headers[0], yAxis: data.headers[0] }));
        }
      } catch (error) {
        toast.error('Failed to load file data.');
      } finally {
        setLoading(false);
      }
    };
    fetchFileDetails();
  }, [fileId]);

  const handleConfigChange = (e) => {
    setChartConfig({ ...chartConfig, [e.target.name]: e.target.value });
  };

  const getChartData = () => {
    if (!fileData || !chartConfig.xAxis || !chartConfig.yAxis) return { labels: [], datasets: [] };
    const labels = fileData.data.map(row => row[chartConfig.xAxis]);
    const dataPoints = fileData.data.map(row => parseFloat(row[chartConfig.yAxis])).filter(val => !isNaN(val));
    if (chartConfig.type === 'scatter') {
        return { datasets: [{ label: `${chartConfig.yAxis} vs ${chartConfig.xAxis}`, data: fileData.data.map(row => ({ x: row[chartConfig.xAxis], y: parseFloat(row[chartConfig.yAxis])})).filter(p => !isNaN(p.y)), backgroundColor: 'rgba(255, 99, 132, 0.6)' }] };
    }
    return { labels, datasets: [{ label: chartConfig.yAxis, data: dataPoints, backgroundColor: 'rgba(75, 192, 192, 0.6)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }] };
  };

  const handleSaveAnalysis = async () => {
    const chartData = getChartData();
    const analysisData = {
        chartType: chartConfig.type,
        xAxis: chartConfig.xAxis,
        yAxis: chartConfig.yAxis,
        title: chartConfig.title || 'Untitled Analysis',
        chartData: chartData,
    };
    try {
        await api.post(`/files/${fileId}/analyses`, analysisData);
        toast.success('Analysis saved successfully!');
        navigate(`/files/${fileId}`);
    } catch (error) {
        toast.error('Failed to save analysis.');
    }
  }

  if (loading) return <div>Loading chart builder...</div>;
  if (!fileData) return <div>File not found.</div>;

  const chartOptions = { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: chartConfig.title || `${chartConfig.type.charAt(0).toUpperCase() + chartConfig.type.slice(1)} Chart: ${fileData.originalName}` } } };

  const renderChart = () => {
    const data = getChartData();
    switch (chartConfig.type) {
      case 'bar': return <Bar options={chartOptions} data={data} />;
      case 'line': return <Line options={chartOptions} data={data} />;
      case 'pie': return <Pie options={chartOptions} data={data} />;
      case 'scatter': return <Scatter options={chartOptions} data={data} />;
      default: return <p>Select a chart type.</p>;
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Chart Builder</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Chart Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <input name="title" placeholder="Chart Title" value={chartConfig.title} onChange={handleConfigChange} className="p-2 border-gray-300 rounded-md shadow-sm" />
          <select name="type" value={chartConfig.type} onChange={handleConfigChange} className="p-2 border-gray-300 rounded-md shadow-sm">
            <option value="bar">Bar</option> <option value="line">Line</option> <option value="pie">Pie</option> <option value="scatter">Scatter</option>
          </select>
          <select name="xAxis" value={chartConfig.xAxis} onChange={handleConfigChange} className="p-2 border-gray-300 rounded-md shadow-sm">
            {fileData.headers.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          <select name="yAxis" value={chartConfig.yAxis} onChange={handleConfigChange} className="p-2 border-gray-300 rounded-md shadow-sm">
            {fileData.headers.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <button onClick={handleSaveAnalysis} className="mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Save Analysis</button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">{renderChart()}</div>
    </>
  );
};

export default ChartBuilder;