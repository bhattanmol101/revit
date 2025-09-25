'use client'

import React from 'react'
import Forum from '@revit/app/features/forum'
import { useSession } from '../Provider/ContextProvider'

const ForumPage = () => {
  const { user } = useSession()

  if (!user) {
    return
  }
  return <Forum user={user} />
}

export default ForumPage
