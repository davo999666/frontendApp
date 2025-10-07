import {API_URL} from "../config.js";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import RestorePassword from "../accounting/Guest/RestorePassword.jsx";

export const accountApi = createApi({
    reducerPath: "account",
    tagTypes: ["profile"],
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token"); // читаем токен
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (user) => ({
                url: "/login",
                method: "POST",
                body: user,
            }),
            invalidatesTags: ["profile"],
        }),

        registerUser: builder.mutation({
            query: (user) => ({
                url: "/register",
                method: "POST",
                body: user,
            }),
            invalidatesTags: ["profile"],
        }),

        sendVerifyCode: builder.mutation({
            query: ({email, code}) => ({
                url: "/verifyCode",
                method: "POST",
                body: {email, code},
            }),
            invalidatesTags: ["profile"],
        }),
        updateProfileField: builder.mutation({
            query: ({field, value, password}) => ({
                url: "/user/update",
                method: "PATCH", // or PUT depending on your backend
                body: {field, value, password},
            }),
            invalidatesTags: ["profile"],
        }),
        getProfile: builder.query({
            query: () => "/user/profile",
            providesTags: ["profile"],
        }),
        restorePassword: builder.mutation({
            query: ({email, code, newPassword}) => ({
                url: "/restorePassword",
                method: "PATCH",
                body: {email, code, newPassword},
            })
        }),
        verifyUser: builder.mutation({
            query: ({email}) => ({
                url: "/verifyUser",
                method: "POST",
                body: {email},
            })
        }),
    }),
});

export const {
    useVerifyUserMutation,
    useRestorePasswordMutation,
    useUpdateProfileFieldMutation,
    useLoginMutation,
    useRegisterUserMutation,
    useSendVerifyCodeMutation,
    useGetProfileQuery,
} = accountApi;
