'use client'

import { Checkbox, CheckboxProps, Label, XStack } from 'tamagui'
import { Check as CheckIcon } from '@tamagui/lucide-icons'

type FontSize = number | "$0" | "$0.25" | "$0.5" | "$0.75" | "$1" | "$1.5" | "$2" | "$2.5" | "$3" | "$3.5" | "$4" | "$true" | "$4.5" | "$5" | "$6" | "$7" | "$8" | "$9" | "$10" | "$11" | "$12" | "$13" | "$14" | "$15" | "$16" | "$17" | "$18" | "$19" | "$20" | "auto" 

export function CheckboxWithLabel({
  size,
  label = 'Accept terms and conditions',
  fontSize ="$2",
  ...checkboxProps
}: CheckboxProps & { label?: string, fontSize: FontSize }) {
  const id = `checkbox-${(size || '').toString().slice(1)}`
  return (
    <XStack width={300} alignItems="center" gap="$3">
      <Checkbox id={id} size={size} {...checkboxProps}>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox>

      <Label size={fontSize} htmlFor={id}>
        {label}
      </Label>
    </XStack>
  )
}
