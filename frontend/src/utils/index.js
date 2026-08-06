/**
 * Helper to extract readable error message from Axios API response or standard Error
 */
export function getErrorMessage(error) {
  if (!error) return 'An unexpected error occurred';
  
  if (typeof error === 'string') return error;

  if (error.response) {
    const data = error.response.data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
    if (data?.errors && Array.isArray(data.errors)) {
      return data.errors.map((e) => e.message || e.msg).join(', ');
    }
  }

  if (error.message) return error.message;

  return 'Server error. Please try again.';
}
