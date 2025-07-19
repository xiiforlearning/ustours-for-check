import { Dict, ResponseTour } from "@/types";
import ProgramDay from "../ProgramDay";
import classes from "./DetailedInfo.module.css";
import { Locale } from "@/i18n-config";
function Detailed({
  lang,
  currentExcursion,
  dict,
}: {
  lang: Locale;
  currentExcursion: ResponseTour;
  dict: Dict;
}) {
  return (
    <div className={classes.detailed}>
      <h2 className={classes.title}>{dict["whatAwaitsYou"]}</h2>
      {currentExcursion.days.map((item, index) => (
        <ProgramDay
          dict={dict}
          index={index}
          lang={lang}
          key={item.title}
          {...item}
        />
      ))}
    </div>
  );
}

export default Detailed;
