import { IButtonRender } from '~/gapi/types'
import { IAccounts } from '~/google/types'

declare global {
  interface IInitState {
    client_id: string
    scope: string
  }

  interface Window {
    googleSDKLoaded: () => void
    gapi: {
      signin2: {
        render: IButtonRender
      },
      load: (
        type: string,
        callback: () => void
      ) => void
      auth2: {
        init: (state: IInitState) => any
      }
    }
    google: {
      accounts: IAccounts
    }
  }
}

export { default as Google } from './google'
export { default as Gapi } from './gapi'
