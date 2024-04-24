import { FC, memo } from "react";
import cls from "classnames";
import Icon from "../Icon";
import "./index.scss";

interface IProps {}

const Settings: FC<Partial<IProps>> = ({}) => {
  return (
    <div className={cls("settings")}>
      <Icon className="settings-icon" src="/icons/settings.svg" />
    </div>
  );
};

export default memo(Settings);
