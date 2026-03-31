'use client'

import {
    Button,
    Card,
    H1,
    H2,
    Paragraph,
    ScrollView,
    Separator,
    Text,
    XStack,
    YStack,
} from '@revit/ui'
import {
    MessageSquareQuote,
    PanelsTopLeft,
    ShieldCheck,
    Sparkles,
    Star,
    Users,
} from '@tamagui/lucide-icons'
import { useRouter } from 'solito/navigation'

export default function LandingScreen() {
    const router = useRouter()

    return (
        <ScrollView flex={1} backgroundColor="$background" showsVerticalScrollIndicator={false}>
            <YStack
                position="relative"
                minHeight="100%"
                paddingHorizontal="$4"
                paddingTop="$5"
                paddingBottom="$6"
                backgroundColor="$background"
                cursor="default"
            >
                <DecorativeBackdrop />

                <YStack
                    width="100%"
                    maxWidth={1120}
                    alignSelf="center"
                    gap="$7"
                >
                    <Header
                        onSignIn={() => router.push('/signin')}
                        onSignUp={() => router.push('/signup')}
                    />

                    <XStack
                        width="100%"
                        flexWrap="wrap"
                        alignItems="stretch"
                        gap="$4"
                    >
                        <YStack
                            flex={1}
                            minWidth={320}
                            maxWidth={690}
                            gap="$5"
                            paddingVertical="$4"
                        >
                            <XStack gap="$2" flexWrap="wrap">
                                <TagPill label="Rate any post" />
                                <TagPill label="Public reviews" />
                                <TagPill label="Community forums" />
                            </XStack>

                            <YStack gap="$3">
                                <H1 size="$12" $platform-native={{fontSize: "$11"}} letterSpacing={-2}>
                                    Revit turns posts into public review threads.
                                </H1>
                                <Paragraph size="$7" color="$color10" maxWidth={620}>
                                    Post anything. Ask for rating. Get feedback.
                                </Paragraph>
                            </YStack>

                            <XStack gap="$3" flexWrap="wrap">
                                <Button
                                    size="$5"
                                    theme="blue"
                                    onPress={() => router.push('/signup')}
                                >
                                    Start reviewing
                                </Button>
                                <Button
                                    size="$5"
                                    theme="gray"
                                    onPress={() => router.push('/signin')}
                                >
                                    Sign in
                                </Button>
                            </XStack>

                            <Card
                                backgroundColor="$blue2"
                                borderWidth={1}
                                borderColor="$borderColor"
                                borderRadius="$8"
                                padding="$4"
                                gap="$4"
                                shadowColor="$blue8"
                                shadowOpacity={0.08}
                                shadowRadius={16}
                                shadowOffset={{ width: 0, height: 8 }}
                            >
                                <Text textTransform="uppercase" letterSpacing={1.1} color="$color10">
                                    What makes it different
                                </Text>
                                <XStack gap="$3" flexWrap="wrap">
                                    <SignalChip label="Public Ratings" tone="$red8" />
                                    <SignalChip label="Feedback-first posts" tone="$red8" />
                                    <SignalChip label="Forum-driven communities" tone="$red8" />
                                </XStack>
                                <Paragraph color="$color10">
                                    Posts are made to be reviewed, discussed, and rated.
                                </Paragraph>
                            </Card>
                        </YStack>

                        <YStack
                            flex={1}
                            minWidth={320}
                            maxWidth={400}
                            gap="$3"
                        >
                            <HeroPreviewCard />
                        </YStack>
                    </XStack>
                    <FeatureSection />
                    <HowItWorksSection />
                    <ForumShowcaseSection />
                    <BottomCTA
                        onSignIn={() => router.push('/signin')}
                        onSignUp={() => router.push('/signup')}
                    />
                </YStack>
            </YStack>
        </ScrollView>
    )
}

