import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@revit/api/root'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_TRPC_API || process.env.EXPO_PUBLIC_TRPC_API}/api/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        })
      },
    }),
  ],
})
