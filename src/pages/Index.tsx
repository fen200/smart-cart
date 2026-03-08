import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { motion } from "framer-motion";
import { ArrowRight, Zap, TrendingUp, Sparkles } from "lucide-react";

const Index = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery)
    );
  }, [searchQuery]);

  const trendingProducts = products.filter((p) => p.badge === "trending" || p.badge === "new");
  const saleProducts = products.filter((p) => p.badge === "sale");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Hero */}
        {!searchQuery && <HeroBanner />}

        {/* Search results */}
        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Results for "{searchQuery}"
            </h2>
            <p className="text-muted-foreground">{filteredProducts.length} products found</p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <p className="mt-8 text-center text-muted-foreground">No products found. Try a different search.</p>
            )}
          </div>
        )}

        {!searchQuery && (
          <>
            {/* Flash Deals */}
            {saleProducts.length > 0 && (
              <section className="mt-10">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    <h2 className="text-xl font-bold text-foreground">Flash Deals</h2>
                  </div>
                  <button className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                    View All <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {saleProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* Categories */}
            <section className="mt-12">
              <div className="mb-5 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-bold text-foreground">Shop by Category</h2>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {categories.map((cat, i) => (
                  <motion.button
                    key={cat.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-card-hover hover:border-accent/30"
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-semibold text-foreground">{cat.name}</span>
                    <span className="text-[10px] text-muted-foreground">{cat.count.toLocaleString()} items</span>
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Trending */}
            <section className="mt-12">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-bold text-foreground">Trending Now</h2>
                </div>
                <button className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                  View All <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {trendingProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </section>

            {/* All Products */}
            <section className="mt-12">
              <h2 className="mb-5 text-xl font-bold text-foreground">All Products</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
