import { FC, memo } from "react";
import cls from "classnames";
import Icon from "../Icon";
import "./index.scss";

interface IProps {
  title: string;
  iconSrc: string;
  text: string;
  count: number;
  active: boolean;
  selected: boolean;
}

const StatusRow: FC<Partial<IProps>> = ({
  title,
  iconSrc,
  active,
  text,
  count,
  selected,
}) => {
  return (
    <div className={cls("status-row", selected && "selected")}>
      <div className="title">
        {iconSrc ? (
          <Icon className="title-icon" src={iconSrc} />
        ) : (
          <span className="title-text">{title}</span>
        )}
      </div>
      <div className="space"></div>
      <div className={cls("desc", active && "active")}>{text}</div>
      <div className="space"></div>
      <div className="count">{count}</div>
    </div>
  );
};

export default memo(StatusRow);
