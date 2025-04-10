import { useState, useEffect } from "react";
import { Link, useLocation as useRouterLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLocation } from "@/lib/LocationContext";
import { MapPin, Menu, Home, Cloud, Navigation, CloudRain, Sun, Wind, AlertTriangle, X, ChevronUp } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { location } = useLocation();
  const routerLocation = useRouterLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { theme } = useTheme();

  // Handle scrolling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navigation items
  const navItems = [
    { name: "Home", path: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Forecast", path: "/forecast", icon: <Cloud className="h-5 w-5" /> },
    { name: "Radar", path: "/radar", icon: <Navigation className="h-5 w-5" /> },
    { name: "Precipitation", path: "/precipitation", icon: <CloudRain className="h-5 w-5" /> },
    { name: "Sun Tracker", path: "/sun-tracker", icon: <Sun className="h-5 w-5" /> },
    { name: "Air Quality", path: "/air-quality", icon: <Wind className="h-5 w-5" /> },
    { name: "Weather Alerts", path: "/weather-alerts", icon: <AlertTriangle className="h-5 w-5" /> },
  ];

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: isScrolled 
            ? (theme === 'dark' ? 'rgba(17, 24, 39, 1)' : 'rgba(255, 255, 255, 1)')
            : (theme === 'dark' ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)'),
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
        }}
        className={cn(
          "sticky top-0 z-50 transition-colors duration-200",
          theme === 'dark' ? "text-gray-100" : "text-gray-900"
        )}
      >
        <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden -ml-2 hover:bg-accent/50">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Weather App
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsOpen(false)}
                    className="h-10 w-10 hover:bg-accent/50"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <nav className="flex flex-col p-4 gap-2">
                  {navItems.map((item) => (
                    <Link 
                      key={item.path} 
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        routerLocation.pathname === item.path 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "hover:bg-accent/50 hover:shadow-sm"
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <Link
              to="/"
              className="flex items-center gap-2 active:opacity-80 group"
            >
              <div className={`p-2 rounded-lg transition-all duration-200 group-hover:bg-accent/50 group-hover:shadow-sm ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-500/10'}`}>
                <Cloud className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <span className="hidden sm:inline-block font-bold text-lg md:text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Weather App
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    routerLocation.pathname === item.path 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "hover:bg-accent/50 hover:shadow-sm"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {location && (
              <div className={`hidden sm:flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-blue-500/10 text-blue-400' 
                  : 'bg-blue-500/10 text-blue-600'
              }`}>
                <MapPin className="h-4 w-4" />
                <span className="font-medium truncate max-w-[150px] md:max-w-[250px]">
                  {location.name}
                </span>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </motion.nav>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t">
        <div className="container">
          <div className="grid grid-cols-4 gap-1 p-2">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  routerLocation.pathname === item.path 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-accent/50"
                }`}
              >
                {item.icon}
                <span className="mt-1">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors md:bottom-4"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
