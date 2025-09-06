import React, { useEffect, useState } from "react";
import { getAllSections, getUserProfile } from "@/api/api";
import { UserTable } from './user_list';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Layout from "@/components/sidebar";
import {

  ShoppingCart,
  DollarSign,
  TrendingUp,
  Bell,
  Users,
  Search,
  Settings,
  LogOut,
  Home,
  BarChart3,
  Package,
  MessageSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";
import UserProfileModal from "@/components/UserProfileModal";

const iconMap = {
  Dashboard: Home,
  // Analytics: BarChart3,
  // Products: Package,
  User: Users,        // note API section_name is "User", but your static label was "Customers" etc.
  // Customers: Users,   // you can map both if needed
  // Messages: MessageSquare,
  // Settings: Settings,
  // Add more if you get more sections
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [user, setUser] = useState({ full_name: "", email: "", user_id: "", profile_image: "" });

  const [sidebarItems, setSidebarItems] = useState([]);
  const userId = localStorage.getItem("user_id");


  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await getAllSections();
        if (data.code === 200 && Array.isArray(data.data)) {
          const items = data.data.map((section, idx) => {
            const icon = iconMap[section.section_name] || Home;
            const active = section.section_name === "Dashboard" || idx === 0;

            return {
              icon,
              label: section.section_name,
              active,
            };
          });
          setSidebarItems(items);
        }
      } catch (err) {
        console.error("Error fetching sidebar sections:", err);
      }
    };

    fetchSections();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("user_id");

        if (!userId) {
          console.warn("No user_id found in localStorage");
          return;
        }

        const res = await getUserProfile(userId);

        if (res.code === 200 && res.data) {
          setUser({
            full_name: res.data.full_name,
            email: res.data.email,
            user_id: res.data.user_id,
            profile_image: res.data.profile_image
          });
        }
      } catch (err) {
        console.error("Error fetching user profile", err);
      }
    };

    fetchUser();
  }, []);




  const handleSidebarClick = (clickedLabel) => {
    setActiveSection(clickedLabel);
    setSidebarItems((items) =>
      items.map((item) => ({
        ...item,
        active: item.label === clickedLabel,
      }))
    );

    navigate(`/user_list`);
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-bold text-primary">Dashboard</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "default" : "ghost"}
                className={`w-full justify-start ${item.active ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => handleSidebarClick(item.label)}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 mb-3 cursor-pointer"
              onClick={() => setOpen(true)}
            >

              <Avatar className="h-8 w-8">
                <AvatarImage src={user.profile_image || ""} />
                {/* <AvatarFallback>{user.full_name ? user.full_name.split(" ").map(n => n[0]).join("") : "JD"}</AvatarFallback> */}
                <AvatarFallback>
                  {user.full_name
                    ? user.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() // Optional: uppercase initials
                    : "JD"}
                </AvatarFallback>
              </Avatar>


              <UserProfileModal
                open={open}
                onClose={() => setOpen(false)}
                userId={user.user_id}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.full_name || "John Doe"}</p>
                <p className="text-xs text-muted-foreground">{user.email || "john@example.com"}</p>
              </div>

            </div>
            <Button variant="ghost" size="sm" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold">{activeSection}</h2>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-10 w-80" />
              </div>

              {/* Notifications */}
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>

              {/* Profile */}
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback>
                  {user.full_name
                    ? user.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() // Optional: uppercase initials
                    : "JD"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {activeSection === "User" ? (
            <UserTable />
          ) : (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
                <p className="text-muted-foreground">
                  Here's what's happening with your business today.
                </p>
              </div>

              {/* Stats Cards */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              </div> */}

              {/* Additional Content */}
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
          )}
        </main>
      </div>

    </div>
  );
};

export default Dashboard;