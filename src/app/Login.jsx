import { useState, useEffect } from 'react'
import { Button } from '../components/Button'
import { SelectField, TextField } from '../components/Fields'
import Logo from '../components/Logo'
import { Airtable } from '../api/Airtable'

function Login () {

  const base = new Airtable()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const createAccount = () => {
    let user = {
      email: email,
      password: password,
    }

    base.loginUser(email, password)
    .then(response => {
        console.log(response)
        if (response.fields) {
            window.location.href = '/dashboard'
        } else {
            alert('Invalid credentials')
        }
    })
  }

  return (
    <>
      <div className='grid grid-cols-2 min-h-screen'>
        <div className='p-16'>
          <div className="flex flex-col">
            <a href="/" aria-label="Home">
              <Logo className="" />
            </a>
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-700">
                Don’t have an account? {' '}
                <a
                  href="/register"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign up
                </a>
                {' '}for a free trial.
              </p>
            </div>
          </div>
          <form
            action="#"
            className="mt-10 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2"
          >
            <TextField
              className="col-span-full"
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              className="col-span-full"
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <div className="col-span-full">
              <Button
                type="button"
                variant="solid"
                color="slate"
                className="w-full"
                onClick = {createAccount}
              >
                <span>
                  Log in <span aria-hidden="true">&rarr;</span>
                </span>
              </Button>
            </div>
          </form>
        </div>
        <div className='bg-blue-600'></div>
      </div>
    </>
  )
}

export default Login;