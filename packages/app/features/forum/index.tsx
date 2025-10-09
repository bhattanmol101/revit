'use client'

import { Button, Card, Image, Text, UniversalList, View, XStack, YStack } from '@revit/ui'
import ForumPostCard from './post/Card'
import { useEffect, useState } from 'react'
import { ForumPostT, ForumT } from '@revit/shared/types/forum'
import { useParams } from 'solito/navigation'
import { StatusT } from '@revit/shared/types/common'
import { IDLE, LOADING } from '@revit/shared/utils/constants'
import { joinForumsApi } from '@revit/api/forum'
import Loader from '../common/Loader'
import { Plus, Users } from '@tamagui/lucide-icons'
import { UserT } from '@revit/shared/types/user'
import CreateForumPostDialog from './post/CreateDialog'
import { useForumPostStore, useForumStore } from '../../store/forum.store'

const Forum = ({ user }: { user: UserT }) => {
  const { id } = useParams()
  if (!id) {
    return
  }

  const forumId = String(id)

  const { forum, fetchForum, loading, error } = useForumStore()
  const {
    posts,
    fetchForumPosts,
    loading: postLoading,
    error: postError,
    clearForumPosts,
  } = useForumPostStore()

  useEffect(() => {
    fetchForum(forumId)
    fetchForumPosts(forumId, { refresh: true })

    return () => {
      clearForumPosts()
    }
  }, [forumId])

  if (loading) {
    return <Loader mt="$2" status={LOADING} />
  }

  if (!forum) {
    return
  }

  const renderForumPost = (post: ForumPostT) => (
    <ForumPostCard key={post.id} user={user} post={post} />
  )

  return (
    <UniversalList
      listHeaderComponent={<ForumCard user={user} forum={forum} />}
      data={posts}
      renderItem={renderForumPost}
      loading={postLoading}
      emptyText="No posts found. Start adding reviews!"
    />
  )
}

const ForumCard = ({ user, forum }: { user: UserT; forum: ForumT }) => {
  const [joinStatus, setJoinStatus] = useState<StatusT>(IDLE)

  const handleJoinForum = async () => {
    setJoinStatus(LOADING)
    await joinForumsApi(forum.id)
    setJoinStatus(IDLE)
  }

  const membershipCount = forum.members.length > 0 ? forum.members[0].memberCount : 0
  const postCount = forum.posts.length > 0 ? forum.posts[0].postCount : 0

  return (
    <Card width="100%" my="$1" hoverStyle={{ backgroundColor: '$black3' }}>
      <Card.Header
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingBottom="$1"
        pt="$0"
        px="$0"
      >
        <Image source={{ uri: forum.image }} width="100%" height={250} alt="forum image" />
      </Card.Header>
      <YStack p="$3" gap="$3">
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1} gap="$1">
            <Text fontSize="$3" fontWeight="bold">
              {forum.name}
            </Text>
            <Text fontSize="$2" color="$white8">
              {forum.description}
            </Text>
          </YStack>
          <View backgroundColor="$blue10" borderRadius={10} py="$1" px="$2">
            <Text fontSize="$1" fontWeight={600}>
              {forum.category}
            </Text>
          </View>
        </XStack>

        <XStack alignItems="center">
          <Users size={14} color="#9ca3af" />
          <Text color="$black11" fontSize="$2" ml="$1">
            {membershipCount} member(s) • {postCount} posts
          </Text>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center">
          <Text color="$black11" fontSize="$2" fontWeight="bold">
            by {forum.creator.name}
          </Text>
          <XStack alignItems="center" gap="$3">
            {forum.isMember && <CreateForumPostDialog forumId={forum.id} />}
            {!(forum.creator.id === user.id) && !forum.isMember && (
              <Button
                size="$2"
                onPress={handleJoinForum}
                iconAfter={<Loader status={joinStatus} />}
              >
                <Button.Icon>
                  <Plus />
                </Button.Icon>
                <Button.Text>Join</Button.Text>
              </Button>
            )}
            {/*{forum.creator.id === user.id && (*/}
            {/*  <Button size="$2">*/}
            {/*    <Button.Text>Edit</Button.Text>*/}
            {/*  </Button>*/}
            {/*)}*/}
          </XStack>
        </XStack>
      </YStack>
    </Card>
  )
}

export default Forum
