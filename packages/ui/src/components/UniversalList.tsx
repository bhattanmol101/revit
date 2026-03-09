import { FlashList } from '@shopify/flash-list'
import { JSX } from 'react'
import { Spinner, Text, View, YStack } from 'tamagui'
import { FlatList, Platform } from 'react-native'

const ListComponent = Platform.OS === 'web' ? FlatList : FlashList

export function UniversalList({
  data,
  renderItem,
  listHeaderComponent,
  loading = false,
  emptyText,
  refreshControl,
  onEndReachedThreshold,
  handleLoadMore,
  loadFooter = false,
}: {
  data: any[]
  renderItem: (item: any) => JSX.Element
  listHeaderComponent?: JSX.Element
  loading?: boolean
  emptyText?: string
  refreshControl?: JSX.Element
  onEndReachedThreshold?: number
  handleLoadMore?: () => void
  loadFooter?: boolean
}) {
  const emptyComponent = loading ? (
    <Spinner marginVertical="$3" />
  ) : data.length === 0 ? (
    <YStack f={1} ai="center" jc="center" py="$3">
      <Text color="$gray10" mb="$4" fontSize="$2">
        {emptyText || 'Nothing here yet!'}
      </Text>
    </YStack>
  ) : null

  return (
    <View f={1}>
      <ListComponent
        ListHeaderComponent={listHeaderComponent}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderItem(item)}
        nestedScrollEnabled={true}
        bounces={false}
        ListEmptyComponent={emptyComponent}
        refreshControl={refreshControl}
        onEndReachedThreshold={onEndReachedThreshold}
        onEndReached={handleLoadMore}
        estimatedItemSize={10}
        ListFooterComponent={loadFooter ? <Spinner style={{ marginVertical: 16 }} /> : null}
      />
    </View>
  )
}
