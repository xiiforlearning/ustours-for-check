import { ChangeEvent } from "react";
import classes from "./Checkbox.module.css";

type CheckboxProps = {
  id: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function Checkbox({ id, checked, onChange }: CheckboxProps) {
  return (
    <div className={classes.checkboxWrapper4}>
      <input
        className={classes.inpcbx}
        id={id + " 1"}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label className={classes.cbx} htmlFor={id + " 1"}>
        <span>
          <svg width="12px" height="10px">
            <use xlinkHref={"#" + id}></use>
          </svg>
        </span>
      </label>
      <svg className={classes.inlinesvg}>
        <symbol id={id} viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </symbol>
      </svg>
    </div>
  );
}

export default Checkbox;
