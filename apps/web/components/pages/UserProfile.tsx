'use client'

import React from 'react'
import Profile from '@revit/app/features/profile'
import { useParams } from 'solito/navigation'

const UserProfilePage = () => {
  const { id } = useParams()
  if (!id) {
    return
  }

  return <Profile userId={String(id)} />
}

export default UserProfilePage
