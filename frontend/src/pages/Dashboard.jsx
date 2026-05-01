import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Clock, AlertCircle, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data.data);
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading dashboard...</div>;
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const pendingTasks = tasks.filter(t => t.status === 'To Do' || t.status === 'In Progress').length;
  // Simplified overdue logic: check if dueDate is past today and status is not done
  const overdueTasks = tasks.filter(t => {
      if(t.status === 'Done' || !t.dueDate) return false;
      return new Date(t.dueDate) < new Date();
  }).length;

  const chartData = [
    { name: 'To Do', count: tasks.filter(t => t.status === 'To Do').length },
    { name: 'In Progress', count: tasks.filter(t => t.status === 'In Progress').length },
    { name: 'Done', count: completedTasks },
  ];

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-4 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Tasks" 
          value={totalTasks} 
          icon={<LayoutDashboard size={24} />} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          title="Completed" 
          value={completedTasks} 
          icon={<CheckCircle2 size={24} />} 
          color="bg-green-50 text-green-600" 
        />
        <StatCard 
          title="Pending" 
          value={pendingTasks} 
          icon={<Clock size={24} />} 
          color="bg-yellow-50 text-yellow-600" 
        />
        <StatCard 
          title="Overdue" 
          value={overdueTasks} 
          icon={<AlertCircle size={24} />} 
          color="bg-red-50 text-red-600" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Task Status Distribution</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Tasks</h3>
          <div className="space-y-4">
            {tasks.slice(0, 5).map(task => (
              <div key={task._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-xs text-gray-500">{task.projectId?.title || 'Unknown Project'}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                  ${task.status === 'Done' ? 'bg-green-100 text-green-700' : 
                    task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-gray-100 text-gray-700'}
                `}>
                  {task.status}
                </span>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">No tasks found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
