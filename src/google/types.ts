export interface IUser {
  email: string
  id: number
  image: string
  name: string
}

export interface ISignInResponse extends IUser{
  token: string
  tokenType: string
}

interface IRenderOption {
  scope?: string
  width?: number
  height?: number
  longtitle?: boolean
  theme?: 'light' | 'dark'
  onsuccess?: () => void
  onfailure?: () => void
}

export type IButtonRender = (
  id: string,
  option?: IRenderOption
) => void

// -----

export interface IRenderButtonOption {
  type: 'standard' | 'icon'
  theme?: 'outline' | 'filled_blue' | 'filled_black'
  size?: 'large' | 'medium' | 'small'
  shape?: 'rectangular' | 'pill' | 'circle' | 'square'
  logo_alignment?: 'left' | 'center'
  width?: string
  locale?: string
}

export type TypeGetNotDisplayedReason =
  'browser_not_supported' |
  'invalid_client' |
  'missing_client_id' |
  'opt_out_or_no_session' |
  'secure_http_required' |
  'suppressed_by_user' |
  'unregistered_origin' |
  'unknown_reason'

export type TypeGetSkippedReason =
  'auto_cancel' |
  'user_cancel' |
  'tap_outside' |
  'issuing_failed'

export type TypeGetDismissedReason =
  'credential_returned' |
  'cancel_called' |
  'flow_restarted'

export type TypeGetMomentType =
  'display' |
  'skipped' |
  'dismissed'

export type TypeSelectBy =
  'auto' |
  'user' |
  'user_1tap' |
  'user_2tap' |
  'btn' |
  'btn_confirm' |
  'btn_add_session' |
  'btn_confirm_add_session'

export interface IPromptNotification {
  isDisplayMoment: () => boolean
  isDisplayed: () => boolean
  isNotDisplayed: () => boolean
  isSkippedMoment: () => boolean
  isDismissedMoment: () => boolean
  getNotDisplayedReason: () => TypeGetNotDisplayedReason
  getSkippedReason: () => TypeGetSkippedReason
  getDismissedReason: () => TypeGetDismissedReason
  getMomentType: () => TypeGetMomentType
}

export interface ICredentialDecodedPayload {
  // hd: string
  // email: string
  // email_verified: boolean
  // azp: string
  // name: string
  // picture: string
  // given_name: string
  // family_name: string
}

export type TypeInitializeCallback = (
  payload: {
    clientId: string
    credential: string
    select_by: TypeSelectBy
  }
) => void

export type TypeRenderButton = (
  dom: HTMLElement | null,
  option?: IRenderButtonOption
) => void

export type TypePrompt = (
  callback?: (notification: IPromptNotification) => void
) => void


export interface IAccounts {
  id: {
    initialize: (
      option: {
        client_id: string
        callback?: TypeInitializeCallback
      }
    ) => void
    renderButton: TypeRenderButton
    prompt: TypePrompt
  }
  oauth2: any
}
