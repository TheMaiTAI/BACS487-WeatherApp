import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export function LocationPermissionHelp() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Location help</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Location Access Help</AlertDialogTitle>
          <AlertDialogDescription>
            To use the "Current Location" feature, you need to allow location access in your browser. Here's how to fix common issues:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">Permission Denied</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              <li>Check for a permission popup that may have been blocked</li>
              <li>Click the location/lock icon in your browser address bar</li>
              <li>Go to your browser settings and reset location permissions for this site</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Chrome Instructions</h3>
            <ol className="list-decimal pl-5 text-sm text-muted-foreground">
              <li>Click the lock/info icon in the address bar</li>
              <li>Click "Site settings"</li>
              <li>Under "Permissions", set "Location" to "Allow"</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Firefox Instructions</h3>
            <ol className="list-decimal pl-5 text-sm text-muted-foreground">
              <li>Click the lock/shield icon in the address bar</li>
              <li>Under "Permissions", find "Access Your Location"</li>
              <li>Click the "X" to clear the current setting and try again</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Other Issues</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              <li>Make sure your device's location services are enabled</li>
              <li>Try refreshing the page</li>
              <li>Some browsers in private/incognito mode may block location access</li>
            </ul>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogAction>Got it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 