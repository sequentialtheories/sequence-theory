import { validateEmail, validatePassword, sanitizeInput, sanitizeEmail, validateUUID } from '@/utils/validation';
import { isRateLimited } from '@/utils/security';

export const useValidation = () => {
  return {
    validateEmail,
    validatePassword,
    sanitizeInput,
    sanitizeEmail,
    validateUUID,
    isRateLimited
  };
};