import { useRef, useState } from 'react'
import Input from '../Input'
import React from 'react'
import styledBox from '../../styledBox'
import Button from '@button'
import { FitLoader } from '../PageLoader'
import fetchProduct from '@/data/shopify/fetchProduct'
// import {getLang} from "../../helpers/setLang";

const NotAvailableMessageForm = styledBox('form', {
  font: 'body02',
  display: 'grid',
  gridGap: 's9',
  input: {
    width: '100%'
  }
})

const JoinTheWaitlistButton = (props) => {
  let _label = props.label ?? 'Join the waitlist'
  return (
    <Button
      {...props}
      sx={({ disabled }) => ({
        color: disabled ? 'mono500' : ['white', null, null, 'black'],
        border: [null, null, null, disabled ? '1px solid mono700' : '1px solid currentColor'],
        height: ['40px', null, null, '35px'],
        width: '100%',
        textAlign: 'center',
        font: 'body02',
        transition: '300ms',
        bg: disabled ? 'mono700' : ['black', null, null, 'transparent'],
        span: {
          display: [props.isShort ? 'none' : 'inline', null, null, 'inline']
        }
      })}
    >
      {props.disabled ? <FitLoader r={20} /> : _label}
    </Button>
  )
}

const Success = styledBox({
  font: 'heading01',
  py: 's8'
})

const NotifyForm = ({ handle, variant, isOneSize, onDismiss, onSubmitExtra }) => {
  const refWaitlistInput = useRef(null)
  const FORM_STATES = ['READY', 'SENDING', 'SUCCESS', 'ERROR']
  const [formState, setFormState] = useState(FORM_STATES[0])

  const onSubmit = async (e) => {
    e.preventDefault()
    setFormState(FORM_STATES[1])

    // const lang = getLang();

    if (onSubmitExtra) {
      onSubmitExtra()
    }

    let variantID = atob(variant.id)

    // if(lang !== 'us') {
    const product = await fetchProduct(handle, false)
    variantID = atob(product.variants.find((v) => v.sku === variant.sku).id)
    // }

    const email = refWaitlistInput.current.value
    const data = `a=XqnYKM&email=${email}&variant=${variantID.replace(
      'gid://shopify/ProductVariant/',
      ''
    )}&platform=shopify`

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
  }

  return (
    <>
      {(formState === FORM_STATES[0] || formState === FORM_STATES[1]) && (
        <NotAvailableMessageForm onSubmit={onSubmit} action={''}>
          <div>
            {variant && isOneSize
              ? `Be notified by email when this product becomes available.`
              : `Be notified by email when a size ${variant.size.label} becomes available.`}
            <Input placeholder={'Email address*'} type={'email'} required ref={refWaitlistInput} />
          </div>
          <JoinTheWaitlistButton
            type={'submit'}
            // disabled={true}
            disabled={formState === FORM_STATES[1]}
          />
        </NotAvailableMessageForm>
      )}
      {formState === FORM_STATES[2] && (
        <>
          <Success>Thank you, we have signed up your email.</Success>
          {onDismiss && <JoinTheWaitlistButton label={'OK'} onClick={onDismiss} />}
        </>
      )}
      {formState === FORM_STATES[3] && (
        <>
          <Success>An error occured. Please try again later.</Success>
          {onDismiss && <JoinTheWaitlistButton label={'OK'} onClick={onDismiss} />}
        </>
      )}
    </>
  )
}

export default NotifyForm
export { JoinTheWaitlistButton }
