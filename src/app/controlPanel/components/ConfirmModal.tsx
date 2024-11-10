import React from "react";
import { Modal, Button } from "flowbite-react";

interface ConfirmModalParams {
  modalShow: boolean;
  setModalShow: (newState: boolean) => void;
  id: string;
  title: string;
  confirmButton: string;
  dimissButton: string;
  comfirmButtonColor?: string;
  dimissButtonColor?: string;
  confirmButtonAction?: () => void;
  dimissButtonAction?: () => void;
}

const ConfirmModal = (params: ConfirmModalParams) => {
  const { modalShow, setModalShow, confirmButtonAction, dimissButtonAction, title, confirmButton, dimissButton } = params;

  const callConfirmButton = () => {
    if(confirmButtonAction) {
      confirmButtonAction();
    }
    setModalShow(false);
  }
  
  const callDimissButton = () => {
    if (dimissButtonAction) {
      dimissButtonAction();
    }
    setModalShow(false);
  }

  return(
    <Modal show={modalShow} size="md" onClose={() => setModalShow(false)} popup>
      <Modal.Header />
      <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {title}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => callConfirmButton()}>
                {confirmButton}
              </Button>
              <Button color="gray" onClick={() => callDimissButton()}>
                {dimissButton}
              </Button>
            </div>
          </div>
        </Modal.Body>
    </Modal>
  )
}

ConfirmModal.displayName = "ConfirmModal";
export default ConfirmModal;
