import { Heart, X, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

const WishlistSheet = () => {
  const { items, removeFromWishlist, totalWishlistItems } = useWishlist();
  const { addToCart } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Heart className="h-5 w-5" />
          {totalWishlistItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground"
            >
              {totalWishlistItems}
            </motion.span>
          )}
        </motion.button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-accent" />
            Wishlist ({totalWishlistItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <Heart className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Your wishlist is empty</p>
            <p className="text-xs text-muted-foreground">Tap the heart icon on products to save them here</p>
          </div>
        ) : (
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {items.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 rounded-lg border border-border bg-card p-3"
              >
                <Link to={`/product/${product.id}`} className="shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link to={`/product/${product.id}`}>
                      <h4 className="text-sm font-semibold text-foreground hover:text-accent transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                    </Link>
                    <p className="text-sm font-bold text-foreground">${product.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        addToCart(product);
                        toast.success(`${product.name} added to cart`);
                      }}
                      className="flex items-center gap-1 rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground hover:opacity-90 transition-opacity"
                    >
                      <ShoppingCart className="h-3 w-3" /> Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        removeFromWishlist(product.id);
                        toast.success("Removed from wishlist");
                      }}
                      className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors"
                    >
                      <X className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistSheet;
