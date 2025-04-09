export type SignupUser = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  bio?: string;
  dob?: Date;
  createdAt: Date;
};

export type UpdateUser = {
  name: string;
  profileImage: string;
  bio: string;
  dob: Date;
};
