import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from 'yup';
import Toggle from "@/app/controlPanel/components/utils/Toggle";
import { FaAngleUp, FaAngleDown, FaRegTrashCan } from "react-icons/fa6";

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

interface Options {
  enableUpOrder: boolean;
  enableDownOrder: boolean;
  enableDelete: boolean;
  upOrder: () => void;
  downOrder: () => void;
  delete: () => void;
}

interface FormularioParams {
  initialValues: QuestionInterface | null;
  isLoading: boolean;
  addQuestion: (question: QuestionInterface) => void;
  options?: Options;
}

const TrueOrFalse = ({
  addQuestion,
  initialValues: selecetedInitialValues,
  isLoading,
  options,
}: FormularioParams) => {
  const [result, setResult] = useState("Verdadero");

  const initialValues: QuestionInterface = selecetedInitialValues ?? {
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
    type: "TRUEORFALSE",
  };

  const saveData = (values: QuestionInterface) => {
    addQuestion(values);
  };

  const rules = Yup.object().shape({
    title: Yup.string().required("El titulo es obligatorio").min(3,'Se requiere de minimo 3 caracteres para el titulo de la pregunta'),
  });
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Verdadero o falso
      </h1>
      {selecetedInitialValues && (
              <div className="flex items-center justify-between mb-5" key="opciones">
                <div>
                  <h5 className="font-bold">Opciones: </h5>
                </div>
                <div>
                  {/* bg-yellow-400/50 cursor-not-allowed */}
                  <button 
                    onClick={() => options?.upOrder()}
                    disabled={!options?.enableUpOrder} className={`${options?.enableUpOrder ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-yellow-400/50 cursor-not-allowed'} text-white font-bold p-2 rounded mr-2`}>
                    <FaAngleUp />
                  </button>
                  <button 
                    onClick={() => options?.downOrder()}
                    disabled={!options?.enableDownOrder} className={`${options?.enableDownOrder ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-yellow-400/50 cursor-not-allowed'} text-white font-bold p-2 rounded mr-2`}>
                    <FaAngleDown />
                  </button>
                  <button 
                    onClick={() => options?.delete()}
                    disabled={!options?.enableDelete} className={`${options?.enableDelete ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-yellow-400/50 cursor-not-allowed'} text-white font-bold p-2 rounded mr-2`}>
                    <FaRegTrashCan />
                  </button>
                </div>
              </div>
            )}
      <Formik
        initialValues={initialValues}
        validationSchema={rules}
        onSubmit={(e) => {
          saveData(e);
        }}
      >
        {({ values, isValid }) => (
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
                options={values.possibleAnswers.map((value) => ({
                  value: value.title,
                  label: value.title,
                  checked: value.title === result,
                }))}
                value={result}
                onChange={(value) => setResult(value)}
              />
            </div>
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`w-full py-2 rounded-lg ${
                !isValid
                  ? "bg-yellow-400/50 cursor-not-allowed"
                  : "bg-yellow-400 text-white font-bold hover:bg-yellow-600"
              }`}
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
