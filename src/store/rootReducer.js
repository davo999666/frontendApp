import { combineReducers } from '@reduxjs/toolkit';
import levelReducer from '../gamefighter/features/level/levelSlice';
import wordReducer from '../gamefighter/features/word/wordSlice';
import sentencesSlice from "../gamefighter/features/word/sentencesSlice.js";
import userSlice from "../gamefighter/features/user/userSlice.js";
import userDataReducer from "../features/userDataSlice.js";

import { accountApi } from "../api/apiUser.js";
import { gameApi } from "../api/apiGame.js";

const appReducer = combineReducers({
    level: levelReducer,
    word: wordReducer,
    sentences: sentencesSlice,
    user: userSlice,
    userData: userDataReducer,
    [gameApi.reducerPath]: gameApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
});

const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT') {
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;
