import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, MapPin, CreditCard, ClipboardList, PartyPopper, Truck, Zap, Clock } from "lucide-react";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const steps = ["Shipping", "Payment", "Review", "Confirmation"];

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({
    name: "", address: "", city: "", state: "", zip: "", phone: "", delivery: "standard",
  });
  const [payment, setPayment] = useState({
    method: "card", cardNumber: "", expiry: "", cvv: "", billingAddress: "same",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderNumber] = useState(() => `ORD-${Date.now().toString(36).toUpperCase()}`);

  const shippingCost = shipping.delivery === "express" ? 14.99 : shipping.delivery === "sameday" ? 24.99 : totalPrice > 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const total = totalPrice + shippingCost + tax;

  const suggested = products.filter((p) => !items.find((i) => i.product.id === p.id)).slice(0, 4);

  if (items.length === 0 && step < 3) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-foreground">Your cart is empty</p>
        <Link to="/" className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const validateShipping = () => {
    const e: Record<string, string> = {};
    if (!shipping.name.trim()) e.name = "Full name is required";
    if (!shipping.address.trim()) e.address = "Address is required";
    if (!shipping.city.trim()) e.city = "City is required";
    if (!shipping.state.trim()) e.state = "State is required";
    if (!shipping.zip.trim()) e.zip = "ZIP code is required";
    if (!shipping.phone.trim()) e.phone = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e: Record<string, string> = {};
    if (payment.method === "card") {
      if (!payment.cardNumber.trim()) e.cardNumber = "Card number is required";
      if (!payment.expiry.trim()) e.expiry = "Expiry date is required";
      if (!payment.cvv.trim()) e.cvv = "CVV is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (step === 0 && !validateShipping()) return;
    if (step === 1 && !validatePayment()) return;
    if (step === 2) {
      clearCart();
      toast.success("Order placed successfully!");
    }
    setStep((s) => s + 1);
    setErrors({});
  };

  const InputField = ({ label, name, value, onChange, placeholder, type = "text" }: {
    label: string; name: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
  }) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border ${errors[name] ? "border-destructive" : "border-border"} bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all`}
      />
      {errors[name] && <p className="mt-1 text-xs text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-6">
        {/* Progress */}
        {step < 3 && (
          <div className="mb-8 flex items-center justify-center gap-2">
            {steps.slice(0, 3).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  i < step ? "bg-accent text-accent-foreground" : i === step ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`hidden text-xs font-medium sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
                  {s}
                </span>
                {i < 2 && <div className={`h-px w-8 sm:w-16 ${i < step ? "bg-accent" : "bg-border"}`} />}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 0: Shipping */}
          {step === 0 && (
            <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                  <MapPin className="h-5 w-5 text-accent" /> Shipping Address
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <InputField label="Full Name" name="name" value={shipping.name} onChange={(v) => setShipping({ ...shipping, name: v })} placeholder="John Doe" />
                  </div>
                  <div className="sm:col-span-2">
                    <InputField label="Street Address" name="address" value={shipping.address} onChange={(v) => setShipping({ ...shipping, address: v })} placeholder="123 Main St" />
                  </div>
                  <InputField label="City" name="city" value={shipping.city} onChange={(v) => setShipping({ ...shipping, city: v })} placeholder="New York" />
                  <InputField label="State" name="state" value={shipping.state} onChange={(v) => setShipping({ ...shipping, state: v })} placeholder="NY" />
                  <InputField label="ZIP Code" name="zip" value={shipping.zip} onChange={(v) => setShipping({ ...shipping, zip: v })} placeholder="10001" />
                  <InputField label="Phone" name="phone" value={shipping.phone} onChange={(v) => setShipping({ ...shipping, phone: v })} placeholder="(555) 123-4567" type="tel" />
                </div>

                <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">Delivery Option</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { id: "standard", label: "Standard", desc: "5-7 business days", price: totalPrice > 50 ? "Free" : "$9.99", icon: Truck },
                    { id: "express", label: "Express", desc: "2-3 business days", price: "$14.99", icon: Zap },
                    { id: "sameday", label: "Same-Day", desc: "Today", price: "$24.99", icon: Clock },
                  ].map(({ id, label, desc, price, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setShipping({ ...shipping, delivery: id })}
                      className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-all ${
                        shipping.delivery === id ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${shipping.delivery === id ? "text-accent" : "text-muted-foreground"}`} />
                      <span className="text-xs font-semibold text-foreground">{label}</span>
                      <span className="text-[10px] text-muted-foreground">{desc}</span>
                      <span className="text-xs font-bold text-foreground">{price}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                  <CreditCard className="h-5 w-5 text-accent" /> Payment Method
                </h2>

                <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {["card", "paypal", "apple", "google"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setPayment({ ...payment, method: m })}
                      className={`rounded-lg border p-3 text-center text-xs font-semibold transition-all ${
                        payment.method === m ? "border-accent bg-accent/5 text-foreground" : "border-border text-muted-foreground hover:border-accent/30"
                      }`}
                    >
                      {m === "card" ? "Credit Card" : m === "paypal" ? "PayPal" : m === "apple" ? "Apple Pay" : "Google Pay"}
                    </button>
                  ))}
                </div>

                {payment.method === "card" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <InputField label="Card Number" name="cardNumber" value={payment.cardNumber} onChange={(v) => setPayment({ ...payment, cardNumber: v })} placeholder="1234 5678 9012 3456" />
                    </div>
                    <InputField label="Expiry Date" name="expiry" value={payment.expiry} onChange={(v) => setPayment({ ...payment, expiry: v })} placeholder="MM/YY" />
                    <InputField label="CVV" name="cvv" value={payment.cvv} onChange={(v) => setPayment({ ...payment, cvv: v })} placeholder="123" />
                  </div>
                )}

                {payment.method !== "card" && (
                  <div className="rounded-lg border border-border bg-muted/50 p-6 text-center">
                    <p className="text-sm text-muted-foreground">You will be redirected to {payment.method === "paypal" ? "PayPal" : payment.method === "apple" ? "Apple Pay" : "Google Pay"} to complete payment.</p>
                  </div>
                )}

                <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">Billing Address</h3>
                <div className="flex gap-4">
                  {["same", "different"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="billing"
                        checked={payment.billingAddress === opt}
                        onChange={() => setPayment({ ...payment, billingAddress: opt })}
                        className="accent-accent"
                      />
                      {opt === "same" ? "Same as shipping" : "Different address"}
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                  <ClipboardList className="h-5 w-5 text-accent" /> Review Order
                </h2>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <img src={item.product.image} alt={item.product.name} className="h-14 w-14 rounded-md object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-foreground">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium text-foreground">${totalPrice.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-medium text-foreground">{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="font-medium text-foreground">${tax.toFixed(2)}</span></div>
                  <div className="flex justify-between border-t border-border pt-3 text-base"><span className="font-bold text-foreground">Total</span><span className="font-bold text-foreground">${total.toFixed(2)}</span></div>
                </div>

                <div className="mt-4 rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
                  <p><strong className="text-foreground">Ship to:</strong> {shipping.name}, {shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}</p>
                  <p className="mt-1"><strong className="text-foreground">Payment:</strong> {payment.method === "card" ? `Card ending in ${payment.cardNumber.slice(-4) || "****"}` : payment.method}</p>
                  <p className="mt-1"><strong className="text-foreground">Delivery:</strong> {shipping.delivery === "standard" ? "Standard (5-7 days)" : shipping.delivery === "express" ? "Express (2-3 days)" : "Same-Day"}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                  <PartyPopper className="mx-auto h-16 w-16 text-accent" />
                </motion.div>
                <h2 className="mt-4 text-2xl font-bold text-foreground">Thank You!</h2>
                <p className="mt-2 text-muted-foreground">Your order has been placed successfully</p>
                <div className="mx-auto mt-6 max-w-xs space-y-2 rounded-lg border border-border bg-muted/50 p-4 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Order Number</span><span className="font-bold text-foreground">{orderNumber}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Est. Delivery</span><span className="font-medium text-foreground">{shipping.delivery === "sameday" ? "Today" : shipping.delivery === "express" ? "Mar 11, 2026" : "Mar 15, 2026"}</span></div>
                </div>
                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <button className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90 transition-opacity">
                    Track Order
                  </button>
                  <Link to="/" className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {suggested.length > 0 && (
                <section className="mt-10">
                  <h2 className="mb-5 text-xl font-bold text-foreground">You Might Also Like</h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {suggested.map((p, i) => (
                      <ProductCard key={p.id} product={p} index={i} />
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        {step < 3 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => step > 0 ? setStep(step - 1) : navigate("/cart")}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> {step === 0 ? "Back to Cart" : "Back"}
            </button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:opacity-90 transition-opacity"
            >
              {step === 2 ? "Place Order" : "Continue"} <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
