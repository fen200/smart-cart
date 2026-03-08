import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <span className="text-4xl font-bold text-muted-foreground">404</span>
      </div>
      <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Sorry, we couldn't find the page you're looking for. It may have been moved or doesn't exist.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <Home className="h-4 w-4" /> Go Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
