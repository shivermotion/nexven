import React from 'react';
import { IRootStore } from './MobxRoot';

export const RootStoreContext = React.createContext<IRootStore>({} as IRootStore);

export const MSTContext = () => React.useContext(RootStoreContext);

export const MSTProvider = RootStoreContext.Provider;
