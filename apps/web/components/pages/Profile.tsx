'use client'

import React from 'react'
import Profile from '@revit/app/features/profile'
import { useSession } from '../Provider/ContextProvider'

const ProfilePage = () => {
  const { user } = useSession()

  if (!user) return null

  return <Profile userId={user.id} user={user} />
}

export default ProfilePage
