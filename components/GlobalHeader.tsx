import Icon from "./Icon";

const GlobalHeader: React.FC = () => {
  return (
    <header className="nmp w-11/12 mx-auto p-4 px-8 mt-8">
      <div className="w-10 mx-auto filter drop-shadow-lg">
        <Icon type="FlashLogo" />
      </div>
    </header>
  );
};

export default GlobalHeader;
