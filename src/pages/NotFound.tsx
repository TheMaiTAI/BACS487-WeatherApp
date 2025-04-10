
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Cloud, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Cloud className="h-24 w-24 text-weather-blue animate-float" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold">404</h1>
        <h2 className="text-2xl md:text-3xl font-medium">Page Not Found</h2>
        
        <p className="text-muted-foreground max-w-md mx-auto">
          Looks like you've drifted into an uncharted forecast area. Let's get you back to clearer skies.
        </p>
        
        <Button asChild size="lg" className="mt-6">
          <Link to="/" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
