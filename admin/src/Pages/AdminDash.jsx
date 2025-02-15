import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bell, Menu, Search } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import Sidebar from "./Sidebar/Sidebar";
import RecentOrders from "./RecentOrder/Recentorder";

const DashboardInterface = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [totalMessages, setTotalMessages] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    totalBakers: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalItems: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/admin/dashdata"
        );
        if (data.status) {
          setDashboardData(data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleBellClick = () => {
    navigate("/messages");
  };

  const data = [
    { time: "10am", value: 50000 },
    { time: "11am", value: 35000 },
    { time: "12pm", value: 60000 },
    { time: "1pm", value: 45000 },
    { time: "2pm", value: 85000 },
    { time: "3pm", value: 55000 },
    { time: "4pm", value: 45000 },
    { time: "5pm", value: 35000 },
    { time: "6pm", value: 45000 },
    { time: "7pm", value: 65000 },
  ];

  const stats = [
    { title: "Products", value: `${dashboardData.totalItems}`, icon: "🍞" },
    { title: "Bakers", value: `${dashboardData.totalBakers}`, icon: "🥐" },
    { title: "Orders", value: `${dashboardData.totalOrders}`, icon: "🍪" },
    { title: "Users", value: `${dashboardData.totalUsers}`, icon: "🧁" },
  ];

  const pieData = [
    { name: "Users", value: dashboardData.totalUsers },
    { name: "Bakers", value: dashboardData.totalBakers },
    { name: "Orders", value: dashboardData.totalOrders },
  ];

  const COLORS = ["#F97316", "#FBBF24", "#34D399"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-orange-50 to-orange-100 flex">
      <Sidebar visible={isSidebarVisible} totalMessages={totalMessages} />
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isSidebarVisible ? "ml-64" : "ml-0"
        }`}
      >
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-lg border border-cream-200 bg-cream-100 text-brown-600 placeholder-brown-400"
              />
              <Search className="w-4 h-4 absolute left-3 top-3 text-brown-500" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button onClick={handleBellClick}>
                <Bell className="w-6 h-6 text-brown-600" />
              </button>
              {totalMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {totalMessages}
                </span>
              )}
            </div>
            <div className="w-10 h-10 rounded-full bg-brown-100" />
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-cream-100 p-6 rounded-xl shadow-md">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{stat.icon}</span>
                <div>
                  <div className="text-2xl font-bold text-brown-800">
                    {stat.value}
                  </div>
                  <div className="text-brown-500 text-sm">{stat.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-cream-100 p-6 rounded-xl lg:col-span-3 shadow-md">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#FBBF24" />
                    <stop offset="50%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#DC2626" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  tickFormatter={(value) => `${value / 1000}K`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="url(#colorGradient)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: "#F97316" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-cream-100 p-6 rounded-xl lg:col-span-1 shadow-md">
            <h2 className="text-brown-700 text-lg font-semibold mb-4">
              Analytics
            </h2>
            <PieChart width={250} height={250}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </div>
        </div>
        <RecentOrders />
      </div>
    </div>
  );
};

export default DashboardInterface;
