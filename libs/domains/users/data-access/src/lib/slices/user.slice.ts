import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { MembersApi } from 'qovery-typescript-axios'
import { ToastEnum, toast, toastError } from '@qovery/shared/ui'
import { type RootState } from '@qovery/state/store'
import { type UserInterface } from '../interfaces'

export const USER_KEY = 'user'

const membersApi = new MembersApi()

export const acceptMembershipInvitation = createAsyncThunk(
  'user/accept-membership-invitation',
  async (payload: { organizationId: string; inviteId: string }) => {
    // transfer ownership for member
    return await membersApi.postAcceptInviteMember(payload.organizationId, payload.inviteId, {})
  }
)

export const fetchMemberInvitation = createAsyncThunk(
  'user/get-membership-invitation',
  async (payload: { organizationId: string; inviteId: string }) => {
    // transfer ownership for member
    return await membersApi.getMemberInvitation(payload.organizationId, payload.inviteId)
  }
)

export const initialUserState: UserInterface = {
  isLoading: false,
  isAuthenticated: false,
  token: null,
}

export const userSlice = createSlice({
  name: USER_KEY,
  initialState: initialUserState,
  reducers: {
    add(state, action) {
      return action.payload
    },
    remove() {
      return initialUserState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(acceptMembershipInvitation.fulfilled, (state: UserInterface) => {
        toast(ToastEnum.SUCCESS, 'Invitation Accepted')
      })
      .addCase(acceptMembershipInvitation.rejected, (state: UserInterface, action) => {
        toast(ToastEnum.ERROR, 'Invitation Member', 'The invitation can not be accepted. ' + action.error.message)
      })
      .addCase(fetchMemberInvitation.rejected, (state: UserInterface, action) => {
        toastError(action.error, 'Invitation Member', 'This member invitation is not correct')
      })
  },
})

export const userReducer = userSlice.reducer

export const userActions = userSlice.actions

export const getUserState = (rootState: RootState): UserInterface => rootState[USER_KEY]

/**
 *
 * @deprecated This should be migrated to the new `use-user-account` hook
 */
export const selectUser = createSelector(getUserState, (state) => state)
