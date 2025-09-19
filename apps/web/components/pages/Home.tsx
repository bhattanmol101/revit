'use client'

import PostCard from '@revit/app/features/post/Card'
import { useSession } from '../Provider/ContextProvider'
import { useEffect, useState } from 'react'
import { fetchUserFeed } from '@revit/api/post/feed'
import { PostT } from '@revit/shared/types/post'
import { Spinner, useToastController, View } from '@revit/ui'

function HomePage() {
  const toast = useToastController()

  const { user } = useSession()

  if (!user) {
    return
  }

  const [loading, setLoading] = useState(true)
  const [feed, setFeed] = useState<PostT[]>([])

  const fetchFeed = async () => {
    const { feed, error } = await fetchUserFeed()

    setLoading(false)

    if (error) {
      toast.show('Failed to fetch posts!', {
        message: 'Something went wrong! Please try again.',
        customData: { type: 'error' },
      })
    }

    if (feed) {
      setFeed(feed)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  if (loading) {
    return (
      <View flex={1} alignItems="center" justifyContent="center">
        <Spinner />
      </View>
    )
  }

  return <>{feed && feed.map((item: any) => <PostCard key={item.id} user={user} post={item} />)}</>
}

export default HomePage
