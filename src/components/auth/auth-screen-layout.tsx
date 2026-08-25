import { Sparkles } from "lucide-react-native";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";

export function AuthScreenLayout({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.select({ ios: "padding", default: undefined })}
      >
        <ScrollView contentContainerClassName="flex-grow items-center justify-center px-3 py-6 sm:px-6">
          <View className="w-full max-w-md gap-5 rounded-lg border border-border bg-card p-4 shadow-none sm:p-5">
            <View className="size-10 items-center justify-center rounded-md bg-primary">
              <Icon as={Sparkles} className="text-white" />
            </View>
            <View className="gap-3">
              <Text variant="h1" className="text-left text-2xl">
                {title}
              </Text>
              <Text variant="muted" className="text-sm leading-5">
                {description}
              </Text>
            </View>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
