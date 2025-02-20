import React, { useEffect, useState } from 'react'
import { useAuth, AuthStatus } from '@w3ui/react-keyring'

export default function ContentPage () {
  const { authStatus, identity, loadDefaultIdentity, registerAndStoreIdentity, unloadIdentity, cancelRegisterAndStoreIdentity } = useAuth()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // eslint-disable-next-line
  useEffect(() => { loadDefaultIdentity() }, []) // try load default identity - once.

  if (authStatus === AuthStatus.SignedIn) {
    return (
      <div>
        <h1 className='near-white'>Welcome {identity.email}!</h1>
        <p>You are logged in!!</p>
        <form onSubmit={e => { e.preventDefault(); unloadIdentity() }}>
          <button type='submit' className='ph3 pv2'>Sign Out</button>
        </form>
      </div>
    )
  }

  if (authStatus === AuthStatus.EmailVerification) {
    return (
      <div>
        <h1 className='near-white'>Verify your email address!</h1>
        <p>Click the link in the email we sent to {identity.email} to sign in.</p>
        <form onSubmit={e => { e.preventDefault(); cancelRegisterAndStoreIdentity() }}>
          <button type='submit' className='ph3 pv2'>Cancel</button>
        </form>
      </div>
    )
  }

  const handleRegisterSubmit = async e => {
    e.preventDefault()
    setSubmitted(true)
    try {
      await registerAndStoreIdentity(email)
    } catch (err) {
      throw new Error('failed to register', { cause: err })
    } finally {
      setSubmitted(false)
    }
  }

  return (
    <form onSubmit={handleRegisterSubmit}>
      <div className='mb3'>
        <label htmlFor='email' className='db mb2'>Email address:</label>
        <input id='email' className='db pa2 w-100' type='email' value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <button type='submit' className='ph3 pv2' disabled={submitted}>Register</button>
    </form>
  )
}
