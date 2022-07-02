import type { NextPage } from 'next';
import type { FC } from 'react';
import { useCallback, useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'

const Home: NextPage = () => {

  // Fetch user when:
  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch('/api/hello')
        const json = await res.json()
        setState((x) => ({ ...x, address: json.address }))
      } catch (_error) { }
    }
    // 1. page loads
    handler()

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [])
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log('Connected', { address, connector, isReconnected })
      console.log({ state })
      if (!state.address) {
        signIn()
      }
    },
  })

  const [state, setState] = useState<{
    address?: string
    error?: Error
    loading?: boolean
  }>({})
  const { address, isConnected } = useAccount()
  const { chain: activeChain } = useNetwork()
  const { signMessageAsync } = useSignMessage()


  const signIn = useCallback(async () => {
    try {
      const chainId = activeChain?.id
      if (!address || !chainId) return

      setState((x) => ({ ...x, error: undefined, loading: true }))
      // Fetch random nonce, create SIWE message, and sign with wallet
      const nonceRes = await fetch('/api/nonce')
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: await nonceRes.text(),
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })

      // Verify signature
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      })
      if (!verifyRes.ok) throw new Error('Error verifying message')

      setState((x) => ({ ...x, address, loading: false }))
    } catch (error) {
      setState((x) => ({ ...x, error, loading: false }))
    }
  }, [])

  return (
    <div className='py-6 justify-center text-center' >
      <div className='flex justify-center'>
        <ConnectButton />

      </div>
      {state.address && <div>
        {/* Account content goes here */}

        <div>
          <div>Signed in as {state.address}</div>
          <button
            onClick={async () => {
              await fetch('/api/logout')
              setState({})
            }}
          >
            Sign Out
          </button>
        </div>

      </div>}

    </div >
  );
};


export default Home;
