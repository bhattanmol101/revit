import React from 'react'
import Forum from '@revit/app/features/forum'
import { useAuthStore } from '@revit/app/store'

const ForumScreen = () => {
  const { user } = useAuthStore()

  if (!user) {
    return
  }
  return <Forum user={user} />
}

export default ForumScreen
