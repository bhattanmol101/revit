import React, { useEffect, useState } from 'react'
import { Platform, ScrollView, StyleSheet } from 'react-native'
import { Button, Card, Paragraph, Separator, Text, Theme, XStack, YStack } from 'tamagui'
import { LinearGradient } from 'expo-linear-gradient'
import { MotiText, MotiView } from 'moti'
import { useRouter } from 'expo-router'
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
import FallingStars from '@revit/app/animation/FallingStars'
import RevitText from '@revit/shared/assets/logo/RevitText'
import { useAuthStore } from '@revit/app/store'

export default function MainScreenr() {
  const { user } = useAuthStore()

  const router = useRouter()

  const [wordIndex, setWordIndex] = useState(0)
  const words = ['Movies', 'Food', 'Apps', 'Ideas', 'Places', 'People']

  const handleSignin = () => {
    router.push('/signin')
  }

  const handleSignup = () => {
    router.push('/signup')
  }

  useEffect(() => {
    const t = setInterval(() => setWordIndex((p) => (p + 1) % words.length), 2200)
    return () => clearInterval(t)
  }, [])

  if (user) {
    return
  }

  return (
    <Theme name="dark">
      <YStack flex={1}>
        {/* 💫 Soft Gradient Background */}
        <LinearGradient
          colors={['#000000', '#152331']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFillObject]}
        />

        <FallingStars />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 120,
            alignItems: 'center',
          }}
        >
          {/* ⭐ Hero Section */}
          <YStack
            alignItems="center"
            justifyContent="center"
            paddingVertical="$3"
            paddingHorizontal="$6"
            marginTop={Platform.OS === 'web' ? 100 : 30}
            width="100%"
            position="relative"
          >
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 800 }}
              style={{ alignItems: 'center' }}
            >
              <RevitText height={70} width={120} />

              <Text
                fontSize={16}
                color="#e5e5e5"
                textAlign="center"
                mx="auto"
                lineHeight={20}
                mt="$3"
              >
                Rate <Text color="#d4af37">{words[wordIndex]}</Text>, share insights, and discover
                what people really think — all in one place.
              </Text>
            </MotiView>

            {/* CTA Buttons */}
            <MotiView
              from={{ opacity: 0, translateY: 40 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 600, duration: 700 }}
              style={{ width: '100%', marginTop: 30 }}
            >
              <YStack gap="$4" width="100%" px="$5">
                <Button
                  size="$4"
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
                  size="$4"
                  borderRadius="$12"
                  borderWidth={1}
                  borderColor="rgba(255,255,255,0.2)"
                  color="white"
                  backgroundColor="rgba(255,255,255,0.05)"
                  onPress={handleSignin}
                >
                  Sign In
                </Button>
              </YStack>
            </MotiView>
          </YStack>

          {/* Divider */}
          <Separator
            borderColor="rgba(255,255,255,0.1)"
            width="80%"
            marginBottom="$3"
            marginTop="$2"
          />

          {/* 💡 Why Revit Section */}
          <YStack alignItems="center" gap="$4" paddingHorizontal="$6" marginTop="$4">
            <MotiText
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 200 }}
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: 'white',
                textAlign: 'center',
              }}
            >
              What is Revit?
            </MotiText>
            <Paragraph color="#bdbdbd" fontSize={16} textAlign="center" maxWidth={800} mb="$8">
              Built for creators, communities, and the curious, it is your personal opinion
              platform. Whether it’s movies, meals, products, or experiences — Revit helps you
              express and discover authentic community-driven ratings.
            </Paragraph>
          </YStack>

          {/* 🌟 Feature Cards */}
          <XStack flexWrap="wrap" justifyContent="center" gap="$4" paddingHorizontal="$4">
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
              <MotiView
                key={i}
                from={{ opacity: 0, translateY: 40 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: i * 200 }}
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
              </MotiView>
            ))}
          </XStack>

          {/* 🗣️ Forums Section */}
          <YStack marginVertical="$10" alignItems="center" paddingHorizontal="$5">
            <MotiText
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 400 }}
              style={{
                fontSize: 26,
                fontWeight: '700',
                color: 'white',
                textAlign: 'center',
              }}
            >
              Explore Revit Forums
            </MotiText>

            <Paragraph
              color="rgba(255,255,255,0.75)"
              textAlign="center"
              fontSize={15}
              maxWidth={350}
              marginVertical="$3"
            >
              Every opinion belongs somewhere. Dive into topic-based discussions — from startups to
              cinema — and shape conversations that matter.
            </Paragraph>

            <XStack gap="$4" flexWrap="wrap" justifyContent="center" marginTop="$3">
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
                <MotiView
                  key={i}
                  from={{ opacity: 0, translateY: 30 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: 600 + i * 200 }}
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
                </MotiView>
              ))}
            </XStack>
          </YStack>

          {/* --- CTA FOOTER --- */}
          <YStack
            alignItems="center"
            pt="$8"
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
              size="$4"
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
              <Heart color="red" fill="red" size={12} /> by aeradron
            </Paragraph>
          </YStack>
        </ScrollView>
      </YStack>
    </Theme>
  )
}
