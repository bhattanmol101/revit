import type { Metadata } from 'next'
import { NextTamaguiProvider } from '@revit/app/provider/NextTamaguiProvider'
import { AuthProvider } from '@revit/app/Provider/auth/AuthProvider'

export const metadata: Metadata = {
  title: 'Tamagui • App Router',
  description: 'Tamagui, Solito, Expo & Next.js',
  icons: '/favicon.ico',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // You can use `suppressHydrationWarning` to avoid the warning about mismatched content during hydration in dev mode
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextTamaguiProvider>
          <AuthProvider>{children}</AuthProvider>
        </NextTamaguiProvider>
      </body>
    </html>
  )
}