function Header({
    onSignIn,
    onSignUp,
}: {
    onSignIn: () => void
    onSignUp: () => void
}) {
    return (
        <XStack
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap="$3"
            paddingTop="$4"
            $platform-native={{paddingTop: "$4"}}
            $platform-web={{paddingTop: "$2", paddingBottom: "$4"}}
        >
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

            <XStack gap="$2" flexWrap="wrap">
                <Button chromeless size="$3" onPress={onSignIn}>
                    Sign in
                </Button>
                <Button size="$3" theme="blue" onPress={onSignUp}>
                    Create account
                </Button>
            </XStack>
        </XStack>
    )
}

function DecorativeBackdrop() {
    return (
        <>
            <YStack
                position="fixed"
                top={-120}
                right={-110}
                width={300}
                height={300}
                borderRadius={999}
                backgroundColor="$blue8"
                opacity={0.12}
            />
            <YStack
                position="fixed"
                top={220}
                left={-140}
                width={260}
                height={260}
                borderRadius={999}
                backgroundColor="$blue9"
                opacity={0.12}
            />
            <YStack
                position="fixed"
                bottom={-160}
                right={-80}
                width={280}
                height={280}
                borderRadius={999}
                backgroundColor="$blue6"
                opacity={0.1}
            />
            <YStack
                position="fixed"
                top={140}
                right="18%"
                width={18}
                height={18}
                borderRadius={999}
                backgroundColor="$blue8"
                opacity={0.28}
            />
            <YStack
                position="fixed"
                top={440}
                left="12%"
                width={12}
                height={12}
                borderRadius={999}
                backgroundColor="$blue10"
                opacity={0.24}
            />
            <YStack
                position="fixed"
                top="200%"
                left={-100}
                bottom={0}
                width={260}
                height={260}
                borderRadius={999}
                backgroundColor="$blue7"
                opacity={0.12}
            />
        </>
    )
}

function HeroPreviewCard() {
    return (
        <Card
            backgroundColor="$blue1"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$8"
            padding="$4"
            gap="$4"
            hoverStyle={{
                backgroundColor: '$blue2',
                shadowColor: '$blue8',
                shadowOpacity: 0.22,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 12 },
            }}
        >
            <XStack alignItems="center" justifyContent="space-between" gap="$3">
                <YStack gap="$1" flex={1}>
                    <Text fontWeight="800">Live review thread</Text>
                    <Paragraph size="$2" color="$color10">
                        A post, a score, and visible feedback
                    </Paragraph>
                </YStack>
                <YStack
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius={999}
                    backgroundColor="$blue9"
                >
                    <Text color="white" fontWeight="800">
                        4.6/5
                    </Text>
                </YStack>
            </XStack>

            <Card
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$6"
                padding="$3"
                gap="$2"
            >
                <Text fontWeight="800">
                    “Should I launch this design system as a paid product?”
                </Text>
                <Paragraph color="$color10">
                    Ask for a rating and get public reasoning back.
                </Paragraph>
            </Card>

            <Separator />

            <XStack gap="$2" flexWrap="wrap">
                <PreviewStat icon={Star} label="2.1k ratings" />
                <PreviewStat icon={MessageSquareQuote} label="641 reviews" />
                <PreviewStat icon={Users} label="3 forums shared it" />
            </XStack>

            <Separator />


            <YStack gap="$2" flexWrap="wrap" paddingHorizontal="$2">
            <H2 size="$7">Built for rating culture.</H2>
            <Paragraph color="$color10">
                Ratings, reviews, and communities stay in one visible public layer.
            </Paragraph>
            </YStack>

            <Separator />

            <XStack gap="$2" flexWrap="wrap">
                <ForumBadge label="Founder Reviews" />
                <ForumBadge label="Design Critiques" />
                <ForumBadge label="Creator Feedback" />
            </XStack>
        </Card>
    )
}

