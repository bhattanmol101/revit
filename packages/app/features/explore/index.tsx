'use client'

import { useState } from 'react'
import {
  Button,
  H5,
  Input,
  ListItemSubtitle,
  ScrollView,
  Tabs,
  TabsContentProps,
  Text,
  View,
  XStack,
} from '@revit/ui'
import { useRouter } from 'solito/navigation'
import { Separator } from '@revit/ui'
import { SizableText } from '@revit/ui'
import { Search } from '@tamagui/lucide-icons'
import { searchPostsApi } from '@revit/api/search'
import { IDLE, LOADING } from '@revit/shared/utils/constants'
import { StatusT } from '@revit/shared/types/common'
import Loader from '../common/Loader'
import { PostT } from '@revit/shared/types/post'
import PostCard from '../post/Card'
import { UserT } from '@revit/shared/types/user'
import { Platform } from 'react-native'

const Explore = ({ user }: { user: UserT }) => {
  const [activeTab, setActiveTab] = useState('post')
  const [query, setQuery] = useState<string>('')
  const [status, setStatus] = useState<StatusT>(IDLE)
  const [posts, setPosts] = useState<PostT[]>([])

  const handleSearch = async () => {
    setStatus(LOADING)
    const { posts, error } = await searchPostsApi(query.trim())
    setStatus(IDLE)
    if (error) {
      console.log(error)
    }
    if (posts) {
      console.log(posts)
      setPosts(posts)
    }
  }
  const router = useRouter()

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
        mx="$2"
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
        overflow="hidden"
        size="$3"
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

        <TabsContent value="post">
          <Loader status={status} />
          <ScrollView>
            {posts.length > 0 ? (
              posts.map((item) => <PostCard key={item.id} user={user} post={item} />)
            ) : (
              <Text alignSelf="center" mt="$4" color="$black11" fontSize="$3">
                Nothing here, Try finding other reivews...
              </Text>
            )}
          </ScrollView>
        </TabsContent>

        <TabsContent key="forum" value="forum">
          <H5>Connections</H5>
        </TabsContent>
      </Tabs>
    </View>
  )
}

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content py="$2" {...props}>
      {props.children}
    </Tabs.Content>
  )
}

export default Explore
