// Global error handler for wallet-related errors
export const setupErrorHandling = () => {
  if (typeof window === 'undefined') return;

  // Suppress console errors from wallet SDKs
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args[0];
    
    // Filter out specific wallet-related errors
    if (typeof message === 'string') {
      if (
        message.includes('Cross-Origin-Opener-Policy') ||
        message.includes('HTTP error! status: 404') ||
        message.includes('coinbase') ||
        message.includes('wallet-sdk') ||
        message.includes('Failed to parse source map') ||
        message.includes('Multiple versions of Lit loaded') ||
        message.includes('WalletConnect Core is already initialized') ||
        message.includes('unable to get local issuer certificate')
      ) {
        return; // Suppress these errors
      }
    }
    
    originalConsoleError.apply(console, args);
  };

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    
    if (reason && typeof reason === 'object') {
      const message = reason.message || reason.toString();
      
      if (
        message.includes('Cross-Origin-Opener-Policy') ||
        message.includes('404') ||
        message.includes('coinbase') ||
        message.includes('wallet-sdk')
      ) {
        event.preventDefault();
        return false;
      }
    }
  });

  // Handle general errors
  window.addEventListener('error', (event) => {
    const message = event.message;
    
    if (
      message.includes('Cross-Origin-Opener-Policy') ||
      message.includes('404') ||
      message.includes('coinbase') ||
      message.includes('wallet-sdk')
    ) {
      event.preventDefault();
      return false;
    }
  });
};

// Initialize error handling
if (typeof window !== 'undefined') {
  setupErrorHandling();
}
