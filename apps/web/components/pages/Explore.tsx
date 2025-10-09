'use client'

import React from 'react'
import Explore from '@revit/app/features/explore'
import { useSession } from '@/components/Provider/ContextProvider'

const ExplorePage = () => {
  const { user } = useSession()

  if (!user) return null

  return <Explore user={user} />
}

export default ExplorePage
