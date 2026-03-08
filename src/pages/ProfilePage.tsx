import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Package, Heart, MapPin, CreditCard, LogOut, Edit, Plus, Trash2, Star, ShoppingCart, Check, X, Truck, Clock, CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { products } from "@/data/products";

type Tab = "overview" | "edit" | "orders" | "wishlist" | "addresses" | "payments";

const ProfilePage = () => {
  const { user, isAuthenticated, logout, updateProfile, addAddress, removeAddress, updateAddress, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod } = useAuth();
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const sidebarItems: { id: Tab; icon: any; label: string }[] = [
    { id: "overview", icon: User, label: "Profile Overview" },
    { id: "edit", icon: Edit, label: "Edit Profile" },
    { id: "orders", icon: Package, label: "Orders" },
    { id: "wishlist", icon: Heart, label: "Wishlist" },
    { id: "addresses", icon: MapPin, label: "Saved Addresses" },
    { id: "payments", icon: CreditCard, label: "Payment Methods" },
  ];

  const handleLogout = () => {
    logout();
    toast.success("You have successfully logged out");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {sidebarItems.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    tab === id ? "bg-accent/10 font-semibold text-accent" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {tab === "overview" && <OverviewTab user={user} setTab={setTab} />}
                {tab === "edit" && <EditTab user={user} updateProfile={updateProfile} />}
                {tab === "orders" && <OrdersTab orders={user.orders} />}
                {tab === "wishlist" && <WishlistTab items={wishlistItems} removeFromWishlist={removeFromWishlist} addToCart={addToCart} />}
                {tab === "addresses" && <AddressesTab addresses={user.addresses} addAddress={addAddress} removeAddress={removeAddress} updateAddress={updateAddress} />}
                {tab === "payments" && <PaymentsTab methods={user.paymentMethods} add={addPaymentMethod} remove={removePaymentMethod} setDefault={setDefaultPaymentMethod} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---- Sub-components ---- */

const OverviewTab = ({ user, setTab }: { user: any; setTab: (t: Tab) => void }) => (
  <div className="space-y-6">
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
          <p className="text-xs text-muted-foreground">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      {[
        { label: "Edit Profile", icon: Edit, tab: "edit" as Tab },
        { label: "View Orders", icon: Package, tab: "orders" as Tab },
        { label: "View Wishlist", icon: Heart, tab: "wishlist" as Tab },
      ].map(({ label, icon: Icon, tab: t }) => (
        <button key={t} onClick={() => setTab(t)} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">
          <Icon className="h-5 w-5 text-accent" />
          {label}
        </button>
      ))}
    </div>
  </div>
);

const EditTab = ({ user, updateProfile }: { user: any; updateProfile: (u: any) => void }) => {
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  const save = () => {
    updateProfile({ name: form.name, email: form.email, phone: form.phone });
    toast.success("Profile updated successfully");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">Edit Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-foreground">Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <motion.button whileTap={{ scale: 0.97 }} onClick={save} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90">Save Changes</motion.button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">Change Password</h2>
        <div className="grid gap-4 max-w-sm">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Current Password</label>
            <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">New Password</label>
            <input type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Confirm New Password</label>
            <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => toast.success("Password updated")} className="w-fit rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">Update Password</motion.button>
        </div>
      </div>
    </div>
  );
};

const OrdersTab = ({ orders }: { orders: any[] }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold text-foreground">Order History</h2>
    {orders.length === 0 ? (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Package className="mx-auto h-12 w-12 text-muted-foreground/30" />
        <p className="mt-3 text-sm text-muted-foreground">No orders yet</p>
      </div>
    ) : (
      orders.map((order) => (
        <div key={order.id} className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-foreground">{order.id}</p>
              <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              {order.status === "pending" && <Clock className="h-4 w-4 text-warning" />}
              {order.status === "shipped" && <Truck className="h-4 w-4 text-accent" />}
              {order.status === "delivered" && <CheckCircle className="h-4 w-4 text-success" />}
              <span className="text-xs font-medium capitalize text-foreground">{order.status}</span>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">{item.quantity}×</span>
                <span className="text-foreground">{item.name}</span>
                <span className="ml-auto font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-bold text-foreground">Total: ${order.total.toFixed(2)}</span>
            <div className="text-xs text-muted-foreground">
              <p>{order.address}</p>
              <p>{order.paymentMethod}</p>
            </div>
          </div>
          {/* Progress timeline */}
          <div className="mt-4 flex items-center gap-2">
            {["pending", "shipped", "delivered"].map((s, i) => {
              const statuses = ["pending", "shipped", "delivered"];
              const current = statuses.indexOf(order.status);
              const active = i <= current;
              return (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`h-2 w-2 rounded-full ${active ? "bg-accent" : "bg-border"}`} />
                  <div className={`h-0.5 flex-1 ${i < 2 ? (i < current ? "bg-accent" : "bg-border") : "hidden"}`} />
                </div>
              );
            })}
          </div>
        </div>
      ))
    )}
  </div>
);

const WishlistTab = ({ items, removeFromWishlist, addToCart }: any) => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold text-foreground">Wishlist</h2>
    {items.length === 0 ? (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Heart className="mx-auto h-12 w-12 text-muted-foreground/30" />
        <p className="mt-3 text-sm text-muted-foreground">Your wishlist is empty</p>
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((product: any) => (
          <div key={product.id} className="rounded-xl border border-border bg-card overflow-hidden">
            <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
            <div className="p-3">
              <h3 className="text-sm font-semibold text-foreground">{product.name}</h3>
              <p className="text-sm font-bold text-accent">${product.price.toFixed(2)}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => { addToCart(product); toast.success("Added to cart"); }} className="flex-1 rounded-lg bg-accent py-2 text-xs font-semibold text-accent-foreground hover:opacity-90">
                  <ShoppingCart className="mr-1 inline h-3 w-3" /> Add
                </button>
                <button onClick={() => removeFromWishlist(product.id)} className="rounded-lg border border-border px-3 py-2 text-xs text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const AddressesTab = ({ addresses, addAddress, removeAddress, updateAddress }: any) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", street: "", city: "", state: "", zip: "", phone: "", isDefault: false });

  const handleAdd = () => {
    if (!form.name || !form.street || !form.city) { toast.error("Please fill required fields"); return; }
    addAddress(form);
    setForm({ name: "", street: "", city: "", state: "", zip: "", phone: "", isDefault: false });
    setShowForm(false);
    toast.success("Address added");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Saved Addresses</h2>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground">
          <Plus className="h-3 w-3" /> Add Address
        </motion.button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl border border-border bg-card p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none" />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none" />
            <input placeholder="Street Address *" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="sm:col-span-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none" />
            <input placeholder="City *" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none" />
            <input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none" />
            <input placeholder="ZIP" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none" />
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="accent-accent" /> Set as default
            </label>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleAdd} className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground">Save</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground">Cancel</button>
          </div>
        </motion.div>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-3 text-sm text-muted-foreground">No saved addresses</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((a: any) => (
            <div key={a.id} className={`rounded-xl border p-4 ${a.isDefault ? "border-accent bg-accent/5" : "border-border bg-card"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.street}</p>
                  <p className="text-xs text-muted-foreground">{a.city}, {a.state} {a.zip}</p>
                  {a.phone && <p className="text-xs text-muted-foreground">{a.phone}</p>}
                </div>
                <div className="flex gap-1">
                  {!a.isDefault && (
                    <button onClick={() => updateAddress(a.id, { isDefault: true })} className="rounded-lg p-1.5 text-muted-foreground hover:text-accent" title="Set default">
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button onClick={() => removeAddress(a.id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {a.isDefault && <span className="mt-2 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent">Default</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PaymentsTab = ({ methods, add, remove, setDefault }: any) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ last4: "", expiry: "", type: "visa" as "visa" | "mastercard" | "amex", isDefault: false });

  const handleAdd = () => {
    if (!form.last4 || !form.expiry) { toast.error("Please fill all fields"); return; }
    add(form);
    setForm({ last4: "", expiry: "", type: "visa", isDefault: false });
    setShowForm(false);
    toast.success("Payment method added");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Payment Methods</h2>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground">
          <Plus className="h-3 w-3" /> Add Card
        </motion.button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl border border-border bg-card p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Card Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none">
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="amex">Amex</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Last 4 Digits</label>
              <input maxLength={4} placeholder="4242" value={form.last4} onChange={(e) => setForm({ ...form, last4: e.target.value.replace(/\D/g, "") })} className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Expiry</label>
              <input placeholder="MM/YY" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none" />
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground self-end">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="accent-accent" /> Set as default
            </label>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleAdd} className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground">Save</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground">Cancel</button>
          </div>
        </motion.div>
      )}

      {methods.length === 0 && !showForm ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-3 text-sm text-muted-foreground">No payment methods saved</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {methods.map((pm: any) => (
            <div key={pm.id} className={`rounded-xl border p-4 ${pm.isDefault ? "border-accent bg-accent/5" : "border-border bg-card"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold capitalize text-foreground">{pm.type} •••• {pm.last4}</p>
                    <p className="text-xs text-muted-foreground">Expires {pm.expiry}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {!pm.isDefault && (
                    <button onClick={() => setDefault(pm.id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-accent" title="Set default">
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button onClick={() => remove(pm.id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {pm.isDefault && <span className="mt-2 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent">Default</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
