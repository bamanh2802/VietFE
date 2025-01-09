import createMiddleware from 'next-intl/middleware'
import { locales, pathnames } from './navigation'

export default createMiddleware({
  defaultLocale: 'en',
  locales,
  pathnames,
})
export const config = {
  matcher: [],
}