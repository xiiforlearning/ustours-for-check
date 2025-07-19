"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import classes from "./FilterTransfer.module.css";
import Select from "../ui/Select";
import TextField from "../ui/TextField";
import Calendar from "../ui/Calendar";
import { Dict } from "@/types";
import AutocompleteInput from "../AutoComplateInput";
import { Bounce, ToastContainer, toast } from "react-toastify";

function FilterTransfer({ dict }: { dict: Dict }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [type, setType] = useState<"departure" | "arrival">("arrival");
  const [formData, setFormData] = useState<{
    departure: string;
    arrival: string;
    date: Date | null;
    city: string | null;
    airaportCity: string | null;
  }>({
    departure: "",
    arrival: "",
    date: null,
    city: null,
    airaportCity: null,
  });

  useEffect(() => {
    const initialDeparture = searchParams.get("departure") || "";
    const initialDate = searchParams.get("date") || null;
    const initialTime = searchParams.get("time") || null;

    setFormData({
      departure: initialDeparture,
      arrival: airaports[1].label,
      date:
        initialDate && initialTime
          ? new Date(`${initialDate}T${initialTime}`)
          : null,
      city: null,
      airaportCity: null,
    });
  }, []);

  const airaports = [
    { label: dict["selectAirport"], value: dict["selectAirport"] },
    {
      label: "Tashkent International Airport (TAS)",
      value: "Tashkent",
    },
  ];

  const handelAddressChange = async (value: string) => {
    if (!value) {
      setFormData({ ...formData, city: "", departure: "" });
      return;
    }

    setFormData({ ...formData, departure: value });
  };

  function getCityFromPlace(
    place: google.maps.places.PlaceResult
  ): string | null {
    if (!place.address_components) return null;

    for (const component of place.address_components) {
      if (component.types.includes("locality")) {
        return component.long_name;
      }

      // Fallback if "locality" isn't present
      if (component.types.includes("administrative_area_level_1")) {
        return component.long_name;
      }
    }

    return null;
  }

  const onPlaceSelected = async (place: any) => {
    const city = getCityFromPlace(place);
    if (
      city != "Tashkent" &&
      city != "Тоshkent" &&
      !place.formatted_address.includes("Tashkent")
    ) {
      toast.warn(dict["selectAddressInsideCityTashkent"], {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      updateQueryParams({ departure: "" });
      setFormData({ ...formData, departure: "" });
      return;
    }
    updateQueryParams({ departure: place.formatted_address });
    setFormData({ ...formData, departure: place.formatted_address, city });
  };

  const changeAirport = () => {};

  const updateQueryParams = (params: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    router.replace(`?${current.toString()}`);
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, date }));

    if (date) {
      const dateString = date.toISOString().split("T")[0]; // yyyy-mm-dd
      const timeString = date.toTimeString().split(" ")[0].slice(0, 5); // HH:MM
      updateQueryParams({ date: dateString, time: timeString });
    } else {
      updateQueryParams({ date: "", time: "" });
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <div className={classes.selectContent}>
        <div onClick={() => setType("arrival")} className={classes.select}>
          <div
            style={{ borderColor: type === "arrival" ? "#328AEE" : "#BBBBBB" }}
            className={classes.circleBorder}
          >
            <div
              style={{
                backgroundColor: type === "arrival" ? "#328AEE" : "#fff",
              }}
              className={classes.circle}
            ></div>
          </div>
          <p className={classes.selectText}>{dict["arrival"]}</p>
        </div>
        <div onClick={() => setType("departure")} className={classes.select}>
          <div
            style={{ borderColor: type !== "arrival" ? "#328AEE" : "#BBBBBB" }}
            className={classes.circleBorder}
          >
            <div
              style={{
                backgroundColor: type !== "arrival" ? "#328AEE" : "#fff",
              }}
              className={classes.circle}
            ></div>
          </div>
          <p className={classes.selectText}>{dict["transfer_departure"]}</p>
        </div>
      </div>
      <div className={classes.filter}>
        {type == "arrival" && (
          <>
            <div className={classes.carContainer} style={{ flex: 1 }}>
              <Select
                options={[airaports[1].label]}
                svg={
                  <svg
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.6333 3.25898C18.125 3.75065 18.125 4.54232 17.6333 5.02565L14.3917 8.26732L16.1583 15.9257L14.9833 17.109L11.75 10.9173L8.49999 14.1673L8.79999 16.2256L7.90833 17.109L6.44166 14.459L3.78333 12.984L4.66666 12.084L6.74999 12.3923L9.97499 9.16732L3.78333 5.90898L4.96666 4.73398L12.625 6.50065L15.8667 3.25898C16.3333 2.77565 17.1667 2.77565 17.6333 3.25898Z"
                      fill="#848484"
                    />
                  </svg>
                }
                label={dict["fromAirport"]}
                setValue={changeAirport}
                value={airaports[1].label}
              />
            </div>
            <div className={classes.carContainer} style={{ flex: 1 }}>
              <AutocompleteInput
                value={formData.departure}
                setValue={handelAddressChange}
                onPlaceSelected={onPlaceSelected}
                svg={
                  <svg
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 15.8333L8 14.075V4.16667L13 5.925V15.8333ZM17.5833 2.5C17.5333 2.5 17.4917 2.5 17.45 2.5L13 4.25L8 2.5L3.3 4.08333C3.125 4.14167 3 4.29167 3 4.48333V17.0833C3 17.1938 3.0439 17.2998 3.12204 17.378C3.20018 17.4561 3.30616 17.5 3.41667 17.5C3.45833 17.5 3.50833 17.5 3.55 17.475L8 15.75L13 17.5L17.7 15.9167C17.875 15.8333 18 15.7083 18 15.5167V2.91667C18 2.80616 17.9561 2.70018 17.878 2.62204C17.7998 2.5439 17.6938 2.5 17.5833 2.5Z"
                      fill="#848484"
                    />
                  </svg>
                }
                placeHolder={dict["enterAddress"]}
                label={dict["toWhere"]}
              />
              <div className={classes.menuWrapper}></div>
            </div>
          </>
        )}

        {type == "departure" && (
          <>
            <div className={classes.carContainer} style={{ flex: 1 }}>
              <TextField
                value={formData.departure}
                setValue={handelAddressChange}
                svg={
                  <svg
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 15.8333L8 14.075V4.16667L13 5.925V15.8333ZM17.5833 2.5C17.5333 2.5 17.4917 2.5 17.45 2.5L13 4.25L8 2.5L3.3 4.08333C3.125 4.14167 3 4.29167 3 4.48333V17.0833C3 17.1938 3.0439 17.2998 3.12204 17.378C3.20018 17.4561 3.30616 17.5 3.41667 17.5C3.45833 17.5 3.50833 17.5 3.55 17.475L8 15.75L13 17.5L17.7 15.9167C17.875 15.8333 18 15.7083 18 15.5167V2.91667C18 2.80616 17.9561 2.70018 17.878 2.62204C17.7998 2.5439 17.6938 2.5 17.5833 2.5Z"
                      fill="#848484"
                    />
                  </svg>
                }
                placeHolder={dict["enterAddress"]}
                label={dict["fromWhere"]}
              />
            </div>
            <div className={classes.carContainer} style={{ flex: 1 }}>
              <Select
                options={[airaports[1].label]}
                svg={
                  <svg
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.6333 3.25898C18.125 3.75065 18.125 4.54232 17.6333 5.02565L14.3917 8.26732L16.1583 15.9257L14.9833 17.109L11.75 10.9173L8.49999 14.1673L8.79999 16.2256L7.90833 17.109L6.44166 14.459L3.78333 12.984L4.66666 12.084L6.74999 12.3923L9.97499 9.16732L3.78333 5.90898L4.96666 4.73398L12.625 6.50065L15.8667 3.25898C16.3333 2.77565 17.1667 2.77565 17.6333 3.25898Z"
                      fill="#848484"
                    />
                  </svg>
                }
                label={dict["toAirport"]}
                setValue={changeAirport}
                value={airaports[1].label}
              />
            </div>
          </>
        )}

        <div className={classes.carContainer} style={{ flex: 1 }}>
          <Calendar
            label={dict["dateAndTime"]}
            svg={
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.75 15.1014C1.75116 16.068 2.13563 16.9946 2.8191 17.6781C3.50256 18.3615 4.4292 18.746 5.39576 18.7472H15.6039C16.5704 18.746 17.4971 18.3615 18.1805 17.6781C18.864 16.9946 19.2485 16.068 19.2496 15.1014V8.53906H1.75V15.1014ZM14.1456 11.8202C14.3619 11.8202 14.5734 11.8844 14.7532 12.0046C14.9331 12.1247 15.0733 12.2956 15.156 12.4954C15.2388 12.6953 15.2605 12.9152 15.2183 13.1273C15.1761 13.3395 15.0719 13.5344 14.919 13.6874C14.766 13.8403 14.5711 13.9445 14.3589 13.9867C14.1468 14.0289 13.9269 14.0072 13.727 13.9244C13.5272 13.8417 13.3564 13.7015 13.2362 13.5216C13.116 13.3417 13.0518 13.1303 13.0518 12.914C13.0518 12.6239 13.1671 12.3457 13.3722 12.1406C13.5773 11.9355 13.8555 11.8202 14.1456 11.8202ZM10.4998 11.8202C10.7161 11.8202 10.9276 11.8844 11.1075 12.0046C11.2873 12.1247 11.4275 12.2956 11.5103 12.4954C11.5931 12.6953 11.6147 12.9152 11.5725 13.1273C11.5303 13.3395 11.4262 13.5344 11.2732 13.6874C11.1202 13.8403 10.9254 13.9445 10.7132 13.9867C10.501 14.0289 10.2811 14.0072 10.0813 13.9244C9.88141 13.8417 9.71059 13.7015 9.59041 13.5216C9.47023 13.3417 9.40609 13.1303 9.40609 12.914C9.40609 12.6239 9.52132 12.3457 9.72643 12.1406C9.93155 11.9355 10.2097 11.8202 10.4998 11.8202ZM6.85406 11.8202C7.07038 11.8202 7.28184 11.8844 7.4617 12.0046C7.64156 12.1247 7.78175 12.2956 7.86453 12.4954C7.94731 12.6953 7.96897 12.9152 7.92677 13.1273C7.88457 13.3395 7.7804 13.5344 7.62744 13.6874C7.47448 13.8403 7.2796 13.9445 7.06743 13.9867C6.85527 14.0289 6.63536 14.0072 6.43551 13.9244C6.23566 13.8417 6.06484 13.7015 5.94466 13.5216C5.82448 13.3417 5.76033 13.1303 5.76033 12.914C5.76033 12.6239 5.87556 12.3457 6.08068 12.1406C6.28579 11.9355 6.56398 11.8202 6.85406 11.8202Z"
                  fill="#848484"
                />
                <path
                  d="M15.6039 2.7083H14.8747V1.97915C14.8747 1.78577 14.7979 1.60031 14.6612 1.46356C14.5244 1.32682 14.339 1.25 14.1456 1.25C13.9522 1.25 13.7667 1.32682 13.63 1.46356C13.4932 1.60031 13.4164 1.78577 13.4164 1.97915V2.7083H7.58321V1.97915C7.58321 1.78577 7.50639 1.60031 7.36965 1.46356C7.2329 1.32682 7.04744 1.25 6.85406 1.25C6.66068 1.25 6.47521 1.32682 6.33847 1.46356C6.20173 1.60031 6.12491 1.78577 6.12491 1.97915V2.7083H5.39576C4.4292 2.70946 3.50256 3.09394 2.8191 3.7774C2.13563 4.46086 1.75116 5.3875 1.75 6.35406L1.75 7.08321H19.2496V6.35406C19.2485 5.3875 18.864 4.46086 18.1805 3.7774C17.4971 3.09394 16.5704 2.70946 15.6039 2.7083Z"
                  fill="#848484"
                />
              </svg>
            }
            setValue={handleDateChange}
            value={formData.date}
          />
        </div>
      </div>
    </div>
  );
}

export default FilterTransfer;
