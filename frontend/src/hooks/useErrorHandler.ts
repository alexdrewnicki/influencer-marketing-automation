import { useApp } from '../context/AppContext';
import { AppError, handleApiError, formatErrorMessage } from '../utils/errorHandler';

export const useErrorHandler = () => {
  const { dispatch } = useApp();

  const handleError = (error: unknown) => {
    const appError = error instanceof AppError 
      ? error 
      : handleApiError(error);

    // Show notification
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: formatErrorMessage(appError),
        type: 'error'
      }
    });

    // Log error for monitoring
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
      console.error('[Error]:', appError);
    }

    return appError;
  };

  return { handleError };
};
