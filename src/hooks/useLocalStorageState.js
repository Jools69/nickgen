import { useState, useEffect } from 'react';

function useLocalStorageState(key, defaultValue) {
    // Make piece of state based on local storage, or default
    const [state, setState] = useState(() => {
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
    }, [key, state]);

    return [state, setState];
}

export default useLocalStorageState;