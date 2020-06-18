import { get as _get } from 'lodash';

const apiErrorHandler = (method, fn) => Promise.resolve(fn()).catch(error => {
  const apiError = new Error();

  // Standard Error properties
  apiError.name = error.name;
  apiError.message = error.message;
  if (error.stack) {
    apiError.stack = error.stack;
  }

  // Custom properties
  const statusCode = _get(error, 'response.status');
  apiError.statusCode = statusCode;

  console.error(`${method} Error:`, apiError);
  throw apiError;
});

export default apiErrorHandler;
