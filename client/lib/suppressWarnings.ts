// Utility to suppress React defaultProps warnings from third-party libraries (specifically recharts)
// This is a temporary fix until libraries fully migrate to JavaScript default parameters

const originalConsoleWarn = console.warn;

export const suppressDefaultPropsWarnings = () => {
  // Only apply in development mode
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.warn = (...args) => {
    const message = args[0];

    // Suppress specific defaultProps warnings from recharts components only
    if (
      typeof message === 'string' &&
      message.includes('Support for defaultProps will be removed from function components') &&
      // Check for recharts-specific components
      (message.includes('XAxis') ||
       message.includes('YAxis') ||
       message.includes('CartesianGrid') ||
       message.includes('Tooltip') ||
       message.includes('Legend') ||
       message.includes('Bar') ||
       message.includes('Line') ||
       message.includes('Pie') ||
       message.includes('Cell') ||
       message.includes('ResponsiveContainer'))
    ) {
      // Suppress only recharts defaultProps warnings
      return;
    }

    // Let all other warnings through unchanged
    originalConsoleWarn.apply(console, args);
  };
};

export const restoreConsoleWarn = () => {
  console.warn = originalConsoleWarn;
};
