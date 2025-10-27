import { Metadata } from 'next'
import HomePage from '@/components/Main'

export const metadata: Metadata = {
  title: 'Revit — Where Opinions Matter',
  description:
    'Rate anything — movies, food, apps, and more. Join a community where real opinions count.',
}

export default function Main() {
  return <HomePage />
}
