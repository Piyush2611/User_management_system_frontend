import { useState, useMemo, useEffect } from "react";
import { getUsers } from "@/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Search,
    Filter,
    Users,
    UserPlus,
    MoreHorizontal,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit,
    Trash2,
    Eye,
    TrendingUp,
    UserCheck,
    Clock,
} from "lucide-react";

interface RawUser {
    user_id: number;
    full_name: string;
    email: string;
    role_id: number;
    createdAt: string;
    profile_image?: string;
    // add other fields if you know them
}


export function UserTable() {
    const [users, setUsers] = useState([]); // Replaces mockUsers
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [sortBy, setSortBy] = useState("name");

    const roleId = localStorage.getItem("role_id");
    const userId = localStorage.getItem("user_id");


    const fetchUsers = async () => {
        try {
            const response  = await getUsers(roleId, userId);
            console.log("API response:", response); 
             const fetchedUsers = response.data;

            // Format fetched data
            const formatted = fetchedUsers.map((user: RawUser) => ({
                id: user.user_id,
                name: user.full_name,
                email: user.email,
                phone: "N/A", // You can add phone if available in response
                role: user.role_id === 1 ? "Admin" : "User",
                status: "active", // Add actual status if available
                location: "N/A",  // Replace if available
                joinDate: user.createdAt,
                avatar: user.profile_image || "",
                lastActive: "Recently"
            }));

            setUsers(formatted);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [roleId, userId]);


    const roles = useMemo(() => {
        const roleList = Array.from(new Set(users.map(u => u.role)));
        return ["all", ...roleList];
    }, [users]);

    const filteredUsers = useMemo(() => {
        let filtered = users;

        if (searchQuery) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.role.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedRole !== "all") {
            filtered = filtered.filter(user => user.role === selectedRole);
        }

        if (selectedStatus !== "all") {
            filtered = filtered.filter(user => user.status === selectedStatus);
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "joinDate":
                    return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
                case "email":
                    return a.email.localeCompare(b.email);
                case "role":
                    return a.role.localeCompare(b.role);
                case "name":
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        return filtered;
    }, [users, searchQuery, selectedRole, selectedStatus, sortBy]);


    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Filters & Controls */}
                <Card className="mb-8 shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters & Search
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users by name, email, role, or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Role Filter */}
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role === "all" ? "All Roles" : role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Status Filter */}
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Sort */}
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="role">Role</SelectItem>
                                    <SelectItem value="joinDate">Join Date</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-muted-foreground">
                            Showing {filteredUsers.length} of {users.length} users
                        </p>
                        {searchQuery && (
                            <p className="text-sm text-muted-foreground">
                                Results for "<span className="font-medium">{searchQuery}</span>"
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {selectedRole !== "all" && <Badge variant="secondary">{selectedRole}</Badge>}
                        {selectedStatus !== "all" && <Badge variant="secondary">{selectedStatus}</Badge>}
                    </div>
                </div>

                {/* Users Table */}
                <Card className="shadow-card">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-yellow-soft/30">
                                <TableHead className="font-semibold">User</TableHead>
                                <TableHead className="font-semibold">Role</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Contact</TableHead>
                                <TableHead className="font-semibold">Location</TableHead>
                                <TableHead className="font-semibold">Join Date</TableHead>
                                <TableHead className="font-semibold">Last Active</TableHead>
                                <TableHead className="font-semibold w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} className="hover:bg-yellow-soft/20 transition-colors">
                                    <TableCell>
                                        {/* User info */}
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback className="bg-gradient-yellow text-primary font-semibold">
                                                    {user.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-foreground">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.role}</TableCell> {/* Role */}
                                    <TableCell>{user.status}</TableCell> {/* Status */}
                                    <TableCell>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Mail className="h-3 w-3 mr-1" />
                                            {user.email}
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Phone className="h-3 w-3 mr-1" />
                                            {user.phone}
                                        </div>
                                    </TableCell> {/* Contact */}
                                    <TableCell>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {user.location}
                                        </div>
                                    </TableCell> {/* Location */}
                                    <TableCell>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {new Date(user.joinDate).toLocaleDateString()}
                                        </div>
                                    </TableCell> {/* Join Date */}
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                                    </TableCell> {/* Last Active */}
                                    <TableCell>
                                        {/* Actions Dropdown */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit User
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete User
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>

                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {filteredUsers.length === 0 && (
                    <Card className="text-center py-12 mt-8">
                        <CardContent>
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No users found</h3>
                            <p className="text-muted-foreground mb-4">
                                Try adjusting your search or filter criteria
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedRole("all");
                                    setSelectedStatus("all");
                                }}
                            >
                                Clear Filters
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );

}