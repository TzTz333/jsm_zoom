import StreamCallProvider from '@/providers/StreamClientProvider'
import React, { Children, ReactNode } from 'react'

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
