import axios from "axios";
import { LoginForm, ChangePasswordForm } from './types';

export class LoginApi {
    server;
    nameSpace;

    constructor(nameSpace: string) {
        this.server = `${process.env.server_host}${process.env.server_port}/`
        this.nameSpace = nameSpace;
    }


    get url() {
        return `${this.server}${this.nameSpace}`
    }

    async login(params: LoginForm) {
        const result = await axios.post(`${this.url}/login`, params);
        if(!result.data.object) {
            throw (result.data.message)
        }
        return result.data.object;
        
    }

    async resetPassword(id: string, params: ChangePasswordForm) {
        return await axios.post(`${this.url}/change-password/${id}`, params).then(({data}) => data.object)
    }
}