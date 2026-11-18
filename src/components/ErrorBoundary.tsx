import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Handled gracefully via fallback UI without exposing internals
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#EAF4FB] dark:bg-[#081426] px-6 py-12 text-[#091933] dark:text-[#EDF6FC]">
          <div className="w-full max-w-md rounded-xl border border-[#C3DCEF] dark:border-[#1E375C] bg-[#FFFFFF] dark:bg-[#0F2038] p-7 shadow-lg">
            <p className="font-mono text-xs text-[#3B8EE0] dark:text-[#66B3F5]">
              Display Recovery
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
              Unable to render view
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
              Something interrupted the page display. Reloading will restore the portfolio cleanly.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 inline-flex items-center gap-2 rounded-md border border-[#091933] dark:border-[#F2EC38] bg-[#EFEA2B] dark:bg-[#F2EC38] px-4 py-2 text-xs font-semibold text-[#091933] hover:bg-[#091933] hover:text-[#EFEA2B] dark:hover:bg-[#66B3F5] dark:hover:border-[#66B3F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
