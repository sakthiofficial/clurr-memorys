import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../lib/config";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.apiUrl}/api`,
  }),
  endpoints: (builder) => ({
    addFormData: builder.mutation({
      query: (formData) => ({
        url: "/formData",
        method: "POST",
        body: formData,
      }),
      transformResponse: (res) => res.result,
    }),
  }),
});

export const { useAddFormDataMutation } = apiSlice;
