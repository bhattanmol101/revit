'use client'

import { useState } from 'react'
import { useRouter } from 'solito/navigation'
import { ShieldCheck } from '@tamagui/lucide-icons'
import {
    Button,
    Card,
    H1,
    Input,
    Paragraph,
    ScrollView,
    Spinner,
    Text,
    XStack,
    YStack,
} from '@revit/ui'

type SignUpScreenProps = {
    error: string | null
    isSubmitting: boolean
    onSubmit: (name: string, email: string, password: string) => Promise<void>
}

export default function SignUpScreen({ error, isSubmitting, onSubmit }: SignUpScreenProps) {
    const router = useRouter()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const passwordsMatch = password.length > 0 && password === confirmPassword

    const handleSubmit = async () => {
        if (!name.trim() || !passwordsMatch) {
            return
        }

        await onSubmit(name.trim(), email, password)
        setPassword('')
        setConfirmPassword('')
    }

    return (
        <ScrollView flex={1} backgroundColor="$background" showsVerticalScrollIndicator={false}>
            <YStack
                position="relative"
                minHeight="100%"
                paddingHorizontal="$4"
                paddingTop="$5"
                paddingBottom="$6"
                backgroundColor="$background"
            >
                <AuthBackdrop />

                <YStack width="100%" maxWidth={1120} alignSelf="center" gap="$6">
                    <XStack alignItems="center" justifyContent="space-between" flexWrap="wrap" gap="$3" marginTop="$2" $platform-native={{marginTop:"$4"}}>
                        <XStack alignItems="center" gap="$2">
                            <YStack
                                width={16}
                                height={16}
                                borderRadius={999}
                                backgroundColor="$blue9"
                            />
                            <Text fontWeight="900" letterSpacing={1.4}>
                                REVIT
                            </Text>
                        </XStack>

                        <Button chromeless size="$3" onPress={() => router.push('/')}>
                            Back to home
                        </Button>
                    </XStack>

                    <XStack width="100%" flexWrap="wrap" alignItems="stretch" marginTop="$4" gap="$10">
                        <YStack
                            flex={1}
                            minWidth={320}
                            maxWidth={620}
                            justifyContent="center"
                            gap="$5"
                            $platform-native={{ display: 'none' }}
                            paddingVertical="$5"
                        >
                            <YStack gap="$3">
                                <Text textTransform="uppercase" letterSpacing={1.2} color="$color10">
                                    Create your account
                                </Text>
                                <H1 size="$12" letterSpacing={-2}>
                                    Join live review threads.
                                </H1>
                                <Paragraph size="$6" color="$color10" maxWidth={560}>
                                    Publish posts, ask for feedback, and join the forums you care
                                    about.
                                </Paragraph>
                            </YStack>

                            <Card
                                backgroundColor="$blue2"
                                borderWidth={1}
                                borderColor="$borderColor"
                                borderRadius="$8"
                                padding="$4"
                                gap="$3"
                            >
                                <XStack alignItems="center" gap="$3">
                                    <YStack
                                        width={44}
                                        height={44}
                                        alignItems="center"
                                        justifyContent="center"
                                        borderRadius={999}
                                        backgroundColor="$blue9"
                                    >
                                        <ShieldCheck size={20} color="white" />
                                    </YStack>
                                    <YStack flex={1} gap="$1">
                                        <Text fontWeight="800">Your identity powers the review.</Text>
                                        <Paragraph color="$color10">
                                            Create an account to rate posts, join forums, and keep your
                                            review history in one place.
                                        </Paragraph>
                                    </YStack>
                                </XStack>
                            </Card>
                        </YStack>

                        <Card
                            flex={1}
                            minWidth={320}
                            maxWidth={420}
                            alignSelf="center"
                            backgroundColor="$blue1"
                            borderWidth={1}
                            borderColor="$borderColor"
                            borderRadius="$8"
                            paddingHorizontal="$5"
                            paddingVertical="$6"
                            gap="$4"
                        >
                            <YStack gap="$2">
                                <Text fontSize={30} fontWeight="900" letterSpacing={-1}>
                                    Sign Up
                                </Text>
                                <Paragraph color="$color10">
                                    Create your account to continue.
                                </Paragraph>
                            </YStack>

                            <YStack gap="$3">
                                <YStack gap="$2">
                                    <Text color="$color11" fontWeight="700">
                                        Name
                                    </Text>
                                    <Input
                                        value={name}
                                        placeholder="Your name"
                                        autoCapitalize="words"
                                        autoCorrect={false}
                                        onChangeText={setName}
                                        backgroundColor="$color1"
                                    />
                                </YStack>

                                <YStack gap="$2">
                                    <Text color="$color11" fontWeight="700">
                                        Email
                                    </Text>
                                    <Input
                                        value={email}
                                        placeholder="you@example.com"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="email-address"
                                        onChangeText={setEmail}
                                        backgroundColor="$color1"
                                    />
                                </YStack>

                                <YStack gap="$2">
                                    <Text color="$color11" fontWeight="700">
                                        Password
                                    </Text>
                                    <Input
                                        value={password}
                                        placeholder="Your password"
                                        secureTextEntry
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={setPassword}
                                        backgroundColor="$color1"
                                    />
                                </YStack>

                                <YStack gap="$2">
                                    <Text color="$color11" fontWeight="700">
                                        Confirm Password
                                    </Text>
                                    <Input
                                        value={confirmPassword}
                                        placeholder="Confirm your password"
                                        secureTextEntry
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={setConfirmPassword}
                                        onSubmitEditing={handleSubmit}
                                        backgroundColor="$color1"
                                    />
                                </YStack>
                            </YStack>

                            {!passwordsMatch && confirmPassword ? (
                                <Paragraph color="$red10">
                                    Passwords do not match.
                                </Paragraph>
                            ) : null}

                            {error ? (
                                <Paragraph color="$red10">
                                    {error}
                                </Paragraph>
                            ) : null}

                            <Button
                                size="$4"
                                theme="blue"
                                disabled={
                                    !name.trim() ||
                                    !email.trim() ||
                                    password.length < 8 ||
                                    !passwordsMatch ||
                                    isSubmitting
                                }
                                onPress={handleSubmit}
                            >
                                {isSubmitting ? <Spinner size="small" /> : 'Sign Up'}
                            </Button>

                            <YStack
                                paddingTop="$4"
                                gap="$3"
                            >
                                <YStack gap="$1">
                                    <Text fontWeight="800">Already have an account?</Text>
                                    <Paragraph color="$color10">
                                        Sign in and jump back into your review threads.
                                    </Paragraph>
                                </YStack>
                                <Button theme="gray" onPress={() => router.push('/signin')}>
                                    Sign in
                                </Button>
                            </YStack>
                        </Card>
                    </XStack>
                </YStack>
            </YStack>
        </ScrollView>
    )
}

function AuthBackdrop() {
    return (
        <>
            <YStack
                position="fixed"
                top={-120}
                right={-80}
                width={260}
                height={260}
                borderRadius={999}
                backgroundColor="$blue8"
                opacity={0.12}
            />
            <YStack
                position="fixed"
                top={200}
                left={-120}
                width={240}
                height={240}
                borderRadius={999}
                backgroundColor="$blue8"
                opacity={0.12}
            />
            <YStack
                position="fixed"
                bottom={-120}
                right={120}
                width={220}
                height={220}
                borderRadius={999}
                backgroundColor="$blue6"
                opacity={0.1}
            />
        </>
    )
}
