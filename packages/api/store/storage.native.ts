import { createJSONStorage } from 'zustand/middleware'
import * as SecureStore from 'expo-secure-store'

export const zustandStorage = createJSONStorage(() => ({
    getItem: (name: string) => SecureStore.getItemAsync(name),
    setItem: (name: string, value: string) =>
        SecureStore.setItemAsync(name, value),
    removeItem: (name: string) =>
        SecureStore.deleteItemAsync(name),
}))