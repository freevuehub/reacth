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
