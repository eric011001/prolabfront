import axios from "axios";
export class PermissionApi {
    server;
    nameSpace;

    /**
     * 
     * @param {String} nameSpace namespace
     */
    constructor(nameSpace) {
        this.server = `https://prolabback.onrender.com/`
        this.nameSpace = nameSpace;
    }

    get url() {
        return `${this.server}${this.nameSpace}`
    }

    async getFormattedPermissions() {
        return await axios.get(`${this.url}/get-formated-permissions`).then(({data}) => data.object);
    }
}

export class UserApi {
    server;
    nameSpace;

    /**
     * 
     * @param {String} nameSpace namespace
     */
    constructor(nameSpace) {
        this.server = `https://prolabback.onrender.com/`
        this.nameSpace = nameSpace;
    }

    get url() {
        return `${this.server}${this.nameSpace}`
    }

    async createUser(user) {
        return await axios.post(`${this.url}/create`, user).then(({data: {object}}) => object);
    }

    async listUsers() {
        return await axios.post(`${this.url}/list`).then(({data: {object}}) => object);
    }

    async deleteUser(id) {
        return await axios.post(`${this.url}/delete/${id}`)
    }
}