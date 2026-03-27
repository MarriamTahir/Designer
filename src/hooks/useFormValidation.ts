// src/hooks/useFormValidation.ts
import { useState, useCallback } from 'react';
import { FORM_VALIDATION } from '@/constants';

export const useFormValidation = <T extends Record<string, any>>(
  initialData: T,
  rules: Partial<Record<keyof T, (value: any) => string | undefined>>
) => {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validateField = useCallback((field: keyof T, value: any): string | undefined => {
    return rules[field]?.(value);
  }, [rules]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    (Object.keys(rules) as Array<keyof T>).forEach(field => {
      const error = validateField(field, data[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [data, rules, validateField]);

  const updateField = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  return {
    data,
    errors,
    updateField,
    validateForm,
    setData,
  };
};