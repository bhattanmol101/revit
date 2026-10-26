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
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="flex-grow items-center justify-center bg-muted/30 px-5 py-10 sm:px-6"
        >
          <View className="w-full max-w-md gap-7">
            <View className="items-center gap-1.5">
              <Text className="font-serif text-3xl font-bold tracking-tight">
                Revit
              </Text>
              <Text variant="muted">Good finds. Trusted opinions.</Text>
            </View>
            <View className="gap-2.5">
              <Text variant="h1" className="text-left">
                {title}
              </Text>
              <Text variant="muted" className="text-sm leading-5">
                {description}
              </Text>
            </View>
            <View className="gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              {children}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
