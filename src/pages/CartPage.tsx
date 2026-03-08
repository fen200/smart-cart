import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { toast } from "sonner";

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const shipping = totalPrice > 50 ? 0 : 9.99;
  const discount = promoApplied ? totalPrice * 0.1 : 0;
  const tax = (totalPrice - discount) * 0.08;
  const total = totalPrice - discount + shipping + tax;

  const suggested = products.filter((p) => !items.find((i) => i.product.id === p.id)).slice(0, 4);

  const handlePromo = () => {
    if (promoCode.toLowerCase() === "save10") {
      setPromoApplied(true);
      toast.success("Promo code applied! 10% off");
    } else {
      toast.error("Invalid promo code");
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
        <h2 className="text-xl font-bold text-foreground">Your cart is empty</h2>
        <p className="text-muted-foreground">Start shopping to add items to your cart</p>
        <Link
          to="/"
          className="mt-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold text-foreground">Shopping Cart ({items.length})</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <Link to={`/product/${item.product.id}`} className="shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="text-sm font-semibold text-foreground hover:text-accent transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground">{item.product.category}</p>
                      {item.product.stock <= 5 && (
                        <p className="mt-1 text-xs font-medium text-warning">Only {item.product.stock} left in stock</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-border">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-foreground">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => {
                            removeFromCart(item.product.id);
                            toast.success("Item removed from cart");
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-bold text-foreground">Order Summary</h3>

              {/* Promo */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full rounded-lg border border-border bg-muted/50 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handlePromo}
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && <p className="mt-1 text-xs text-success">SAVE10 applied — 10% off!</p>}
                {!promoApplied && <p className="mt-1 text-[10px] text-muted-foreground">Try "SAVE10" for 10% off</p>}
              </div>

              <div className="space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-success">
                    <span>Discount (10%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-foreground">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-foreground">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/"
                className="mt-3 block text-center text-xs text-muted-foreground hover:text-accent transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Suggested */}
        {suggested.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 text-xl font-bold text-foreground">You Might Also Like</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {suggested.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CartPage;
