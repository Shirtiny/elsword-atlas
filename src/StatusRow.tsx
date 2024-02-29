import { FC, memo } from "react";
import cls from "classnames";
import Icon from "./components/Icon";

interface IProps {
  title: string;
  iconSrc: string;
  text: string;
  count: number;
  active: boolean;
}

const StatusRow: FC<Partial<IProps>> = ({
  title,
  iconSrc,
  active,
  text,
  count,
}) => {
  return (
    <div className="row">
      <div className="title">{iconSrc ? <Icon className="title-icon" src={iconSrc} /> : title}</div>
      <div className="space"></div>
      <div className={cls("desc", active && "active")}>{text}</div>
      <div className="space"></div>
      <div className="count">{count}</div>
    </div>
  );
};

export default memo(StatusRow);
