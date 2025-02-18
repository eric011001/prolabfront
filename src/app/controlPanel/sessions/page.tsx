"use client";
import React, { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { useRouter } from "next/navigation";
import { SessionApi } from "./components/utils";
import dayjs from "dayjs";

import { Modal, Button } from "flowbite-react";

type Session = {
  id: string;
  questions: Array<string>;
  title: string;
  createdBy: [string];
  createdAt: string;
  status: string;
};
export default function Home() {
  const router = useRouter();
  const api = new SessionApi("sessions");

  const [loading, setLoading] = useState<boolean>(false);
  const [sessions, setSessions] = useState<Array<Session>>([]);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        const usersData = await api.getUserSessions();
        setSessions(usersData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    };

    const createSession = async () => {
      const result = await api.createSession({
        title,
        questions: [],
      });
      console.log(result);
      setSessions([result, ...sessions]);
      setShowNewModal(false);
      
    }

  return (
    <Menu>
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <div className="flex flex-col px-5 justify-center h-24 mb-4 rounded bg-gray-50 dark:bg-gray-800">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sesiones
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Modulo de administración de tus sesiones creadas
          </p>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="focus:outline-none text-white font-bold text-lg bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
            onClick={() => setShowNewModal(true)}
          >
            Nueva sesión
          </button>
        </div>
        {loading ? (
          <div>Cargando</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((card) => (
              <div
                key={card.id}
                className="bg-white cursor-pointer rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                onClick={() => router.push(`/controlPanel/sessions/${card.id}`)}
              >
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{card.title}</h2>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Fecha de creación:
                      </span>
                      <span className="text-sm font-medium ">
                        {card.createdAt
                          ? dayjs(card.createdAt).format("DD/MM/YYYY")
                          : "Indefinido"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Preguntas:</span>
                      <span className="text-sm font-medium">
                        {card.questions.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Estado:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {card.status === "ACTIVE" ? "Activo" : "Inactivo"}
                        </span>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            card.status === "ACTIVE"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Modal show={showNewModal} onClose={() => setShowNewModal(false)}>
          <Modal.Header>
            <h1
              className={`text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100`}
            >
             Crear una nueva sesión
            </h1>
          </Modal.Header>
          <Modal.Body>
            <div className="w-full max-w-md">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Título
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Ingrese el título"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="warning" onClick={() => createSession()}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Menu>
  );
}
