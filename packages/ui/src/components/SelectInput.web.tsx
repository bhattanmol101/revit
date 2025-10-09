import { GetThemeValueForKey, Select, Theme, View } from 'tamagui'
import { Check, ChevronDown } from '@tamagui/lucide-icons'
import { SelectItem } from '@revit/shared/types/common'

type Props = {
  items: SelectItem[]
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
  width = 220,
  error,
}: Props) {
  return (
    <Theme name={error ? 'red' : null} forceClassName>
      <View width={width}>
        <Select value={value} onValueChange={onValueChange}>
          <Select.Trigger width={width} iconAfter={ChevronDown}>
            <Select.Value placeholder={placeholder} />
          </Select.Trigger>

          <Select.Content zIndex={200000}>
            <Select.Viewport>
              {items.map((item, idx) => (
                <Select.Item index={idx} key={item.value} value={item.value}>
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    <Check size={14} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select>
      </View>
    </Theme>
  )
}
