"use client";
import React, { useState } from "react";
import Menu from "../../components/Menu";
import Question from "./components/Question";
import TrueOrFalse from "./components/TrueOrFalse";

interface Cord {
  x: number;
  y: number;
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

export default function Home() {
  const components = {
    a: Question,
    b: TrueOrFalse,
  };

  const [items, setItems] = useState<Array<QuestionInterface>>([]);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionInterface | null>(null);
  const [selectedComponent, setSelectedComponent] = useState("a");

  const addQuestion = (value: QuestionInterface) => {
    setItems([value, ...items]);
  };

  const selectQuestion = (value: QuestionInterface) => {
    setSelectedQuestion(value);
    setShowNew(false);
  };

  const Component = components[selectedComponent as keyof typeof components];
  return (
    <Menu>
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <div className="flex flex-col px-5 justify-center h-24 mb-4 rounded bg-gray-50 dark:bg-gray-800">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Nueva sesión
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Da formato a una nueva sesión
          </p>
        </div>
        <div className="flex justify-between w-2/3 mb-3 px-5">
          <input
            type="text"
            placeholder="Enter text..."
            className="w-2/3 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
          <button className="px-4 w-1/3 ml-2 py-2 text-white bg-yellow-400 rounded-md hover:bg-yellow-600 focus:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 transition-colors duration-200">
            Guardar nombre
          </button>
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
                <Component addQuestion={addQuestion} />
              </div>
            </div>
          )}
          {selectedQuestion && (
            <div className="xl:w-2/3 xl:mt-0 md:mt-5">
              <Component addQuestion={addQuestion} />
            </div>
          )}
          {!showNew && !selectedQuestion && (
            <div className="xl:w-2/3 xl:mt-0 md:mt-5">
              <p>Agrega preguntas</p>
            </div>
          )}
        </div>
      </div>
    </Menu>
  );
}
