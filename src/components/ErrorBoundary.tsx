import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <h1>Oops! Something went wrong</h1>
            <p>
              We're sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>
            <button
              className="button"
              onClick={() => {
                // Clear localStorage and reload
                try {
                  localStorage.removeItem("el3vn_form_data");
                  localStorage.removeItem("el3vn_form_tab");
                } catch (e) {
                  console.warn("Failed to clear localStorage:", e);
                }
                window.location.reload();
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

