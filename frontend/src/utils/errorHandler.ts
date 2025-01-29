export class AppError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
  }
}

export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error
    return new AppError(
      error.response.data.message || 'Server error',
      error.response.status,
      error.response.data.code
    );
  } else if (error.request) {
    // Request made but no response
    return new AppError('No response from server', 503, 'SERVER_UNAVAILABLE');
  } else {
    // Error in request setup
    return new AppError(error.message || 'Request failed', 400, 'REQUEST_FAILED');
  }
};

export const formatErrorMessage = (error: AppError): string => {
  switch (error.code) {
    case 'UNAUTHORIZED':
      return 'Please log in to continue';
    case 'FORBIDDEN':
      return 'You do not have permission to perform this action';
    case 'NOT_FOUND':
      return 'The requested resource was not found';
    case 'SERVER_UNAVAILABLE':
      return 'Unable to connect to server. Please try again later';
    case 'VALIDATION_ERROR':
      return error.message || 'Invalid input provided';
    default:
      return error.message || 'An unexpected error occurred';
  }
};
