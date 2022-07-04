import type { NextPage } from 'next';
import type { FC } from 'react';
import { useCallback, useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSignMessage, useDisconnect } from 'wagmi'
import { SiweMessage } from 'siwe'
import { useUser } from '@/hooks/useUser';



const Home: NextPage = () => {
  const { disconnect } = useDisconnect()
  const { user, isLoading, refetchUser } = useUser()
  const { address, isConnected } = useAccount()

  useEffect(() => {
    if (isConnected && !user?.address && !isLoading) {
      signIn()
    }
  }, [isConnected, user?.address, isLoading])



  useAccount({
    async onDisconnect() {
      await fetch('/api/logout')
      refetchUser()
    },
  })

  const { chain: activeChain } = useNetwork()
  const { signMessageAsync } = useSignMessage()


  const signIn = async () => {
    try {
      const chainId = activeChain?.id
      if (!address || !chainId) return

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

    } catch (error: any) {
      console.log('failed sign in')
      disconnect()
    }
  }

  return (
    <div className='py-6 justify-center text-center' >
      <div className='flex justify-center'>
        <ConnectButton />
      </div>
    </div >
  );
};


export default Home;
