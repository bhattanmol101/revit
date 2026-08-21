import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";

export function AuthScreenLayout({ children, title, description }: { children: ReactNode; title: string; description: string }) {
  return <SafeAreaView className="flex-1 bg-background"><KeyboardAvoidingView className="flex-1" behavior={Platform.select({ ios: "padding", default: undefined })}><ScrollView contentContainerClassName="flex-grow items-center justify-center px-6 py-10"><View className="w-full max-w-md gap-8"><View className="gap-2"><Text variant="h1" className="text-left">{title}</Text><Text variant="muted" className="text-base leading-6">{description}</Text></View>{children}</View></ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
