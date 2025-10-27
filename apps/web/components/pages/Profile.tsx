'use client'

import React from 'react'
import Profile from '@revit/app/features/profile'
import { useAuthStore } from '@revit/app/store'

const ProfilePage = () => {
  const { user } = useAuthStore()

  if (!user) return null

  return <Profile userId={user.id} user={user} />
}

export default ProfilePage