function FeatureSection() {
    return (
        <YStack gap="$4">
            <SectionIntro
                eyebrow="Why Revit"
                title="A social platform centered on reviews, not just reactions."
                body="Each post can collect a rating, a comment, and a public verdict."
            />

            <XStack gap="$3" flexWrap="wrap" alignItems="stretch">
                <FeatureCard
                    icon={Sparkles}
                    title="Posts that invite a verdict"
                    body="Ask for ratings, critiques, or quick feedback."
                />
                <FeatureCard
                    icon={MessageSquareQuote}
                    title="Reviews with score plus context"
                    body="Every score comes with visible reasoning."
                />
                <FeatureCard
                    icon={Users}
                    title="Forums for communities"
                    body="Create spaces for niche audiences to review together."
                />
            </XStack>
        </YStack>
    )
}

function HowItWorksSection() {
    return (
        <YStack gap="$4">
            <SectionIntro
                eyebrow="How it works"
                title="Three simple actions keep the network moving."
                body="Publish, collect ratings, and watch public sentiment form."
            />

            <XStack gap="$3" flexWrap="wrap" alignItems="stretch">
                <StepCard
                    step="01"
                    title="Publish a post"
                    body="Ask people to rate an idea, launch, product, creator, or concept."
                />
                <StepCard
                    step="02"
                    title="Collect feedback"
                    body="People reply with a 1 to 5 rating and a public comment."
                />
                <StepCard
                    step="03"
                    title="Build a consensus"
                    body="As reviews stack up, the post becomes a visible public signal."
                />
            </XStack>
        </YStack>
    )
}

function ForumShowcaseSection() {
    return (
        <YStack gap="$4">
            <SectionIntro
                eyebrow="Forums"
                title="Create spaces where people gather around a shared standard."
                body="Forums keep feedback tied to real communities."
            />

            <XStack gap="$3" flexWrap="wrap" alignItems="stretch">
                <ForumCard
                    icon={PanelsTopLeft}
                    title="Startup feedback forum"
                    body="Landing pages, demos, and launches get open scores."
                    stats="2.3k members"
                />
                <ForumCard
                    icon={Star}
                    title="Creator review forum"
                    body="Audiences rate series, drops, and collaborations."
                    stats="8.1k members"
                />
                <ForumCard
                    icon={ShieldCheck}
                    title="Design critique forum"
                    body="Branding, interfaces, and case studies get public critique."
                    stats="1.4k members"
                />
            </XStack>
        </YStack>
    )
}


function BottomCTA({
    onSignIn,
    onSignUp,
}: {
    onSignIn: () => void
    onSignUp: () => void
}) {
    return (
        <Card
            backgroundColor="$blue1"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$8"
            padding="$5"
            gap="$3"
            hoverStyle={{
                backgroundColor: '$blue2',
                shadowColor: '$blue8',
                shadowOpacity: 0.22,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 12 },
            }}
        >
            <YStack gap="$2" maxWidth={720}>
                <Text textTransform="uppercase" letterSpacing={1.2} color="$color10">
                    Ready to launch your first review thread?
                </Text>
                <H2 size="$9">Start a forum, publish a post, and let people rate it.</H2>
                <Paragraph color="$color10">
                    Better for public feedback than likes or one-line replies.
                </Paragraph>
            </YStack>

            <XStack gap="$3" flexWrap="wrap">
                <Button size="$5" theme="blue" onPress={onSignUp}>
                    Join Revit
                </Button>
                <Button size="$5" theme="gray" onPress={onSignIn}>
                    Sign in
                </Button>
            </XStack>
        </Card>
    )
}

function SectionIntro({
    eyebrow,
    title,
    body,
}: {
    eyebrow: string
    title: string
    body: string
}) {
    return (
        <YStack gap="$2" maxWidth={760}>
            <Text textTransform="uppercase" letterSpacing={1.2} color="$color10">
                {eyebrow}
            </Text>
            <H2 size="$9">{title}</H2>
            <Paragraph color="$color10">{body}</Paragraph>
        </YStack>
    )
}

