import { createFont, isWeb } from 'tamagui'

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
  },
  transform: {
    6: 'uppercase',
    7: 'none',
  },
  weight: {
    3: '500',
    4: '700',
  },
  face: notoSansFace,
})

export const bodyFont = createFont({
  family: isWeb ? 'Noto Sans, serif' : 'OpenSans',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 22,
    7: 24,
    8: 26,
    9: 28,
    10: 30,
  },
  weight: {
    1: '300',
    2: '400',
    3: '500',
    4: '700',
  },
  face: notoSansFace,
})
