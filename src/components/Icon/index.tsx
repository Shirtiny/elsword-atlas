import { FC, memo } from "react";
import cls from "classnames";
import "./index.scss";

interface IProps {
  src: string;
  className?: string;
}

const Icon: FC<IProps> = ({ src, className }) => {
  return (
    <span className={cls("icon", className)}>
      <img src={src} />
    </span>
  );
};

export default memo(Icon);