function TagPill({ label }: { label: string }) {
    return (
        <XStack
            paddingHorizontal="$3"
            paddingVertical="$2"
            borderRadius={999}
            backgroundColor="$blue2"
            borderWidth={1}
            borderColor="$borderColor"
            hoverStyle={{
                backgroundColor: '$blue3',
                shadowColor: '$blue8',
                shadowOpacity: 0.18,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 8 },
            }}
        >
            <Text fontWeight="700">{label}</Text>
        </XStack>
    )
}

function SignalChip({ label, tone }: { label: string; tone: string }) {
    return (
        <XStack
            alignItems="center"
            gap="$2"
            paddingHorizontal="$3"
            paddingVertical="$2"
            borderRadius={999}
            borderWidth={1}
            borderColor="$borderColor"
        >
            <YStack width={10} height={10} borderRadius={999} background={tone} />
            <Text fontWeight="700">{label}</Text>
        </XStack>
    )
}

function PreviewStat({
    icon: Icon,
    label,
}: {
    icon: any
    label: string
}) {
    return (
        <XStack
            alignItems="center"
            gap="$2"
            paddingHorizontal="$3"
            paddingVertical="$2"
            borderRadius={999}
            backgroundColor="$blue2"
            borderWidth={1}
            borderColor="$borderColor"
        >
            <Icon size={14} color="var(--blue10)" />
            <Text fontWeight="700">{label}</Text>
        </XStack>
    )
}

function ForumBadge({ label }: { label: string }) {
    return (
        <XStack
            paddingHorizontal="$3"
            paddingVertical="$2"
            borderRadius={999}
            backgroundColor="$blue2"
            borderWidth={1}
            borderColor="$borderColor"
        >
            <Text fontSize="$2" fontWeight="700">
                {label}
            </Text>
        </XStack>
    )
}

function FeatureCard({
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
            minWidth={240}
            backgroundColor="$blue1"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$7"
            padding="$4"
            gap="$2"
            hoverStyle={{
                backgroundColor: '$blue2',
                shadowColor: '$blue8',
                shadowOpacity: 0.2,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 10 },
            }}
        >
            <XStack
                width={42}
                height={42}
                alignItems="center"
                justifyContent="center"
                borderRadius={999}
                backgroundColor="$blue3"
            >
                <Icon size={18} color="var(--blue10)" />
            </XStack>
            <Text fontWeight="800">{title}</Text>
            <Paragraph color="$color10">{body}</Paragraph>
        </Card>
    )
}

function StepCard({
    step,
    title,
    body,
}: {
    step: string
    title: string
    body: string
}) {
    return (
        <Card
            flex={1}
            minWidth={240}
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$7"
            padding="$4"
            gap="$2"
            hoverStyle={{
                background: '$cyan2',
                shadowColor: '$blue8',
                shadowOpacity: 0.2,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 10 },
                cursor: 'default',
            }}
        >
            <Text color="$blue10" fontWeight="900">
                {step}
            </Text>
            <Text fontWeight="800">{title}</Text>
            <Paragraph color="$color10">{body}</Paragraph>
        </Card>
    )
}

function ForumCard({
    icon: Icon,
    title,
    body,
    stats,
}: {
    icon: any
    title: string
    body: string
    stats: string
}) {
    return (
        <Card
            flex={1}
            minWidth={240}
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$7"
            padding="$4"
            gap="$3"
            hoverStyle={{
                background: '$cyan2',
                shadowColor: '$blue8',
                shadowOpacity: 0.2,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 10 },
            }}
        >
            <XStack
                width={42}
                height={42}
                alignItems="center"
                justifyContent="center"
                borderRadius={999}
                backgroundColor="$blue3"
            >
                <Icon size={18} color="var(--blue10)" />
            </XStack>

            <YStack gap="$2">
                <Text fontWeight="800">{title}</Text>
                <Paragraph color="$color10">{body}</Paragraph>
            </YStack>

            <XStack
                alignItems="center"
                justifyContent="space-between"
                gap="$2"
                flexWrap="wrap"
            >
                <Text color="$color10">{stats}</Text>
                <ForumBadge label="Open reviews" />
            </XStack>
        </Card>
    )
}
