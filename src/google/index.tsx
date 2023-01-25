import React, { useEffect, useState } from 'react'
import {
  GOOGLE_ACCOUNTS_ID,
  SCRIPT_TAG,
  GOOGLE_ACCOUNT_URL
} from './constant'
import {
  ICredentialDecodedPayload,
  IAccounts,
  TypeRenderButton,
  TypePrompt,
} from './types'

interface IProps {
  clientKey: string
  callback?: (payload: ICredentialDecodedPayload) => void
  children: React.ReactElement
}

interface IDefaultValue {
  render: TypeRenderButton | unknown
  prompt: TypePrompt | unknown
  credential: string
}

const onLoadGoogleSDK = (id: string, url: string) => {
  if (document.getElementById(id)) return

  const scriptTag: HTMLScriptElement = document.getElementsByTagName(SCRIPT_TAG)[0]
  const scriptElement: HTMLScriptElement = document.createElement(SCRIPT_TAG)

  scriptElement.id = id
  scriptElement.src = url
  scriptElement.async = true
  scriptElement.defer = true

  scriptTag.parentNode?.insertBefore(scriptElement, scriptTag)
}

const AuthContext = React.createContext<IDefaultValue | null>(null)
const AuthProvider: React.FC<IProps> = (props) => {
  const [accounts, setAccounts] = useState<IAccounts & unknown>()
  const [credential, setCredential] = useState<string>('')

  const useGoogleAccountSet = () => {
    onLoadGoogleSDK(GOOGLE_ACCOUNTS_ID, GOOGLE_ACCOUNT_URL)

    window.addEventListener('load', () => {
      window.google.accounts.id.initialize({
        client_id: props.clientKey,
        callback: ({ credential }) => {
          setCredential(credential)
        }
      })

      setAccounts(window.google.accounts)
    })
  }

  useEffect(useGoogleAccountSet, [props.clientKey])

  return (
    <AuthContext.Provider
      value={{
        credential,
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
