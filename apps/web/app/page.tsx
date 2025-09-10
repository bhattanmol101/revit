import { Metadata } from 'next'
import SigninPage from '@/app/pages/Signin'

export const metadata: Metadata = {
  title: 'Revit - All in one place for reviews',

  // other metadata
  description: 'This is Home for Solid Pro',
}

export default function Main() {
  return <SigninPage />
}
