'use client'

import { useEffect, useState } from 'react'
import { Card, H5, Tabs, TabsContentProps, Text, View, XStack } from '@revit/ui'
import { useRouter } from 'solito/navigation'
import { Separator } from '@revit/ui'
import { SizableText } from '@revit/ui'
import { StatusT } from '@revit/shared/types/common'
import { IDLE, LOADING } from '@revit/shared/utils/constants'
import { ForumT } from '@revit/shared/types/forum'
import { fetchForumsByUserApi } from '@revit/api/forum'
import Loader from '../common/Loader'
import { Image } from '@revit/ui'
import { YStack } from '@revit/ui'
import { Users } from '@tamagui/lucide-icons'
import ForumCard from './Card'

const Forums = () => {
  const [activeTab, setActiveTab] = useState<string>('tab1')
  const [status, setStatus] = useState<StatusT>(LOADING)
  const [userForums, setUserForums] = useState<ForumT[]>([])
  const [joinedForums, setJoinedForums] = useState<ForumT[]>([])

  const fetchUserForums = async () => {
    if (userForums.length > 0) {
      return
    }

    const { forums, error } = await fetchForumsByUserApi()
    setStatus(IDLE)
    if (error) {
      // toas
      return
    }
    if (forums) {
      setUserForums(forums)
    }
  }

  const fetchJoinedForums = async () => {
    if (joinedForums.length > 0) {
      return
    }
    const { forums, error } = await fetchForumsByUserApi()
    setStatus(IDLE)
    if (error) {
      // toas
      return
    }
    if (forums) {
      setJoinedForums(forums)
    }
  }

  useEffect(() => {
    if (activeTab == 'tab1') {
      fetchUserForums()
    } else {
      fetchJoinedForums()
    }
  }, [activeTab])

  return (
    <View flex={1}>
      {/* Forum Top Tabs */}
      <Tabs
        defaultValue="tab1"
        orientation="horizontal"
        flexDirection="column"
        width="100%"
        onValueChange={setActiveTab}
      >
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
            value="tab1"
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
            value="tab2"
          >
            <SizableText fontFamily="$body" textAlign="center">
              Joined Forums
            </SizableText>
          </Tabs.Tab>
        </Tabs.List>
        <Separator />
        <TabsContent value="tab1" flex={1}>
          <Loader status={status} />
          {userForums.map((forum) => (
            <ForumCard key={forum.id} forum={forum} />
          ))}
        </TabsContent>

        <TabsContent value="tab2">
          <H5>Connections</H5>
        </TabsContent>
      </Tabs>
    </View>
  )
}

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      key="tab1"
      alignItems="center"
      justifyContent="center"
      flex={1}
      width="100%"
      {...props}
    >
      {props.children}
    </Tabs.Content>
  )
}

export default Forums
