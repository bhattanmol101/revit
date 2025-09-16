import { createFont, createTokens, isWeb } from 'tamagui'

export const defaultTokens = createTokens({
  size: {
    // Define various sizes, with 'true' marking your base default
    1: 10,
    2: 12,
    true: 14, // This sets 16px as your default font size
    3: 16,
    4: 28,
  },
  weight: {
    1: '300',
    true: '400',
    2: '500',
    3: '700',
  },
})

const notoSansFace = {
  normal: { normal: 'NotoSans-Regular' },
  bold: { normal: 'NotoSans-Bold' },
  300: { normal: 'NotoSans-Light' },
  500: { normal: 'NotoSans-Regular' },
  600: { normal: 'NotoSans-Medium' },
  700: { normal: 'NotoSans-SemiBold' },
  800: { normal: 'NotoSans-Bold' },
  900: { normal: 'NotoSans-ExtraBold' },
}

export const headingFont = createFont({
  family: isWeb ? 'Noto Sans, serif' : 'OpenSans',
  size: {
    1: 20,
    2: 22,
    3: 24,
    4: 26,
    5: 28,
    6: 30,
    true: 20,
  },
  transform: {
    6: 'uppercase',
    7: 'none',
  },
  weight: {
    3: '500',
    4: '700',
    true: 600,
  },
  face: notoSansFace,
})

export const bodyFont = createFont({
  family: isWeb ? 'Noto Sans, serif' : 'OpenSans',
  size: {
    1: 10,
    2: 12,
    3: 14,
    4: 16,
    5: 18,
    6: 20,
    7: 22,
    8: 24,
    9: 26,
    10: 28,
    true: 14,
  },
  weight: {
    1: '300',
    2: '400',
    3: '500',
    4: '700',
    true: '400',
  },
  face: notoSansFace,
})
