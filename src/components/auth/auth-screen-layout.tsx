import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
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
        <ScrollView contentContainerClassName="flex-grow items-center justify-center px-6 py-8 sm:px-6">
          <View className="w-full max-w-md gap-6">
            <View className="gap-1">
              <Text className="font-serif text-2xl font-bold tracking-tight">
                Revit
              </Text>
              <Text variant="muted">Good finds. Trusted opinions.</Text>
            </View>
            <View className="gap-2">
              <Text variant="h1" className="text-left">
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
