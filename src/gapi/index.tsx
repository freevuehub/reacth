import React, { useEffect, useState } from 'react'
import { GOOGLE_JS_ID, SCRIPT_TAG, GOOGLE_API_URL } from './constant'
import { IUser, IButtonRender } from './types'

interface IDefaultValue {
  signIn: any
  signOut: any
  user: IUser
  render: IButtonRender
}

interface IProps {
  clientKey: string
  scope?: string
  children: React.ReactElement
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
  render: () => {},
  user: initialUserState
}

const onLoadGoogleApi = () => {
  if (document.getElementById(GOOGLE_JS_ID)) return

  const scriptTag: HTMLScriptElement = document.getElementsByTagName(SCRIPT_TAG)[0]
  const scriptElement: HTMLScriptElement = document.createElement(SCRIPT_TAG)

  scriptElement.id = GOOGLE_JS_ID
  scriptElement.src = GOOGLE_API_URL
  scriptElement.async = true
  scriptElement.defer = true

  scriptTag.parentNode?.insertBefore(scriptElement, scriptTag)
}

const AuthContext = React.createContext<IDefaultValue>(initialState)
const AuthProvider: React.FC<IProps> = (props) => {
  const [googleAuth, setGoogleAuth] = useState<any>()
  const [signIn2, setSignIn2] = useState<any>()

  const onGoogleSDKLoad = () => {
    const onGapiLoad = async () => {
      const googleAuth = await window.gapi.auth2.init({
        client_id: props.clientKey,
        scope: props?.scope || 'profile email',
      })

      setGoogleAuth(googleAuth)
      setSignIn2(window.gapi.signin2)
    }

    window.gapi.load('auth2', onGapiLoad)
  }

  const useMountedEffect = () => {
    onLoadGoogleApi()

    window.onload = () => {
      onGoogleSDKLoad()
    }
  }

  useEffect(useMountedEffect, [props.clientKey])

  return (
    <AuthContext.Provider
      value={{
        signIn: googleAuth?.signIn,
        signOut: googleAuth?.signOut,
        user: googleAuth?.currentUser.get().getBasicProfile(),
        render: signIn2?.render
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

AuthProvider.defaultProps = {
  scope: 'profile email'
}

export default {
  Provider: AuthProvider,
  Context: AuthContext,
}
