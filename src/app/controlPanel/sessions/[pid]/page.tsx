"use client";
import React, { useState, useEffect } from "react";
import Menu from "../../components/Menu";
import Question from "./components/Question";
import TrueOrFalse from "./components/TrueOrFalse";
import { useParams } from "next/navigation";
import { SessionApi, QuestionApi } from "../components/utils";
import { FaPen, FaLightbulb } from "react-icons/fa";

import { Modal, Button } from "flowbite-react";

interface Cord {
  x: number;
  y: number;
}

interface Session {
  questions: Array<string>;
  title: string;
  createdBy: [string];
  createdAt: [Date];
  status: [string];
}

interface ExtraPossibleAnswerData {
  cords: Array<Cord> | null;
  result: string | null;
  isCorrect: boolean | null;
}

interface PossibleAnswer {
  title: string;
  points: number;
  extraData: ExtraPossibleAnswerData;
}

interface QuestionInterface {
  title: string;
  description: string;
  type: string;
  possibleAnswers: Array<PossibleAnswer>;
}
interface QuestionSavedInterface {
  id: string;
  title: string;
  description: string;
  type: string;
  possibleAnswers: Array<PossibleAnswer>;
}

enum Direction {
  up,
  down
}

export default function Home() {
  const params = useParams();
  const api = new SessionApi("sessions");
  const questionApi = new QuestionApi("questions");
  const components = {
    a: Question,
    b: TrueOrFalse,
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionInfo, setSessionInfo] = useState<Session | null>(null);
  const [items, setItems] = useState<Array<QuestionSavedInterface>>([]);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionSavedInterface | null>(null);
  const [selectedComponent, setSelectedComponent] = useState("a");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [edittedTitle, setEdittedTitle] = useState("");

  useEffect(() => {
    const loadInfo = async () => {
      try {
        setLoading(true);
        console.log(params);

        const sessionData = await api.getSessionInfo(params.pid);
        setSessionInfo(sessionData);
        const questionsData = await questionApi.getSessionQuestions(params.pid);
        setEdittedTitle(sessionData.title);
        setItems(questionsData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadInfo();
  }, []);

  const addQuestion = async (value: QuestionInterface) => {
    try {
      setLoadingAdd(true);
      if (selectedQuestion?.id) {
        const result = await questionApi.editQuestion(
          value,
          selectedQuestion.id
        );
        setItems(items.map((item) => (item.id === result.id ? result : item)));
        return;
      }
      const result = await questionApi.saveQuestion(value, params.pid);
      setItems([result, ...items]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAdd(false);
    }
  };

  const editSession = async () => {
    try {
      const result = await api.editSession({ title: edittedTitle }, params.pid);
      setSessionInfo(result);
      setShowEditModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const reOrder = async (direction: Direction) => {
    const index = items.findIndex((item) => item.id === selectedQuestion?.id);
    if (index === -1) {
      return;
    }

    // Create a *copy* of the items array using the spread operator
    const arrWithoutdata = [...items]; 
    arrWithoutdata.splice(index, 1);

    let nuevoIndice;
    switch (direction) {
      case Direction.up:
        nuevoIndice = Math.max(0, index - 1); // Prevent going below 0
        break;
      case Direction.down:
        nuevoIndice = Math.min(arrWithoutdata.length, index + 1); // Prevent going beyond the array
        break;
      default:
        nuevoIndice = index;
        break;
    }

    if (selectedQuestion) {
      arrWithoutdata.splice(nuevoIndice, 0, selectedQuestion);

      // Log *after* setting the state, or use a separate variable for logging
      console.log('viejo acomodo (before state update): ', [...items].map((item) => item.id)); // Copy for log
      console.log('nuevo acomodo (before state update): ', arrWithoutdata.map((item) => item.id));

      await api.editSession({ title: edittedTitle, questions: arrWithoutdata.map((item) => item.id) }, params.pid);
      setItems(arrWithoutdata);

      // Log *after* the state has updated (in a useEffect or setTimeout)
      // Or, use a separate variable for logging before setting state
      setTimeout(() => {
        console.log('viejo acomodo (after state update): ', items.map((item) => item.title));
      }, 0); // Small timeout to ensure state update

    }
    return;
  }

  const selectQuestion = (value: QuestionSavedInterface) => {
    switch (value.type) {
      case "TRUEORFALSE":
        setSelectedComponent("b");
        break;
      default:
        setSelectedComponent("a");
        break;
    }
    setSelectedQuestion(value);
    setShowNew(false);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEdittedTitle(event.target.value);
  };

  const Component = components[selectedComponent as keyof typeof components];
  return (
    <Menu>
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <div className="flex flex-col px-5 justify-center xl:h-24 mb-4 rounded bg-gray-50 dark:bg-gray-800">
          {loading ? (
            <>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Cargando...
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Da formato a una nueva sesión
              </p>
            </>
          ) : (
            <div className="xl:flex justify-between xs:py-5">
              <div>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {sessionInfo?.title}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Da formato a una nueva sesión
                </p>
              </div>
              <div className="flex items-center mt-2 xl:mt-0 mb-2 xl:mb-0 justify-end xl:justify-start">
                <button className=" flex items-center bg-yellow-400 hover:bg-yellow-600 mr-2 p-2 text-white rounded-xl" onClick={() => setShowEditModal(true)}>
                  <FaPen
                    className="h-4 w-4"
                  />
                </button>
                <button className="bg-yellow-400 hover:bg-yellow-600 p-2 text-white rounded-xl">
                  <FaLightbulb className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="xl:flex ">
          <div className="container xl:mx-5 xl:w-1/3 border rounded-lg shadow-md overflow-hidden">
            <div className="bg-yellow-400 p-2">
              <h3 className="text-xl font-bold text-center text-white">
                Preguntas
              </h3>
            </div>
            <div className="overflow-y-scroll h-96">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="shadow-md my-2 mx-3 flex justify-between rounded-lg overflow-hidden"
                >
                  <div className="bg-yellow-400 py-3 px-3 w-1/8">
                    <h3 className="text-white font-bold">{index + 1}</h3>
                  </div>
                  <div className="flex justify-center px-3 items-center w-full">
                    <h1 className="text-lg font-bold text-gray-800 text-ellipsis">
                      {item.title}
                    </h1>
                  </div>
                  <div className="w-2/8 flex justify-center items-center">
                    <button
                      onClick={() => selectQuestion(item)}
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
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5">
              <button
                onClick={() => {
                  setShowNew(true);
                  setSelectedQuestion(null);
                }}
                className="bg-yellow-400 w-full p-2 rounded-lg text-white font-bold"
              >
                Agregar pregunta
              </button>
            </div>
          </div>
          {showNew && (
            <div className="xl:w-2/3 xl:mt-0 md:mt-5">
              <select
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md h-10"
              >
                <option value="a">Pregunta</option>
                <option value="b">Verdadero o falso</option>
              </select>
              <div className="mt-5">
                <Component
                  addQuestion={addQuestion}
                  initialValues={selectedQuestion}
                  isLoading={loadingAdd}
                />
              </div>
            </div>
          )}
          {selectedQuestion && (
            <div className="xl:w-2/3 xl:mt-0 md:mt-5">
              <Component
                addQuestion={addQuestion}
                initialValues={selectedQuestion}
                isLoading={loadingAdd}
                options={{
                  enableUpOrder: items.findIndex((item) => item.id === selectedQuestion?.id) > 0,
                  enableDelete: false,
                  enableDownOrder: items.findIndex((item) => item.id === selectedQuestion?.id) < items.length - 1,
                  delete: () => console.log('cosa'),
                  downOrder: () => reOrder(Direction.down),
                  upOrder: () => reOrder(Direction.up),
                }}
              />
            </div>
          )}
          {!showNew && !selectedQuestion && (
            <div className="xl:w-2/3 xl:mt-0 md:mt-5 flex items-center justify-center">
              <div>
              <h3 className="font-bold text-2xl text-gray-800 border-b-4 border-yellow-500">Información de las preguntas</h3>
              <p className="text-center text-gray-500 w-full p-2">Agrega preguntas</p>
              </div>
            </div>
          )}
        </div>
        <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
          <Modal.Header>
            <h1
              className={`text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100`}
            >
              Detalles de {sessionInfo?.title}
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
                value={edittedTitle}
                onChange={handleTitleChange}
                placeholder="Ingrese el título"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="warning" onClick={() => editSession()}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Menu>
  );
}
