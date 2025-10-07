// /src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { accountApi } from "../api/apiUser.js";
import { gameApi } from "../api/apiGame.js";

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(gameApi.middleware)
            .concat(accountApi.middleware),
});
