import classes from "./PrimaryBtn.module.css";
import { RotatingLines } from "react-loader-spinner";
function PrimaryBtn({
  text,
  disabled,
  onClick,
  loading,
}: {
  text: string;
  disabled?: boolean;
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        backgroundColor: disabled ? "#F5F5F5" : "#328AEE",
      }}
      className={classes.container}
    >
      {loading ? (
        <RotatingLines
          visible={true}
          width="25"
          strokeColor="#fff"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      ) : (
        <p
          style={{ color: disabled ? "#848484" : "#FFFFFF" }}
          className={classes.text}
        >
          {text}
        </p>
      )}
    </div>
  );
}

export default PrimaryBtn;
