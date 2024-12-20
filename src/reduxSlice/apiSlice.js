import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../lib/config";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.apiUrl}/api`,
  }),
  endpoints: (builder) => ({
    logVisit: builder.mutation({
      query: (visitData) => ({
        url: "/visit", // Corresponds to the `/api/visit` endpoint
        method: "POST",
        body: visitData,
      }),
    }),
  }),
});

export const { useLogVisitMutation } = apiSlice;
