"use client";
import classes from "./GuideTourCreate.module.css";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { useEffect, useMemo, useRef, useState } from "react";
import TextField from "../ui/TextField";
import Select, { ActionMeta, OnChangeValue } from "react-select";
import { cities, langs } from "@/consts";
import { Dict, TourType, TypeProgram } from "@/types";
import DateAdd from "../DateAdd";
import { DateRange } from "react-day-picker";
import DayProgram from "../DayProgram";
import PrimaryBtn from "../ui/PrimaryBtn";
import { YMaps, Map, Placemark, SearchControl } from "@pbe/react-yandex-maps";
import { createTour, getExactTours } from "@/api";
import { useRouter, useSearchParams } from "next/navigation";
import { RotatingLines } from "react-loader-spinner";
import { API } from "@/http-client";
import moment from "moment";

function GuideTourCreate({ dict }: { dict: Dict }) {
  const [poster, setPoster] = useState<ImageListType>([]);
  const [images, setImages] = useState<ImageListType>([]);
  const searchParams = useSearchParams();
  const idFromParam = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const id = useRef(idFromParam ? idFromParam : "");

  const [days, setDays] = useState<
    {
      quantity: string;
      dateRange?: DateRange;
    }[]
  >([]);

  const [data, setData] = useState<TourType>({
    title: "",
    duration: "",
    price: "",
    child_price: "",
    description: "",
    included: [""],
    excluded: [""],
    orientation: "",
    address: "",
    selectedCordinates: [41.2995, 69.2401],
    poster: "",
    gallery: [],
    cities: [],
    duration_unit: "hours",
    type: "private",
    difficulty: "easy",
    departure_city: "",
    departure_time: "",
    languages: [],
  });

  const [programs, setPrograms] = useState<TypeProgram[]>([]);

  const onChangePoster = async (imageList: ImageListType) => {
    setPoster(imageList);
    const image = imageList[0];
    if (image.file) {
      const formData = new FormData();
      formData.append("file", image.file);
      setLoading(true);
      await API.post("/files/upload", formData)
        .then((response) => {
          if (response.data.url) {
            setData({
              ...data,
              poster: response.data.url,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
    }
  };
  const onChangeGallery = async (
    imageList: ImageListType,
    addUpdateIndex?: number[] | undefined
  ) => {
    setImages(imageList); // still update preview
    if (!addUpdateIndex || addUpdateIndex.length === 0) return;

    setLoading(true);

    const updatedGalleryUrls = [...data.gallery]; // Start with existing gallery
    const uploadedUrls: string[] = [];

    for (const index of addUpdateIndex) {
      const image = imageList[index];
      if (image?.file) {
        const formData = new FormData();
        formData.append("file", image.file);

        try {
          const response = await API.post("/files/upload", formData);
          if (response.data.url) {
            updatedGalleryUrls[index] = response.data.url; // Replace or insert
            uploadedUrls.push(response.data.url);
          }
        } catch (error) {
          console.error("Image upload failed:", error);
        }
      }
    }

    setData({
      ...data,
      gallery: updatedGalleryUrls,
    });

    setLoading(false);
  };

  const cityChangeHandler = (
    newValue: OnChangeValue<{ value: string; label: string }, true>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    actionMeta;
    setData({
      ...data,
      cities: newValue.map((item) => item.value),
    });
  };
  const typeChangeHandler = (
    newValue: OnChangeValue<
      { value: "group" | "private"; label: string },
      false
    >,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    actionMeta;
    if (newValue?.value) {
      setData({
        ...data,
        type: newValue.value,
      });
    }
  };
  const unitChangeHandler = (
    value: OnChangeValue<{ value: string; label: string }, false>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    actionMeta;
    if (value?.value == "day3") {
      setData((data) => ({
        ...data,
        duration_unit: "days",
      }));
    } else {
      setData((data) => ({
        ...data,
        duration_unit: "hours",
      }));
    }
  };

  const difficultyChangeHandler = (
    value: OnChangeValue<
      { value: "easy" | "medium" | "hard"; label: string },
      false
    >,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    actionMeta;
    if (value?.value) {
      setData((data) => ({
        ...data,
        difficulty: value.value,
      }));
    }
  };
  const citiesFromChangeHandler = (
    value: OnChangeValue<{ value: string; label: string }, false>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    actionMeta;
    if (value?.value) {
      setData((data) => ({
        ...data,
        departure_city: value.value,
      }));
    }
  };
  const languagesChangeHandler = (
    value: OnChangeValue<{ value: string; label: string }, true>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    actionMeta;
    if (value?.length) {
      setData((data) => ({
        ...data,
        languages: value.map((item) => item.value),
      }));
    }
  };

  const units = ["day3", "hour2"];
  const types = [
    { label: dict["group"], value: "group" },
    { label: dict["individual"], value: "private" },
  ];
  const difficulties = [
    { label: dict["easy"], value: "easy" },
    { label: dict["medium"], value: "medium" },
    { label: dict["hard"], value: "hard" },
  ];

  const duration = useMemo(() => {
    if (data.duration && data.duration_unit) {
      if (data.duration_unit == "days") {
        return Number(data.duration);
      } else {
        return 1;
      }
    }
    return 0;
  }, [data.duration, data.duration_unit]);

  useEffect(() => {
    setPrograms((prevPrograms) => {
      if (!prevPrograms.length) {
        return new Array(duration).fill({
          name: "",
          description: "",
          images: [],
          photos: [],
        });
      }

      if (prevPrograms.length > duration) {
        return prevPrograms.slice(0, duration);
      }

      if (prevPrograms.length < duration) {
        const additionalItems = new Array(duration - prevPrograms.length).fill({
          name: "",
          description: "",
          images: [],
          photos: [],
        });
        return [...prevPrograms, ...additionalItems];
      }

      return prevPrograms;
    });
  }, [duration]);

  const handleMapClick = (e: any) => {
    const coords = e.get("coords");
    setData((prevData) => ({ ...prevData, selectedCordinates: coords }));
  };

  const handleMapLoad = (a: any) => {
    console.log(a);
  };

  async function getAddressFromCoords(lat: number, lng: number) {
    const response = await fetch(
      `https://geocode-maps.yandex.ru/1.x/?apikey=7fe61813-5a1f-42a7-8549-3641b268be1f&geocode=${lng},${lat}&format=json`
    );
    const data = await response.json();

    const geoObject =
      data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;

    const addressLine = geoObject?.name + ", " + geoObject?.description;
    return addressLine || "Unknown location";
  }

  useEffect(() => {
    getAddressFromCoords(
      data.selectedCordinates[0],
      data.selectedCordinates[1]
    ).then((address) => {
      setData((prevData) => ({ ...prevData, address: address }));
    });
  }, [data.selectedCordinates]);

  const save = async () => {
    setLoading(true);
    const availability = days.map((item) => ({
      date:
        item.dateRange?.from?.getTime() === item.dateRange?.to?.getTime()
          ? moment(item.dateRange?.from).format("DD.MM.YYYY")
          : moment(item.dateRange?.from).format("DD.MM.YYYY") +
            " - " +
            moment(item.dateRange?.to).format("DD.MM.YYYY"),
      total_slots: item.quantity,
      available_slots: item.quantity,
    }));

    const programsList = programs.map((item) => ({
      title: item.name,
      description: item.description,
      photos: item.photos,
    }));
    const res = await createTour({
      data,
      id: id.current,
      availability,
      programsList,
    });
    if (res.id) {
      id.current = res.id;
      router.replace("/guide-tour-create?id=" + id.current);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id.current) {
      const fetchData = async () => {
        const res = await getExactTours({ id: id.current });

        setData((prevData) => ({
          ...prevData,
          title: res.title,
          poster: res.main_photo,
          gallery: res.photos,
          cities: res.city,
          duration: res.duration ? res.duration.toString() : "",
          duration_unit: res.duration_unit ? res.duration_unit : "hours",
          type: res.type,
          difficulty: res.difficulty,
          departure_city: res.departure_city,
          departure_time: res.departure_time,
          price: res.price,
          child_price: res.child_price,
          languages: res.languages,
          excluded: res.excluded,
          included: res.included,
          description: res.description,
        }));

        if (res.availability.length) {
          setDays(
            res.availability.map((item) => {
              const dates = item.date.split(" - ");
              const from = moment(dates[0], "DD.MM.YYYY").toDate();
              const to = moment(
                dates.length > 1 ? dates[1] : dates[0],
                "DD.MM.YYYY"
              ).toDate();
              return {
                dateRange: {
                  from: from,
                  to: to,
                },
                quantity: item.total_slots,
              };
            })
          );
        }

        if (res.photos.length) {
          setImages(res.photos.map((item) => ({ data_url: item })));
        }
        if (res.main_photo) {
          setPoster([{ data_url: res.main_photo }]);
        }
        if (res.days.length) {
          setPrograms(
            res.days.map((item) => ({
              name: item.title,
              description: item.description,
              photos: item.photos,
              images: item.photos.map((photo) => ({ data_url: photo })),
            }))
          );
        }
      };
      fetchData();
    }
  }, []);

  const sentReview = async () => {
    const requiredFields = [
      "title",
      "duration",
      "price",
      "child_price",
      "description",
      "included",
      "excluded",
      "orientation",
      "address",
      "selectedCordinates",
      "poster",
      "cities",
      "duration_unit",
      "type",
      "difficulty",
      "departure_city",
      "departure_time",
      "languages",
    ];

    for (const key of requiredFields) {
      const value = (data as any)[key];
      const isEmptyArray = Array.isArray(value) && value.length === 0;
      const isEmptyString = typeof value === "string" && value.trim() === "";

      if (isEmptyArray || isEmptyString) {
        alert(`Field "${key}" cannot be empty.`);
        return;
      }
    }

    const isProgramsValid = programs.every(
      (p) => p.name.trim() !== "" && p.description.trim() !== ""
    );

    if (!isProgramsValid) {
      alert("Each program must have a title and description.");
      return;
    }

    if (days.length === 0) {
      alert(
        "Пожалуйста, укажите хотя бы одну дату. Вы можете воспользоваться кнопкой «Добавить дату"
      );
      return;
    }

    setLoading(true);

    const availability = days.map((item) => ({
      date:
        item.dateRange?.from?.getTime() === item.dateRange?.to?.getTime()
          ? moment(item.dateRange?.from).format("DD.MM.YYYY")
          : moment(item.dateRange?.from).format("DD.MM.YYYY") +
            " - " +
            moment(item.dateRange?.to).format("DD.MM.YYYY"),
      total_slots: item.quantity,
      available_slots: item.quantity,
    }));

    const programsList = programs.map((item) => ({
      title: item.name,
      description: item.description,
      photos: item.photos,
    }));
    const res = await createTour({
      data,
      id: id.current,
      availability,
      programsList,
      isSubmit: true,
    });
    if (res.id) {
      id.current = res.id;
    }
    setLoading(false);
    router.replace("/guide-tours");
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.editBlock}>
          <div onClick={save} className={classes.saveBtn}>
            <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.06029 7.76602C9.73362 6.09935 12.427 6.07935 14.127 7.71268V3.83268C14.127 3.09935 13.5336 2.49935 12.7936 2.49935H10.007C9.72695 1.72602 8.99362 1.16602 8.12695 1.16602C7.26029 1.16602 6.52695 1.72602 6.24695 2.49935H3.46029C2.72695 2.49935 2.12695 3.09935 2.12695 3.83268V13.166C2.12695 13.906 2.72695 14.4993 3.46029 14.4993H8.83362C8.56029 14.326 8.30029 14.1327 8.06029 13.8993C6.37362 12.206 6.37362 9.45935 8.06029 7.76602ZM8.12695 2.49935C8.49362 2.49935 8.79362 2.79935 8.79362 3.16602C8.79362 3.53268 8.49362 3.83268 8.12695 3.83268C7.76029 3.83268 7.46029 3.53268 7.46029 3.16602C7.46029 2.79935 7.76029 2.49935 8.12695 2.49935ZM13.667 12.4327C13.9603 11.9727 14.127 11.4193 14.127 10.8327C14.127 9.16602 12.7936 7.83268 11.127 7.83268C9.46029 7.83268 8.12695 9.16602 8.12695 10.8327C8.12695 12.4993 9.46029 13.8327 11.127 13.8327C11.707 13.8327 12.2536 13.666 12.7136 13.3793L14.7936 15.426L15.7203 14.4993L13.667 12.4327ZM11.127 12.4993C10.207 12.4993 9.46029 11.7527 9.46029 10.8327C9.46029 9.91268 10.207 9.16602 11.127 9.16602C12.047 9.16602 12.7936 9.91268 12.7936 10.8327C12.7936 11.7527 12.047 12.4993 11.127 12.4993Z"
                fill="white"
              />
            </svg>
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
              <div className={classes.saveBtnText}>Сохранить изменения</div>
            )}
          </div>
          <div className={classes.left}>
            <div onClick={sentReview} className={classes.editBtn}>
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.06029 7.76602C9.73362 6.09935 12.427 6.07935 14.127 7.71268V3.83268C14.127 3.09935 13.5336 2.49935 12.7936 2.49935H10.007C9.72695 1.72602 8.99362 1.16602 8.12695 1.16602C7.26029 1.16602 6.52695 1.72602 6.24695 2.49935H3.46029C2.72695 2.49935 2.12695 3.09935 2.12695 3.83268V13.166C2.12695 13.906 2.72695 14.4993 3.46029 14.4993H8.83362C8.56029 14.326 8.30029 14.1327 8.06029 13.8993C6.37362 12.206 6.37362 9.45935 8.06029 7.76602ZM8.12695 2.49935C8.49362 2.49935 8.79362 2.79935 8.79362 3.16602C8.79362 3.53268 8.49362 3.83268 8.12695 3.83268C7.76029 3.83268 7.46029 3.53268 7.46029 3.16602C7.46029 2.79935 7.76029 2.49935 8.12695 2.49935ZM13.667 12.4327C13.9603 11.9727 14.127 11.4193 14.127 10.8327C14.127 9.16602 12.7936 7.83268 11.127 7.83268C9.46029 7.83268 8.12695 9.16602 8.12695 10.8327C8.12695 12.4993 9.46029 13.8327 11.127 13.8327C11.707 13.8327 12.2536 13.666 12.7136 13.3793L14.7936 15.426L15.7203 14.4993L13.667 12.4327ZM11.127 12.4993C10.207 12.4993 9.46029 11.7527 9.46029 10.8327C9.46029 9.91268 10.207 9.16602 11.127 9.16602C12.047 9.16602 12.7936 9.91268 12.7936 10.8327C12.7936 11.7527 12.047 12.4993 11.127 12.4993Z"
                  fill="white"
                />
              </svg>
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
                <div className={classes.editText}>Отправить на модерацию</div>
              )}
            </div>
          </div>
        </div>

        <div className={classes.content}>
          <TextField
            value={data.title}
            label="Название тура"
            placeHolder="Например: Классическая экскурсия по Самарканду"
            setValue={(value: string) => setData({ ...data, title: value })}
          />
          <div style={{ height: 20 }} />

          <p className={classes.labelSelect}>Описание экскурсии</p>
          <div className={classes.description}>
            <TextField
              setValue={(value: string) =>
                setData({ ...data, description: value })
              }
              placeHolder=""
              multiline
              value={data.description}
            />
          </div>
          <div style={{ height: 20 }} />
          <h2 className={classes.title}>Постер</h2>
          <p className={classes.desc}>
            Загрузите главную картинку которая будет отображаться на карточке
            вашей экскурсии.📷 Пожалуйста, загрузите фото с соотношением сторон
            3:2 и разрешением не менее 736×482 пикселей для наилучшего качества
            отображения.
          </p>

          <ImageUploading
            value={poster}
            onChange={onChangePoster}
            maxNumber={1}
            dataURLKey="data_url"
          >
            {({ imageList, onImageUpload }) => (
              <>
                {imageList[0] && (
                  <img className={classes.poster} src={imageList[0].data_url} />
                )}

                <div onClick={onImageUpload} className={classes.selectPhoto}>
                  <svg
                    width="23"
                    height="22"
                    viewBox="0 0 23 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_926_65529)">
                      <path
                        d="M5.21029 2.75C4.72406 2.75 4.25774 2.94315 3.91392 3.28697C3.57011 3.63079 3.37695 4.0971 3.37695 4.58333V17.4167C3.37695 17.9029 3.57011 18.3692 3.91392 18.713C4.25774 19.0568 4.72406 19.25 5.21029 19.25H13.5428C13.4878 18.9475 13.4603 18.645 13.4603 18.3333C13.4603 17.71 13.5703 17.0867 13.7811 16.5H5.21029L8.41862 12.375L10.7103 15.125L13.9186 11L15.9628 13.7225C16.852 13.145 17.897 12.8333 18.9603 12.8333C19.272 12.8333 19.5745 12.8608 19.877 12.9158V4.58333C19.877 3.56583 19.052 2.75 18.0436 2.75H5.21029ZM18.0436 14.6667V17.4167H15.2936V19.25H18.0436V22H19.877V19.25H22.627V17.4167H19.877V14.6667H18.0436Z"
                        fill="#328AEE"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_926_65529">
                        <rect
                          width="22"
                          height="22"
                          fill="white"
                          transform="translate(0.626953)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <p className={classes.selectPhotoText}>
                    {imageList?.length ? "Изменить Постер" : "Выбрать постер"}
                  </p>
                </div>
              </>
            )}
          </ImageUploading>
          <div style={{ height: 20 }} />
          <h2 className={classes.title}>Фото галерея</h2>
          <p className={classes.desc}>
            Загрузите качественные и яркие фотографии, которые лучше всего
            отражают суть и атмосферу вашего тура. Это поможет путешественникам
            заранее познакомиться с вашим маршрутом и повысит их интерес к
            бронированию.📷 Пожалуйста, загрузите фото с соотношением сторон 3:2
            и разрешением не менее 736×482 пикселей для наилучшего качества
            отображения.
          </p>
          <ImageUploading
            value={images}
            onChange={onChangeGallery}
            maxNumber={10}
            multiple
            dataURLKey="data_url"
          >
            {({ imageList, onImageUpload, onImageUpdate, onImageRemove }) => (
              <>
                <div onClick={onImageUpload} className={classes.selectPhoto}>
                  <svg
                    width="23"
                    height="22"
                    viewBox="0 0 23 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_926_65529)">
                      <path
                        d="M5.21029 2.75C4.72406 2.75 4.25774 2.94315 3.91392 3.28697C3.57011 3.63079 3.37695 4.0971 3.37695 4.58333V17.4167C3.37695 17.9029 3.57011 18.3692 3.91392 18.713C4.25774 19.0568 4.72406 19.25 5.21029 19.25H13.5428C13.4878 18.9475 13.4603 18.645 13.4603 18.3333C13.4603 17.71 13.5703 17.0867 13.7811 16.5H5.21029L8.41862 12.375L10.7103 15.125L13.9186 11L15.9628 13.7225C16.852 13.145 17.897 12.8333 18.9603 12.8333C19.272 12.8333 19.5745 12.8608 19.877 12.9158V4.58333C19.877 3.56583 19.052 2.75 18.0436 2.75H5.21029ZM18.0436 14.6667V17.4167H15.2936V19.25H18.0436V22H19.877V19.25H22.627V17.4167H19.877V14.6667H18.0436Z"
                        fill="#328AEE"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_926_65529">
                        <rect
                          width="22"
                          height="22"
                          fill="white"
                          transform="translate(0.626953)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <p className={classes.selectPhotoText}>Добавить фото</p>
                </div>
                <div className={classes.imageList}>
                  {imageList.map((item, index) => (
                    <div className={classes.photoWrapper} key={index}>
                      <img
                        onClick={() => onImageRemove(index)}
                        className={classes.close}
                        src={"/images/x.svg"}
                      />
                      <img className={classes.photo} src={item.data_url} />
                      <div
                        onClick={() => onImageUpdate(index)}
                        className={classes.selectPhoto}
                      >
                        <svg
                          width="23"
                          height="22"
                          viewBox="0 0 23 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_926_65529)">
                            <path
                              d="M5.21029 2.75C4.72406 2.75 4.25774 2.94315 3.91392 3.28697C3.57011 3.63079 3.37695 4.0971 3.37695 4.58333V17.4167C3.37695 17.9029 3.57011 18.3692 3.91392 18.713C4.25774 19.0568 4.72406 19.25 5.21029 19.25H13.5428C13.4878 18.9475 13.4603 18.645 13.4603 18.3333C13.4603 17.71 13.5703 17.0867 13.7811 16.5H5.21029L8.41862 12.375L10.7103 15.125L13.9186 11L15.9628 13.7225C16.852 13.145 17.897 12.8333 18.9603 12.8333C19.272 12.8333 19.5745 12.8608 19.877 12.9158V4.58333C19.877 3.56583 19.052 2.75 18.0436 2.75H5.21029ZM18.0436 14.6667V17.4167H15.2936V19.25H18.0436V22H19.877V19.25H22.627V17.4167H19.877V14.6667H18.0436Z"
                              fill="#328AEE"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_926_65529">
                              <rect
                                width="22"
                                height="22"
                                fill="white"
                                transform="translate(0.626953)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        <p className={classes.selectPhotoText}>Заменить</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </ImageUploading>

          <div style={{ height: 30 }} />
          <h2 className={classes.title}>Основная информация</h2>
          <div className={classes.listFields}>
            <div className={classes.listField}>
              <p className={classes.labelSelect}>
                Выберите городы которых вы будете
              </p>
              <Select
                placeholder="Выберите городы"
                isMulti
                value={data.cities.map((item) => ({
                  value: item,
                  //@ts-expect-error aaa
                  label: dict[item],
                }))}
                onChange={cityChangeHandler}
                options={cities.map((lang) => ({
                  value: lang,
                  //@ts-expect-error aaa
                  label: dict[lang],
                }))}
              />
            </div>
            <div className={classes.listField}>
              <p className={classes.labelSelect}>Длительность</p>
              <TextField
                value={data.duration}
                setValue={(value: string) =>
                  setData({ ...data, duration: value.replace(/[^0-9]/g, "") })
                }
                placeHolder="Только цифры"
              />
            </div>
            <div className={classes.listField}>
              <p className={classes.labelSelect}>Единица измерения</p>
              <Select
                placeholder="Выберите единицу измерения"
                value={
                  data.duration_unit == "days"
                    ? { value: "day3", label: dict["day3"] }
                    : { value: "hour2", label: dict["hour2"] }
                }
                onChange={unitChangeHandler}
                options={units.map((lang) => ({
                  value: lang,
                  //@ts-expect-error aaa
                  label: dict[lang],
                }))}
              />
            </div>
          </div>
          <div style={{ height: 20 }} />
          <div className={classes.listFields}>
            <div className={classes.listField}>
              <p className={classes.labelSelect}>Тип экскурсии</p>
              <Select
                placeholder=""
                value={types.find((item) => item.value == data.type)}
                //@ts-expect-error aaa
                onChange={typeChangeHandler}
                options={types}
              />
            </div>
            <div className={classes.listField}>
              <p className={classes.labelSelect}>Сложность</p>
              <Select
                placeholder=""
                value={difficulties.find(
                  (item) => item.value == data.difficulty
                )}
                //@ts-expect-error aaa
                onChange={difficultyChangeHandler}
                options={difficulties}
              />
            </div>
            <div className={classes.listField}>
              <p className={classes.labelSelect}>Отправление</p>
              <Select
                placeholder=""
                onChange={citiesFromChangeHandler}
                value={{
                  value: data.departure_city,
                  //@ts-expect-error aaa
                  label: dict[data.departure_city],
                }}
                options={cities.map((lang) => ({
                  value: lang,
                  //@ts-expect-error aaa
                  label: dict[lang],
                }))}
              />
            </div>
          </div>
          <div style={{ height: 20 }} />
          <div className={classes.listFields}>
            <div className={classes.listField}>
              <p className={classes.labelSelect}>Время отправки</p>
              <TextField
                value={data.departure_time}
                placeHolder="Например: 10:00"
                setValue={(value: string) =>
                  setData({ ...data, departure_time: value })
                }
              />
            </div>
            <div className={classes.listField}>
              <p className={classes.labelSelect}>
                Цена для взрослого в долларах
              </p>
              <TextField
                value={data.price}
                placeHolder="Например: 50"
                setValue={(value: string) =>
                  setData({
                    ...data,
                    price: value.replace(/[^0-9]/g, ""),
                  })
                }
              />
            </div>
            <div className={classes.listField}>
              <p className={classes.labelSelect}>Цена для ребёнка</p>
              <TextField
                value={data.child_price}
                placeHolder="Например: 40"
                setValue={(value: string) =>
                  setData({
                    ...data,
                    child_price: value.replace(/[^0-9]/g, ""),
                  })
                }
              />
            </div>
          </div>
          <div style={{ height: 20 }} />
          <div className={classes.listFields}>
            <div className={classes.listField}>
              <p className={classes.labelSelect}>Языки проведения экскурсий</p>
              <Select
                placeholder="Выберите языки"
                onChange={languagesChangeHandler}
                isMulti
                value={data.languages.map((lang) => ({
                  value: lang,
                  // @ts-expect-error aaa
                  label: dict[lang],
                }))}
                options={langs.map((lang) => ({
                  value: lang,
                  // @ts-expect-error aaa
                  label: dict[lang],
                }))}
              />
            </div>
            <div className={classes.listField}></div>
            <div className={classes.listField}></div>
          </div>
          <div style={{ height: 20 }} />
          <DateAdd duration={duration} days={days} setDays={setDays} />

          <div style={{ height: 20 }} />
          <div className={classes.dayProgramms}>
            {programs.map((program, index) => (
              <DayProgram
                key={index}
                index={index}
                program={program}
                setLoading={setLoading}
                setPrograms={setPrograms}
              />
            ))}
          </div>
          <div style={{ height: 20 }} />
          <div className={classes.listIncludeTitle}>
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.253906"
                width="20"
                height="20"
                rx="10"
                fill="#1BB747"
              />
              <path
                d="M14.2539 7L8.75391 12.5L6.25391 10"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className={classes.labelSelect}>Включено в стоимость</p>
          </div>
          <div className={classes.listInclude}>
            {/* <TextField/> */}
            {data.included?.map((item, index) => (
              <div className={classes.listIncludeItem} key={index}>
                <div style={{ flex: 1 }}>
                  <TextField
                    setValue={(value: string) => {
                      setData({
                        ...data,
                        included: data.included?.map((item, i) => {
                          if (i === index) {
                            return value;
                          } else {
                            return item;
                          }
                        }),
                      });
                    }}
                    placeHolder="Например: Входные билеты в музеи"
                    value={item}
                  />
                </div>
                <div
                  onClick={() => {
                    setData({
                      ...data,
                      included: data.included?.filter((item, i) => i !== index),
                    });
                  }}
                  className={classes.delateBtn}
                >
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.6712 4.16667H14.4629L13.5462 3.25H8.96289L8.04622 4.16667H4.83789V6H17.6712V4.16667ZM5.75456 17.9167C5.75456 18.4029 5.94771 18.8692 6.29153 19.213C6.63534 19.5568 7.10166 19.75 7.58789 19.75H14.9212C15.4075 19.75 15.8738 19.5568 16.2176 19.213C16.5614 18.8692 16.7546 18.4029 16.7546 17.9167V6.91667H5.75456V17.9167Z"
                      fill="#EB5757"
                    />
                  </svg>
                </div>
              </div>
            ))}
            <PrimaryBtn
              text="Добавить что включено"
              onClick={() => {
                setData({ ...data, included: [...(data.included ?? []), ""] });
              }}
            />
          </div>
          <div style={{ height: 30 }} />
          <div className={classes.listIncludeTitle}>
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.126953 10C0.126953 4.47715 4.60411 0 10.127 0C15.6498 0 20.127 4.47715 20.127 10C20.127 15.5228 15.6498 20 10.127 20C4.60411 20 0.126953 15.5228 0.126953 10Z"
                fill="#F5F5F5"
              />
              <path
                d="M7.12695 7L13.127 13"
                stroke="#BBBBBB"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.12695 13L13.127 7"
                stroke="#BBBBBB"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p className={classes.labelSelect}>Не включено в стоимость</p>
          </div>
          <div className={classes.listInclude}>
            {/* <TextField/> */}
            {data.excluded?.map((item, index) => (
              <div className={classes.listIncludeItem} key={index}>
                <div style={{ flex: 1 }}>
                  <TextField
                    setValue={(value: string) => {
                      setData({
                        ...data,
                        excluded: data.excluded?.map((item, i) => {
                          if (i === index) {
                            return value;
                          } else {
                            return item;
                          }
                        }),
                      });
                    }}
                    placeHolder="Например: Личные траты"
                    value={item}
                  />
                </div>
                <div
                  onClick={() => {
                    setData({
                      ...data,
                      excluded: data.excluded?.filter((item, i) => i !== index),
                    });
                  }}
                  className={classes.delateBtn}
                >
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.6712 4.16667H14.4629L13.5462 3.25H8.96289L8.04622 4.16667H4.83789V6H17.6712V4.16667ZM5.75456 17.9167C5.75456 18.4029 5.94771 18.8692 6.29153 19.213C6.63534 19.5568 7.10166 19.75 7.58789 19.75H14.9212C15.4075 19.75 15.8738 19.5568 16.2176 19.213C16.5614 18.8692 16.7546 18.4029 16.7546 17.9167V6.91667H5.75456V17.9167Z"
                      fill="#EB5757"
                    />
                  </svg>
                </div>
              </div>
            ))}
            <PrimaryBtn
              text="Добавить что не включено"
              onClick={() => {
                setData({ ...data, excluded: [...(data.excluded ?? []), ""] });
              }}
            />
          </div>
          <div style={{ height: 30 }} />
          <h2 className={classes.title}>Место встречи</h2>
          <div style={{ height: 20 }} />
          <TextField
            setValue={(value: string) => {
              setData({ ...data, orientation: value });
            }}
            value={data.orientation}
            placeHolder="Ориентир"
          />
          <div style={{ height: 20 }} />
          <h2 className={classes.title}>{data.address}</h2>
          <div style={{ height: 20 }} />

          <YMaps
            query={{
              lang: "ru_RU",
              apikey: "7fe61813-5a1f-42a7-8549-3641b268be1f",
            }}
          >
            <Map
              onClick={handleMapClick}
              style={{ width: "100%", height: "400px" }}
              defaultState={{ center: [41.2995, 69.2401], zoom: 9 }}
              onLoad={handleMapLoad}
            >
              <SearchControl options={{ float: "right", noPlacemark: true }} />
              <Placemark geometry={data.selectedCordinates} />
            </Map>
          </YMaps>
        </div>
      </div>
    </div>
  );
}

export default GuideTourCreate;
