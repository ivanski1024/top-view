import UsersService from "../services/userService";
import { UserProfile, UsersBio, UsersImages, UsersInfo } from "../models/userModels";

const Users = {
    async getUsersId(): Promise<string[]> {
        const users: UsersInfo = await UsersService.getUsers();

        return Object.keys(users);
    },

    async getUser(userId: string): Promise<UserProfile> {

        let usersInfo: UsersInfo = null;
        let usersBio: UsersBio = null;
        let usersImages: UsersImages = null;

        let result: UserProfile = null;

        await Promise.all([
            UsersService.getUsers().then(data => {
                if(!data[userId]) {
                    return Promise.reject(`No user with id ${userId}`)
                }

                usersInfo = data;
            }),
            UsersService.getUsersBio().then(data => {
                if( !data[userId]) {
                    return Promise.reject(`No user with id ${userId}`)
                }

                usersBio = data;
            }),
            UsersService.getUsersImages().then(data => {
                if(!data[userId]) {
                    return Promise.reject(`No user with id ${userId}`)
                }

                usersImages = data;
            }),
        ]).then(() => {
            result = {
                name: usersInfo[userId].name,
                email: usersInfo[userId].email,
                bio: usersBio[userId],
                image: usersImages[userId]
            }
        }).catch(error => {
            return Promise.resolve();
        });

        return result;
    }
}

export default Users;