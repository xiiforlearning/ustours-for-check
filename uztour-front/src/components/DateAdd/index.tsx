"use client";
import { useRef, useState } from "react";
import classes from "./DateAdd.module.css";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import TextField from "../ui/TextField";
import PrimaryBtn from "../ui/PrimaryBtn";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import moment from "moment";
import { getDuration } from "@/consts";

function DateAdd({
  days,
  setDays,
  duration,
}: {
  days: { quantity: string; dateRange?: DateRange }[];
  setDays: React.Dispatch<
    React.SetStateAction<{ quantity: string; dateRange?: DateRange }[]>
  >;
  duration: number;
}) {
  const [newData, setNewData] = useState<{
    quantity: string;
    dateRange?: DateRange;
  } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const editingIndex = useRef(-1);

  useOnClickOutside(modalRef, () => {
    setNewData(null);
    editingIndex.current = -1;
  });

  const save = () => {
    if (newData) {
      if (
        newData.dateRange &&
        newData.quantity &&
        newData.quantity !== "0" &&
        newData.dateRange.from &&
        newData.dateRange.to
      ) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const fromDate = new Date(newData.dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        const secondDuration = getDuration(
          newData.dateRange.from,
          newData.dateRange.to
        );
        if (duration != secondDuration + 1) {
          alert("Продолжительность должна быть равна длительности тура");
          return;
        }

        if (fromDate <= today) {
          alert("Дата не может быть раньше сегодняшнего дня");
          return;
        }
        if (editingIndex.current < 0) {
          setDays([
            ...days,
            {
              quantity: newData.quantity,
              dateRange: newData.dateRange,
            },
          ]);
          setNewData(null);
          editingIndex.current = -1;
        } else {
          const newDays = [...days];
          newDays[editingIndex.current] = {
            quantity: newData.quantity,
            dateRange: newData.dateRange,
          };
          setDays(newDays);
          setNewData(null);
          editingIndex.current = -1;
        }
      } else {
        alert("Заполните все поля чтобы сохранить");
      }
    }
  };
  const createDate = () => {
    if (duration) {
      setNewData({
        quantity: "0",
        dateRange: undefined,
      });
    } else {
      alert("Выберите длительность и единица измерения");
    }
  };

  const edit = (index: number) => {
    editingIndex.current = index;
    const thatDay = days[index];
    setNewData(thatDay);
  };

  return (
    <>
      {newData && (
        <div className={classes.layer}>
          <div ref={modalRef} className={classes.modal}>
            <DayPicker
              animate
              mode="range"
              selected={newData.dateRange}
              onSelect={(dateRange: DateRange | undefined) => {
                setNewData({
                  ...newData,
                  dateRange,
                });
              }}
              footer={
                <div className={classes.footer}>
                  <TextField
                    placeHolder=""
                    label="Свободно мест"
                    setValue={(value: string) =>
                      setNewData({
                        ...newData,
                        quantity: value.replace(/[^0-9]/g, ""),
                      })
                    }
                    value={newData.quantity}
                  />
                  <PrimaryBtn text="Cохранить" onClick={save} />
                </div>
              }
            />
          </div>
        </div>
      )}

      <h2 className={classes.title}>Даты экскурсии</h2>
      <p className={classes.desc}>
        Выберите даты и укажите количество свободных мест. <br />
        Редактируйте данные по мере необходимости. <br />
      </p>
      <div onClick={createDate} className={classes.btn}>
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.12695 12.0819C1.12788 12.8552 1.43546 13.5965 1.98223 14.1432C2.529 14.69 3.27031 14.9976 4.04356 14.9985H12.2101C12.9833 14.9976 13.7246 14.69 14.2714 14.1432C14.8182 13.5965 15.1257 12.8552 15.1267 12.0819V6.83203H1.12695V12.0819ZM11.0434 9.45698C11.2165 9.45698 11.3856 9.50829 11.5295 9.60444C11.6734 9.70058 11.7856 9.83723 11.8518 9.99712C11.918 10.157 11.9353 10.3329 11.9016 10.5027C11.8678 10.6724 11.7845 10.8283 11.6621 10.9507C11.5397 11.073 11.3838 11.1564 11.2141 11.1901C11.0444 11.2239 10.8685 11.2066 10.7086 11.1403C10.5487 11.0741 10.412 10.962 10.3159 10.8181C10.2197 10.6742 10.1684 10.505 10.1684 10.332C10.1684 10.0999 10.2606 9.87734 10.4247 9.71325C10.5888 9.54916 10.8114 9.45698 11.0434 9.45698ZM8.12681 9.45698C8.29986 9.45698 8.46903 9.50829 8.61292 9.60444C8.75681 9.70058 8.86896 9.83723 8.93518 9.99712C9.00141 10.157 9.01874 10.3329 8.98497 10.5027C8.95121 10.6724 8.86788 10.8283 8.74551 10.9507C8.62314 11.073 8.46724 11.1564 8.29751 11.1901C8.12778 11.2239 7.95185 11.2066 7.79196 11.1403C7.63208 11.0741 7.49543 10.962 7.39928 10.8181C7.30314 10.6742 7.25182 10.505 7.25182 10.332C7.25182 10.0999 7.34401 9.87734 7.5081 9.71325C7.67219 9.54916 7.89475 9.45698 8.12681 9.45698ZM5.2102 9.45698C5.38326 9.45698 5.55242 9.50829 5.69631 9.60444C5.8402 9.70058 5.95235 9.83723 6.01858 9.99712C6.0848 10.157 6.10213 10.3329 6.06837 10.5027C6.03461 10.6724 5.95127 10.8283 5.82891 10.9507C5.70654 11.073 5.55063 11.1564 5.3809 11.1901C5.21117 11.2239 5.03524 11.2066 4.87536 11.1403C4.71548 11.0741 4.57882 10.962 4.48268 10.8181C4.38654 10.6742 4.33522 10.505 4.33522 10.332C4.33522 10.0999 4.4274 9.87734 4.59149 9.71325C4.75559 9.54916 4.97814 9.45698 5.2102 9.45698Z"
            fill="white"
          />
          <path
            d="M12.2101 2.16664H11.6267V1.58332C11.6267 1.42861 11.5653 1.28024 11.4559 1.17085C11.3465 1.06146 11.1981 1 11.0434 1C10.8887 1 10.7403 1.06146 10.6309 1.17085C10.5215 1.28024 10.4601 1.42861 10.4601 1.58332V2.16664H5.79352V1.58332C5.79352 1.42861 5.73206 1.28024 5.62267 1.17085C5.51328 1.06146 5.36491 1 5.2102 1C5.05549 1 4.90712 1.06146 4.79773 1.17085C4.68834 1.28024 4.62688 1.42861 4.62688 1.58332V2.16664H4.04356C3.27031 2.16757 2.529 2.47515 1.98223 3.02192C1.43546 3.56869 1.12788 4.31 1.12695 5.08325L1.12695 5.66657H15.1267V5.08325C15.1257 4.31 14.8182 3.56869 14.2714 3.02192C13.7246 2.47515 12.9833 2.16757 12.2101 2.16664Z"
            fill="white"
          />
        </svg>
        <p className={classes.btnText}>Добавить дату</p>
      </div>

      {days?.map((item, index) => (
        <div key={index} className={classes.day}>
          <div>
            <p>
              {item.dateRange?.from?.getTime() === item.dateRange?.to?.getTime()
                ? moment(item.dateRange?.from).format("DD.MM.YYYY")
                : moment(item.dateRange?.from).format("DD.MM.YYYY") +
                  " - " +
                  moment(item.dateRange?.to).format("DD.MM.YYYY")}
            </p>
            <div className={classes.places}>
              <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.2227 10.9375V12.1875H1.69141V10.9375C1.69141 10.9375 1.69141 8.43751 5.95703 8.43751C10.2227 8.43751 10.2227 10.9375 10.2227 10.9375ZM8.08984 5.00003C8.08984 4.56738 7.96476 4.14445 7.7304 3.78472C7.49604 3.42499 7.16294 3.14461 6.77322 2.97905C6.3835 2.81348 5.95467 2.77016 5.54094 2.85457C5.12721 2.93897 4.74718 3.14731 4.44891 3.45323C4.15063 3.75916 3.9475 4.14893 3.8652 4.57327C3.78291 4.9976 3.82514 5.43743 3.98657 5.83714C4.148 6.23685 4.42137 6.57849 4.7721 6.81886C5.12284 7.05922 5.5352 7.18752 5.95703 7.18752C6.52269 7.18752 7.06518 6.95705 7.46516 6.54682C7.86514 6.13658 8.08984 5.58018 8.08984 5.00003ZM10.1861 8.43751C10.5607 8.73485 10.8672 9.11278 11.0841 9.5447C11.301 9.97662 11.423 10.452 11.4414 10.9375V12.1875H13.8789V10.9375C13.8789 10.9375 13.8789 8.66876 10.1861 8.43751ZM9.61328 2.81253C9.19384 2.81014 8.78363 2.93875 8.43719 3.18128C8.80735 3.71174 9.00638 4.34771 9.00638 5.00003C9.00638 5.65234 8.80735 6.28831 8.43719 6.81877C8.78363 7.0613 9.19384 7.18991 9.61328 7.18752C10.1789 7.18752 10.7214 6.95705 11.1214 6.54682C11.5214 6.13658 11.7461 5.58018 11.7461 5.00003C11.7461 4.41987 11.5214 3.86347 11.1214 3.45323C10.7214 3.043 10.1789 2.81253 9.61328 2.81253Z"
                  fill="#0FA53A"
                />
              </svg>
              <p className={classes.placesText}>
                Свободно мест: {item.quantity}
              </p>
            </div>
          </div>
          <div className={classes.dayBtnList}>
            <div
              onClick={() =>
                setDays((old) => old.filter((item, i) => i !== index))
              }
              className={classes.delete}
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.75391 5.5L15.7539 15.5"
                  stroke="#EB5757"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.75391 15.5L15.7539 5.5"
                  stroke="#EB5757"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>Удалить</p>
            </div>
            <div onClick={() => edit(index)} className={classes.editBtn}>
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.5606 5.19305C14.8206 4.93305 14.8206 4.49971 14.5606 4.25305L13.0006 2.69305C12.7539 2.43305 12.3206 2.43305 12.0606 2.69305L10.8339 3.91305L13.3339 6.41305L14.5606 5.19305ZM2.75391 11.9997V14.4997H5.25391L12.6272 7.11971L10.1272 4.61971L2.75391 11.9997Z"
                  fill="#328AEE"
                />
              </svg>
              <p>Изменить</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default DateAdd;
