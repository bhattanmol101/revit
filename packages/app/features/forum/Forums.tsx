'use client'

import { useEffect, useState } from 'react'
import { Fab, Separator, SizableText, Tabs, TabsContentProps, UniversalList, View } from '@revit/ui'
import { ForumT } from '@revit/shared/types/forum'
import ForumCard from './Card'
import { Plus } from '@tamagui/lucide-icons'
import { Platform } from 'react-native'
import { useRouter } from 'solito/navigation'
import { useForumStore } from '../../store/forum.store'

const TABS = ['created', 'joined']

const Forums = () => {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<string>(TABS[0])

  const { loading, userForums, joinedForums, fetchUserForums, fetchJoinedForums } = useForumStore()

  const handleCreateForum = () => {
    router.push('/forums/create')
  }

  useEffect(() => {
    if (activeTab == TABS[0]) {
      fetchUserForums({ refresh: true })
    } else {
      fetchJoinedForums({ refresh: true })
    }
  }, [activeTab])

  const data: ForumT[] = activeTab == TABS[0] ? userForums : joinedForums
  const renderItem = (forum: ForumT) => <ForumCard key={forum.id} forum={forum} />

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
                  Your Forums
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
                  Joined Forums
                </SizableText>
              </Tabs.Tab>
            </Tabs.List>
            <Separator />
          </Tabs>
        }
        emptyText="Nothing here, create or join forums."
        data={data}
        loading={loading}
        renderItem={renderItem}
      />
      {Platform.OS != 'web' && <Fab bg="$blue4" icon={<Plus />} onPress={handleCreateForum} />}
    </View>
  )
}

const TabsContent = (props: TabsContentProps) => {
  return <Tabs.Content {...props}>{props.children}</Tabs.Content>
}

export default Forums
