import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Spinner } from "flowbite-react";
import { ChangePasswordForm } from './utils/types'
import type { CustomFlowbiteTheme } from "flowbite-react";
interface Params {
  changePassword: (params: ChangePasswordForm) => void;
  isChangePassword: boolean;
  disabledLoginButton?: boolean;
}

const customTheme: CustomFlowbiteTheme["button"] = {
  color: {
    primaryYellow: "bg-primary-600 hover:bg-primary-700",
  },
};

const ChangePasswordCard = ({ changePassword, isChangePassword, disabledLoginButton }: Params) => {
  const verifyTokenErrorPassword = "Tu contraseña previa es necesaria";
  const verifyTokenErrorToken = "Tu token de acceso es necesario";
  const changePasswordSchema = Yup.object().shape({
    verifyToken: Yup.string().required(
      `${isChangePassword ? verifyTokenErrorToken : verifyTokenErrorPassword}`
    ),
    password: Yup.string().required("La contraseña es necesaria"),
    confirmPassword: Yup.string().required(
      "La confirmación de clave es necesaria"
    ),
    email: Yup.string().email("El campo debe ser un correo"),
  });

  const initialValues: ChangePasswordForm = {
    password: '',
    confirmPassword: '',
    verifyToken: '',
    email: '',
  }
  return (
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Cambio de contraseña
        </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={changePasswordSchema}
          onSubmit={async (values) => {
            await changePassword(values);
          }}
        >
          {(props) => (
            <Form className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Correo:{" "}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="nombre@company.com"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.email}
                />
                <div>
                  <p className="text-red-700 mt-2">{props.errors.email}</p>
                </div>
              </div>
              <div>
                <label
                  htmlFor="verifyToken"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {isChangePassword ? 'Token de acceso: ' : 'Contraseña previa'}
                </label>
                <input
                  type={isChangePassword ? 'text' : 'password'}
                  name="verifyToken"
                  id="verifyToken"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.verifyToken}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Contraseña:{" "}
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.password}
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirmar contraseña:{" "}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.confirmPassword}
                />
              </div>
              <Button
                disabled={disabledLoginButton}
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                theme={customTheme}
                color="primaryYellow"
              >
                {!disabledLoginButton ? (
                  "Guardar cambios"
                ) : (
                  <Spinner color="warning" aria-label="Cargando..." />
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChangePasswordCard;
