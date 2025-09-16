export type UserSignupT = {
  name: string
  email: string
  password: string
}

export type UserSigninT = {
  email: string
  password: string
}

export type UserT = {
  id: string
  email: string
  name: string
  profileImage?: string | null
  bio?: string | null
  dob?: Date | null
  createdAt: Date
}
