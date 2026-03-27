import type { PersistStorage, StorageValue } from 'zustand/middleware'

const noopStorage: PersistStorage<any> = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
}

const setCookie = (name: string, value: string) => {
    document.cookie = [
        `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
        'Path=/',
        'Max-Age=604800',
        'SameSite=Lax',
        window.location.protocol === 'https:' ? 'Secure' : '',
    ].filter(Boolean).join('; ')
}

const getCookie = (name: string) => {
    const encoded = encodeURIComponent(name)
    const cookies = document.cookie ? document.cookie.split('; ') : []
    for (const cookie of cookies) {
        const i = cookie.indexOf('=')
        const key = i === -1 ? cookie : cookie.slice(0, i)
        if (key === encoded) {
            return decodeURIComponent(i === -1 ? '' : cookie.slice(i + 1))
        }
    }
    return null
}

const removeCookie = (name: string) => {
    document.cookie = [
        `${encodeURIComponent(name)}=`,
        'Path=/',
        'Max-Age=0',
        'SameSite=Lax',
        window.location.protocol === 'https:' ? 'Secure' : '',
    ].filter(Boolean).join('; ')
}

export const zustandStorage: PersistStorage<any> =
    typeof window === 'undefined'
        ? noopStorage
        : {
            getItem: (name): StorageValue<any> | null => {
                const user = getCookie(`${name}-user`)
                const accessToken = getCookie(`${name}-accessToken`)
                const isHydrated = getCookie(`${name}-isHydrated`)

                return {
                    state: {
                        user: user ? JSON.parse(user) : null,
                        accessToken: accessToken ?? null,
                        isHydrated: isHydrated === 'true',
                    },
                    version: 0,
                }
            },
            setItem: (name, value) => {
                const state = value.state as any

                if (state.user == null) removeCookie(`${name}-user`)
                else setCookie(`${name}-user`, JSON.stringify(state.user))

                if (state.accessToken == null) removeCookie(`${name}-accessToken`)
                else setCookie(`${name}-accessToken`, state.accessToken)

                setCookie(`${name}-isHydrated`, String(Boolean(state.isHydrated)))
            },
            removeItem: (name) => {
                removeCookie(`${name}-user`)
                removeCookie(`${name}-accessToken`)
                removeCookie(`${name}-isHydrated`)
            },
        }