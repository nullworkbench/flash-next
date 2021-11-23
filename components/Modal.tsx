import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isOpen: boolean;
  closeModal: () => void;
};

const Modal: React.FC<Props> = ({ children, isOpen, closeModal }) => {
  //   const [isOpen, setIsOpen] = useState(false);
  //   function toggleIsOpen() {
  //     setIsOpen(!isOpen);
  //   }
  return (
    <>
      {isOpen ? (
        //   画面全体の黒背景
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-20">
          {/* モーダル外クリックで閉じる */}
          <div
            className="absolute top-0 left-0 w-full h-full"
            onClick={() => closeModal()}
          ></div>
          {/* モーダル中身 */}
          <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 w-max min-w-md filter drop-shadow-lg bg-theme rounded-xl p-4">
            {children}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Modal;
