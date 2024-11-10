"use client";
import { Modal, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { useRouter } from "next/navigation";
import { UserApi } from "./new/components/utils";
import LoadingCard from "../components/LoadingCard";

type User = {
  user: string;
  name: string;
  permissions: Array<string>;
  id: string;
};

export default function Home() {
  const router = useRouter();
  const userApi = new UserApi("users");
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<Array<User>>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOptionsView, setModalOptionsView] = useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const usersData = await userApi.listUsers();
        setUsers(usersData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const showOptionsModal = async (item: User) => {
    setSelectedUser(item);
    setModalOptionsView(true);
  };

  const hideOptionsModal = () => {
    setSelectedUser(null);
    setModalOptionsView(false);
  };

  const deleteUser = async () => {
    if (!selectedUser) {
      return;
    }
    try {
      setLoadingAction(true);
      await userApi.deleteUser(selectedUser.id);
      setLoading(true);
      const usersData = await userApi.listUsers();
      setUsers(usersData);
    } catch (error) {
      console.log(error);
    } finally {
      hideOptionsModal();
      setLoading(false);
      setLoadingAction(true);
    }
  };

  return (
    <Menu>
      <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
        <div className="flex flex-col px-5 justify-center h-24 mb-4 rounded bg-gray-50 dark:bg-gray-800">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Usuarios
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Módulo de administración de usuarios y permisos
            {modalOptionsView ? "true" : "false"}
          </p>
        </div>
        <div className="lg:flex justify-between px-5 mb-5">
          <div>
            <label htmlFor="table-search" className="sr-only">
              Buscar
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Buscar usuarios"
              />
            </div>
          </div>
          <button
            type="button"
            className="focus:outline-none text-white font-bold text-lg bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
            onClick={() => router.push("/controlPanel/users/new")}
          >
            Agregar usuario
          </button>
        </div>
        <div className="relative overflow-x-auto">
          {!loading ? (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Usuario
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Permisos
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((itemUser) => (
                  <tr
                    key={itemUser.user}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {itemUser.name}
                    </th>
                    <td className="px-6 py-4">{itemUser.user}</td>
                    <td className="px-6 py-4 ">
                      {itemUser.permissions.length}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => showOptionsModal(itemUser)}
                        type="button"
                        className="text-white hover:bg-gray-200  focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        <svg
                          className="w-6 h-6 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeWidth="2"
                            d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                          />
                          <path
                            stroke="currentColor"
                            strokeWidth="2"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>

                        <span className="sr-only">Icon description</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <LoadingCard title="Cargando..." subtitle="Cargando usuarios" />
          )}
        </div>
        <div className="lg:flex justify-between px-5 mt-5">
          <p>numero por pagina</p>
          <nav aria-label="Page navigation">
            <ul className="inline-flex -space-x-px text-sm">
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Anterior
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  1
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  2
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-current="page"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  3
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  4
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  5
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Siguiente
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <Modal
          show={modalOptionsView}
          size={'5xl'}
          onClose={() => setModalOptionsView(false)}
        >
          <Modal.Header>Opciones</Modal.Header>
          <Modal.Body>
            <Modal.Body>
                  <div className="p-4 md:p-5 space-y-4">
                    <div className="block cursor-pointer max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Editar
                      </h5>
                      <p className="font-normal text-gray-700 dark:text-gray-400">
                        Modifica la información editable de este usuario como
                        nombre, usuario y permisos
                      </p>
                    </div>
                    <div
                      className="block cursor-pointer max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                      onClick={() => deleteUser()}
                    >
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Eliminar
                      </h5>
                      <p className="font-normal text-gray-700 dark:text-gray-400">
                        Elimina un usuario, todas sus contribuciones quedarán
                        bajo su nombre
                      </p>
                    </div>
                    <div className="block cursor-pointer max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Restablecer contraseña
                      </h5>
                      <p className="font-normal text-gray-700 dark:text-gray-400">
                        Ayuda a este usuario a restablecer su contraseña
                      </p>
                    </div>
                  </div>
            </Modal.Body>
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={loadingAction} onClick={() => setModalOptionsView(false)}>Aceptar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Menu>
  );
}
