'use client'

import { useEffect, useState } from 'react'
import {
  Fab,
  isWeb,
  Separator,
  SizableText,
  Tabs,
  TabsContentProps,
  UniversalList,
  View,
} from '@revit/ui'
import { ForumT, TrendingForumT } from '@revit/shared/types/forum'
import ForumCard from './Card'
import { Plus } from '@tamagui/lucide-icons'
import { useRouter } from 'solito/navigation'
import { useForumStore } from '../../store/forum.store'
import TrendingForumCard from '@revit/app/features/forum/TrendingCard'

const TABS = ['created', 'joined', 'trending']

const Forums = () => {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<string>(TABS[0])

  const {
    loading,
    userForums,
    joinedForums,
    trendingForums,
    fetchUserForums,
    fetchJoinedForums,
    fetchTrendingForums,
  } = useForumStore()

  const handleCreateForum = () => {
    router.push('/forums/create')
  }

  useEffect(() => {
    switch (activeTab) {
      case TABS[0]:
        fetchUserForums({ refresh: true })
        break
      case TABS[1]:
        fetchJoinedForums({ refresh: true })
        break
      case TABS[2]:
        fetchTrendingForums()
        break
      default:
        break
    }
  }, [activeTab])

  const data: ForumT[] | TrendingForumT[] =
    activeTab == TABS[0] ? userForums : activeTab === TABS[1] ? joinedForums : trendingForums

  const renderItem = (forum: ForumT | TrendingForumT) =>
    activeTab == TABS[2] ? (
      <TrendingForumCard key={forum.id} forum={forum as TrendingForumT} />
    ) : (
      <ForumCard key={forum.id} forum={forum as ForumT} />
    )

  return (
    <View flex={1}>
      <UniversalList
        listHeaderComponent={
          <Tabs
            defaultValue={TABS[0]}
            orientation="horizontal"
            flexDirection="column"
            width="100%"
            mt="$1"
            onValueChange={setActiveTab}
          >
            <Separator mt="$1" />
            <Tabs.List
              separator={<Separator vertical />}
              disablePassBorderRadius="bottom"
              aria-label="Manage your account"
            >
              <Tabs.Tab
                focusStyle={{
                  backgroundColor: '$color4',
                }}
                flex={1}
                value={TABS[0]}
              >
                <SizableText fontFamily="$body" textAlign="center">
                  Created
                </SizableText>
              </Tabs.Tab>
              <Tabs.Tab
                focusStyle={{
                  backgroundColor: '$color4',
                }}
                flex={1}
                value={TABS[1]}
              >
                <SizableText fontFamily="$body" textAlign="center">
                  Joined
                </SizableText>
              </Tabs.Tab>
              {!isWeb && (
                <Tabs.Tab
                  focusStyle={{
                    backgroundColor: '$color4',
                  }}
                  flex={1}
                  value={TABS[2]}
                >
                  <SizableText fontFamily="$body" textAlign="center">
                    Trending
                  </SizableText>
                </Tabs.Tab>
              )}
            </Tabs.List>
            <Separator />
          </Tabs>
        }
        emptyText="Nothing here, create or join forums."
        data={data}
        loading={loading}
        renderItem={renderItem}
      />
      {!isWeb && <Fab bg="$blue4" icon={<Plus />} onPress={handleCreateForum} />}
    </View>
  )
}

const TabsContent = (props: TabsContentProps) => {
  return <Tabs.Content {...props}>{props.children}</Tabs.Content>
}

export default Forums
