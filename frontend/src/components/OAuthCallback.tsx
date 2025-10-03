import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Check URL parameters for error
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (error) {
      setStatus('error');
      setErrorMessage(errorDescription || 'Authentication failed');
      return;
    }

    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      setStatus('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      return;
    }

    // If still loading, show processing
    if (isLoading) {
      setStatus('processing');
      return;
    }

    // If not authenticated and not loading, there might be an issue
    setTimeout(() => {
      setStatus('error');
      setErrorMessage('Authentication timeout. Please try again.');
    }, 10000); // 10 second timeout
  }, [isAuthenticated, isLoading, navigate]);

  const handleRetry = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center space-y-6">
        {status === 'processing' && (
          <>
            <Loader2 className="h-16 w-16 mx-auto text-primary animate-spin" />
            <div>
              <h2 className="text-2xl font-semibold mb-2">Processing Authentication</h2>
              <p className="text-muted-foreground">
                Please wait while we complete your GitHub login...
              </p>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-green-600">Authentication Successful!</h2>
              <p className="text-muted-foreground">
                Redirecting to your dashboard...
              </p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-16 w-16 mx-auto text-red-500" />
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-red-600">Authentication Failed</h2>
              <Alert className="text-left">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              <Button onClick={handleRetry} className="mt-4">
                Try Again
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
