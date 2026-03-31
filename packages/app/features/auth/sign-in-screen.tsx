'use client'

import {useState} from 'react'
import {useRouter} from 'solito/navigation'
import {AlertCircle, ShieldCheck} from '@tamagui/lucide-icons'
import {trpc} from '@revit/api/client'
import {useAuthStore} from '@revit/api/store/auth.store'
import {SignInT} from '@revit/api/types/auth.types'
import {
    Button,
    Card,
    ErrorText,
    H1,
    Input,
    Paragraph,
    ScrollView,
    Spinner,
    Text,
    XStack,
    YStack,
} from '@revit/ui'

export default function SignInScreen() {
    const router = useRouter()
    const mutation = trpc.auth.signIn.useMutation()
    const setSession = useAuthStore((state) => state.setSession)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<{
        email?: string
        password?: string
        form?: string
    }>({})

    const emailValue = email.trim()
    const canSubmit = emailValue !== '' && password.length >= 8 && !mutation.isPending

    const validate = () => {
        const result = SignInT.safeParse({
            email: emailValue.trim().toLowerCase(),
            password,
        })

        if (result.success) {
            return {}
        }

        const {fieldErrors} = z.flattenError(result.error)

        return {
            email: fieldErrors.email?.[0],
            password: fieldErrors.password?.[0],
        }
    }

    const handleLogin = () => {
        const nextErrors = validate()

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors)
            return
        }

        setErrors({})

        mutation.mutate(
            {email: emailValue.toLowerCase(), password},
            {
                onSuccess: (data) => {
                    if (!data.accessToken) {
                        return
                    }

                    setSession({
                        user: data.user,
                        accessToken: data.accessToken,
                    })
                    router.replace('/home')
                },
                onError: (error) => {
                    setErrors((current) => ({
                        ...current,
                        form: error.message,
                    }))
                },
            }
        )
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
                <AuthBackdrop/>

                <YStack width="100%" maxWidth={1120} alignSelf="center" gap="$6">
                    <XStack alignItems="center" justifyContent="space-between" flexWrap="wrap" gap="$3" marginTop="$4">
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

                    <XStack  width="100%" flexWrap="wrap" alignItems="stretch" marginTop="$10" gap="$10">
                        <YStack
                            flex={1}
                            minWidth={320}
                            maxWidth={620}
                            justifyContent="center"
                            gap="$5"
                            $platform-native={{display: "none"}}
                            paddingVertical="$5"
                        >
                            <YStack gap="$3">
                                <Text textTransform="uppercase" letterSpacing={1.2} color="$color10">
                                    Welcome back
                                </Text>
                                <H1 size="$12" letterSpacing={-2}>
                                    Sign into live review threads.
                                </H1>
                                <Paragraph size="$6" color="$color10" maxWidth={560}>
                                    Rate posts, give feedback, and join the forums you care
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
                                        <ShieldCheck size={20} color="white"/>
                                    </YStack>
                                    <YStack flex={1} gap="$1">
                                        <Text fontWeight="800">Your identity powers the review.</Text>
                                        <Paragraph color="$color10">
                                            Sign in to rate posts, join forums, and keep your review
                                            history in one place.
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
                            padding="$5"
                            gap="$4"
                        >
                            {errors.form ? (
                                <XStack
                                    alignItems="flex-start"
                                    gap="$3"
                                    width="100%"
                                    paddingVertical="$3"
                                    paddingHorizontal="$3.5"
                                    borderWidth={1}
                                    borderColor="$red6"
                                    backgroundColor="$red2"
                                    borderRadius="$5"
                                >
                                    <YStack
                                        width={20}
                                        height={20}
                                        alignItems="center"
                                        justifyContent="center"
                                        marginTop="$1"
                                        borderRadius={999}
                                        backgroundColor="$red3"
                                        flexShrink={0}
                                    >
                                        <AlertCircle size={14} color="$red10"/>
                                    </YStack>
                                    <YStack flex={1} gap="$1">
                                        <Text color="$red11" fontWeight="800" lineHeight="$1">
                                            Sign in failed
                                        </Text>
                                        <Paragraph color="$red11" size="$3">
                                            {errors.form}
                                        </Paragraph>
                                    </YStack>
                                </XStack>
                            ) : null}

                            <YStack gap="$2">
                                <Text fontSize={30} fontWeight="900" letterSpacing={-1}>
                                    Sign In
                                </Text>
                                <Paragraph color="$color10">
                                    Use your email and password to continue.
                                </Paragraph>
                            </YStack>

                            <YStack gap="$3">
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
                                        onChangeText={(value) => {
                                            setEmail(value)
                                            setErrors((current) => ({...current, email: undefined, form: undefined}))
                                        }}
                                        backgroundColor="$color1"
                                    />
                                    <ErrorText error={errors.email}/>
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
                                        onChangeText={(value) => {
                                            setPassword(value)
                                            setErrors((current) => ({...current, password: undefined, form: undefined}))
                                        }}
                                        onSubmitEditing={handleLogin}
                                        backgroundColor="$color1"
                                    />
                                    <ErrorText error={errors.password}/>
                                </YStack>
                            </YStack>
                            <Button
                                size="$4"
                                theme="blue"
                                disabled={!canSubmit}
                                onPress={handleLogin}
                            >
                                {mutation.isPending ? <Spinner size="small"/> : 'Sign In'}
                            </Button>

                            <YStack
                                paddingTop="$4"
                                gap="$3"
                            >
                                <YStack gap="$1">
                                    <Text fontWeight="800">New here?</Text>
                                    <Paragraph color="$color10">
                                        Create an account and start publishing review requests.
                                    </Paragraph>
                                </YStack>
                                <Button theme="gray" onPress={() => router.push('/signup')}>
                                    Create account
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

function AuthFeature({
                         icon: Icon,
                         title,
                         body,
                     }: {
    icon: any
    title: string
    body: string
}) {
    return (
        <Card
            flex={1}
            minWidth={170}
            backgroundColor="$blue1"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$7"
            padding="$4"
            gap="$2"
        >
            <XStack
                width={40}
                height={40}
                alignItems="center"
                justifyContent="center"
                borderRadius={999}
                backgroundColor="$blue3"
            >
                <Icon size={18} color="var(--blue10)"/>
            </XStack>
            <Text fontWeight="800">{title}</Text>
            <Paragraph color="$color10">{body}</Paragraph>
        </Card>
    )
}
