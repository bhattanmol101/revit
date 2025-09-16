'use client'

import PostCard from '@revit/shared/components/post/Card'
import { useSession } from '../Provider/ContextProvider'

function HomePage() {
  const { user } = useSession()

  if (!user) {
    return
  }

  console.log(user)

  return <PostCard />
}

export default HomePage
