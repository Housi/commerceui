import { useRef, useState } from 'react'
import React from 'react'

import { theme } from '@theme'
import styled from '@emotion/styled'
import { ButtonPrimary } from '@button'

const Root = styled.div`
  ${theme.size.s('padding')}
  display: grid;
  p {
    ${theme.font.body02}
    margin-bottom: 1em;
    &.error {
      color: ${theme.colors.red};
    }
  }
`
const NotAvailableMessageForm = styled.form`
  display: grid;
  ${theme.size.xs('grid-gap')}

  h2 {
    ${theme.font.caps06}
  }

  input {
    appearance: none;
    border-radius: 0;
    ${theme.font.body02}
    height: 60px;
    border: 1px solid ${theme.colors.mono200};
    margin: 0;
    &:focus {
      border-color: ${theme.colors.mono900};
    }
    padding: 0 1em;
  }
`

const WaitlistForm = ({ variant, isOneSize, onDismiss, title }) => {
  const refWaitlistInput = useRef(null)
  const FORM_STATES = ['READY', 'SENDING', 'SUCCESS', 'ERROR']
  const [formState, setFormState] = useState(FORM_STATES[0])

  const onSubmit = async (e) => {
    e.preventDefault()
    setFormState(FORM_STATES[1])

    const variantID = atob(variant.id).replace('gid://shopify/ProductVariant/', '')

    const email = refWaitlistInput.current.value
    const data = `a=kE6WEv&email=${email}&variant=${variantID}&platform=shopify`

    fetch('/api/klaviyo_waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(async (response) => {
        let res = await response.json()

        console.log(res)

        if (res.status === 400) {
          setFormState(FORM_STATES[3])
        } else {
          setFormState(FORM_STATES[2])
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        setFormState(FORM_STATES[3])
      })

    setTimeout(() => {
      setFormState(FORM_STATES[2])
    }, 1000)
  }

  return (
    <Root>
      {(formState === FORM_STATES[0] || formState === FORM_STATES[1]) && (
        <NotAvailableMessageForm onSubmit={onSubmit} action={''}>
          <h2>{title}</h2>
          <p>
            {variant && isOneSize
              ? `Be notified by email when this product becomes available.`
              : `Be notified by email when a ${variant.title} becomes available.`}
          </p>
          <input
            placeholder={'Email address*'}
            type={'email'}
            required
            id={'waitlist_form_input'}
            ref={refWaitlistInput}
          />
          <ButtonPrimary type={'submit'} disabled={formState === FORM_STATES[1]}>
            Add to waitlist
          </ButtonPrimary>
        </NotAvailableMessageForm>
      )}
      {formState === FORM_STATES[2] && (
        <>
          <p>Thank you, we have signed up your email.</p>
          {onDismiss && <ButtonPrimary onClick={onDismiss}>ok</ButtonPrimary>}
        </>
      )}
      {formState === FORM_STATES[3] && (
        <>
          <p className="error">An error occured. Please try again later.</p>
          <ButtonPrimary onClick={() => setFormState(FORM_STATES[0])}>ok</ButtonPrimary>
        </>
      )}
    </Root>
  )
}

export default WaitlistForm
