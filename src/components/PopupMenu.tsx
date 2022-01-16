import { Children, useState } from "react";
import Router from "next/router";
import styled from "styled-components";
import Icon from "./Icon";
import { deletePost } from "@/plugins/firestore";
import Modal from "@/components/Modal";

type Props = {
  docId: string;
};

// Menuの各ボタンのスタイル
const MenuItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
`;

const PopupMenu: React.FC<Props> = ({ docId }) => {
  // Popupメニューの開閉状態
  const [isOpen, setIsOpen] = useState(false);

  // 削除確認モーダルの開閉状態
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  // 削除ボタンが選択されたとき
  async function deleteBtn() {
    const res = await deletePost(docId);
    Router.reload();
  }

  return (
    <div>
      <div
        className="p-0.5 pr-0 cursor-pointer"
        style={{ width: "1.5rem" }}
        onClick={() => setIsOpen(true)}
      >
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
        <div
          className="text-right px-2 py-1 cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          &times;
        </div>
        <MenuItem onClick={() => setDeleteModalIsOpen(true)}>Delete</MenuItem>
      </div>
      {/* 削除確認モーダル */}
      <Modal
        isOpen={deleteModalIsOpen}
        closeModal={() => setDeleteModalIsOpen(false)}
      >
        <div className="p-3">
          <p>Are you sure want to delete?</p>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 mr-4 text-sm bg-gray-300 rounded-md focus:outline-none"
            onClick={() => setDeleteModalIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white text-sm bg-red-400 rounded-md focus:outline-none"
            onClick={() => deleteBtn()}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PopupMenu;
