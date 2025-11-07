import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === null) {
    throw new Error("useModal must be used within an ModalProvider");
  }

  return context;
};

export const ModalProvider = ({ children }) => {
  // store the modal type
  const [selectedModalType, setSelectedModalType] = useState(null);

  const openModal = (modalType) => {
    setSelectedModalType(modalType);
  };

  const closeModal = () => {
    setSelectedModalType(null);
  };

  const contextValue = {
    selectedModalType,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};
