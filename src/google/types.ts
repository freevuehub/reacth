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
