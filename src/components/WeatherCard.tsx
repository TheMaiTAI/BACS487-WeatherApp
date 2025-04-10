import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/ThemeProvider";

interface WeatherCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function WeatherCard({ children, className, ...props }: WeatherCardProps) {
  const { theme } = useTheme();

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        theme === 'dark' 
          ? "bg-gray-800/50 backdrop-blur-sm border-gray-700" 
          : "bg-white/80 backdrop-blur-sm border-gray-200",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="relative z-10 p-6">
        {children}
      </CardContent>
    </Card>
  );
}
