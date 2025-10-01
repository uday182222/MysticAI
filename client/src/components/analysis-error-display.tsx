import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RotateCcw } from "lucide-react";

interface AnalysisErrorDisplayProps {
  error: string | null;
  retryCount: number;
  onRetry: () => void;
  isPending: boolean;
}

export function AnalysisErrorDisplay({ 
  error, 
  retryCount, 
  onRetry, 
  isPending 
}: AnalysisErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="mt-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={isPending}
            className="ml-4"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry {retryCount > 0 && `(${retryCount})`}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
