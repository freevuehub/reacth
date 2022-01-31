import React, { useEffect, useState } from 'react'
import { GOOGLE_JS_ID, SCRIPT_TAG, GOOGLE_API_URL } from './constant'
import { ISignInResponse, IUser } from './types'

declare global {
  interface IInitState {
    client_id: string
    scope: string
  }

  interface Window {
    googleSDKLoaded: () => void
    gapi: {
      load: any
      auth2: {
        init: (state: IInitState) => any
      }
    }
  }
}

interface IDefaultValue {
  signIn: any
  signOut: any
  user: IUser
}

interface IProps {
  clientKey: string
  scope?: string
}

const initialUserState = {
  email: '',
  id: 0,
  image: '',
  name: '',
}
const initialState = {
  signIn: null,
  signOut: null,
  user: initialUserState
}

const onLoadGoogleApi = () => {
  if (document.getElementById(GOOGLE_JS_ID)) return

  const scriptTag: HTMLScriptElement = document.getElementsByTagName(SCRIPT_TAG)[0]
  const scriptElement: HTMLScriptElement = document.createElement(SCRIPT_TAG)

  scriptElement.id = GOOGLE_JS_ID
  scriptElement.src = GOOGLE_API_URL

  scriptTag.parentNode?.insertBefore(scriptElement, scriptTag)
}

const AuthContext = React.createContext<IDefaultValue>(initialState)
const AuthProvider: React.FC<IProps> = (props) => {
  const [signOut, setSignOut] = useState<Function>()
  const [signIn, setSignIn] = useState<Function>()
  const [user, setUser] = useState<IUser>(initialUserState)

  const onGoogleSDKLoad = () => {
    const onGapiLoad = async () => {
      const googleAuth = await window.gapi.auth2.init({
        client_id: props.clientKey,
        scope: props?.scope || 'profile email',
      })
      const onSignOut = () => () => new Promise<{}>(async (resolve, reject) => {
        await googleAuth.signOut()

        try {
          return resolve({})
        } catch (error) {
          return reject(error)
        }
      })
      const onSignIn = () => () => new Promise<ISignInResponse>(async (resolve, reject) => {
        const data = await googleAuth.signIn()
        const auth = await data.getAuthResponse()

        const profile = data.getBasicProfile()

        try {
          return resolve({
            token: auth.id_token,
            tokenType: auth.token_type,
            email: profile.getEmail(),
            id: profile.getId(),
            image: profile.getImageUrl(),
            name: profile.getName(),
          })
        } catch (error) {
          return reject(error)
        }
      })

      const currentUser = googleAuth.currentUser.get()
      const profile = currentUser.getBasicProfile()

      setSignIn(onSignIn)
      setSignOut(onSignOut)
      setUser({
        email: profile?.getEmail(),
        id: profile?.getId(),
        image: profile?.getImageUrl(),
        name: profile?.getName(),
      })
    }

    window.gapi.load('auth2', onGapiLoad)
  }

  const useMountedEffect = () => {
    window.googleSDKLoaded = onGoogleSDKLoad

    onLoadGoogleApi()
  }

  useEffect(useMountedEffect, [])

  return (
    <AuthContext.Provider
      value={{
    signIn,
      signOut,
      user,
  }}
>
  {props.children}
  </AuthContext.Provider>
)
}

AuthProvider.defaultProps = {
  scope: 'profile email'
}

export { AuthContext }

export default AuthProvider
