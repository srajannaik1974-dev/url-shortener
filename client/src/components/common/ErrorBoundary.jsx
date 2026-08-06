/**
 * ErrorBoundary.jsx — Design System v2
 *
 * React class error boundary with a friendly fallback UI.
 * Catches rendering errors in children and prevents full app crash.
 */

import { Component } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center min-h-[320px]
                   px-6 py-12 text-center"
      >
        <div
          className="flex items-center justify-center w-12 h-12 mb-4
                     rounded-[var(--radius-lg)] bg-[var(--color-danger-subtle)]
                     text-[var(--color-danger)]"
          aria-hidden="true"
        >
          <AlertCircle className="w-6 h-6" />
        </div>

        <p className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-1">
          Something went wrong
        </p>
        <p className="text-[13px] text-[var(--color-text-secondary)] mb-5 max-w-xs leading-[20px]">
          An unexpected error occurred. Refreshing this section usually fixes it.
        </p>

        <Button
          variant="secondary"
          size="sm"
          onClick={this.handleReset}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Try again
        </Button>
      </div>
    );
  }
}
