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
      <ScrollView contentContainerClassName="mx-auto w-full max-w-4xl gap-8 px-5 py-8 sm:px-8">
        <View className="gap-2">
          <Text variant="h1" className="text-left text-3xl">
            Create
          </Text>
          <Text variant="muted" className="text-base leading-6">
            Ask people for their rating now, or share a restaurant rating later.
          </Text>
        </View>

        <View className="gap-4 sm:flex-row">
          <Card className="flex-1 gap-4 py-5">
            <CardHeader className="gap-3">
              <View className="size-11 items-center justify-center rounded-full bg-primary/10">
                <Icon as={MessageCircleQuestion} className="text-primary" />
              </View>
              <CardTitle>Ask for ratings</CardTitle>
              <CardDescription className="leading-5">
                Post a question and let people respond with a 1–5 rating.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={routes.createAsk} asChild>
                <Button className="w-full">
                  <Text>Start an Ask</Text>
                  <Icon as={ArrowRight} className="text-primary-foreground" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="flex-1 gap-4 py-5 opacity-70">
            <CardHeader className="gap-3">
              <View className="size-11 items-center justify-center rounded-full bg-muted">
                <Icon as={Star} className="text-muted-foreground" />
              </View>
              <CardTitle>Share a restaurant rating</CardTitle>
              <CardDescription className="leading-5">
                Rate a restaurant and add an optional review or photos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled variant="outline" className="w-full">
                <Text>Available in a later phase</Text>
              </Button>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
