import { HiUserCircle, HiDocumentSearch, HiCheckCircle, HiOutlineViewGridAdd } from 'react-icons/hi';
export const permissionsGroupsGlobals = {
    users: {
        iName: 'Usuarios',
        icon: HiUserCircle,
    },
    docs: {
        iName: 'Documentos',
        icon: HiDocumentSearch
    },
    permissions: {
        iName: 'Permisos',
        icon: HiCheckCircle
    }
}
export const permissionsGlobals = {
    CREATE: {
        iName: 'Crear',
        icon: HiOutlineViewGridAdd,
    },
    READ: {
        iName: 'Leer',
        icon: HiDocumentSearch
    },
    EDIT: {
        iName: 'Editar',
        icon: HiCheckCircle
    },
    DELETE: {
        iName: 'Eliminar',
        icon: HiCheckCircle
    }
}
