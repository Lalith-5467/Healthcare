import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled runtime error in React tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '40px auto', background: '#fff', border: '1px solid #fee2e2', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#dc2626', fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
            Portal Rendering Error Encountered
          </h2>
          <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '16px' }}>
            {this.state.error?.message || 'An unexpected runtime error occurred.'}
          </p>
          <pre style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '12px', overflowX: 'auto', border: '1px solid #e2e8f0', color: '#1e293b' }}>
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => {
              localStorage.removeItem('active_hospital_portal');
              window.location.reload();
            }}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#00a896', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
          >
            Reset Hospital State & Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

