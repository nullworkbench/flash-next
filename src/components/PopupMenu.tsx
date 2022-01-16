import { Children, useState } from "react";
import Router from "next/router";
import Icon from "./Icon";
import { deletePost } from "@/plugins/firestore";
import Modal from "@/components/Modal";

type Props = {
  docId: string;
};

const PopupMenu: React.FC<Props> = ({ docId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const MenuItem: React.FC = ({ children }) => {
    return <div className="px-2 py-1">{children}</div>;
  };

  async function deleteBtn() {
    const res = await deletePost(docId);
    Router.reload();
  }

  return (
    <div>
      <div className="p-0.5 pr-0" onClick={() => setIsOpen(true)}>
        <Icon type="Other" fill="#44476a" />
      </div>
      <div
        className="nmp absolute top-3 right-3 grid grid-cols-1 divide-y divide-gray-300 px-2 py-1"
        style={{
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          transform: isOpen ? "scale(1)" : "scale(0)",
          transformOrigin: "top right",
          transitionProperty: "opacity, visibility, transform",
          transitionDuration: "0.2s, 0.5s, 0.5s",
        }}
      >
        <div className="text-right px-2 py-1" onClick={() => setIsOpen(false)}>
          &times;
        </div>
        <div onClick={() => deleteBtn()}>
          <MenuItem>Delete</MenuItem>
        </div>
      </div>
      {/* 削除確認モーダル */}
      <Modal
        isOpen={deleteModalIsOpen}
        closeModal={() => setDeleteModalIsOpen(false)}
      >
        <p>a</p>
      </Modal>
    </div>
  );
};

export default PopupMenu;
