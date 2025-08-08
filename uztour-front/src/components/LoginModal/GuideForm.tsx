import Image from "next/image";
import TextField from "../ui/TextField";
import classes from "./LoginModal.module.css";
import Select from "../ui/Select";
import PrimaryBtn from "../ui/PrimaryBtn";
import { Dict, GuideSubmitData } from "@/types";
import { converFirstLetterToUpperCase } from "@/consts";
function GuideForm({
  email,
  submitGuideData,
  formData,
  setFormData,
  dict,
  loading,
}: {
  email: string;
  submitGuideData: () => void;
  formData: GuideSubmitData;
  setFormData: (data: GuideSubmitData) => void;
  dict: Dict;
  loading: boolean;
}) {
  const options = [
    converFirstLetterToUpperCase(dict["guide"]),
    converFirstLetterToUpperCase(dict["company"]),
  ];

  return (
    <>
      <p className={classes.guideText}>{dict["registerForManageTours"]}</p>
      <div className={classes.fieldWrapper}>
        <div className={classes.area}>
          <TextField
            placeHolder={dict["name"]}
            value={formData.name}
            setValue={(value) => setFormData({ ...formData, name: value })}
            svg={
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.625 3.75C11.5367 3.75 12.411 4.11216 13.0557 4.75682C13.7003 5.40148 14.0625 6.27582 14.0625 7.1875C14.0625 8.09918 13.7003 8.97352 13.0557 9.61818C12.411 10.2628 11.5367 10.625 10.625 10.625C9.71332 10.625 8.83898 10.2628 8.19432 9.61818C7.54966 8.97352 7.1875 8.09918 7.1875 7.1875C7.1875 6.27582 7.54966 5.40148 8.19432 4.75682C8.83898 4.11216 9.71332 3.75 10.625 3.75ZM10.625 12.3438C14.4234 12.3438 17.5 13.882 17.5 15.7812V17.5H3.75V15.7812C3.75 13.882 6.82656 12.3438 10.625 12.3438Z"
                  fill="#848484"
                />
              </svg>
            }
          />
        </div>
        <div className={classes.area}>
          <TextField
            placeHolder={dict["surname"]}
            value={formData.lastName}
            setValue={(value) => setFormData({ ...formData, lastName: value })}
            svg={
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.625 3.75C11.5367 3.75 12.411 4.11216 13.0557 4.75682C13.7003 5.40148 14.0625 6.27582 14.0625 7.1875C14.0625 8.09918 13.7003 8.97352 13.0557 9.61818C12.411 10.2628 11.5367 10.625 10.625 10.625C9.71332 10.625 8.83898 10.2628 8.19432 9.61818C7.54966 8.97352 7.1875 8.09918 7.1875 7.1875C7.1875 6.27582 7.54966 5.40148 8.19432 4.75682C8.83898 4.11216 9.71332 3.75 10.625 3.75ZM10.625 12.3438C14.4234 12.3438 17.5 13.882 17.5 15.7812V17.5H3.75V15.7812C3.75 13.882 6.82656 12.3438 10.625 12.3438Z"
                  fill="#848484"
                />
              </svg>
            }
          />
        </div>
        <div className={`${classes.area} ${classes.fullArea}`}>
          <TextField
            placeHolder={dict["email"]}
            value={email}
            disabled={true}
            svg={
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.6675 6.66536L10.0008 10.832L3.33415 6.66536V4.9987L10.0008 9.16536L16.6675 4.9987V6.66536ZM16.6675 3.33203H3.33415C2.40915 3.33203 1.66748 4.0737 1.66748 4.9987V14.9987C1.66748 15.4407 1.84308 15.8646 2.15564 16.1772C2.4682 16.4898 2.89212 16.6654 3.33415 16.6654H16.6675C17.1095 16.6654 17.5334 16.4898 17.846 16.1772C18.1586 15.8646 18.3341 15.4407 18.3341 14.9987V4.9987C18.3341 4.0737 17.5841 3.33203 16.6675 3.33203Z"
                  fill="#848484"
                />
              </svg>
            }
          />
        </div>
        <div className={`${classes.area} ${classes.fullArea}`}>
          <TextField
            value={formData.phone}
            isPhone={true}
            setValue={(value) => setFormData({ ...formData, phone: value })}
            placeHolder={"+998 __ ___ __ __"}
            svg={
              <Image alt="uz" width={17} height={13} src={"/images/uz.svg"} />
            }
          />
        </div>
        <div className={classes.line}></div>
        <div className={classes.area}>
          <Select
            label={dict["userStatus"]}
            value={formData.isCompany ? options[1] : options[0]}
            options={options}
            setValue={(value) =>
              setFormData({ ...formData, isCompany: value === options[1] })
            }
          />
        </div>
        <div className={classes.area}>
          {formData.isCompany && (
            <TextField
              placeHolder={dict["fill"]}
              label={dict["companyName"]}
              value={formData.companyName}
              setValue={(value) =>
                setFormData({ ...formData, companyName: value })
              }
            />
          )}
        </div>
      </div>
      <PrimaryBtn
        loading={loading}
        disabled={
          !formData.phone ||
          !formData.lastName ||
          !formData.name ||
          (formData.isCompany && !formData.companyName)
        }
        onClick={() => submitGuideData()}
        text={dict["sendCodeForConfirmation"]}
      />
    </>
  );
}

export default GuideForm;
