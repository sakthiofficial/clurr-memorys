import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../lib/config";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.apiUrl}/api`,
  }),
  endpoints: (builder) => ({
    // addFormData: builder.mutation({
    //   query: (formData) => ({
    //     url: "/user/authenticate",
    //     method: "POST",
    //     body: formData,
    //   }),
    //   transformResponse: (res) => res.result,
    // }),
    loginUserData: builder.mutation({
      query: (formData) => ({
        url: "/user/authenticate",
        method: "POST",
        body: formData,
      }),
    }),
    getUsers: builder.query({
      query: (formData) => ({
        url: "/user",
        method: "GET",
        body: formData,
      }),
    }),
    deleteUsers: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
        body: id,
      }),
    }),
    getParents: builder.query({
      query: (id) => ({
        url: `/user/parentUsers`,
        method: "POST",
        body: id,
      }),
    }),
  }),
});

export const {
  useAddFormDataMutation,
  useLoginUserDataMutation,
  useGetUsersQuery,
  useDeleteUsersMutation,
  useGetParentsQuery,
} = apiSlice;
