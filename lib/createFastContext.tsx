import React, {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";

import {get as lodashGet, set as lodashSet} from "lodash"

export default function createFastContext<Store>(initialState: Store) {
  function useStoreData(): {
    get: () => Store;
    set: (value: Partial<Store>) => void;
    subscribe: (callback: () => void) => () => void;
    store: {current: Store}
  } {
    const store = useRef(initialState);

    const get = useCallback(() => store.current, []);

    const subscribers = useRef(new Set<() => void>());

    const set = useCallback((value: Partial<Store>) => {
      store.current = { ...store.current, ...value };
      subscribers.current.forEach((callback) => callback());
    }, []);

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      set,
      subscribe,
      store
    };
  }

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

  const StoreContext = createContext<UseStoreDataReturnType | null>(null);

  function Provider({ children }: { children: React.ReactNode }) {
    return (
      <StoreContext.Provider value={useStoreData()}>
        {children}
      </StoreContext.Provider>
    );
  }

  function useStore<SelectorOutput>(
    selector: string
  ): [SelectorOutput, (value: Partial<Store> | null) => void] {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error("Store not found");
    }

    const selectFunction = useCallback(()=>{
      return lodashGet(store.get(), selector)
    }, [store, selector])

    const setFunction = useCallback((v: any)=> {
      store.set(lodashSet({}, selector, v))
    }, [store, selector])

    const state = useSyncExternalStore(
      store.subscribe,
      selectFunction
    );

    return [state, setFunction];
  }

  return {
    Provider,
    useStore,
    Context: StoreContext
  };
}
