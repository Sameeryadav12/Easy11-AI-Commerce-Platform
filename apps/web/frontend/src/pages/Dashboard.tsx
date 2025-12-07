import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LineChart, Line, PieChart, Pie, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import { useEffect } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">$334,000</p>
              <p className="text-sm text-green-600 flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold">1,245</p>
              <p className="text-sm text-green-600 flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8.2%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Users</p>
              <p className="text-3xl font-bold">8,456</p>
              <p className="text-sm text-green-600 flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                +15.3%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Products</p>
              <p className="text-3xl font-bold">342</p>
              <p className="text-sm text-gray-600 flex items-center mt-2">
                Last 30 days
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
          <LineChart width={450} height={250} data={revenueData}>
            <LineChart.CartesianGrid strokeDasharray="3 3" />
            <LineChart.XAxis dataKey="month" />
            <LineChart.YAxis />
            <LineChart.Tooltip />
            <LineChart.Line type="monotone" dataKey="revenue" stroke="#0ea5e9" />
          </LineChart>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Sales by Category</h2>
          <PieChart width={450} height={250}>
            <PieChart.Pie
              data={[
                { name: 'Electronics', value: 40, fill: '#0ea5e9' },
                { name: 'Clothing', value: 30, fill: '#d946ef' },
                { name: 'Books', value: 20, fill: '#10b981' },
                { name: 'Home', value: 10, fill: '#f59e0b' },
              ]}
              cx={225}
              cy={125}
              innerRadius={40}
              outerRadius={80}
            />
            <PieChart.Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

