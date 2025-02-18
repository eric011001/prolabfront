"use client";
import { Formik, Form, Field, FieldArray } from "formik";

interface PreguntaQuiz {
  titulo: string;
  opciones: {
    texto: string;
    esCorrecta: boolean;
  }[];
}

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

export default function FormularioQuiz({
  addQuestion,
}: {
  addQuestion: (question: QuestionInterface) => void;
}) {
  const valoresIniciales: PreguntaQuiz = {
    titulo: "",
    opciones: [{ texto: "", esCorrecta: false }],
  };

  const manejarEnvio = (valores: PreguntaQuiz) => {
    const question: QuestionInterface = {
      title: valores.titulo,
      description: "",
      type: "MULTIOPTION",
      possibleAnswers: valores.opciones.map((opcion) => ({
        title: opcion.texto,
        points: opcion.esCorrecta ? 1 : 0,
        extraData: {
          cords: null,
          result: null,
          isCorrect: opcion.esCorrecta,
        },
      })),
    };
    addQuestion(question);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Crear Pregunta de Quiz
      </h1>
      <Formik initialValues={valoresIniciales} onSubmit={manejarEnvio}>
        {({ values }) => (
          <Form className="space-y-6">
            <div>
              <label
                htmlFor="titulo"
                className="block mb-2 font-medium text-gray-700 dark:text-gray-200"
              >
                Título de la Pregunta
              </label>
              <Field
                type="text"
                id="titulo"
                name="titulo"
                placeholder="Ingrese su pregunta"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>

            <FieldArray name="opciones">
              {({ push, remove }) => (
                <div className="space-y-4">
                  {values.opciones.map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-grow">
                        <label
                          htmlFor={`opciones.${index}.texto`}
                          className="sr-only"
                        >
                          Opción {index + 1}
                        </label>
                        <Field
                          type="text"
                          id={`opciones.${index}.texto`}
                          name={`opciones.${index}.texto`}
                          placeholder={`Opción ${index + 1}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Field
                          type="checkbox"
                          id={`opciones.${index}.esCorrecta`}
                          name={`opciones.${index}.esCorrecta`}
                          className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`opciones.${index}.esCorrecta`}
                          className="text-sm text-gray-700 dark:text-gray-200"
                        >
                          Correcta
                        </label>
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="sr-only">Eliminar opción</span>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => push({ texto: "", esCorrecta: false })}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-900 bg-yellow-400 border border-transparent rounded-md hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline-block h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Agregar Opción
                  </button>
                </div>
              )}
            </FieldArray>
            <div className="flex w-full">
              <button
                type="submit"
                className="w-full bg-blue-400"
              >
                Enviar Pregunta
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
