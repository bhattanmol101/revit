'use client'

import React, { useState } from 'react'
import { ScrollView, Alert } from 'react-native'
import ForumCard from './Card'
import { H5, Tabs, TabsContentProps, Text, View, XStack } from '@revit/ui'
import { useRouter } from 'solito/navigation'
import { Separator } from '@revit/ui'
import { SizableText } from '@revit/ui'

const Forums = () => {
  const [activeTab, setActiveTab] = useState('forums')
  const [searchQuery, setSearchQuery] = useState('')

  const router = useRouter()

  // Mock data for review forums
  const forums = [
    {
      id: '1',
      title: 'Best Coffee Shops in NYC',
      description: 'Share your experiences and rate coffee shops in the city',
      category: 'Food & Dining',
      participants: 142,
      posts: 28,
      image:
        'https://images.unsplash.com/photo-1613759612065-d5971d32ca49?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TWFya2V0aW5nJTIwYnJhbmRpbmd8ZW58MHx8MHx8fDA%3D',
      creator: 'coffee_lover',
      rating: 4.7,
    },
    {
      id: '2',
      title: 'Smartphone Reviews 2023',
      description: 'Compare and rate the latest smartphones',
      category: 'Technology',
      participants: 210,
      posts: 45,
      image:
        'https://images.unsplash.com/photo-1480694313141-991fcf38cc6e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fDMlMjBncmFwaGljc3xlbnwwfHwwfHx8MA%3D%3D',
      creator: 'tech_guru',
      rating: 4.5,
    },
    {
      id: '3',
      title: 'Fitness Apps Comparison',
      description: 'Review and rate fitness tracking apps',
      category: 'Health & Fitness',
      participants: 87,
      posts: 19,
      image:
        'https://images.unsplash.com/photo-1608447718455-ed5006c46051?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8MyUyMGdyYXBoaWNzfGVufDB8fDB8fHww',
      creator: 'fitness_fan',
      rating: 4.2,
    },
  ]

  // Mock data for recent reviews
  const reviews = [
    {
      id: '1',
      forumTitle: 'Best Coffee Shops in NYC',
      username: 'cafe_explorer',
      userAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      title: 'Central Perk Experience',
      content: 'Amazing coffee and cozy atmosphere. Perfect for working remotely!',
      likes: 24,
      comments: 5,
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      forumTitle: 'Smartphone Reviews 2023',
      username: 'tech_reviewer',
      userAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      rating: 4,
      title: 'iPhone 15 Pro Review',
      content: 'Great camera improvements but battery life could be better.',
      likes: 42,
      comments: 12,
      timestamp: '5 hours ago',
    },
  ]

  const handleCreateForum = () => {
    Alert.alert('Create Forum', 'This would open the create forum form')
  }

  return (
    <View flex={1}>
      {/* Forum Top Tabs */}
      <Tabs defaultValue="tab1" orientation="horizontal" flexDirection="column" width="100%">
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
          {forums.map((forum) => (
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
