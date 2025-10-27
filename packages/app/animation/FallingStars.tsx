'use client'

import React from 'react'
import { View } from '@revit/ui'
import { MotiView } from 'moti'
import { Star } from '@tamagui/lucide-icons'
import { Dimensions } from 'react-native'

const { height } = Dimensions.get('window')

const stars = Array.from({ length: 25 }).map((_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: 10 + Math.random() * 12,
  duration: 60000 + Math.random() * 10000,
  delay: Math.random() * 10000,
}))

export default function FallingStars() {
  return (
    <View
      style={{
        position: 'fixed',
        inset: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: 'full',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {stars.map((s) => (
        <MotiView
          key={s.id}
          from={{
            translateY: -50,
            opacity: 0,
          }}
          animate={{
            translateY: height + 50,
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            type: 'timing',
            delay: s.delay,
            loop: true,
            repeatReverse: false,
            duration: s.duration,
          }}
          style={{
            position: 'absolute',
            left: `${s.left}%`,
            height: '100%',
          }}
        >
          <Star
            size={s.size}
            color="#d4af37"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.4))',
            }}
          />
        </MotiView>
      ))}
    </View>
  )
}
