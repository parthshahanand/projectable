'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Uncaught error in ${this.props.name || 'Component'}:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      
      return (
        <div className="flex flex-col items-center justify-center p-6 border border-destructive/20 rounded-lg bg-destructive/5 text-center space-y-3 h-full">
          <AlertTriangle className="w-8 h-8 text-destructive opacity-50" />
          <h3 className="text-sm font-semibold text-destructive">Something went wrong</h3>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            {this.props.name ? `The ${this.props.name} failed to load.` : 'This component failed to load.'}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => this.setState({ hasError: false })}
            className="h-7 text-[10px]"
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
