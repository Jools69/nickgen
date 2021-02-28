import React, { createContext } from 'react';
import { nickGenReducer } from '../reducers/nickGenReducer';
import useLocalStorageReducer from '../hooks/useLocalStorageReducer';
import initialNickGenState from '../data/initialNickGenState';

export const NickGenContext = createContext();
export const DispatchContext = createContext();

export function NickGenProvider(props) {
    const [state, dispatch] = useLocalStorageReducer('nickGenState', initialNickGenState, nickGenReducer);

    return (
        <NickGenContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {props.children}
            </DispatchContext.Provider>
        </NickGenContext.Provider>
    );
}