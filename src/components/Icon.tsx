// Icon svgs
import FlashLogo from "./Icon/FlashLogo";
import Fire from "./Icon/Fire";
import Other from "./Icon/Other";
import { CSSProperties } from "react";

export const IconTypes = {
  FlashLogo,
  Fire,
  Other,
};
type IconType = keyof typeof IconTypes;

interface IconProps {
  type: IconType;
  size?: number;
  maxHeight?: number;
  fill?: string;
  style?: CSSProperties;
}

const Icon: React.FC<IconProps> = (props) => {
  const { type, size, maxHeight, fill, style } = props;
  const IconSvgFile = IconTypes[type as IconType];

  return (
    <IconSvgFile
      style={{
        width: size ? size + "px" : "100%",
        maxHeight: maxHeight ? maxHeight + "px" : "none",
        fill: fill ? fill : "",
        ...style,
      }}
    />
  );
};

export default Icon;
