import React, { useEffect } from 'react'
import { GOOGLE_JS_ID, SCRIPT_TAG, GOOGLE_API_URL } from './constant'
import { IUser } from './types'

interface IDefaultValue {
  signIn: any
  signOut: any
  user: IUser
}

interface IProps {
  clientKey: string
  children: React.ReactElement
  Suspense?: React.ReactElement
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

const onLoadGoogleApi = (load: () => void) => {
  if (document.getElementById(GOOGLE_JS_ID)) return

  const scriptTag: HTMLScriptElement = document.getElementsByTagName(SCRIPT_TAG)[0]
  const scriptElement: HTMLScriptElement = document.createElement(SCRIPT_TAG)

  scriptElement.id = GOOGLE_JS_ID
  scriptElement.src = GOOGLE_API_URL
  scriptElement.async = true
  scriptElement.defer = true
  scriptElement.onload = load

  scriptTag.parentNode?.insertBefore(scriptElement, scriptTag)
}

const AuthContext = React.createContext<IDefaultValue>(initialState)
const AuthProvider: React.FC<IProps> = (props) => {
  const onGoogleSDKLoad = (client_id: string, scope: string) => {
    const onGapiLoad = async () => {
      await window.gapi.auth2.init({
        client_id,
        scope,
      })
    }

    window.gapi.load('auth2', onGapiLoad)
  }

  const useMountedEffect = () => {
    onLoadGoogleApi(() => {
      onGoogleSDKLoad(props.clientKey, 'profile email')
    })
  }

  useEffect(useMountedEffect, [])

  const signIn = async () => {
    await window.gapi.auth2.getAuthInstance().signIn()

    return window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse()
  }
  const signOut = async () => {
    await window.gapi.auth2.getAuthInstance().signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user: window.gapi?.auth2.getAuthInstance().currentUser.get().getBasicProfile()
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export default {
  Provider: AuthProvider,
  Context: AuthContext,
}
