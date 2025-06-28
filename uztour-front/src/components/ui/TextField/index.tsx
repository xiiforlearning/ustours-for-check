import { ReactNode } from "react";
import classes from "./TextField.module.css";
function TextField({
  svg,
  placeHolder,
  value,
  setValue,
  disabled,
  label,
  isPhone,
}: {
  svg?: ReactNode;
  placeHolder: string;
  value: string;
  setValue?: (value: string) => void;
  disabled?: boolean;
  label?: string;
  isPhone?: boolean;
}) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setValue) {
      return;
    }

    const input = e.target.value;
    if (!isPhone) {
      setValue(input);
      return;
    }
    const previousValue = value;

    // If user is deleting (input is shorter than previous value)
    if (input.length < previousValue.length) {
      // Allow deletion but keep the "+998 " prefix
      if (input.startsWith("+998 ") && input.length <= 5) {
        setValue("+998 ");
        return;
      }
      setValue(input);
      return;
    }

    // Proceed with formatting for new input
    let numbers = input.replace(/\D/g, "");

    // Limit to 12 digits (998 + 9 digits)
    if (numbers.length > 12) {
      numbers = numbers.substring(0, 12);
    }

    let formattedInput = "+998 ";

    if (numbers.length > 3) {
      formattedInput += numbers.substring(3, 5);
      if (numbers.length > 5) {
        formattedInput += " " + numbers.substring(5, 8);
        if (numbers.length > 8) {
          formattedInput += " " + numbers.substring(8, 10);
          if (numbers.length > 10) {
            formattedInput += " " + numbers.substring(10, 12);
          }
        }
      }
    }

    setValue(formattedInput);
  };

  return (
    <div className={classes.container}>
      {label && <p className={classes.label}>{label}</p>}
      <div className={classes.wrapper}>
        <div className={classes.textFieldIcon}>{svg}</div>
        <input
          onChange={handlePhoneChange}
          placeholder={placeHolder}
          type="text"
          style={{
            paddingLeft: svg ? "44px" : "14px",
          }}
          disabled={disabled}
          value={value}
          className={classes.input}
        />
      </div>
    </div>
  );
}

export default TextField;
