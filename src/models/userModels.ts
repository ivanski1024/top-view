//tslint:disable
export interface UserProfile {
    name: string
    email: string
    image: string
    bio: string
}

export interface UsersInfo {
    [user_id: string]: {
        name: string
        email: string
  }
}

export interface UsersImages {
    [user_id: string]: string
}

export interface UsersBio {
    [user_id: string]: string
}