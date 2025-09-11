import type { SizeTokens } from 'tamagui'
import { Theme, View } from 'tamagui'
import { Input } from '../elements/inputParts'
import { Shake } from '../Shake'
import { FieldError } from '../FieldError'

/** ------ EXAMPLE ------ */
export function InputField({
  id,
  label,
  size,
  placeholder,
  textContentType = 'none',
  focusOnMount = false,
  secureTextEntry = false,
  value,
  onChangeText,
  error,
}: {
  id: string
  size?: SizeTokens
  textContentType?: 'none' | 'emailAddress' | 'password'
  placeholder: string
  focusOnMount?: boolean
  secureTextEntry?: boolean
  label?: string
  value?: string
  onChangeText?: (text: string) => void
  error?: string
}) {
  return (
    <Theme name={error ? 'red' : null} forceClassName>
      <View flexDirection="column" justifyContent="center" alignItems="center">
        <Input size={size} minWidth="100%">
          <Input.Label htmlFor="input" mb="$1.5" size="$2">
            {label}
          </Input.Label>
          <Shake shakeKey={error}>
            <Input.Box>
              <Input.Area
                id={id}
                fontSize="$3"
                textContentType={textContentType}
                secureTextEntry={secureTextEntry}
                value={value}
                placeholder={placeholder}
                autoFocus={focusOnMount}
                onChangeText={onChangeText}
              />
            </Input.Box>
          </Shake>
          <FieldError message={error} />
        </Input>
      </View>
    </Theme>
  )
}
