import classes from "./Counter.module.css";
function Counter({
  label,
  value,
  setValue,
  placeholder,
}: {
  label?: string;
  value: number;
  setValue: (value: number) => void;
  placeholder?: string;
}) {
  return (
    <div className={classes.container}>
      <p className={classes.label}>{label}</p>
      <div className={classes.counter}>
        <p className={classes.counterText}>{placeholder}</p>
        <div className={classes.counterContent}>
          <div
            onClick={() => setValue(value - 1)}
            className={classes.counterBtn}
          >
            -
          </div>
          <p className={classes.counterValue}>{value}</p>
          <div
            onClick={() => setValue(value + 1)}
            className={classes.counterBtn}
          >
            +
          </div>
        </div>
      </div>
    </div>
  );
}

export default Counter;
