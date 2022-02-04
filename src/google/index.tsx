import React, { useEffect, useState } from 'react'
import { GOOGLE_JS_ID, SCRIPT_TAG, GOOGLE_ACCUNT_URL } from './constant'
import {
  ICredentialDecodedPayload,
  IAccounts,
  TypeRenderButton,
  TypePrompt,
} from './types'
import jose from 'jose'

declare global {
  interface Window {
    google: {
      accounts: IAccounts
    }
  }
}

interface IProps {
  key: string
  callback?: (payload: ICredentialDecodedPayload) => void
}

interface IDefaultValue {
  render: TypeRenderButton | unknown
  prompt: TypePrompt | unknown
}

const initialState: IDefaultValue = {
  render: undefined,
  prompt: undefined,
}

const onLoadGoogleApi = () => {
  if (document.getElementById(GOOGLE_JS_ID)) return

  const scriptTag: HTMLScriptElement = document.getElementsByTagName(SCRIPT_TAG)[0]
  const scriptElement: HTMLScriptElement = document.createElement(SCRIPT_TAG)

  scriptElement.id = GOOGLE_JS_ID
  scriptElement.src = GOOGLE_ACCUNT_URL
  scriptElement.async = true
  scriptElement.defer = true

  scriptTag.parentNode?.insertBefore(scriptElement, scriptTag)
}

const AuthContext = React.createContext<IDefaultValue>(initialState)
const AuthProvider: React.FC<IProps> = (props) => {
  const [accounts, setAccounts] = useState<IAccounts & unknown>()

  const useGoogleAccountSet = () => {
    onLoadGoogleApi()

    window.onload = () => {
      window.google.accounts.id.initialize({
        client_id: props.key,
        callback: async (credential) => {
          const { payload } = await jose.jwtVerify(credential, { type: 'RS256' })

          props.callback?.(payload)
        }
      })

      setAccounts(window.google.accounts)
    }
  }

  useEffect(useGoogleAccountSet, [])

  return (
    <AuthContext.Provider
      value={{
        render: accounts?.id.renderButton,
        prompt: accounts?.id.prompt,
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

