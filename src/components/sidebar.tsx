import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllSections, getUserProfile } from "@/api/api";
import {
    Home, Users, Bell, LogOut, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import UserProfileModal from "./UserProfileModal";

const iconMap = {
    Dashboard: Home,
    User: Users,
};

const Layout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState({ full_name: "", email: "", user_id: "", profile_image: "" });
    const [sidebarItems, setSidebarItems] = useState([]);
    const [activeSection, setActiveSection] = useState("");
    const [open, setOpen] = useState(false);
    const userId = localStorage.getItem("user_id");


    useEffect(() => {
        const fetchSections = async () => {
            try {
                const data = await getAllSections();
                if (data.code === 200 && Array.isArray(data.data)) {
                    const items = data.data.map((section, idx) => {
                        const icon = iconMap[section.section_name] || Home;
                        return {
                            icon,
                            label: section.section_name,
                            active: location.pathname.includes(section.section_name.toLowerCase()),
                        };
                    });
                    setSidebarItems(items);
                }
            } catch (err) {
                console.error("Error fetching sections", err);
            }
        };

        fetchSections();
    }, [location]);
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



    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleSidebarClick = (label: string) => {
        setActiveSection(label);
        navigate(`/${label.toLowerCase()}`);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-border">
                        <Link to="/dashboard" className="text-xl font-bold text-primary hover:underline">
                            Dashboard
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.label}
                                variant={item.label === activeSection ? "default" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => handleSidebarClick(item.label)}
                            >
                                <item.icon className="h-4 w-4 mr-3" />
                                {item.label}
                            </Button>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-border">
                        <div className="flex items-center space-x-3 mb-3 cursor-pointer" onClick={() => setOpen(true)}>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="" />
                                <AvatarFallback>
                                    {user.full_name
                                        ? user.full_name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()
                                        : "JD"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.full_name || "John Doe"}</p>
                                <p className="text-xs text-muted-foreground">{user.email || "john@example.com"}</p>
                            </div>
                        </div>

                        <UserProfileModal
                            open={open}
                            onClose={() => setOpen(false)}
                            userId={user.user_id}
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
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
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">{activeSection}</h2>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search..." className="pl-10 w-80" />
                            </div>
                            <Button variant="outline" size="icon">
                                <Bell className="h-4 w-4" />
                            </Button>
                            <div className="cursor-pointer"
                                onClick={() => setOpen(true)}>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="" />
                                    <AvatarFallback >
                                        {user.full_name
                                            ? user.full_name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()
                                            : "JD"}
                                    </AvatarFallback>
                                </Avatar>

                            </div>
                        </div>
                        <UserProfileModal
                            open={open}
                            onClose={() => setOpen(false)}
                            userId={user.user_id}
                        />
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
