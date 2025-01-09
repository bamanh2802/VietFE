import { createLocalizedPathnamesNavigation } from 'next-intl/navigation'
import { Pathnames } from 'next-intl/navigation'

export const locales = ['en', 'vi'] as const

export const pathnames = {
  '/': '/',
  '/about': {
    en: '/about',
    vi: '/ve',
  },
} satisfies Pathnames<typeof locales>

export const { Link, redirect, usePathname, useRouter } = createLocalizedPathnamesNavigation({ locales, pathnames })