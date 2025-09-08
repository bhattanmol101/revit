import { Metadata } from 'next'
import PostCard from '@revit/app/components/post/Card'

import CreatePost from '@revit/app/components/post/Create'

export const metadata: Metadata = {
  title: 'Revit - All in one place for reviews',

  // other metadata
  description: 'This is Home for Solid Pro',
}

export default function Main() {
  return (
    <main>
      <CreatePost />
    </main>
  )
}
