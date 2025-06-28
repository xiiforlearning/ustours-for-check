import Link from "next/link";
import classes from "./Header.module.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
function LangBtn({ lang }: { lang: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const langs = [
    {
      img: "/images/ru.svg",
      name: "Русский",
      code: "ru",
    },
    {
      img: "/images/en.svg",
      name: "English",
      code: "en",
    },
    {
      img: "/images/uz.svg",
      name: "Узбекский",
      code: "uz",
    },
    {
      img: "/images/china.svg",
      name: "中国人",
      code: "cn",
    },
  ];

  const cleanPath = pathname.replace(/^\/(ru|en|uz)/, "");

  const currentLang = langs.find((l) => l.code === lang);

  return (
    <div ref={ref} className={classes.btnContainer}>
      <div onClick={() => setOpen(!open)} className={classes.btn}>
        <div className={classes.langContent}>
          {currentLang && (
            <Image src={currentLang.img} width={17} height={13} alt={""} />
          )}
          <span data-v-2a94e252="" className={classes.dropDown}>
            <svg width="12" height="12" viewBox="0 0 48 48" fill="none">
              <path
                d="M22.5409 31.4437L10.5787 18.6839C9.97995 18.0453 10.4328 17 11.3082 17L36.6918 17C37.5672 17 38.0201 18.0453 37.4213 18.6839L25.4591 31.4437C24.6689 32.2865 23.3311 32.2865 22.5409 31.4437Z"
                fill="#757575"
                stroke="#757575"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </span>
        </div>
      </div>
      {open && (
        <div className={classes.langList}>
          {langs.map((lang) => (
            <Link
              href={`/${lang.code}${cleanPath}`}
              key={lang.name}
              onClick={() => {
                setOpen(false);
              }}
              className={classes.currencyItem}
            >
              <Image
                className={classes.langFlag}
                src={lang.img}
                alt="flag"
                width={17}
                height={13}
              />
              <div className={classes.currencyText}>{lang.name}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default LangBtn;
