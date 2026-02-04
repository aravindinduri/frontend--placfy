import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getStoredToken, getSessionToken } from './authToken.js'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const sessionToken = getSessionToken();
      const token = sessionToken || getStoredToken();
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Operation', 'Plan', 'Task', 'User', 'PageContent', 'Subscription', 'Ticket', 'TicketReply', 'Employee'],
  endpoints: (builder) => ({
    // Auth
    register: builder.mutation({
      query: (body) => ({ url: 'auth/register', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),
    login: builder.mutation({
      query: (body) => ({ url: 'auth/login', method: 'POST', body }),
    }),
    loginEmployee: builder.mutation({
      query: (body) => ({
        url: 'auth/login-employee',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Employee'], // Assuming employee login invalidates employee related tags
    }),
    loginWithToken: builder.mutation({
      query: (token) => ({
        url: 'auth/login-with-token',
        method: 'POST',
        body: { token },
      }),
      invalidatesTags: ['User'],
    }),
    me: builder.query({ 
      query: () => ({ url: 'auth/me', method: 'GET' }),
      providesTags: ['User'],
    }),
    logout: builder.mutation({ 
        query: () => ({ url: 'auth/logout', method: 'POST' }),
        invalidatesTags: ['User'],
    }),

    // Content
    getPageContent: builder.query({
      query: (pageIdentifier) => `content/${pageIdentifier}`,
      providesTags: (result, error, pageIdentifier) => [{ type: 'PageContent', id: pageIdentifier }],
    }),
    updatePageContent: builder.mutation({
      query: ({ pageIdentifier, ...body }) => ({
        url: `content/${pageIdentifier}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { pageIdentifier }) => [{ type: 'PageContent', id: pageIdentifier }],
    }),

    // Operations
    getOperations: builder.query({
      query: () => 'operations',
      providesTags: ['Operation'],
    }),
    createOperation: builder.mutation({
      query: (body) => ({ url: 'operations', method: 'POST', body }),
      invalidatesTags: ['Operation'],
    }),
    updateOperation: builder.mutation({
      query: ({ id, ...body }) => ({ url: `operations/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Operation'],
    }),
    deleteOperation: builder.mutation({
      query: (id) => ({ url: `operations/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Operation'],
    }),

    // Plans
    getPlans: builder.query({
      query: () => 'plans',
      providesTags: ['Plan'],
    }),
    createPlan: builder.mutation({
      query: (body) => ({ url: 'plans', method: 'POST', body }),
      invalidatesTags: ['Plan'],
    }),
    updatePlan: builder.mutation({
      query: ({ id, ...body }) => ({ url: `plans/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Plan'],
    }),
    deletePlan: builder.mutation({
      query: (id) => ({ url: `plans/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Plan'],
    }),

    // Subscriptions
    hrSubscribe: builder.mutation({
      query: (body) => ({
        url: 'hr/subscribe',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User', 'Subscription'],
    }),
    recruiterSubscribe: builder.mutation({
      query: (body) => ({
        url: 'recruiter/subscribe',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User', 'Subscription'],
    }),
    hrRecruiterSubscribe: builder.mutation({
      query: (body) => ({
        url: 'hr-recruiter/subscribe',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User', 'Subscription'],
    }),
    getMySubscription: builder.query({
      query: () => 'subscriptions/my-subscription',
      providesTags: ['Subscription'],
    }),

    createRazorpayOrder: builder.mutation({
      query: (body) => ({
        url: 'razorpay/create-order',
        method: 'POST',
        body,
      }),
    }),

    // HR Employees
    getHrEmployees: builder.query({
      query: () => 'hr/employees',
      providesTags: ['Employee'],
    }),
    createHrEmployee: builder.mutation({
      query: (body) => ({ url: 'hr/employees', method: 'POST', body }),
      invalidatesTags: ['Employee'],
    }),
    updateHrEmployee: builder.mutation({
      query: ({ id, ...body }) => ({ url: `hr/employees/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }],
    }),
    deleteHrEmployee: builder.mutation({
      query: (id) => ({ url: `hr/employees/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Employee'],
    }),

    // Recruiter Employees
    getRecruiterEmployees: builder.query({
        query: () => 'recruiter/employees',
        providesTags: ['Employee'],
    }),
    createRecruiterEmployee: builder.mutation({
        query: (body) => ({ url: 'recruiter/employees', method: 'POST', body }),
        invalidatesTags: ['Employee'],
    }),
    updateRecruiterEmployee: builder.mutation({
        query: ({ id, ...body }) => ({ url: `recruiter/employees/${id}`, method: 'PUT', body }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }],
    }),
    deleteRecruiterEmployee: builder.mutation({
        query: (id) => ({ url: `recruiter/employees/${id}`, method: 'DELETE' }),
        invalidatesTags: ['Employee'],
    }),

    // HR-Recruiter Employees
    getHrRecruiterEmployees: builder.query({
        query: () => 'hr-recruiter/employees',
        providesTags: ['Employee'],
    }),
    createHrRecruiterEmployee: builder.mutation({
        query: (body) => ({ url: 'hr-recruiter/employees', method: 'POST', body }),
        invalidatesTags: ['Employee'],
    }),
    updateHrRecruiterEmployee: builder.mutation({
        query: ({ id, ...body }) => ({ url: `hr-recruiter/employees/${id}`, method: 'PUT', body }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }],
    }),
    deleteHrRecruiterEmployee: builder.mutation({
        query: (id) => ({ url: `hr-recruiter/employees/${id}`, method: 'DELETE' }),
        invalidatesTags: ['Employee'],
    }),

    uploadEmployeeDocument: builder.mutation({
      query: ({ id, body }) => ({
        url: `employees/${id}/documents`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }],
    }),
    updateEmployeeOperations: builder.mutation({
      query: ({ id, body }) => ({
        url: `employees/${id}/operations`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }],
    }),
    updateEmployeePassword: builder.mutation({
      query: ({ id, body }) => ({
        url: `employees/${id}/password`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }],
    }),

    // Tasks
    getTasks: builder.query({
      query: () => 'tasks',
      providesTags: ['Task'],
    }),
    createTask: builder.mutation({
      query: (body) => ({ url: 'tasks', method: 'POST', body }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...body }) => ({ url: `tasks/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({ url: `tasks/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Task'],
    }),
    addTaskUpdate: builder.mutation({
      query: ({ id, body }) => ({
        url: `tasks/${id}/updates`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
    }),

    // Users
    getAssignableUsers: builder.query({
      query: () => 'auth/assignable-users',
      providesTags: ['User'],
    }),
    getUsersByRole: builder.query({
      query: ({ role, page }) => `auth/users?role=${role}&page=${page}`,
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `auth/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `auth/users/${id}`, method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
    adminLoginAsUser: builder.mutation({
      query: (id) => ({ url: `auth/users/login-as/${id}`, method: 'POST' }),
      invalidatesTags: ['User'],
    }),

    // Help Desk / Tickets
    getMyTickets: builder.query({
        query: () => 'tickets/my-tickets',
        providesTags: (result) => 
            result ? [...result.map(({ id }) => ({ type: 'Ticket', id })), { type: 'Ticket', id: 'LIST' }] : [{ type: 'Ticket', id: 'LIST' }],
    }),
    getAllTickets: builder.query({
        query: () => 'tickets',
        providesTags: (result) =>
            result ? [...result.map(({ id }) => ({ type: 'Ticket', id })), { type: 'Ticket', id: 'LIST' }] : [{ type: 'Ticket', id: 'LIST' }],
    }),
    getTicketById: builder.query({
        query: (id) => `tickets/${id}`,
        providesTags: (result, error, id) => [{ type: 'Ticket', id }, { type: 'TicketReply', id: 'LIST' }],
    }),
    createTicket: builder.mutation({
        query: (body) => ({
            url: 'tickets',
            method: 'POST',
            body,
        }),
        invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),
    addReply: builder.mutation({
        query: ({ id, body }) => ({
            url: `tickets/${id}/replies`,
            method: 'POST',
            body,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }, { type: 'TicketReply', id: 'LIST' }],
    }),
    updateTicketStatus: builder.mutation({
        query: ({ id, ...body }) => ({
            url: `tickets/${id}/status`,
            method: 'PUT',
            body,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }],
    }),
    reopenTicket: builder.mutation({
        query: (id) => ({
            url: `tickets/${id}/reopen`,
            method: 'PUT',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Ticket', id }],
    }),
    deleteTicket: builder.mutation({
        query: (id) => ({
            url: `tickets/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLoginEmployeeMutation,
  useLoginWithTokenMutation,
  useMeQuery,
  useLazyMeQuery,
  useLogoutMutation,
  useGetPageContentQuery,
  useUpdatePageContentMutation,
  useGetOperationsQuery,
  useCreateOperationMutation,
  useUpdateOperationMutation,
  useDeleteOperationMutation,
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useHrSubscribeMutation,
  useRecruiterSubscribeMutation,
  useHrRecruiterSubscribeMutation,
  useGetMySubscriptionQuery,
  useCreateRazorpayOrderMutation,
  useGetHrEmployeesQuery,
  useCreateHrEmployeeMutation,
  useUpdateHrEmployeeMutation,
  useDeleteHrEmployeeMutation,
  useGetRecruiterEmployeesQuery,
  useCreateRecruiterEmployeeMutation,
  useUpdateRecruiterEmployeeMutation,
  useDeleteRecruiterEmployeeMutation,
  useGetHrRecruiterEmployeesQuery,
  useCreateHrRecruiterEmployeeMutation,
  useUpdateHrRecruiterEmployeeMutation,
  useDeleteHrRecruiterEmployeeMutation,
  useUploadEmployeeDocumentMutation,
  useUpdateEmployeeOperationsMutation,
  useUpdateEmployeePasswordMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useAddTaskUpdateMutation,
  useGetAssignableUsersQuery,
  useGetUsersByRoleQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useAdminLoginAsUserMutation,
  useGetMyTicketsQuery,
  useGetAllTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useAddReplyMutation,
  useUpdateTicketStatusMutation,
  useReopenTicketMutation,
  useDeleteTicketMutation,
} = api
