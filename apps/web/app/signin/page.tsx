import { Metadata } from 'next'
import SigninPage from '@/components/pages/Signin'

export const metadata: Metadata = {
  title: 'Revit - All in one place for reviews',

  // other metadata
  description: 'This is sign-in page for revit',
}

export default function Signin() {
  return <SigninPage />
}
