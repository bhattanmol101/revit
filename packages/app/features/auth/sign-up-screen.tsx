'use client'

import { useState } from 'react'
import { Button, Card, H2, Input, Paragraph, Spinner, Text, YStack } from '@revit/ui'

type SignUpScreenProps = {
    error: string | null
    isSubmitting: boolean
    onSubmit: (name:string, email: string, password: string) => Promise<void>
}

export function SignUpScreen({ error, isSubmitting, onSubmit }: SignUpScreenProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const passwordsMatch = password.length > 0 && password === confirmPassword

    const handleSubmit = async () => {
        if (!passwordsMatch) return
        await onSubmit("tom", email, password)
        setPassword('')
        setConfirmPassword('')
    }

    return (
        <YStack flex={1} justify="center" items="center" p="$4" bg="$background">
            <Card border="1px solid" width="100%" maxWidth={420} p="$5" gap="$4">
                <YStack gap="$2">
                    <H2 color="$color12">Sign up</H2>
                    <Paragraph color="$color10">Create an account with email and password.</Paragraph>
                </YStack>

                <YStack gap="$3">
                    <YStack gap="$2">
                        <Text color="$color11">Email</Text>
                        <Input value={email} placeholder="you@example.com" autoCapitalize="none" autoCorrect={false} onChangeText={setEmail} />
                    </YStack>
                    <YStack gap="$2">
                        <Text color="$color11">Password</Text>
                        <Input value={password} placeholder="At least 8 characters" secureTextEntry autoCapitalize="none" autoCorrect={false} onChangeText={setPassword} />
                    </YStack>
                    <YStack gap="$2">
                        <Text color="$color11">Confirm password</Text>
                        <Input value={confirmPassword} placeholder="Repeat password" secureTextEntry autoCapitalize="none" autoCorrect={false} onChangeText={setConfirmPassword} onSubmitEditing={handleSubmit} />
                    </YStack>
                </YStack>

                {!passwordsMatch && confirmPassword ? <Paragraph color="$red10">Passwords do not match.</Paragraph> : null}
                {error ? <Paragraph color="$red10">{error}</Paragraph> : null}

                <Button size="$5" disabled={isSubmitting || !email.trim() || password.length < 8 || !passwordsMatch} onPress={handleSubmit}>
                    {isSubmitting ? <Spinner size="small" /> : 'Create account'}
                </Button>
            </Card>
        </YStack>
    )
}