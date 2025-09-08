import { HomeScreen } from '@revit/app/features/home/screen'
import { Stack } from 'expo-router'
import { createSupabaseClient } from '@revit/api/utils/supabase'
import PostCard from '@revit/app/components/post/Card'
import CreatePost from '@revit/app/components/post/Create'

export default function Screen() {
  createSupabaseClient()
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
      <CreatePost />
    </>
  )
}
