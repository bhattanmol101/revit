'use client'

import { ScrollView, Spinner, useToastController, View } from '@revit/ui'
import { useSession } from '../../../components/Provider/ContextProvider'
import { useEffect, useState } from 'react'
import { fetchUserFeed } from '@revit/api/post/feed'
import { PostT } from '@revit/shared/types/post'
import PostCard from '@revit/app/features/post/Card'
import { UserT } from '@revit/shared/types/user'

function Home() {
  const toast = useToastController()

  const { user } = useSession()

  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
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

  return (
    <ScrollView>
      {feed && feed.map((item: any) => <PostCard key={item.id} user={user as UserT} post={item} />)}
    </ScrollView>
  )
}

export default Home
