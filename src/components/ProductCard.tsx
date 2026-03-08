import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Eye, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const badgeStyles: Record<string, string> = {
  sale: "bg-sale text-sale-foreground",
  new: "bg-accent text-accent-foreground",
  trending: "bg-primary text-primary-foreground",
  "low-stock": "bg-warning text-warning-foreground",
};

const badgeLabels: Record<string, string> = {
  sale: "Sale",
  new: "New",
  trending: "Trending",
  "low-stock": "Low Stock",
};

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            {/* Badge */}
            {product.badge && (
              <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeStyles[product.badge]}`}>
                {badgeLabels[product.badge]}
              </span>
            )}

            {/* Stock warning */}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="absolute bottom-3 left-3 rounded-full bg-warning/90 px-2.5 py-1 text-xs font-semibold text-warning-foreground">
                Only {product.stock} left!
              </span>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/0 opacity-0 transition-all duration-300 group-hover:bg-foreground/5 group-hover:opacity-100">
              <button
                onClick={handleAddToCart}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-elevated transition-transform hover:scale-110"
              >
                <ShoppingCart className="h-4 w-4 text-foreground" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (wishlisted) {
                    removeFromWishlist(product.id);
                    toast.success("Removed from wishlist");
                  } else {
                    addToWishlist(product);
                    toast.success("Added to wishlist");
                  }
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-elevated transition-transform hover:scale-110"
              >
                <Heart className={`h-4 w-4 ${wishlisted ? "fill-accent text-accent" : "text-foreground"}`} />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-elevated">
                <Eye className="h-4 w-4 text-foreground" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="mb-1 text-xs font-medium text-muted-foreground">{product.category}</p>
            <h3 className="mb-2 text-sm font-semibold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="mb-2 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="text-xs font-medium text-foreground">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount.toLocaleString()})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                  <span className="rounded-md bg-sale/10 px-1.5 py-0.5 text-xs font-semibold text-sale">
                    -{discount}%
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
