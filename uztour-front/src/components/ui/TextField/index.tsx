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
  multiline,
  inputRef,
}: {
  svg?: ReactNode;
  placeHolder: string;
  value: string;
  setValue?: (value: string) => void;
  disabled?: boolean;
  label?: string;
  isPhone?: boolean;
  multiline?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!setValue) {
      return;
    }

    const input = e.target.value;
    if (!isPhone) {
      setValue(input);
      return;
    }
    const previousValue = value;
    if (input.length < previousValue.length) {
      if (input.startsWith("+998 ") && input.length <= 5) {
        setValue("+998 ");
        return;
      }
      setValue(input);
      return;
    }

    let numbers = input.replace(/\D/g, "");

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
    } else {
      formattedInput += numbers;
    }

    setValue(formattedInput);
  };

  return (
    <div className={classes.container}>
      {label && <p className={classes.label}>{label}</p>}
      <div style={multiline ? { height: 100 } : {}} className={classes.wrapper}>
        <div className={classes.textFieldIcon}>{svg}</div>
        {multiline ? (
          <textarea
            onChange={handlePhoneChange}
            placeholder={placeHolder}
            disabled={disabled}
            value={value}
            className={classes.input}
            style={{
              resize: "none", // disable resize
              padding: 15,
            }}
            rows={4} // or any number depending on height
          />
        ) : (
          <input
            type="text"
            onChange={handlePhoneChange}
            placeholder={placeHolder}
            disabled={disabled}
            ref={inputRef}
            value={value}
            className={classes.input}
            style={{
              paddingLeft: svg ? "44px" : "14px",
            }}
          />
        )}
      </div>
    </div>
  );
}

export default TextField;
