import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { UserTable } from "./user_list"; // adjust path if needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, BarChart3, Settings } from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: 1234,
    change: "+4.5%",
    icon: Users,
    color: "text-green-500",
  },
  {
    title: "New Orders",
    value: 256,
    change: "+1.2%",
    icon: Package,
    color: "text-blue-500",
  },
  {
    title: "Revenue",
    value: "$12.4k",
    change: "+8.3%",
    icon: BarChart3,
    color: "text-purple-500",
  },
  {
    title: "Settings Updated",
    value: 15,
    change: "-0.5%",
    icon: Settings,
    color: "text-yellow-500",
  },
];

function Dashboard() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your business today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p className="text-sm">New user registered</p>
                <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm">Order #1234 completed</p>
                <span className="text-xs text-muted-foreground ml-auto">5m ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-sm">Payment received</p>
                <span className="text-xs text-muted-foreground ml-auto">10m ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col">
                <Users className="h-5 w-5 mb-2" />
                <span className="text-sm">Add User</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Package className="h-5 w-5 mb-2" />
                <span className="text-sm">New Product</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <BarChart3 className="h-5 w-5 mb-2" />
                <span className="text-sm">View Reports</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Settings className="h-5 w-5 mb-2" />
                <span className="text-sm">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function MainPage() {
  return (
    <Router>
      <div>
        <nav className="flex bg-gray-100 p-4 space-x-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive ? "bg-blue-600 text-white" : "bg-white text-gray-700"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive ? "bg-blue-600 text-white" : "bg-white text-gray-700"
              }`
            }
          >
            Users
          </NavLink>
        </nav>

        <main className="p-6 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserTable />} />
            {/* You can add more routes here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}
