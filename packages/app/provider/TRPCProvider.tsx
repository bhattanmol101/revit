'use client'

import { useState } from 'react'
import {httpBatchLink} from "@trpc/client";
import {useAuthStore} from "@revit/api/store/auth.store"
import {trpc} from "@revit/api/client"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


export function TRPCProvider({ children }) {
    const accessToken  = useAuthStore((s) => s.accessToken)

    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: `${process.env.EXPO_PUBLIC_TRPC_API || process.env.NEXT_PUBLIC_TRPC_API}/api/trpc`,
                    headers() {
                        return accessToken
                            ? { Authorization: `Bearer ${accessToken}` }
                            : {}
                    },
                }),
            ],
        })
    )

    const [queryClient] = useState(() => new QueryClient())

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    )
}