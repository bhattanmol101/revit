'use client'

import { useState } from 'react'
import {
  Button,
  Input,
  Separator,
  SizableText,
  Tabs,
  TabsContentProps,
  Text,
  UniversalList,
  View,
  XStack,
} from '@revit/ui'
import { Search } from '@tamagui/lucide-icons'
import { searchForumsApi, searchPostsApi } from '@revit/api/search'
import { IDLE, LOADING } from '@revit/shared/utils/constants'
import { StatusT } from '@revit/shared/types/common'
import Loader from '../common/Loader'
import { PostT } from '@revit/shared/types/post'
import PostCard from '../post/Card'
import { UserT } from '@revit/shared/types/user'
import { ForumT } from '@revit/shared/types/forum'
import ForumCard from '../forum/Card'
import { FlatList } from 'react-native'

const Explore = ({ user }: { user: UserT }) => {
  const [activeTab, setActiveTab] = useState('post')
  const [query, setQuery] = useState<string>('')
  const [status, setStatus] = useState<StatusT>(IDLE)
  const [posts, setPosts] = useState<PostT[]>([])
  const [forums, setForums] = useState<ForumT[]>([])

  const handleSearch = async () => {
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

  const renderPost = (post: PostT) => <PostCard key={post.id} user={user as UserT} post={post} />

  const renderForum = (forum: ForumT) => <ForumCard key={forum.id} forum={forum} />

  return (
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
        onValueChange={setActiveTab}
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

        <TabsContent pb="$15" value="post">
          <Loader status={status} />
          {posts.length === 0 && status === IDLE && (
            <Text alignSelf="center" mt="$4" color="$black11" fontSize="$3">
              Nothing here, Try finding other reviews...
            </Text>
          )}
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderPost(item)}
          />
        </TabsContent>

        <TabsContent pb="$15" value="forum">
          {forums.length === 0 && status === IDLE && (
            <Text alignSelf="center" mt="$4" color="$black11" fontSize="$3">
              Nothing here, Try finding other forums...
            </Text>
          )}
          <UniversalList data={forums} renderItem={renderForum} />
        </TabsContent>
      </Tabs>
    </View>
  )
}

const TabsContent = (props: TabsContentProps) => {
  return <Tabs.Content {...props}>{props.children}</Tabs.Content>
}

export default Explore
