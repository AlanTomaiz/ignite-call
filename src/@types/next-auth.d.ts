import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string | undefined
    username: string
    avatar_url: string | undefined
  }

  interface Session {
    user: User
  }
}
