/**
 * useForm — generic form state & validation hook.
 *
 * Usage:
 *   const { values, setValue, errors, setError, loading, setLoading, validate, reset } =
 *     useForm({ email: '', password: '' });
 */

import { useCallback, useState } from 'react';

export type Validator<T> = (values: T) => Partial<Record<keyof T, string>> | null;

export interface UseFormReturn<T extends Record<string, any>> {
  values: T;
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  setValues: (partial: Partial<T>) => void;
  errors: Partial<Record<keyof T, string>>;
  setError: (key: keyof T, msg: string) => void;
  clearErrors: () => void;
  globalError: string;
  setGlobalError: (msg: string) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  validate: (validator: Validator<T>) => boolean;
  reset: () => void;
}

export function useForm<T extends Record<string, any>>(initial: T): UseFormReturn<T> {
  const [values, setValuesState] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValuesState(prev => ({ ...prev, [key]: value }));
    // clear field-level error when user types
    setErrors(prev => {
      if (prev[key]) { const next = { ...prev }; delete next[key]; return next; }
      return prev;
    });
    if (globalError) setGlobalError('');
  }, [globalError]);

  const setValues = useCallback((partial: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...partial }));
  }, []);

  const setError = useCallback((key: keyof T, msg: string) => {
    setErrors(prev => ({ ...prev, [key]: msg }));
  }, []);

  const clearErrors = useCallback(() => { setErrors({}); setGlobalError(''); }, []);

  const validate = useCallback((validator: Validator<T>): boolean => {
    const result = validator(values);
    if (result && Object.keys(result).length > 0) {
      setErrors(result);
      return false;
    }
    setErrors({});
    return true;
  }, [values]);

  const reset = useCallback(() => {
    setValuesState(initial);
    setErrors({});
    setGlobalError('');
    setLoading(false);
  }, [initial]);

  return { values, setValue, setValues, errors, setError, clearErrors, globalError, setGlobalError, loading, setLoading, validate, reset };
}

export default useForm;
