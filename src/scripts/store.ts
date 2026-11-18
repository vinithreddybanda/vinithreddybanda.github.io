export type Listener<T> = (value: T) => void;

export function createStore<T>(initialValue: T) {
  let value = initialValue;
  const listeners = new Set<Listener<T>>();
  return {
    get: () => value,
    set(nextValue: T) {
      if (Object.is(value, nextValue)) return;
      value = nextValue;
      listeners.forEach((listener) => listener(value));
    },
    subscribe(listener: Listener<T>) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
