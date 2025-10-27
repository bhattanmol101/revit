import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import { createJSONStorage } from 'zustand/middleware'

const noopStorage = {
  getItem: async (name: string) => null,
  setItem: async (name: string, value: string) => {},
  removeItem: async (name: string) => {},
}

const expoSecureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await SecureStore.getItemAsync(name)
      return value ?? null
    } catch (err) {
      console.warn('[expoSecureStorage] getItem failed:', err)
      return null
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value)
    } catch (err) {
      console.warn('[expoSecureStorage] setItem failed:', err)
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name)
    } catch (err) {
      console.warn('[expoSecureStorage] removeItem failed:', err)
    }
  },
}

// Only import localStorage when on web
export const storage =
  Platform.OS === 'web'
    ? createJSONStorage(() => noopStorage)
    : createJSONStorage(() => expoSecureStorage)
