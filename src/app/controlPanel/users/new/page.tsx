"use client";
import "flowbite";
import { Modal } from 'flowbite';
import React, { useEffect, useState } from "react";
import Menu from "../../components/Menu";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { PermissionApi, UserApi } from "./components/utils.js";
import LoadingCard
 from "../../components/LoadingCard";
interface UserObject {
  name: string;
  user: string;
  email: string;
  permissions: Array<string | null>;
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

export default function Home() {
  const router = useRouter();
  const api = new PermissionApi("permissions");
  const userApi = new UserApi("users");
  const [permissionsLoading, setPermissionsLoading] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<Array<PermissionGroup>>([]);
  const [selectedPermission, setSelectedPermission] =
    useState<PermissionGroup | null>(null);
  const [userPermissions, setUserPermissions] = useState<Array<string>>([]);
  const [userPassword, setUserPassword] = useState<string>('')
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setPermissionsLoading(true);
        const data = await api.getFormattedPermissions();
        setPermissions(data);
      } catch (error) {
        console.log(error);
      } finally {
        setPermissionsLoading(false);
      }
    };
    loadPermissions();
  }, []);

  const showModal = () => {
    const modalData = document.getElementById('static-modal');
    const modal = new Modal(modalData);
    modal.show();
  }

  const redirectToTable = () => {
    const modalData = document.getElementById('static-modal');
    const modal = new Modal(modalData);
    modal.hide();
    router.push('/controlPanel/users')
  }

  const handlePermission = (changePermission: Permission) => {
    if (userPermissions.includes(changePermission.id)) {
      const permissionIndex = userPermissions.findIndex(
        (i) => i === changePermission.id
      );
      const userPermissionsCopy = JSON.parse(JSON.stringify(userPermissions));
      userPermissionsCopy.splice(permissionIndex, permissionIndex + 1);
      setUserPermissions(userPermissionsCopy);
      return;
    }
    const setteableUserPermissions = [...userPermissions, changePermission.id];
    setUserPermissions(setteableUserPermissions);
  };

  const userSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es requerido"),
    user: Yup.string().required("El usuario es requerido"),
    email: Yup.string()
      .email("Se espera un email valido")
      .required("El correo es requerido"),
    permissions: Yup.array().of(Yup.string()),
  });

  const initialValues: UserObject = {
    name: "",
    user: "",
    email: "",
    permissions: [],
  };
  return (
    <Menu>
      <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Nuevo usuario
        </h5>
        <Formik
          initialValues={initialValues}
          validationSchema={userSchema}
          onSubmit={async (values) => {
            try {
              setPermissionsLoading(true)
              const result = await userApi.createUser({...values, permissions: userPermissions});
              setUserPassword(result.temporaryPassword);
              showModal();
            } catch (error) {
              console.log(error);
            } finally {
              setPermissionsLoading(false)
            }
            
          }}
        >
          {(props) => (
            <Form className="border-2 border-gray-200 border-dashed p-4">
              <div className="lg:grid lg:grid-cols-3 gap-4 mb-4">
                <div className="mb-5">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nombre:{" "}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder="introduzca un nombre"
                    required
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.name}
                  />
                  <div>
                    <p className="text-red-700 mt-2">{props.errors.name}</p>
                  </div>
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="user"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Usuario:{" "}
                  </label>
                  <input
                    type="text"
                    id="user"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder="introduzca un nombre de usuario"
                    required
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.user}
                  />
                  <div>
                    <p className="text-red-700 mt-2">{props.errors.user}</p>
                  </div>
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Correo electrónico:{" "}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder="introduzca un email"
                    required
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.email}
                  />
                  <div>
                    <p className="text-red-700 mt-2">{props.errors.email}</p>
                  </div>
                </div>
              </div>
              {permissionsLoading ? (
                <>
                 <LoadingCard  title="Cargando..." subtitle="Estamos cargando los permisos" showSubtitle/>
                </>
              ) : (
                <div className="lg:flex bg-gray-50 rounded-lg overflow-hidden">
                  <div className="lg:w-1/3 py-3">
                    <div className="bg-slate-400 py-2 px-2 mx-5 rounded-lg mb-5">
                      <p className="text-center text-white font-bold text-xl">
                        Grupos de permisos
                      </p>
                    </div>
                    {permissions.map((item: PermissionGroup, index: number) => (
                      <div
                        className={`${
                          selectedPermission?.id !== item.id
                            ? "bg-slate-200"
                            : "bg-slate-600"
                        } cursor-pointer py-2 px-2 mx-7 rounded-lg mb-3 `}
                        key={index}
                        onClick={() => setSelectedPermission(item)}
                      >
                        <p
                          className={`text-center ${
                            selectedPermission?.id !== item.id
                              ? "text-slate-600"
                              : "text-white"
                          } font-bold text-xl`}
                        >
                          {item.name}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white lg:w-2/3 bg-slate-200">
                    {selectedPermission ? (
                      <div className="flex flex-col items-center h-full rounded ">
                        <dt className="mb-2 text-3xl font-extrabold mt-5">
                          {selectedPermission?.name}
                        </dt>
                        <dd className="text-gray-500 dark:text-gray-400">
                          A continuación se muestran los posibles permisos del
                          grupo a agregar
                        </dd>
                        <div className="mt-2">
                          {selectedPermission.permissions.map((permission) => (
                            <div key={permission.id}>
                              <label className="inline-flex items-center mb-5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  value=""
                                  checked={userPermissions.includes(
                                    permission.id
                                  )}
                                  className="sr-only peer"
                                  onChange={() => handlePermission(permission)}
                                />
                                <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                  {permission.key}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full rounded ">
                        <dt className="mb-2 text-3xl font-extrabold">
                          Permisos
                        </dt>
                        <dd className="text-gray-500 dark:text-gray-400">
                          Selecciona un grupo de permisos para continuar
                        </dd>
                      </div>
                    )}
                  </div>
                  <div></div>
                </div>
              )}
              <div className="flex justify-end mt-5">
                <button
                  disabled={permissionsLoading}
                  type="submit"
                  className="focus:outline-none text-white font-bold text-lg bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900 mr-10"
                >
                  + Agregar usuario
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div id="static-modal" data-modal-backdrop="static" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Usuario creado
                </h3>
                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="static-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
            <div className="p-4 md:p-5 space-y-4">
                <h3 className="font-bold">El usuario ha sido creado exitosamente</h3>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    A continuacion se te muestra la contraseña temporal con lo que puede acceder el usuario
                </p>
                <h3 className="font-bold text-center">Clave: {userPassword}</h3>
            </div>
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button data-modal-hide="static-modal" type="button" onClick={() => redirectToTable()} className="text-white bg-yellow-400 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">De acuerdo</button>
            </div>
        </div>
    </div>
</div>
    </Menu>
  );
}
