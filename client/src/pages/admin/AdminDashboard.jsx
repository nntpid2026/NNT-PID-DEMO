import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FiUsers, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const kpiData = [
  { title: "Total Companies", value: "124", icon: <FiUsers className="text-muted-foreground" />, trend: "+4 this month" },
  { title: "Pending Requests", value: "12", icon: <FiClock className="text-amber-500" />, trend: "2 urgent" },
  { title: "Active Companies", value: "98", icon: <FiCheckCircle className="text-emerald-500" />, trend: "+2 this month" },
  { title: "Revoked", value: "14", icon: <FiAlertCircle className="text-destructive" />, trend: "No change" },
];

const chartData = [
  { name: 'Active', count: 98, fill: 'var(--color-primary)' },
  { name: 'Pending', count: 12, fill: '#f59e0b' },
  { name: 'Revoked', count: 14, fill: 'var(--color-destructive)' },
];

const activityData = [
  { id: 1, admin: "Super Admin", action: "Approved registration", target: "Nexus Engineering", date: "10 mins ago", status: "success" },
  { id: 2, admin: "System", action: "Created backup", target: "Database", date: "1 hour ago", status: "info" },
  { id: 3, admin: "Jane Smith", action: "Revoked access", target: "Omega LLC", date: "3 hours ago", status: "destructive" },
  { id: 4, admin: "Super Admin", action: "Updated limits", target: "Global Pipeline Co.", date: "5 hours ago", status: "info" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of platform metrics and recent activity.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <div key={index} className="surface p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium tracking-tight text-muted-foreground">{kpi.title}</h3>
              {kpi.icon}
            </div>
            <div>
              <div className="text-2xl font-bold nums">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart */}
        <div className="surface lg:col-span-4 p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Companies by Status</h3>
          </div>
          <div className="h-[300px] w-full mt-4 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  cursor={{fill: 'var(--color-secondary)'}}
                  contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '0.5rem', color: 'var(--color-foreground)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="surface lg:col-span-3 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">Admin actions across the platform.</p>
          </div>
          <div className="space-y-6">
            {activityData.map(item => (
              <div key={item.id} className="flex items-center">
                <div className={`w-2 h-2 mt-1.5 rounded-full mr-4 self-start flex-shrink-0 ${
                  item.status === 'success' ? 'bg-emerald-500' : 
                  item.status === 'destructive' ? 'bg-destructive' : 'bg-primary'
                }`} />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item.admin} <span className="font-normal text-muted-foreground">{item.action}</span> {item.target}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
