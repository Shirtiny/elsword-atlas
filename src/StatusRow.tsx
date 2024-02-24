import { FC, memo } from "react";
import cls from "classnames";

interface IProps {
  title: string;
  text: string;
  count: number;
  active: boolean;
}

const StatusRow: FC<Partial<IProps>> = ({ title, active, text, count }) => {
  return (
    <div className="row">
      <div className="title">{title}</div>
      <div className="space"></div>
      <div className={cls("desc", active && "active")}>{text}</div>
      <div className="space"></div>
      <div className="count">{count}</div>
    </div>
  );
};

export default memo(StatusRow);
