import axios from "axios";
import { LoginForm, ChangePasswordForm } from './types';
export class LoginApi {
    server;
    nameSpace;

    constructor(nameSpace: string) {
        this.server = `https://prolabback.onrender.com/`
        this.nameSpace = nameSpace;
    }

    get url() {
        return `${this.server}${this.nameSpace}`
    }

    async login(params: LoginForm) {
        return await axios.post(`${this.url}/login`, params).then(({data}) => data.object);
    }

    async resetPassword(id: string, params: ChangePasswordForm) {
        return await axios.post(`${this.url}/change-password/${id}`, params).then(({data}) => data.object)
    }
}