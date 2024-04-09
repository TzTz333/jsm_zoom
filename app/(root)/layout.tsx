import StreamCallProvider from '@/providers/StreamClientProvider'
import { Metadata } from 'next';
import React, { Children, ReactNode } from 'react'

export const metadata: Metadata = {
  title: "Yoom",
  description: "Video calling app",
  icons: {
    icon: '/icons/logo.svg',
  }
};

const RootLayout = ({children}:{children:ReactNode}) => {
  return (
    <main>
      <StreamCallProvider>
        {children}
      </StreamCallProvider>
    </main>
  )
}

export default RootLayout
