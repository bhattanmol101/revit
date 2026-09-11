import { Link } from "expo-router";
import { ArrowRight, MessageCircleQuestion, Star } from "lucide-react-native";
import { ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";

export function CreateChoiceScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <ScrollView contentContainerClassName="mx-auto w-full max-w-4xl gap-5 px-3 py-4 sm:px-6">
        <View className="gap-2 py-1">
          <Text variant="h1" className="text-left text-2xl">
            Share your taste
          </Text>
          <Text variant="muted" className="text-base leading-6">
            Ask people for their rating or share a restaurant rating.
          </Text>
        </View>

        <View className="gap-3 sm:flex-row">
          <Card className="flex-1 gap-3 py-3">
            <CardHeader className="gap-3 px-3">
              <View className="size-9 items-center justify-center rounded-md bg-selected">
                <Icon as={MessageCircleQuestion} className="text-primary" />
              </View>
              <CardTitle className="text-lg">Ask for ratings</CardTitle>
              <CardDescription className="leading-5">
                Post a question and let people respond with a 1–5 rating.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3">
              <Link href={routes.createAsk} asChild>
                <Button className="w-full">
                  <Text>Start an Ask</Text>
                  <Icon as={ArrowRight} />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="flex-1 gap-3 py-3">
            <CardHeader className="gap-3 px-3">
              <View className="size-9 items-center justify-center rounded-md bg-elevated">
                <Icon as={Star} className="text-rating" />
              </View>
              <CardTitle>Share a restaurant rating</CardTitle>
              <CardDescription className="leading-5">
                Rate a restaurant and add an optional review or photos.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3">
              <Link href={routes.createShare} asChild>
                <Button variant="outline" className="w-full">
                  <Text>Rate a restaurant</Text>
                  <Icon as={ArrowRight} />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
