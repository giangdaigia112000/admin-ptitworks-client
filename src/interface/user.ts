export interface UserParam {
  name: string;
  username: string;
}

export interface UserProfile {
  id: string | undefined;
  name: string | undefined;
  avt: string | undefined;
  email: string | undefined;
  password: string | undefined;
  active: boolean | undefined;
}
export interface CreateUser {
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
}
