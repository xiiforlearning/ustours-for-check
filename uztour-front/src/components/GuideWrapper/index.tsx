import { Locale } from "@/i18n-config";
import { Dict } from "@/types";
import classes from "./GuideWrapper.module.css";
import MenuGuide from "../MenuGuide";
import { Suspense } from "react";

function GuideWrapper({
  dict,
  lang,
  children,
}: {
  dict: Dict;
  lang: Locale;
  children: React.ReactNode;
}) {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.menuWrapper}>
          <Suspense>
            <MenuGuide dict={dict} lang={lang} />
          </Suspense>
        </div>
        <div className={classes.contentWrapper}>{children}</div>
      </div>
    </div>
  );
}

export default GuideWrapper;
