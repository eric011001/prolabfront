export class UseAccessMonitor {
    permissions;
    constructor() {
        const actualPermissions = localStorage.getItem('permissions');
        if(!actualPermissions) {
            throw new Error('Permissions not found')
        }
        this.permissions = JSON.parse(actualPermissions ?? '{}');
    }
    verifyPermissions(permission: string) {
        try {
            const splittedPermission = permission.split('.');
            if(!this.permissions[splittedPermission[0]]){
                return false;
            }
            if(this.permissions[splittedPermission[0]][splittedPermission[1]]) {
                return true;
            }
            return false;
        } catch (e) {
            console.log(e);
            
            return false
        } 
    }
}