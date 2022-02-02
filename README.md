# Reacth (React-Auth)

## Installation

NPM: `npm install @freevuehub/reacth --save`

Yarn: `yarn add @freevuehub/reacth`

## Usage

### Google

```tsx
import React from 'react'
import { Google } from '@freevuehub/reacth'

const CLIENT_KEY = '<Google OAuth Client Key>'
const App: React.FC = (props) => {
  return (
    <Google.Provider client-key={CLIENT_KEY}>
      {props.children}
    </Google.Provider>
  )
}
```

```tsx
import React, { useContext } from 'react'
import { Google } from '@freevuehub/reacth'

const Home: React.FC = (props) => {
  const { signIn, signOut, user } = useContext(Google.Context)
  
  const onSignInClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    
    await signIn()
  }
  const onSignOutClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    await signOut()
  }
  
  return (
    <>
      <div>
        <button onClick={onSignInClick}>Sign In</button>
        <button onClick={onSignOutClick}>Sign Out</button>
      </div>
      <h1>{user.name}</h1>
    </>
  )
}
```

#### User Response Data

| Key | Type |
| --- | --- |
| id | Int |
| name | String |
| email | String |
| image | String |
