'use client'

import React, { useEffect, useState } from 'react'
import { Button, Card, Paragraph, Text, Theme, View, XStack, YStack } from '@revit/ui'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Globe,
  Hash,
  Heart,
  MessageCircle,
  MessageSquare,
  TrendingUp,
  Users,
} from '@tamagui/lucide-icons'
import RevitText from '@revit/shared/assets/logo/RevitText'
import FallingStars from '@revit/app/animation/FallingStars'
import { useRouter } from 'next/navigation'

const words = ['Movies', 'Food', 'Apps', 'Ideas', 'Places', 'People']

export default function HomePage() {
  const router = useRouter()

  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setWordIndex((p) => (p + 1) % words.length), 2200)
    return () => clearInterval(t)
  }, [])

  const handleSignin = () => {
    router.push('/signin')
  }

  const handleSignup = () => {
    router.push('/signup')
  }

  return (
    <Theme name="dark">
      {/* Linear Gradient Background Layer */}
      <View
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: `
              linear-gradient(
                #000000 0%,
                #152331 100%
              )
            `,
        }}
      />

      <FallingStars />

      <YStack flex={1} position="relative" zIndex={2} minHeight="100%" overflow="hidden">
        {/* --- HERO --- */}
        <YStack alignItems="center" justifyContent="center" pt="$12" pb="$10" px="$6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            style={{ textAlign: 'center', width: 850 }}
          >
            <XStack justifyContent="center" alignItems="center" mb="$8">
              <RevitText height={70} width={150} />
            </XStack>

            <XStack justifyContent="center" alignItems="center" mb="$3">
              <Text
                fontSize={36}
                style={{
                  background: 'linear-gradient(90deg, #FF705B, #FFB457)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                fontWeight="bold"
              >
                Review&nbsp;
              </Text>

              <Text
                fontSize={36}
                style={{
                  background: 'linear-gradient(90deg, #FF72E1, #F54C7A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                fontWeight="bold"
              >
                Everything&nbsp;
              </Text>
            </XStack>

            <Text fontSize={20} color="#e5e5e5" textAlign="center" mx="auto" lineHeight={30}>
              Rate <Text color="#d4af37">{words[wordIndex]}</Text>, share insights, and discover
              what people really think — all in one place.
            </Text>
          </motion.div>

          <XStack mt="$10" gap="$3">
            <Button
              size="$5"
              borderRadius="$12"
              backgroundColor="#167df4"
              color="white"
              fontWeight="700"
              iconAfter={ArrowRight}
              onPress={handleSignup}
            >
              Get Started
            </Button>
            <Button
              size="$5"
              borderRadius="$12"
              borderWidth={1}
              borderColor="rgba(255,255,255,0.2)"
              color="white"
              backgroundColor="rgba(255,255,255,0.05)"
              onPress={handleSignin}
            >
              Sign In
            </Button>
          </XStack>
        </YStack>

        {/* --- FEATURE SECTION --- */}
        <YStack alignItems="center" py="$6" px="$6" zIndex={2}>
          <Text fontSize={28} fontWeight="700" color="white" mb="$3">
            What is Revit?
          </Text>
          <Paragraph color="#bdbdbd" fontSize={16} textAlign="center" maxWidth={800} mb="$8">
            Built for creators, communities, and the curious, it is your personal opinion platform.
            Whether it’s movies, meals, products, or experiences — Revit helps you express and
            discover authentic community-driven ratings.
          </Paragraph>

          <XStack
            flexWrap="wrap"
            justifyContent="center"
            alignItems="stretch"
            gap="$5"
            maxWidth={1100}
          >
            {[
              {
                icon: <Users color="#167df4" size={26} />,
                title: 'Join the Community',
                desc: 'Connect with passionate users worldwide sharing their honest opinions every day.',
              },
              {
                icon: <Award color="#167df4" size={26} />,
                title: 'Discover Real Trends',
                desc: 'See what’s popular, and explore top-rated posts — powered by real opinions, not algorithms.',
              },
              {
                icon: <MessageSquare color="#167df4" size={26} />,
                title: 'Share Insights',
                desc: 'Start meaningful conversations that inspire and others relate to.',
              },
              {
                icon: <TrendingUp color="#167df4" size={26} />,
                title: 'Build Influence',
                desc: 'Your opinions matter — Earn trust and become a top rater in your niche.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Card
                  elevate
                  borderRadius="$10"
                  backgroundColor="rgba(255,255,255,0.04)"
                  borderWidth={1}
                  borderColor="rgba(255,255,255,0.1)"
                  p="$5"
                  w={250}
                  cursor="default"
                  alignItems="center"
                  hoverStyle={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    transform: 'translateY(-4px)',
                  }}
                  pressStyle={{
                    backgroundColor: 'rgba(255,255,255,0.12)',
                  }}
                >
                  {item.icon}
                  <Text color="white" fontSize="$4" fontWeight="700" mt="$3" textAlign="center">
                    {item.title}
                  </Text>
                  <Paragraph color="#a1a1aa" fontSize="$3" textAlign="center" mt="$2">
                    {item.desc}
                  </Paragraph>
                </Card>
              </motion.div>
            ))}
          </XStack>
        </YStack>

        {/* --- FORUM SECTION --- */}
        <YStack alignItems="center" py="$12" px="$6" zIndex={2}>
          <Text fontSize={28} fontWeight="700" color="white" mb="$3">
            Explore Revit Forums
          </Text>
          <Paragraph color="#bdbdbd" fontSize={16} textAlign="center" maxWidth={800} mb="$8">
            Every opinion belongs somewhere. Dive into topic-based discussions — from startups to
            cinema — and shape conversations that matter.
          </Paragraph>

          <XStack flexWrap="wrap" justifyContent="center" gap="$5" maxWidth={900}>
            {[
              {
                icon: <Globe color="#167df4" size={24} />,
                title: 'Explore Forums',
                desc: 'Discover trending and niche spaces tailored to your interests.',
              },
              {
                icon: <Hash color="#167df4" size={24} />,
                title: 'Create a Forum',
                desc: 'Start your own community and lead discussions.',
              },
              {
                icon: <MessageCircle color="#167df4" size={24} />,
                title: 'Join Conversations',
                desc: 'Engage, react, and connect with authenticity.',
              },
            ].map((forum, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.2, duration: 0.7 }}
              >
                <Card
                  borderRadius="$10"
                  backgroundColor="rgba(255,255,255,0.05)"
                  borderWidth={1}
                  borderColor="rgba(255,255,255,0.1)"
                  p="$5"
                  w={260}
                  alignItems="center"
                  hoverStyle={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-4px)',
                  }}
                >
                  {forum.icon}
                  <Text color="white" fontSize={17} fontWeight="700" mt="$3" textAlign="center">
                    {forum.title}
                  </Text>
                  <Paragraph color="#a1a1aa" fontSize={14} textAlign="center" mt="$2">
                    {forum.desc}
                  </Paragraph>
                </Card>
              </motion.div>
            ))}
          </XStack>
        </YStack>

        {/* --- CTA FOOTER --- */}
        <YStack
          alignItems="center"
          py="$14"
          px="$6"
          borderTopWidth={1}
          borderColor="rgba(255,255,255,0.1)"
        >
          <Text fontSize={32} fontWeight="800" color="white" textAlign="center" mb="$3">
            Ready to Rate the World?
          </Text>
          <Paragraph color="#bdbdbd" textAlign="center" fontSize={16} mb="$5">
            Join thousands already discovering honest opinions and community-driven insights.
          </Paragraph>
          <Button
            size="$6"
            backgroundColor="#167df4"
            color="white"
            fontWeight="700"
            borderRadius="$12"
            iconAfter={ArrowRight}
            onPress={handleSignup}
          >
            Get Started Free
          </Button>

          <Paragraph color="#6b7280" fontSize={13} mt="$8">
            © {new Date().getFullYear()} Revit — Created with{' '}
            <Heart color="red" fill="red" size={12} /> by aeradron.
          </Paragraph>
        </YStack>
      </YStack>
    </Theme>
  )
}
