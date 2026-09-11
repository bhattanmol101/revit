import {
  focusManager,
  onlineManager,
  QueryClientProvider,
} from "@tanstack/react-query";
import * as Network from "expo-network";
import { type ReactNode, useEffect } from "react";
import { AppState, Platform } from "react-native";

import { queryClient } from "@/lib/query/query-client";

export function AppProvider({ children }: { children: ReactNode }) {
  useQueryLifecycle();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function useQueryLifecycle() {
  useEffect(() => {
    const appStateSubscription =
      Platform.OS === "web"
        ? undefined
        : AppState.addEventListener("change", (status) => {
            focusManager.setFocused(status === "active");
          });
    const networkSubscription = Network.addNetworkStateListener((state) => {
      onlineManager.setOnline(
        state.isConnected !== false && state.isInternetReachable !== false,
      );
    });

    void Network.getNetworkStateAsync()
      .then((state) => {
        onlineManager.setOnline(
          state.isConnected !== false && state.isInternetReachable !== false,
        );
      })
      .catch(() => {
        onlineManager.setOnline(true);
      });

    return () => {
      appStateSubscription?.remove();
      networkSubscription.remove();
    };
  }, []);
}
