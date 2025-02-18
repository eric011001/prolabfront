import React, { useState, useEffect } from "react";
import { Modal, Label, TextInput, Tabs, Button } from "flowbite-react";
import { Formik } from "formik";
import * as Yup from "yup";
import { HiShieldCheck } from "react-icons/hi";
import { FaLock, FaSpinner } from "react-icons/fa";
import { PermissionApi } from "./utils.js";
import {
  permissionsGroupsGlobals,
  permissionsGlobals,
} from "../../../components/utils/utils";
import { IconType } from "react-icons";
type User = {
  user: string;
  name: string;
  permissions: Array<string>;
  email: string;
  id: string;
};

interface Params {
  showModal: boolean;
  onCancel: () => void;
  onClose: () => void;
  selectedUser: User | null;
}

interface PermissionGroup {
  name: string;
  key: string;
  active: boolean;
  id: string;
  permissions: Array<Permission>;
}

interface Permission {
  id: string;
  key: string;
}

interface PermissionsGlobals {
  [key: string]: {
    iName: string;
    icon: IconType;
  };
}
const EditUserModal = ({
  onCancel,
  onClose,
  showModal,
  selectedUser,
}: Params) => {
  const permissionsApi = new PermissionApi("permissions");
  const [permissionsLoading, setPermissionsLoading] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<Array<PermissionGroup>>([]);
  const [userPermissions, setUserPermissions] = useState<Array<string>>([]);
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setPermissionsLoading(true);
        setTimeout(async () => {
          const data = await permissionsApi.getFormattedPermissions();
          setPermissions(data);
        }, 5000);
      } catch (error) {
        console.log(error);
      } finally {
        setPermissionsLoading(false);
      }
    };
    loadPermissions();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es necesario"),
    email: Yup.string().required("El correo es necesario"),
    userName: Yup.string().required("El usuario es necesario"),
  });

  const handlePermission = (changePermission: Permission) => {
    if (userPermissions.includes(changePermission.id)) {
      const newPermissions = userPermissions.filter(
        (item) => item !== changePermission.id
      );
      setUserPermissions(newPermissions);
      return;
    }
    const setteableUserPermissions = [...userPermissions, changePermission.id];
    setUserPermissions(setteableUserPermissions);
  };

  const selectAllHandle = (permissionGroupToHandle: PermissionGroup) => {
    if (
      permissionGroupToHandle.permissions.every((i) =>
        userPermissions.includes(i.id)
      )
    ) {
      const permissionToDelete = new Set(
        permissionGroupToHandle.permissions.map((i) => i.id)
      );
      const permissionsToUpdate = userPermissions.filter(
        (item) => !permissionToDelete.has(item)
      );
      setUserPermissions(permissionsToUpdate);
      return;
    }
    const missingPermissions: Array<string> =
      permissionGroupToHandle.permissions.reduce(
        (prev: Array<string>, curr) => {
          if (!userPermissions.includes(curr.id)) {
            prev.push(curr.id);
          }
          return prev;
        },
        []
      );

    setUserPermissions([...userPermissions, ...missingPermissions]);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          name: selectedUser?.name,
          email: selectedUser?.email,
          userName: selectedUser?.user,
          cosa: 'sdsd'
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
         console.log(values);
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          /* and other goodies */
        }) => (
          <Modal show={showModal} size={"5xl"} onClose={() => onClose()}>
            <Modal.Header>Editar usuario</Modal.Header>
            <Modal.Body>
              <form className="flex flex-col space-y-4 mb-5">
                {JSON.stringify(selectedUser)}
                <div className="flex flex-wrap md:flex-nowrap gap-4">
                  <div className="w-full md:w-1/3">
                    <div className="mb-1">
                      <Label htmlFor="name" value="Nombre" />
                    </div>
                    <TextInput
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Escribe tu nombre"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      required
                      disabled
                      className="w-full"
                    />
                  </div>
                  <div className="w-full md:w-1/3">
                    <div className="mb-1">
                      <Label htmlFor="email" value="Email" />
                    </div>
                    <TextInput
                      id="email"
                      type="email"
                      name="email"
                      placeholder="nombre@ejemplo.com"
                      disabled
                      onChange={handleChange}
                      value={values.email}
                      onBlur={handleBlur}
                      className="w-full bg-gray-100"
                    />
                  </div>
                  <div className="w-full md:w-1/3">
                    <div className="mb-1">
                      <Label htmlFor="username" value="Usuario" />
                    </div>
                    <TextInput
                      id="username"
                      type="text"
                      placeholder="Nombre de usuario"
                      disabled
                      value={values.userName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full bg-gray-100"
                    />
                  </div>
                </div>
              </form>
              {permissionsLoading ? (
                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
                  <div className="relative">
                    <FaLock className="text-6xl text-blue-600 opacity-20" />
                    <FaSpinner className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl text-blue-600 animate-spin" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-700">
                    Cargando Permisos
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Por favor, espere mientras se cargan los permisos...
                  </p>
                  <div className="mt-4 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 animate-pulse"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-lg shadow-lg mb-6">
                    <HiShieldCheck className="text-white mr-4 text-4xl" />
                    <h1 className="text-3xl font-bold text-white">
                      Gestión de Permisos
                    </h1>
                  </div>
                  <Tabs aria-label="Full width tabs" variant="fullWidth">
                    {permissions.map((item, index) => (
                      <Tabs.Item
                        key={index}
                        title={
                          (permissionsGroupsGlobals as PermissionsGlobals)[
                            item.name
                          ]?.iName
                        }
                        icon={
                          (permissionsGroupsGlobals as PermissionsGlobals)[
                            item.name
                          ]?.icon
                        }
                      >
                        <div className="px-3">
                          <div className="md:grid grid-cols-4 gap-4 mb-5">
                            {item.permissions.map((permission) => (
                              <div
                                key={permission.id}
                                className={`shadow-lg p-5 text-center font-bold cursor-pointer ${
                                  userPermissions.includes(permission.id)
                                    ? "text-white bg-yellow-400 hover:bg-yellow-500"
                                    : ""
                                } hover:bg-gray-100`}
                                onClick={() => handlePermission(permission)}
                              >
                                {(permissionsGlobals as PermissionsGlobals)[
                                  permission.key
                                ]?.iName ?? permission.key}
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end">
                            <label className="inline-flex items-center mb-5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.permissions.every((i) =>
                                  userPermissions.includes(i.id)
                                )}
                                onChange={() => selectAllHandle(item)}
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                              <span className="ms-3 text-sm font-bold text-gray-900 dark:text-gray-300">
                                Seleccionar todos
                              </span>
                            </label>
                          </div>
                        </div>
                      </Tabs.Item>
                    ))}
                  </Tabs>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer className="flex justify-end">
              <Button color="gray" onClick={() => onCancel()}>
                Cancelar
              </Button>
              <Button color="warning" onClick={() => onClose()}>
                Guardar cambios
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Formik>
    </>
  );
};
export default EditUserModal;
