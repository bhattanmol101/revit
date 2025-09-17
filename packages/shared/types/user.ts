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
  profileImage?: string
  bio?: string
  dob?: Date
  createdAt: Date
}
