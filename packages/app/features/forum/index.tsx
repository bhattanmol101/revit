'use client'

import { Card, Separator, Text, View, XStack } from '@revit/ui'
import ForumPostCard from './post/Card'
import { useEffect, useState } from 'react'
import { ForumPostT, ForumT } from '@revit/shared/types/forum'
import { fetchForumPostsApi } from '@revit/api/forum/post'
import { useParams, useRouter } from 'solito/navigation'
import { StatusT } from '@revit/shared/types/common'
import { IDLE, LOADING } from '@revit/shared/utils/constants'
import { fetchForumsByIdApi } from '@revit/api/forum'
import Loader from '../common/Loader'
import { Image } from '@revit/ui'
import { YStack } from '@revit/ui'
import { Plus, Users } from '@tamagui/lucide-icons'
import { Button } from '@revit/ui'
import { UserT } from '@revit/shared/types/user'

const Forum = ({ user }: { user: UserT }) => {
  const { id } = useParams()
  if (!id) {
    return
  }

  const [forum, setForum] = useState<ForumT>()
  const [posts, setPosts] = useState<ForumPostT[]>([])
  const [forumStatus, setForumStatus] = useState<StatusT>(LOADING)
  const [postsStatus, setPostsStatus] = useState<StatusT>(LOADING)

  const fetchForum = async () => {
    const { forum, error } = await fetchForumsByIdApi(String(id))
    setForumStatus(IDLE)
    if (error) {
      return
    }
    if (forum) {
      setForum(forum)
    }
  }

  const fetchForumPosts = async () => {
    const { posts, error } = await fetchForumPostsApi(String(id))
    setPostsStatus(IDLE)
    if (error) {
      return
    }
    if (posts) {
      setPosts(posts)
    }
  }

  useEffect(() => {
    fetchForum()
    fetchForumPosts()
  }, [])

  if (forumStatus === LOADING) {
    return <Loader status={forumStatus} />
  }

  if (!forum) {
    return
  }

  return (
    <View flex={1}>
      <ForumCard user={user} forum={forum} />
      <XStack my="$2" gap="$3" alignItems="center">
        <Separator />
        <Text fontSize="$3" color="$black11">
          Posts
        </Text>
        <Separator />
      </XStack>
      <ForumPostCard />
    </View>
  )
}

const ForumCard = ({ user, forum }: { user: UserT; forum: ForumT }) => {
  const router = useRouter()

  const handleForumClick = () => {
    router.push(`/forums/${forum.id}`)
  }

  const membershipCount = forum.members.length > 0 ? forum.members[0].membershipCount : 0
  const postCount = forum.posts.length > 0 ? forum.posts[0].postCount : 0

  return (
    <Card width="100%" my="$1" hoverStyle={{ backgroundColor: '$black3' }}>
      <Card.Header
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingBottom="$1"
      >
        <Image source={{ uri: forum.image }} width="100%" height={200} alt="forum image" />
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
              {/* {forum.category} */}
            </Text>
          </View>
        </XStack>

        <XStack alignItems="center">
          <Users size={16} color="#9ca3af" />
          <Text color="$black11" fontSize="$2">
            {membershipCount} participants • {postCount} posts
          </Text>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center">
          <Text color="$black11" fontSize="$2" fontWeight="bold">
            by {forum.creator.name}
          </Text>
          <XStack alignItems="center" gap="$3">
            {forum.isMember && (
              <Button size="$3">
                <Button.Icon>
                  <Plus />
                </Button.Icon>
                <Button.Text>Add Review</Button.Text>
              </Button>
            )}
            {!(forum.creator.id === user.id) && !forum.isMember && (
              <Button size="$3">
                <Button.Icon>
                  <Plus />
                </Button.Icon>
                <Button.Text>Join</Button.Text>
              </Button>
            )}
            {forum.creator.id === user.id && (
              <Button size="$3">
                <Button.Text>Edit</Button.Text>
              </Button>
            )}
          </XStack>
        </XStack>
      </YStack>
    </Card>
  )
}

export default Forum
