'use client'

import { useState } from 'react'
import {
  Button,
  Input,
  Separator,
  SizableText,
  Tabs,
  TabsContentProps,
  UniversalList,
  View,
  XStack,
} from '@revit/ui'
import { Search } from '@tamagui/lucide-icons'
import { searchForumsApi, searchPostsApi } from '@revit/api/search'
import { IDLE, LOADING } from '@revit/shared/utils/constants'
import { StatusT } from '@revit/shared/types/common'
import { PostT } from '@revit/shared/types/post'
import PostCard from '../post/Card'
import { UserT } from '@revit/shared/types/user'
import { ForumT } from '@revit/shared/types/forum'
import ForumCard from '../forum/Card'
import { useAuthStore } from '../../store'

const Explore = () => {
  const { user } = useAuthStore()

  if (!user) {
    return
  }

  const [activeTab, setActiveTab] = useState('post')
  const [query, setQuery] = useState<string>('')
  const [status, setStatus] = useState<StatusT>(IDLE)
  const [posts, setPosts] = useState<PostT[]>([])
  const [forums, setForums] = useState<ForumT[]>([])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    handleSearch()
  }

  const handleSearch = async () => {
    if (query.trim().length === 0) {
      return
    }

    setStatus(LOADING)
    switch (activeTab) {
      case 'post':
        const { posts, error: postError } = await searchPostsApi(query.trim())
        setStatus(IDLE)
        if (postError) {
          console.log(postError)
          return
        }
        if (posts) {
          setPosts(posts)
        }
        break
      case 'forum':
        const { forums, error: forumError } = await searchForumsApi(query.trim())
        setStatus(IDLE)
        if (forumError) {
          console.log(forumError)
          return
        }
        if (forums) {
          setForums(forums)
        }
        break
      default:
        console.log('default')
    }
  }

  const data = activeTab === 'post' ? posts : forums

  const renderPost = (post: PostT) => <PostCard key={post.id} user={user as UserT} post={post} />

  const renderForum = (forum: ForumT) => <ForumCard key={forum.id} forum={forum} />

  const renderItem = activeTab === 'post' ? renderPost : renderForum

  return (
    <UniversalList
      listHeaderComponent={
        <View flex={1}>
          <XStack
            alignItems="center"
            gap="$2"
            borderRadius={8}
            borderWidth={1}
            py="$1"
            my="$2"
            px="$2"
            mx="$1"
            borderColor="$borderColor"
          >
            <Input
              flex={1}
              px="$2"
              height="$4"
              placeholder="Start searching for reviews...."
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              unstyled
              fontSize="$3"
              color="$white2"
            />
            <Button size="$3" circular icon={Search} onPress={handleSearch} />
          </XStack>
          <Tabs
            defaultValue="post"
            orientation="horizontal"
            flexDirection="column"
            width="100%"
            size="$3"
            onValueChange={handleTabChange}
          >
            <Tabs.List disablePassBorderRadius="bottom" aria-label="Manage your account">
              <Tabs.Tab
                focusStyle={{
                  backgroundColor: '$color4',
                  borderRadius: 5,
                }}
                flex={1}
                value="post"
              >
                <SizableText fontSize="$2" textAlign="center">
                  Posts
                </SizableText>
              </Tabs.Tab>
              <Tabs.Tab
                focusStyle={{
                  backgroundColor: '$color4',
                  borderRadius: 5,
                }}
                flex={1}
                value="forum"
              >
                <SizableText fontSize="$2" textAlign="center">
                  Forums
                </SizableText>
              </Tabs.Tab>
            </Tabs.List>
            <Separator />
          </Tabs>
        </View>
      }
      loading={status === LOADING}
      data={data}
      renderItem={renderItem}
      emptyText="Nothing here, Try searching again..."
    />
  )
}

const TabsContent = (props: TabsContentProps) => {
  return <Tabs.Content {...props}>{props.children}</Tabs.Content>
}

export default Explore
