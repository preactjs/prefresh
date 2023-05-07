import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

export const createContextWithoutDefault = (errorMessage) => {
  const emptyContext = Symbol();
  const context = createContext(emptyContext);
  const useCtx = () => {
    const ctx = useContext(context);
    if ((ctx) === emptyContext) {
      throw new Error(errorMessage);
    }
    return ctx;
  };
  return [context, useCtx];
};
