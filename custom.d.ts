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

type Post = {
  title: string;
  userId: string;
};
