// svgを直接読み込むとき用
declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}

type User = {
  displayName: string;
  photoURL: string;
  uid: string;
};

type Like = {
  userId: string;
  createdAt: Date;
};

type Post = {
  docId: string;
  body: string;
  likes: Like[];
  userId: string;
  createdAt: string;
};
