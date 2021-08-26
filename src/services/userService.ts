import axios from "axios";
import { UsersBio, UsersImages, UsersInfo } from "../models/userModels";

const cache: {[key: string]: any} = {};

const UsersService = {
    async getUsers(): Promise<UsersInfo> {

        if(!cache.users) {
            await axios.get(process.env.USERS_URL).then((data) => {
                cache.users = data.data;
                return Promise.resolve();
            }).catch(error => {
                return Promise.reject(error);
            });
        }

        return cache.users;
    },


    async getUsersImages(): Promise<UsersImages> {
        if(!cache.usersImages) {
            await axios.get(process.env.USERS_IMAGES_URL).then(data => {
                cache.userImages = data.data;
                return Promise.resolve();
            }).catch(error => {
                return Promise.reject(error);
            });
        }

        return cache.userImages;
    },


    async getUsersBio(): Promise<UsersBio> {
        if(!cache.usersBios) {
            await axios.get(process.env.USERS_BIO_URL).then(data => {
                cache.usersBios = data.data
                return Promise.resolve();
            }).catch(error => {
                return Promise.reject(error);
            });
        }

        return cache.usersBios;
    },
}

export default UsersService;