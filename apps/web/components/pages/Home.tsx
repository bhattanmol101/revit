'use client'

import PostCard from '@revit/app/features/post/Card'
import { useEffect } from 'react'
import { Spinner, UniversalList, useToastController, View } from '@revit/ui'
import { useAuthStore, useFeedStore } from '@revit/app/store'
import { PostT } from '@revit/shared/types/post'
import { UserT } from '@revit/shared/types/user'
import { RefreshControl } from 'react-native'

function HomePage() {
  const toast = useToastController()
  const { posts, loading, fetchFeed, loadMore, hasMore, error } = useFeedStore()

  const { user } = useAuthStore()

  useEffect(() => {
    fetchFeed()
  }, [])

  useEffect(() => {
    if (error) {
      toast.show(error, {
        message: 'Something went wrong. Please try again later!',
        customData: { type: 'error' },
      })
    }
  }, [error])

  const handleRefresh = async () => {
    await fetchFeed({ refresh: true })
  }

  if (!user) {
    return
  }

  if (loading && posts.length === 0) {
    return (
      <View flex={1} mt="$3" alignItems="center" justifyContent="center">
        <Spinner />
      </View>
    )
  }

  return (
    <UniversalList
      data={posts}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} />}
      handleLoadMore={loadMore}
      onEndReachedThreshold={0.5}
      loadFooter={loading && hasMore}
      renderItem={(item: PostT) => <PostCard key={item.id} user={user as UserT} post={item} />}
    />
  )
}

export default HomePage
