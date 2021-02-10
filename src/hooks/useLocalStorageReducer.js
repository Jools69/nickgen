import { useReducer, useEffect } from 'react';

function useLocalStorageReducer(key, defaultValue, reducer) {
    // Make piece of state based on local storage, or default

    const [state, dispatch] = useReducer(reducer, defaultValue, () => {
        let val;
        try {
            val = JSON.parse(localStorage.getItem(key) || String(defaultValue));
        }
        catch (e) {
            val = defaultValue;
        }
        return val;
    });

    // Use useEffect to update local storage when state changes.
    
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);
    

    return [state, dispatch];
}

export default useLocalStorageReducer;