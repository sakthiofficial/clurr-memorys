import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../lib/config";
import { roleNames } from "../../shared/cpNamings";

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
        url: `/user?id=${id}`,
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
    addUsers: builder.mutation({
      query: (usersData) => ({
        url: `/user`,
        method: "POST",
        body: usersData,
      }),
    }),
    getRealtionshipManager: builder.query({
      query: (usersData) => ({
        url: `/user/retriveUserByRole/${roleNames?.cpRm}`,
        method: "GET",
        body: usersData,
      }),
    }),
    addCp: builder.mutation({
      query: (cpData) => ({
        url: `/cpManagenent`,
        method: "POST",
        body: cpData,
      }),
    }),
    getCp: builder.query({
      query: () => ({
        url: `/cpManagenent`,
        method: "GET",
      }),
    }),
    // getLeads: builder.query({
    //   query: (selectedProject) => ({
    //     url: `/lead?project=${selectedProject}`,
    //     method: "GET",
    //   }),
    // }),
    addLead: builder.mutation({
      query: (leadData) => ({
        url: `/lead`,
        method: "GET",
        body: leadData,
      }),
    }),
    getProject: builder.query({
      query: () => ({
        url: `/project`,
        method: "GET",
      }),
    }),
    getLeadsByDate: builder.query({
      query: (data) => ({
        url: `/lead?project=${data.selectedProject}&leadStartDate=${data.selectedStartDate}&leadEndDate=${data.selectedEndDate}`,
        method: "GET",
      }),
    }),
    cpDelete: builder.mutation({
      query: (CpCode) => ({
        url: `/cpManagenent?cpCode=${CpCode}`,
        method: "DELETE",
      }),
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/user/retriveUserById/${id}`,
        method: "GET",
      }),
    }),
    getProjectWithPermission: builder.query({
      query: () => ({
        url: `/project`,
        method: "GET",
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
  useAddUsersMutation,
  useGetRealtionshipManagerQuery,
  useAddCpMutation,
  useGetCpQuery,
  useGetLeadsQuery,
  useAddLeadMutation,
  useGetProjectQuery,
  useGetLeadsByDateQuery,
  useCpDeleteMutation,
  useGetUserByIdQuery,
  useGetProjectWithPermissionQuery,
} = apiSlice;
