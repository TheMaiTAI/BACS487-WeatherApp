import { useState, useEffect } from "react";
import { Outlet, useLocation as useRouterLocation, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useLocation } from "@/lib/LocationContext";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTheme } from "@/components/ThemeProvider";
import { Loader2 } from "lucide-react";

export function Layout() {
  const { location, isLoading } = useLocation();
  const routerLocation = useRouterLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isInitialCheck, setIsInitialCheck] = useState(true);
  const { theme } = useTheme();

  // Check for required location on protected routes
  useEffect(() => {
    const currentPath = routerLocation.pathname;
    const isHomePage = currentPath === "/";
    
    if (isHomePage) {
      setIsInitialCheck(false);
      return;
    }

    if (isLoading) {
      return; // Wait for location loading to complete
    }

    if (!location) {
      toast({
        title: "Location Required",
        description: "Please select a location first to access this feature",
        variant: "destructive",
      });
      navigate("/");
    }
    
    setIsInitialCheck(false);
  }, [location, routerLocation.pathname, navigate, toast, isLoading]);

  // Show loading state while checking location
  if (isLoading && !isInitialCheck) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-b from-sky-100 via-white to-blue-50'
    }`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-30 ${
          theme === 'dark' 
            ? 'bg-blue-500' 
            : 'bg-sky-400'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-30 ${
          theme === 'dark' 
            ? 'bg-purple-500' 
            : 'bg-indigo-400'
        }`}></div>
        {theme === 'light' && (
          <>
            <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full blur-2xl opacity-20 bg-amber-200"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full blur-2xl opacity-20 bg-emerald-200"></div>
          </>
        )}
      </div>
      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex flex-col min-h-screen">
          <TooltipProvider>
            <Navbar />
            <main className="flex-1 py-6 relative z-10">
              <div className="container">
                <div className="animate-fade-in">
                  <Outlet />
                </div>
              </div>
            </main>
          </TooltipProvider>
          <Toaster />
          <SonnerToaster />
        </div>
      </div>
    </div>
  );
}
