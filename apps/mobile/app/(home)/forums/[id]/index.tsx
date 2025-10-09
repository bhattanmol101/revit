import { useSession } from '../../../../components/Provider/ContextProvider'
import React from 'react'
import Forum from '@revit/app/features/forum'

const ForumScreen = () => {
  const { user } = useSession()

  if (!user) {
    return
  }
  return <Forum user={user} />
}

export default ForumScreen
