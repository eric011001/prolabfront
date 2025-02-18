import React, {useState} from "react";
import { Formik, Form, Field } from "formik";
import Toggle from "@/app/controlPanel/components/utils/Toggle";
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

const TrueOrFalse = ({
  addQuestion,
}: {
  addQuestion: (question: QuestionInterface) => void;
}) => {
    const [result, setResult] = useState('Verdadero');

  const initialValues: QuestionInterface = {
      title: "",
      description: "",
      possibleAnswers: [
          {
              title: "Verdadero",
              points: 1,
              extraData: {
                  isCorrect: false,
                  cords: null,
                  result: null,
              },
          },
          {
              title: "Falso",
              points: 0,
              extraData: {
                  isCorrect: false,
                  cords: null,
                  result: null,
              },
          },
      ],
      type: "TRUEORFALSE"
  };

  const saveData = (values: QuestionInterface) => {
    addQuestion(values);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Verdadero o falso
      </h1>
      <Formik
        initialValues={initialValues}
        onSubmit={(e) => {
          saveData(e);
        }}
      >
        {({ values }) => (
          <Form className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block mb-2 font-medium text-gray-700 dark:text-gray-200"
              >
                Título de la Pregunta
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                placeholder="Ingrese su pregunta"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>
            <div>
                <Toggle
                    options={values.possibleAnswers.map((value) => (
                        {
                            value: value.title,
                            label: value.title,
                            checked: value.title === result,
                        }
                        
                    ))}
                    value={result}
                    onChange={(value) => setResult(value)}
                />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-gray-900 bg-yellow-400 border border-transparent rounded-md hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400 text-white font-bold"
            >
              Enviar Pregunta
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TrueOrFalse;
