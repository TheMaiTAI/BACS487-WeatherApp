import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/lib/LocationContext";
import { Loader2, AlertCircle, ExternalLink } from "lucide-react";

export default function Radar() {
  const { location } = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    console.log("Radar component mounted, location:", location);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location]);
  
  // Handle load state when location changes
  useEffect(() => {
    if (location) {
      console.log("Location available:", location.name);
      setLoading(true);
      setLoadError(false);
      
      // Set a shorter timeout (8 seconds) for loading
      timeoutRef.current = setTimeout(() => {
        console.log("Loading timeout triggered");
        if (loading) {
          setLoading(false);
          
          // Check if we can detect if iframe loaded despite no event
          const iframe = iframeRef.current;
          try {
            // This might fail due to CORS
            if (iframe && iframe.contentWindow) {
              console.log("Iframe appears to have content");
            }
          } catch (e) {
            console.log("Cannot access iframe content due to CORS");
          }
          
          // Show a direct link toast
          toast({
            title: "Radar Alternative",
            description: "For best experience, view radar in a new tab",
            variant: "destructive",
          });
        }
      }, 8000);
    } else {
      console.log("No location available");
      setLoading(false);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location, toast]);
  
  // Build the Ventusky iframe URL
  const getIframeSrc = () => {
    if (!location) return '';
    return `https://embed.ventusky.com/?p=${location.lat};${location.lon};11&l=radar&pin=${location.lat};${location.lon};dot;${encodeURIComponent(location.name)}`;
  };
  
  // Build a direct Ventusky URL (non-embed)
  const getDirectVentuskyUrl = () => {
    if (!location) return '';
    return `https://www.ventusky.com/?p=${location.lat};${location.lon};11&l=radar`;
  };
  
  // Handle iframe load event
  const handleIframeLoad = () => {
    console.log("Iframe loaded event triggered");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLoading(false);
  };
  
  // Handle iframe error
  const handleIframeError = () => {
    console.log("Iframe error event triggered");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLoading(false);
    setLoadError(true);
  };
  
  // Manually force loading to complete
  const forceLoadComplete = () => {
    console.log("Manually completing load");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLoading(false);
  };
  
  // Open map in new tab
  const openInNewTab = () => {
    window.open(getDirectVentuskyUrl(), '_blank');
  };
  
  // Refresh the page
  const refreshPage = () => {
    window.location.reload();
  };

  if (!location) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">No Location Selected</h2>
        <p className="text-muted-foreground mb-4">
          Please select a location on the home page to view radar data.
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/'}
        >
          Go to Home Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold">Weather Radar</h2>
        <div className="flex gap-2">
          {loading && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={forceLoadComplete}
            >
              Stop Loading
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={openInNewTab}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Radar for {location.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p className="text-sm">Loading radar data...</p>
              </div>
            )}
            
            <div className="w-full" style={{ 
              position: "relative", 
              maxWidth: "177.612vh", 
              margin: "auto", 
              height: 0,
              paddingBottom: "56.303%" 
            }}>
              <iframe 
                ref={iframeRef}
                src={getIframeSrc()}
                className="absolute inset-0 w-full h-full border-0"
                frameBorder="0"
                allowFullScreen
                loading="lazy"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            </div>
            
            {loadError && (
              <div className="mt-4 bg-destructive/10 border border-destructive rounded-md p-4 text-destructive">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Error loading radar map</p>
                    <p className="mt-1">The radar service may be blocking embedded views.</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={openInNewTab}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in new tab
                      </Button>
                      <Button size="sm" variant="outline" onClick={refreshPage}>
                        <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
                        </svg>
                        Refresh page
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              Radar data powered by Ventusky. If the embedded view doesn't load, please use the "Open in New Tab" option for the best experience.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
