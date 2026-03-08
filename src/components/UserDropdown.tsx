import { User, Package, Heart, MapPin, CreditCard, LogOut, LogIn } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const menuItems = [
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Package, label: "Orders", path: "/profile?tab=orders" },
  { icon: Heart, label: "Wishlist", path: "/profile?tab=wishlist" },
  { icon: MapPin, label: "Saved Addresses", path: "/profile?tab=addresses" },
  { icon: CreditCard, label: "Payment Methods", path: "/profile?tab=payments" },
];

const UserDropdown = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("You have successfully logged out");
    navigate("/");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <User className="h-5 w-5" />
        </motion.button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-0">
        {isAuthenticated && user ? (
          <>
            {/* Profile header */}
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-accent text-accent-foreground text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-1">
              {menuItems.map(({ icon: Icon, label, path }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {label}
                </button>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-border p-1">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </div>
          </>
        ) : (
          <div className="p-4 text-center">
            <p className="mb-3 text-sm text-muted-foreground">Sign in to access your account</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("/login")}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90"
              >
                <LogIn className="h-4 w-4" /> Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                Create Account
              </button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default UserDropdown;
