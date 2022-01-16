import { Children, useState } from "react";
import Router from "next/router";
import styled from "styled-components";
import Icon from "./Icon";
import { deletePost } from "@/plugins/firestore";
import Modal from "@/components/Modal";

type Props = {
  docId: string;
};

const PopupMenu: React.FC<Props> = ({ docId }) => {
  // Popupメニューの開閉状態
  const [isOpen, setIsOpen] = useState(false);

  // 削除確認モーダルの開閉状態
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  // Menuの各ボタンのスタイル
  const MenuItem = styled.div`
    padding: 0.5rem 1rem;
  `;

  // 削除ボタンが選択されたとき
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
        <MenuItem onClick={() => setDeleteModalIsOpen(true)}>Delete</MenuItem>
      </div>
      {/* 削除確認モーダル */}
      <Modal
        isOpen={deleteModalIsOpen}
        closeModal={() => setDeleteModalIsOpen(false)}
      >
        <div className="p-3">
          <p>本当に削除しますか？</p>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 mr-4 text-sm bg-gray-300 rounded-md focus:outline-none"
            onClick={() => setDeleteModalIsOpen(false)}
          >
            キャンセル
          </button>
          <button
            className="px-4 py-2 text-white text-sm bg-red-400 rounded-md focus:outline-none"
            onClick={() => deleteBtn()}
          >
            削除する
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PopupMenu;
