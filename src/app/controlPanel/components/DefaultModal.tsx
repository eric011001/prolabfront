import React, {useEffect} from "react";
import { Modal } from 'flowbite';
interface DefaultModalParams {
  id: string;
  title: string;
  children: React.ReactNode;
  showFooter?: boolean;
  primaryButton?: boolean;
  secondaryButton?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonAction?: () => void;
  secondaryButtonAction?: () => void;
  setModal?: (modal: Modal) => void;
}

const DefaultModal = ({
  id,
  title,
  children,
  primaryButton = true,
  primaryButtonText = "De acuerdo",
  secondaryButton = true,
  secondaryButtonText = "Cancelar",
  showFooter = true,
  primaryButtonAction,
  secondaryButtonAction,
  setModal,
}: DefaultModalParams) => {

  useEffect(() => {
    const modalData = document.getElementById('static-modal');
    const modal = new Modal(modalData);
    if(setModal){
      setModal(modal);
    }
  }, []);

  return (
    <div
      id={id}
      tabIndex={-1}
      aria-hidden="true"
      className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide={id}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">{children}</div>
          {showFooter ? (
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              {primaryButton ? (
                <button
                  data-modal-hide={id}
                  type="button"
                  className="text-white bg-yellow-300 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {primaryButtonText}
                </button>
              ) : null}
              {
                secondaryButton ? (<button
                    data-modal-hide={id}
                    type="button"
                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    {secondaryButtonText}
                  </button>) : null
              }
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DefaultModal;
