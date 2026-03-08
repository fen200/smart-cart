import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const footerSections = [
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Blog", to: "/blog" },
      { label: "Press", to: "/press" },
      { label: "Sustainability", to: "/sustainability" },
    ],
  },
  {
    title: "Customer Support",
    links: [
      { label: "Help Center", to: "/help" },
      { label: "Contact Us", to: "/contact" },
      { label: "Track Order", to: "/profile" },
      { label: "Returns & Refunds", to: "/returns" },
      { label: "Shipping Info", to: "/shipping-info" },
    ],
  },
  {
    title: "Shopping",
    links: [
      { label: "Deals & Promotions", to: "/?search=sale" },
      { label: "Gift Cards", to: "/gift-cards" },
      { label: "New Arrivals", to: "/?search=new" },
      { label: "Best Sellers", to: "/?search=trending" },
      { label: "Trending Products", to: "/?search=trending" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", to: "/login" },
      { label: "Register", to: "/signup" },
      { label: "My Orders", to: "/profile" },
      { label: "Wishlist", to: "/profile" },
      { label: "Saved Addresses", to: "/profile" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Cookie Policy", to: "/cookies" },
      { label: "Payment Security", to: "/payment-security" },
      { label: "Accessibility", to: "/accessibility" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    toast({ title: "Subscribed!", description: "You'll receive our latest deals and updates." });
    setEmail("");
  };

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  return (
    <footer className="mt-16 bg-primary text-primary-foreground">
      {/* Newsletter */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h3 className="text-lg font-bold">Stay in the loop</h3>
              <p className="text-sm text-primary-foreground/70">Subscribe for exclusive deals, new arrivals, and more.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-primary-foreground/10 py-2.5 pl-10 pr-4 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Email for newsletter"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer links */}
      <div className="container mx-auto px-4 py-12">
        {/* Desktop grid */}
        <div className="hidden gap-8 md:grid md:grid-cols-5">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary-foreground/80">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile accordion */}
        <div className="space-y-0 md:hidden">
          {footerSections.map((section) => (
            <div key={section.title} className="border-b border-primary-foreground/10">
              <button
                onClick={() => toggleSection(section.title)}
                className="flex w-full items-center justify-between py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground/80"
                aria-expanded={openSection === section.title}
              >
                {section.title}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openSection === section.title ? "rotate-180" : ""}`}
                />
              </button>
              {openSection === section.title && (
                <ul className="space-y-2.5 pb-4">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
              <span className="text-xs font-bold text-accent-foreground">S</span>
            </div>
            <span className="text-sm font-bold">ShopSmart</span>
          </div>
          <p className="text-xs text-primary-foreground/50">© 2026 ShopSmart. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground/50 transition-colors hover:bg-primary-foreground/10 hover:text-accent"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
