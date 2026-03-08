import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { toast } from "sonner";

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", phone: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const success = await signup(form.name, form.email, form.password, form.phone);
    setLoading(false);
    if (success) {
      toast.success("Account created successfully!");
      navigate("/profile");
    } else {
      toast.error("An account with this email already exists");
    }
  };

  const Field = ({ icon: Icon, label, name, type = "text", placeholder }: { icon: any; label: string; name: keyof typeof form; type?: string; placeholder: string }) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-foreground">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type={name === "password" || name === "confirm" ? (showPassword ? "text" : "password") : type}
          value={form[name]}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          placeholder={placeholder}
          className={`w-full rounded-lg border ${errors[name] ? "border-destructive" : "border-border"} bg-muted/50 py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20`}
        />
        {(name === "password") && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {errors[name] && <p className="mt-1 text-xs text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <span className="text-lg font-bold text-accent-foreground">S</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join ShopSmart today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field icon={User} label="Full Name" name="name" placeholder="John Doe" />
          <Field icon={Mail} label="Email Address" name="email" type="email" placeholder="you@example.com" />
          <Field icon={Phone} label="Phone Number (optional)" name="phone" type="tel" placeholder="(555) 123-4567" />
          <Field icon={Lock} label="Password" name="password" placeholder="••••••••" />
          <Field icon={Lock} label="Confirm Password" name="confirm" placeholder="••••••••" />

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-accent hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
