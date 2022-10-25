import { configureStore,combineReducers } from "@reduxjs/toolkit";
import workspaceReducer from './workspaceRedux'
import userReducer from './userRedux'
import collectionReducer from './collectionRedux'
import requestReducer from './requestRedux'

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
  import storage from 'redux-persist/lib/storage'

  const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  }
  
  const rootReducer = combineReducers({user:userReducer, workspace:workspaceReducer, collection:collectionReducer, request:requestReducer})

  const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
    }),
    
});

export let persistor = persistStore(store)
