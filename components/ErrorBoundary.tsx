import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to the console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          
          <View style={styles.errorDetails}>
            <Text style={styles.errorMessage}>
              {this.state.error?.toString() || 'Unknown error'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={this.resetError}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5A189A',
    marginBottom: 16,
  },
  errorDetails: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    width: '100%',
  },
  errorMessage: {
    fontSize: 14,
    color: '#ff0000',
  },
  button: {
    backgroundColor: '#5A189A',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorBoundary;
