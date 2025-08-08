"use client";
import { TypeProgram } from "@/types";
import classes from "./DayProgram.module.css";
import TextField from "../ui/TextField";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { API } from "@/http-client";

function DayProgram({
  index,
  program,
  setPrograms,
  setLoading,
}: {
  index: number;
  program: TypeProgram;
  setPrograms: React.Dispatch<React.SetStateAction<TypeProgram[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const onChangeGallery = async (
    imageList: ImageListType,
    addUpdateIndex?: number[] | undefined
  ) => {
    setPrograms((programs) => {
      const newPrograms = [...programs];
      newPrograms[index].images = imageList;
      return newPrograms;
    });
    if (!addUpdateIndex || addUpdateIndex.length === 0) return;
    setLoading(true);
    const updatedGalleryUrls = [...program.photos]; // Start with existing gallery
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
    setPrograms((programs) => {
      const newPrograms = [...programs];
      newPrograms[index].photos = updatedGalleryUrls;
      return newPrograms;
    });
    setLoading(false);
  };
  return (
    <>
      <div>
        <div className={classes.day}>{index + 1} День</div>
        <TextField
          value={program.description}
          placeHolder="Описание дня"
          multiline
          setValue={(value) => {
            setPrograms((programs) => {
              const newPrograms = [...programs];
              newPrograms[index].description = value;
              return newPrograms;
            });
          }}
        />
        <div style={{ height: 20 }} />
        <ImageUploading
          value={program.images}
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
      </div>
    </>
  );
}

export default DayProgram;
