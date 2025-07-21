import { validateEmail, validatePassword, sanitizeInput } from '@/utils/validation';

export const useValidation = () => {
  return {
    validateEmail,
    validatePassword,
    sanitizeInput
  };
};