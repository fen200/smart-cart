import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <span className="text-sm font-bold text-accent-foreground">S</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">ShopSmart</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Smart shopping, simplified. Discover products you'll love with personalized recommendations.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-accent transition-colors">New Arrivals</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Best Sellers</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Sale</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Collections</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-accent transition-colors">Help Center</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Shipping</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Returns</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-accent transition-colors">About</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Careers</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Privacy</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2026 ShopSmart. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
