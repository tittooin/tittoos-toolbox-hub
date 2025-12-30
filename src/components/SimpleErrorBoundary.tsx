
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class SimpleErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center text-red-500">
                    <h2 className="text-xl font-bold">Something went wrong.</h2>
                    <p className="mt-2">{this.state.error?.message}</p>
                    <p className="text-sm text-gray-400 mt-4">Please refresh the page or try again later.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default SimpleErrorBoundary;
