"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { User } from "@/types/user";

import { fetchUserAction } from "./action";

import { useGlobalStore } from "@/store";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  const { setGlobalState } = useGlobalStore((state) => state);

  React.useEffect(() => {
    const fetchUser = async () => {
      const user = await fetchUserAction();
      if (user) {
        setGlobalState({ auth: true, user: user});
      } else{
        setGlobalState({ auth: false});
      }
    };

    fetchUser();
  }, []);

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </HeroUIProvider>
  );
}
