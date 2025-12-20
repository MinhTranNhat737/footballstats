"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  children?: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3">
              Something went wrong
            </h2>
            
            <p className="text-slate-400 mb-6 leading-relaxed">
              We encountered an unexpected error while loading the football data. 
              This could be a temporary network issue or a problem with the API.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
                <h4 className="text-red-400 font-semibold mb-2">Error Details:</h4>
                <pre className="text-red-300 text-sm overflow-auto">
                  {this.state.error.message}
                </pre>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={this.handleReset}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
              
              <Button 
                onClick={this.handleReload}
                variant="outline"
                className="border-slate-600 hover:border-slate-500"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function ApiErrorFallback({ 
  error, 
  onRetry, 
  title = "Failed to load data",
  description = "We couldn't fetch the latest football data. Please try again."
}: {
  error: string
  onRetry: () => void
  title?: string
  description?: string
}) {
  return (
    <div className="text-center py-12">
      <div className="mb-6">
        <svg className="w-16 h-16 mx-auto text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>
      
      <p className="text-slate-400 mb-4 max-w-md mx-auto">
        {description}
      </p>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 text-left">
          <summary className="text-yellow-400 font-semibold cursor-pointer mb-2">
            Error Details (Development)
          </summary>
          <pre className="text-yellow-300 text-sm overflow-auto">
            {error}
          </pre>
        </details>
      )}
      
      <Button 
        onClick={onRetry}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Try Again
      </Button>
    </div>
  )
}

export function NetworkErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
      <div className="mb-4">
        <svg className="w-12 h-12 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
        </svg>
      </div>
      
      <h4 className="text-red-400 font-semibold mb-2">Connection Error</h4>
      
      <p className="text-red-300 text-sm mb-4">
        Unable to connect to the football API. Please check your internet connection and try again.
      </p>
      
      <Button 
        onClick={onRetry}
        size="sm"
        className="bg-red-600 hover:bg-red-700"
      >
        Retry Connection
      </Button>
    </div>
  )
}

export default ErrorBoundary