import React from 'react'
import styled from '@emotion/styled'

const radius = '30px'
const thickness = '2px'
const track = `${thickness} solid rgba(200,200,200,0.2)`
const ride = `${thickness} solid rgba(200,200,200)`

const Spinner = styled.div`
  width: ${(props) => props.r ?? '100%'};
  height: ${(props) => props.r ?? '100%'};
  border-radius: 50%;
  position: relative;
  border-top: ${track};
  border-right: ${track};
  border-bottom: ${track};
  border-left: ${ride};
  transform: translateZ(0);
  animation: load8 0.8s infinite linear;
  div {
    width: ${(props) => props.r ?? '100%'};
    height: ${(props) => props.r ?? '100%'};
    border-radius: 50%;
  }
  @keyframes load8 {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const Root = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;
`
const AdaptiveLoaderRoot = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FitLoader = ({ r }) => {
  return (
    <AdaptiveLoaderRoot>
      <Spinner className={'spinner'} r={radius}>
        <div />
      </Spinner>
    </AdaptiveLoaderRoot>
  )
}

const PageLoader = () => {
  return (
    <Root>
      <FitLoader r={radius} />
    </Root>
  )
}

export default PageLoader

export { FitLoader }
