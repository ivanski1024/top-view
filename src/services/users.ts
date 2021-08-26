import axios from "axios";
import logger from "winston";
import { UserProfile, UsersBio, UsersImages, UsersInfo } from "../models/users";

const usersUrl = "https://firebasestorage.googleapis.com/v0/b/topview-sightseeing-staging-ji/o/be%2Fusers.json?alt=media&token=bfbe4202-7204-4bcc-a08e-cba9cca9896c";
const usersImagesUrl = "https://firebasestorage.googleapis.com/v0/b/topview-sightseeing-staging-ji/o/be%2Fimages.json?alt=media&token=d2399583-25c7-453a-af4e-851dbda7ef95";
const usersBioUrl = "https://firebasestorage.googleapis.com/v0/b/topview-sightseeing-staging-ji/o/be%2Fbio.json?alt=media&token=c6a99a79-7a97-45b3-acda-85fa367724a1";

const Users = {
    async getUsers(): Promise<UsersInfo> {
        let result: UsersInfo = null;

        await axios.get(usersUrl).then((data) => {
            result = data.data;
            logger.debug(JSON.stringify(result, null, 4));
            Promise.resolve(result);
        }).catch(error => {
            Promise.reject(error);
        });

        return result;
    },


    async getUsersImages(): Promise<UsersImages> {
        let result: UsersImages = null;

        await axios.get(usersImagesUrl).then(data => {
            result = data.data;
            logger.debug(JSON.stringify(result, null, 4));

        }).catch(error => {
            Promise.reject(error);
        });

        return result;
    },


    async getUsersBio(): Promise<UsersBio> {
        let result: UsersBio = null;

        await axios.get(usersBioUrl).then(data => {
            result = data.data;
            logger.debug(JSON.stringify(result, null, 4));

        }).catch(error => {
            Promise.reject(error);
        });

        return result;
    },


    async getUser(userId: string): Promise<UserProfile> {
        let result: UserProfile = null;

        await axios.get(usersUrl).then(async (data) => {

            const users: UsersInfo = data.data;
            logger.debug(JSON.stringify(users, null, 4));

            const user = users[userId];

            if(!user) {
                return Promise.reject();
            }

            const usersBio: UsersBio = await Users.getUsersBio();
            const usersImages: UsersImages = await Users.getUsersImages();

            result = {
                name: user.name,
                email: user.email,
                bio: usersBio[userId],
                image: usersImages[userId]
            }

            Promise.resolve();
        }).catch(error => {
            logger.error(error);
            Promise.resolve(error);
        });

        return result;
    }
}

export default Users;