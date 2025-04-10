import { useEffect, useState } from 'react';
import { useLocation } from '@/lib/LocationContext';
import { getWeatherAlerts } from '@/lib/api';
import { WeatherAlert } from '@/lib/api';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export default function WeatherAlerts() {
  const { location } = useLocation();
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchAlerts() {
      if (!location) return;
      
      try {
        setLoading(true);
        const data = await getWeatherAlerts(location.lat, location.lon);
        setAlerts(data);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather alerts');
        console.error('Error fetching alerts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, [location]);

  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">
          Please select a location on the home page first.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <p className="text-destructive text-center">
          Error loading weather alerts. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold">Weather Alerts</h1>
        <p className="text-muted-foreground">View active weather alerts for your location.</p>
        {lastUpdated && (
          <div className="text-sm text-muted-foreground mt-2">
            Last updated: {format(lastUpdated, 'PPpp')}
          </div>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-4 bg-card rounded-lg border">
          <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
          <p className="text-muted-foreground text-center">
            No active weather alerts for this location.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="bg-card rounded-lg border p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{alert.headline}</h3>
                  <p className="text-muted-foreground">{alert.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Effective:</p>
                      <p className="text-muted-foreground">
                        {format(new Date(alert.effective), 'PPpp')}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Expires:</p>
                      <p className="text-muted-foreground">
                        {format(new Date(alert.expires), 'PPpp')}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Severity:</p>
                      <p className="text-muted-foreground capitalize">{alert.severity.toLowerCase()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Certainty:</p>
                      <p className="text-muted-foreground capitalize">{alert.certainty.toLowerCase()}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Affected Area:</p>
                    <p className="text-muted-foreground">{alert.areaDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
