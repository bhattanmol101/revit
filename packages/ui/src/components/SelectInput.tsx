import { Picker } from '@react-native-picker/picker'
import { GetThemeValueForKey, Theme, View } from 'tamagui'

type Item = { label: string; value: string }

type Props = {
  items: Item[]
  value?: string
  onValueChange?: (val: string) => void
  placeholder?: string
  width?: number | GetThemeValueForKey<'width'>
  error?: string
}

export function SelectInput({
  items,
  value,
  onValueChange,
  placeholder = 'Select an option',
  error,
}: Props) {
  return (
    <Theme name={error ? 'red' : null} forceClassName>
      <View
        flex={1}
        borderWidth={1}
        borderColor="$borderColor"
        borderRadius="$5"
        backgroundColor="$background"
        alignItems="center"
      >
        <Picker
          style={{ width: '90%', color: 'white' }}
          selectedValue={value}
          onValueChange={onValueChange}
          placeholder={placeholder}
        >
          {!value && <Picker.Item label={placeholder} value="" />}
          {items.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </Theme>
  )
}
