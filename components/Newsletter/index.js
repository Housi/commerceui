import React, { useState, useRef } from 'react'
import styled from '@emotion/styled'
import { mq, theme } from '@theme'
import ButtonRaw from '../Button'
import { useAnalytics } from '@/hooks/Analytics'

const Root = styled.div`
  position: relative;
`
const Form = styled.form`
  display: flex;
  border-bottom: 2px solid black;
  transition: opacity 200ms;
  ${(props) => (props.disabled ? 'opacity: 0.5;' : '')}
  input {
    flex-grow: 1;
    appearance: none;
    border: none;
    ${theme.font.caps07}
    padding: 14px 0;
    &:disabled {
      background: none;
    }
  }
  button {
    ${theme.font.caps02}
    padding: 10px 0;
    &:disabled {
      background: none;
    }
  }
`
const Status = styled.div`
  ${theme.font.caps07}
  position: absolute;
  top: 100%;
  margin-top: 4px;
`
const Newsletter = () => {
  const STATES = ['READY', 'INPUT_HAS_ERROR', 'BUSY', 'SENT_SUCCESS', 'SENT_ERROR']

  const Analytics = useAnalytics()
  // const [firstFocus, setFirstFocus] = useState(false);
  // const [policyAcceptanceError, setPolicyAcceptanceError] = useState(false);
  const [mainState, setMainState] = useState(STATES[0])
  const [errorMessage, setErrorMessage] = useState(null)
  const [inputValue, setInputValue] = useState('')

  const refInput = useRef(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    // console.log("### NEWSLETTER SUBMIT ###", refInput.current.value);

    setMainState(STATES[2])

    const email = inputValue

    console.log('email', email)
    let _data = {
      profiles: [
        {
          email: email,
          source: 'website_footer'
        }
      ]
    }

    fetch('/api/klaviyo_subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(_data)
    })
      .then(async (response) => {
        let res = await response.json()

        console.log('newsletterSignUp', response, res)

        if (response.status === 200) {
          setMainState(STATES[3])
          setTimeout(() => {
            setMainState(STATES[0])
          }, 10000)

          Analytics.newsletterSignup(email)
        } else {
          setMainState(STATES[4])
          // setErrorMessage(res.detail);
          setErrorMessage('An error occurred, please try again later.')
          setTimeout(() => {
            setMainState(STATES[0])
          }, 10000)
        }
      })
      .catch((error) => {
        setMainState(STATES[4])
        setErrorMessage('An error occurred, please refresh this page and try again.')
        setTimeout(() => {
          setMainState(STATES[0])
        }, 10000)
        console.error('Error:', error)
      })
  }

  return (
    <Root>
      <Form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder={'Get 15% off first order'}
          value={inputValue}
          required
          onChange={(e) => setInputValue(e.target.value)}
          disabled={mainState === STATES[2]}
        />
        <ButtonRaw type={'submit'} disabled={mainState === STATES[2]}>
          {mainState === STATES[2] ? 'sending' : 'Sign up'}
        </ButtonRaw>
      </Form>
      <Status>
        {mainState === STATES[3] && 'Thank you for subscribing.'}
        {mainState === STATES[4] && errorMessage}
      </Status>
    </Root>
  )
}

export default Newsletter
