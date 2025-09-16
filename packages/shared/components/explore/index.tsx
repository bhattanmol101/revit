'use client'

import { useState } from 'react'
import { Search } from '@tamagui/lucide-icons'
import { Text, View, XStack } from '@revit/ui'
import { Input } from '@revit/ui'
import ForumCard from '../forum/Card'
import PostCard from '../post/Card'

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock data for forums
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
      location: 'New York',
      lastActive: '2 hours ago',
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
      location: 'Global',
      lastActive: '5 hours ago',
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
      location: 'Remote',
      lastActive: '1 day ago',
    },
    {
      id: '4',
      title: 'Top Travel Destinations 2023',
      description: 'Share your favorite travel spots and experiences',
      category: 'Travel',
      participants: 312,
      posts: 67,
      image:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
      creator: 'world_traveler',
      rating: 4.8,
      location: 'Worldwide',
      lastActive: '30 mins ago',
    },
  ]

  // Mock data for reviews
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
      image:
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNvZmZlZSUyMHNob3B8ZW58MHx8MHx8fDA%3D',
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
      image:
        'https://images.unsplash.com/photo-1606220588911-4a8d9b0c0f7c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aVBob25lJTIwMTUlMjBQcm98ZW58MHx8MHx8fDA%3D',
    },
    {
      id: '3',
      forumTitle: 'Top Travel Destinations 2023',
      username: 'globetrotter',
      userAvatar:
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      title: 'Bali Paradise Resort',
      content: "Best vacation I've ever had. The service was exceptional!",
      likes: 128,
      comments: 24,
      timestamp: '1 day ago',
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVzb3J0JTIwaW4lMjBiYWxpfGVufDB8fDB8fHww',
    },
  ]

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'food', name: 'Food & Dining' },
    { id: 'tech', name: 'Technology' },
    { id: 'health', name: 'Health & Fitness' },
    { id: 'travel', name: 'Travel' },
    { id: 'entertainment', name: 'Entertainment' },
  ]

  const filteredForums = forums.filter((forum) => {
    const matchesSearch =
      forum.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      forum.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || forum.category.toLowerCase().includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.forumTitle.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <View flex={1} py="$1">
      {/* Search Bar */}
      <XStack
        borderRadius="$5"
        borderWidth={1}
        alignItems="center"
        borderColor="$black4"
        backgroundColor="$black3"
        px="$3"
        py="$2"
      >
        <Search size={20} color="#9CA3AF" />
        <Input
          width="100%"
          size="$3"
          placeholder="Find reviews on revit...."
          unstyled
          fontSize={14}
        />
      </XStack>

      {/* Results */}
      {activeFilter === 'all' || activeFilter === 'forums' ? (
        <>
          {filteredForums.length > 0 ? (
            filteredForums.map((forum) => <ForumCard key={forum.id} forum={forum} />)
          ) : (
            <View borderRadius="$5" backgroundColor="$black3" padding="$4">
              <Text>No forums match your search</Text>
            </View>
          )}
        </>
      ) : null}

      {activeFilter === 'all' || activeFilter === 'posts' ? (
        <>
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => <PostCard key={review.id} />)
          ) : (
            <View borderRadius="$5" backgroundColor="$black3" padding="$4">
              <Text>No Posts match your search</Text>
            </View>
          )}
        </>
      ) : null}
    </View>
  )
}

export default Explore
