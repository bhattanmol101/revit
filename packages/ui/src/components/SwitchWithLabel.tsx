import type { SizeTokens } from 'tamagui'
import { Label, Separator, Switch, XStack } from 'tamagui'

export const SwitchWithLabel = ({
  label,
  size,
  checked,
  onCheckedChange
}: {
  label: string
  size: SizeTokens
  checked?: boolean
  onCheckedChange: () => void
}) => {
  const id = `switch-${size.toString().slice(1)}-${checked ?? ''}}`
  return (
    <XStack alignItems="center" gap="$2">
      <Switch id={id} size={size} checked={checked} backgroundColor={checked ? "$green10" : "$black10"} onCheckedChange={onCheckedChange}>
        <Switch.Thumb animation="quick" />
      </Switch>
      <Label color="$black11" size={12} htmlFor={id}>
        {label}
      </Label>
    </XStack>
  )
}
