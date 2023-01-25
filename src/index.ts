import { IAccounts } from '~/google/types'

declare global {
  interface IInitState {
    client_id: string
    scope: string
  }

  interface Window {
    googleSDKLoaded: () => void
    gapi: {
      auth2: {
        getAuthInstance: () => {
          signIn: () => void
          signOut: () => void
          currentUser: {
            get: () => {
              getBasicProfile: () => any
              getAuthResponse: () => {
                access_token: string
                expires_at: number
                expires_in: number
                first_issued_at: number
                id_token: string
                idpId: string
                login_hint: string
                scope: string
                token_type: string
              }
            }
          }
        }
        init: (state: IInitState) => any
      }
      load: (
        type: string,
        callback: () => void
      ) => void
    }
    google: {
      accounts: IAccounts
    }
  }
}

export { default as Google } from './google'
export { default as Gapi } from './gapi'
