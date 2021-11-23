// Icon svgs
import FlashLogo from "./Icon/FlashLogo";

export const IconTypes = {
  FlashLogo,
};
type IconType = keyof typeof IconTypes;

interface IconProps {
  type: IconType;
  size?: number;
  maxHeight?: number;
  fill?: string;
}

const Icon: React.FC<IconProps> = (props) => {
  const { type, size, maxHeight, fill } = props;
  const IconSvgFile = IconTypes[type as IconType];

  return (
    <IconSvgFile
      style={{
        width: size ? size + "px" : "100%",
        maxHeight: maxHeight ? maxHeight + "px" : "none",
        fill: fill ? fill : "",
      }}
    />
  );
};

export default Icon;
