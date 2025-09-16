'use client'

import React from 'react'
import Profile from '@revit/shared/components/profile'
import { useSession } from '../Provider/ContextProvider'

const ProfilePage = () => {
  const { user } = useSession()

  if (!user) {
    return
  }

  return <Profile user={user} />
}

export default ProfilePage
