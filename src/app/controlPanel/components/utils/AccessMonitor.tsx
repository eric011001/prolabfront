import { useRouter } from "next/navigation";
export class UseAccessMonitor {
    permissions;
    router = useRouter();
    constructor() {
        const actualPermissions = localStorage.getItem('permissions');
        if(!actualPermissions) {
            this.router.push('/controlPanel/login')
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