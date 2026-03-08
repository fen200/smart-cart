import { User, Package, Heart, MapPin, CreditCard, LogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const menuItems = [
  { icon: Package, label: "Orders" },
  { icon: Heart, label: "Wishlist" },
  { icon: MapPin, label: "Saved Addresses" },
  { icon: CreditCard, label: "Payment Methods" },
];

const UserDropdown = () => {
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
        {/* Profile header */}
        <div className="flex items-center gap-3 border-b border-border p-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-accent text-accent-foreground text-sm font-bold">
              G
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">Guest User</p>
            <p className="text-xs text-muted-foreground">guest@example.com</p>
          </div>
        </div>

        {/* Menu items */}
        <div className="p-1">
          {menuItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              {label}
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="border-t border-border p-1">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10">
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserDropdown;
