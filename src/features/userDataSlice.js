import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    userData: {},
}

const userDataSlice = createSlice({
    name: "userData",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.userData = action.payload;
        },
        clearUser: (state) => {
            state.userData = {};
        },
    }
})

export const { addUser, clearUser } = userDataSlice.actions;
export default userDataSlice.reducer;