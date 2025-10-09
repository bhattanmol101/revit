'use client'

import { useEffect, useState } from 'react'
import { View, Text } from '@revit/ui'
import { StatusT } from '@revit/shared/types/common'
import { IDLE, LOADING } from '@revit/shared/utils/constants'
import { TrendingForumT } from '@revit/shared/types/forum'
import { fetchTrendingForumsApi } from '@revit/api/forum'
import TrendingForumCard from '@revit/app/features/forum/TrendingCard'
import Loader from '@revit/app/features/common/Loader'

const TrendingForums = () => {
  const [status, setStatus] = useState<StatusT>(LOADING)
  const [forums, setForums] = useState<TrendingForumT[]>([])

  const fetchTrendingForums = async () => {
    const { forums, error } = await fetchTrendingForumsApi()
    setStatus(IDLE)
    if (error) {
      // toas
      return
    }
    if (forums) {
      setForums(forums)
    }
  }

  useEffect(() => {
    fetchTrendingForums()
  }, [])

  return (
    <View flex={1}>
      <View bg="$black4" borderRadius="$3" px="$3" py="$2.5" mb="$2">
        <Text fontSize="$2">Trending Forums</Text>
      </View>
      <Loader status={status} />
      {forums.map((forum) => (
        <TrendingForumCard key={forum.id} forum={forum} />
      ))}
    </View>
  )
}

export default TrendingForums
