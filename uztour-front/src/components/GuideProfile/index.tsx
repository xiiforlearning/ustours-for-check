"use client";
import { Dict } from "@/types";
import classes from "./GuideProfile.module.css";
import useGuide from "@/hooks/useGuide";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import TextField from "../ui/TextField";
import Select, { ActionMeta, OnChangeValue } from "react-select";
import { RotatingLines } from "react-loader-spinner";
import { API } from "@/http-client";
import { langs } from "@/consts";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "./getCroppedImg";
import PrimaryBtn from "../ui/PrimaryBtn";

type AllowedFile = File & {
  // narrow MIME types if you like; optional
  type:
    | "application/pdf"
    | "application/msword"
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
};

function GuideProfile({ dict }: { dict: Dict }) {
  const { guide, loading } = useGuide();
  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState<ImageListType>([]);
  const [file, setFile] = useState<AllowedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropDone = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return;

    const croppedFile = await getCroppedImg(cropImageSrc, croppedAreaPixels);
    const newImageList: ImageListType = [
      {
        data_url: URL.createObjectURL(croppedFile),
        file: croppedFile,
      },
    ];

    setImages(newImageList);
    setEditData({
      ...editData,
      avatar: URL.createObjectURL(croppedFile),
    });
    setShowCropper(false);
  };

  const [actualData, setActualData] = useState<{
    yearsOfExperience?: number;
    spokenLanguages?: string[];
    about?: string;
    avatar?: string;
    certificate?: string[];
  } | null>(null);
  const [editData, setEditData] = useState<{
    yearsOfExperience?: number;
    spokenLanguages?: string[];
    about?: string;
    avatar?: string;
    certificate?: string[];
  } | null>(null);

  const pressEditing = async () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      if (isLoading) return;
      const changedData: {
        yearsOfExperience?: number;
        spokenLanguages?: string[];
        about?: string;
        avatar?: string;
        certificates?: string[];
      } = {};
      if (editData?.yearsOfExperience) {
        changedData["yearsOfExperience"] = editData?.yearsOfExperience;
      }
      if (editData?.spokenLanguages?.length) {
        changedData["spokenLanguages"] = editData?.spokenLanguages;
      }
      if (editData?.about) {
        changedData["about"] = editData?.about;
      }

      setIsLoading(true);
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        await API.post("/files/upload", formData)
          .then((response) => {
            if (response.data.url) {
              console.log(response.data.url);
              changedData["certificates"] = [response.data.url];
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }

      if (images?.length) {
        if (images[0].file) {
          const formData = new FormData();
          formData.append("file", images[0].file);
          await API.post("/files/upload", formData)
            .then((response) => {
              if (response.data.url) {
                changedData["avatar"] = response.data.url;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }

      if (Object.keys(changedData).length) {
        await API.patch("/users/partner-profile", changedData)
          .then(() => {
            console.log(
              changedData.yearsOfExperience
                ? changedData.yearsOfExperience
                : actualData?.yearsOfExperience
            );
            setActualData({
              yearsOfExperience: changedData.yearsOfExperience
                ? changedData.yearsOfExperience
                : actualData?.yearsOfExperience,
              spokenLanguages: changedData.spokenLanguages
                ? changedData.spokenLanguages
                : actualData?.spokenLanguages,
              about: changedData.about ? changedData.about : actualData?.about,
              avatar: changedData.avatar
                ? changedData.avatar
                : actualData?.avatar,
              certificate: changedData.certificates?.length
                ? changedData.certificates
                : actualData?.certificate,
            });
            setEditData({
              yearsOfExperience: changedData.yearsOfExperience
                ? changedData.yearsOfExperience
                : actualData?.yearsOfExperience,
              spokenLanguages: changedData.spokenLanguages
                ? changedData.spokenLanguages
                : actualData?.spokenLanguages,
              about: changedData.about ? changedData.about : actualData?.about,
              avatar: changedData.avatar
                ? changedData.avatar
                : actualData?.avatar,
              certificate: changedData.certificates?.length
                ? changedData.certificates
                : actualData?.certificate,
            });
            setIsEditing(false);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    }
  };

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex?: Array<number>
  ) => {
    addUpdateIndex;
    setCropImageSrc(imageList[0].data_url || null);
    setShowCropper(true);
  };

  useEffect(() => {
    if (guide) {
      setActualData({
        spokenLanguages: guide.partner.spokenLanguages || [],
        yearsOfExperience: guide.partner.yearsOfExperience
          ? guide.partner.yearsOfExperience
          : undefined,
        about: guide.partner.about ? guide.partner.about : "",
        avatar: guide.partner.avatar ? guide.partner.avatar : "",
        certificate: guide.partner.certificates
          ? guide.partner.certificates
          : [],
      });

      setEditData({
        spokenLanguages: guide.partner.spokenLanguages || [],
        yearsOfExperience: guide.partner.yearsOfExperience
          ? guide.partner.yearsOfExperience
          : undefined,
        about: guide.partner.about ? guide.partner.about : "",
        avatar: guide.partner.avatar ? guide.partner.avatar : "",
        certificate: guide.partner.certificates
          ? guide.partner.certificates
          : [],
      });
    }
  }, [guide]);

  const handleChange = (event: ChangeEventHandler<HTMLInputElement>) => {
    //@ts-expect-error sss
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const langChangeHandler = (
    newValue: OnChangeValue<{ value: string; label: string }[], true>,
    actionMeta: ActionMeta<{ value: string; label: string }[]>
  ) => {
    if (newValue?.length) {
      actionMeta;
      setEditData({
        ...editData,
        //@ts-expect-error aaa
        spokenLanguages: newValue.map((item) => item.value),
      });
    }
  };

  return (
    <>
      <div className={classes.editBlock}>
        {isEditing && (
          <div
            onClick={() => {
              setIsEditing(false);
            }}
            className={classes.editCancel}
          >
            Назад
          </div>
        )}
        <div
          onClick={pressEditing}
          style={{ backgroundColor: isEditing ? "#1BB747" : "#328AEE" }}
          className={classes.editBtn}
        >
          {!isEditing && (
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.4336 4.69305C14.6936 4.43305 14.6936 3.99971 14.4336 3.75305L12.8736 2.19305C12.627 1.93305 12.1936 1.93305 11.9336 2.19305L10.707 3.41305L13.207 5.91305L14.4336 4.69305ZM2.62695 11.4997V13.9997H5.12695L12.5003 6.61971L10.0003 4.11971L2.62695 11.4997Z"
                fill="white"
              />
            </svg>
          )}

          <p className={classes.editText}>
            {isLoading ? (
              <RotatingLines
                visible={true}
                width="25"
                strokeColor="#fff"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
            ) : (
              <>{isEditing ? "Сохранить изменения" : dict["edit"]}</>
            )}
          </p>
        </div>
      </div>
      {!loading && guide && (
        <div className={classes.info}>
          <div>
            <ImageUploading
              multiple
              value={images}
              onChange={onChange}
              maxNumber={1}
              dataURLKey="data_url"
            >
              {({ imageList, onImageUpload, onImageUpdate }) => (
                <>
                  <img
                    className={classes.avatar}
                    src={
                      imageList[0]?.data_url ||
                      editData?.avatar ||
                      actualData?.avatar ||
                      "/images/avatar.svg"
                    }
                  />
                  {isEditing && (
                    <div
                      onClick={
                        imageList[0]?.data_url
                          ? () => onImageUpdate(0)
                          : onImageUpload
                      }
                      className={classes.selectPhoto}
                    >
                      {/* your SVG and label */}{" "}
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
                      <p className={classes.selectPhotoText}>Выбрать фото</p>{" "}
                    </div>
                  )}
                </>
              )}
            </ImageUploading>
          </div>

          <div style={{ width: "100%" }}>
            <div className={classes.infoItem}>
              <p className={classes.label}>Личные данные</p>
              <div className={classes.infoBlock}>
                <p className={classes.infoText}>
                  <span>{dict["name"]}</span>: {guide.partner.firstName}
                </p>
                <p className={classes.infoText}>
                  <span>{dict["surname"]}: </span> {guide.partner.lastName}
                </p>
              </div>
            </div>
            <div className={classes.line}></div>
            <div className={classes.infoItem}>
              <p className={classes.label}>{dict["contacts"]}</p>
              <div className={classes.infoBlock}>
                <div className={classes.contact}>
                  <svg
                    width="23"
                    height="22"
                    viewBox="0 0 23 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.377 11H16.2103C16.2103 9.78442 15.7274 8.61864 14.8679 7.75909C14.0083 6.89955 12.8425 6.41667 11.627 6.41667V8.25C12.3563 8.25 13.0558 8.53973 13.5715 9.05546C14.0872 9.57118 14.377 10.2707 14.377 11ZM18.0436 11H19.877C19.877 6.41667 16.1828 2.75 11.627 2.75V4.58333C15.1653 4.58333 18.0436 7.4525 18.0436 11ZM18.9603 14.2083C17.8145 14.2083 16.7145 14.025 15.6878 13.6858C15.367 13.585 15.0095 13.6583 14.7528 13.915L12.7361 15.9317C10.142 14.6117 8.01529 12.485 6.69529 9.89083L8.71195 7.87417C8.96862 7.6175 9.04195 7.26 8.94112 6.93917C8.60195 5.9125 8.41862 4.8125 8.41862 3.66667C8.41862 3.42355 8.32204 3.19039 8.15013 3.01849C7.97823 2.84658 7.74507 2.75 7.50195 2.75H4.29362C4.0505 2.75 3.81735 2.84658 3.64544 3.01849C3.47353 3.19039 3.37695 3.42355 3.37695 3.66667C3.37695 7.79962 5.01876 11.7633 7.94121 14.6857C10.8636 17.6082 14.8273 19.25 18.9603 19.25C19.2034 19.25 19.4366 19.1534 19.6085 18.9815C19.7804 18.8096 19.877 18.5764 19.877 18.3333V15.125C19.877 14.8819 19.7804 14.6487 19.6085 14.4768C19.4366 14.3049 19.2034 14.2083 18.9603 14.2083Z"
                      fill="#328AEE"
                    />
                  </svg>
                  <p className={classes.contactText}>{guide.partner.phone}</p>
                </div>
                <div className={classes.contact}>
                  <svg
                    width="23"
                    height="22"
                    viewBox="0 0 23 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.9609 7.33268L11.6276 11.916L4.29427 7.33268V5.49935L11.6276 10.0827L18.9609 5.49935V7.33268ZM18.9609 3.66602H4.29427C3.27677 3.66602 2.46094 4.48185 2.46094 5.49935V16.4993C2.46094 16.9856 2.65409 17.4519 2.99791 17.7957C3.34172 18.1395 3.80804 18.3327 4.29427 18.3327H18.9609C19.4472 18.3327 19.9135 18.1395 20.2573 17.7957C20.6011 17.4519 20.7943 16.9856 20.7943 16.4993V5.49935C20.7943 4.48185 19.9693 3.66602 18.9609 3.66602Z"
                      fill="#328AEE"
                    />
                  </svg>

                  <p className={classes.contactText}>{guide.email}</p>
                </div>
              </div>
            </div>
            <div className={classes.line}></div>
            <div className={classes.infoItem}>
              {!isEditing && <p className={classes.label}>Опыт работы</p>}

              {isEditing ? (
                <div style={{ width: "100%" }}>
                  <TextField
                    placeHolder="Напишите cколько лет работаете, толко цифры"
                    value={
                      editData?.yearsOfExperience
                        ? editData.yearsOfExperience.toString()
                        : ""
                    }
                    label="Опыт работы"
                    setValue={(value: string) => {
                      setEditData({
                        ...editData,
                        yearsOfExperience: Number(value.replace(/[^0-9]/g, "")),
                      });
                    }}
                  />
                </div>
              ) : (
                <>
                  {actualData?.yearsOfExperience ? (
                    <div className={classes.experience}>
                      {actualData?.yearsOfExperience} лет
                    </div>
                  ) : (
                    <p className={classes.infoText}>Пусто</p>
                  )}
                </>
              )}
            </div>
            <div className={classes.line}></div>
            <div className={classes.infoItem}>
              {isEditing && (
                <div>
                  <p className={classes.labelSelect}>
                    Языки проведения экскурсий
                  </p>
                  <Select
                    placeholder="Добавить языкы"
                    isMulti
                    value={
                      editData?.spokenLanguages
                        ? editData?.spokenLanguages.map((lang) => ({
                            value: lang,
                            //@ts-expect-error aaa
                            label: dict[lang],
                          }))
                        : []
                    }
                    onChange={langChangeHandler}
                    // @ts-expect-error aaa
                    options={langs.map((lang) => ({
                      value: lang,
                      //@ts-expect-error aaa
                      label: dict[lang],
                    }))}
                  />
                </div>
              )}
              {!isEditing && <p className={classes.label}>Языки</p>}
              {!isEditing && (
                <div className={classes.infoBlock}>
                  {actualData?.spokenLanguages ? (
                    actualData?.spokenLanguages?.map((language, index) => (
                      <p className={classes.infoText} key={index}>
                        {
                          // @ts-expect-error aaa
                          dict[language]
                        }
                      </p>
                    ))
                  ) : (
                    <p className={classes.infoText}>Нет данных</p>
                  )}
                </div>
              )}
            </div>
            <div className={classes.line}></div>
            <div className={classes.infoItem}>
              {!isEditing && (
                <>
                  <p className={classes.label}>О себе</p>
                  <div className={classes.infoText}>
                    {actualData?.about ? actualData.about : "Пусто"}
                  </div>
                </>
              )}
              {isEditing && (
                <div style={{ width: "100%" }}>
                  <TextField
                    placeHolder="Расскажите немного о себе для туристов"
                    value={editData?.about ? editData.about : ""}
                    setValue={(value: string) => {
                      setEditData({
                        ...editData,
                        about: value,
                      });
                    }}
                    multiline
                    label="О себе"
                  />
                </div>
              )}
            </div>
            <div className={classes.line}></div>
            <div className={classes.infoItem}>
              {isEditing && (
                <div>
                  {!file &&
                  !editData?.certificate &&
                  !actualData?.certificate ? (
                    <div className={classes.alert}>
                      <svg
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.32695 8.7H7.92695V4.5H9.32695V8.7ZM9.32695 11.5H7.92695V10.1H9.32695V11.5ZM8.62695 1C7.7077 1 6.79745 1.18106 5.94817 1.53284C5.09889 1.88463 4.32722 2.40024 3.67721 3.05025C2.36445 4.36301 1.62695 6.14348 1.62695 8C1.62695 9.85651 2.36445 11.637 3.67721 12.9497C4.32722 13.5998 5.09889 14.1154 5.94817 14.4672C6.79745 14.8189 7.7077 15 8.62695 15C10.4835 15 12.2639 14.2625 13.5767 12.9497C14.8895 11.637 15.627 9.85651 15.627 8C15.627 7.08075 15.4459 6.17049 15.0941 5.32122C14.7423 4.47194 14.2267 3.70026 13.5767 3.05025C12.9267 2.40024 12.155 1.88463 11.3057 1.53284C10.4565 1.18106 9.54621 1 8.62695 1Z"
                          fill="#F2B211"
                        />
                      </svg>
                      <p className={classes.alertText}>
                        Вы еще не добавили свои сертификаты — это самое важное
                        поле для подтверждения вашей квалификации. Пожалуйста,
                        загрузите сертификаты, чтобы повысить доверие клиентов и
                        начать работу
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    //@ts-expect-error aaa
                    onChange={handleChange}
                    id="fileUpload"
                    className={`${classes.certificateInput}`}
                  />
                  <label htmlFor="fileUpload" className={classes.fileLabel}>
                    {file?.name ? file.name : "Загрузить сертификат"}
                  </label>
                </div>
              )}
              {!isEditing && (
                <>
                  <p className={classes.label}>Сертификаты</p>
                  <div className={classes.infoBlock}>
                    {actualData?.certificate?.length ? (
                      actualData?.certificate?.map((certificate, index) => (
                        <a
                          href={certificate}
                          key={index}
                          className={classes.contactText}
                        >
                          Сертификат
                        </a>
                      ))
                    ) : (
                      <p>Нет сертификатов</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {showCropper && cropImageSrc && (
        <div className={classes.cropModal}>
          <div style={{ position: "relative", width: "100%", height: 400 }}>
            <Cropper
              image={cropImageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className={classes.btnBlockCrop}>
            <PrimaryBtn text="Сохранить" onClick={handleCropDone} />
            <PrimaryBtn text="Отменить" onClick={() => setShowCropper(false)} />
          </div>
        </div>
      )}
    </>
  );
}

export default GuideProfile;
