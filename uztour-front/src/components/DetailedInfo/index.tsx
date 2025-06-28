import ProgramDay from "../ProgramDay";
import classes from "./DetailedInfo.module.css";
function Detailed() {
  const data: {
    id: number;
    period: string;
    title: string;
    blocks: string[];
    photos: string[];
  }[] = [
    {
      id: 1,
      period: "1 День",
      title: "Прибытие и знакомство с Самаркандом",
      blocks: [
        "Встреча группы по адресу: г. Ташкент, Hilton  Hotel, ориентир: метро Бадамзар",
        "Трансфер на скоростном поезде «Афросиаб»",
        "Заселение в отель “ Wellness Park Hotel Bactria”",
        "Вечерняя прогулка по Регистану и ужин в национальном ресторане",
      ],
      photos: [
        "/images/program1.png",
        "/images/program2.png",
        "/images/program3.png",
        "/images/program4.png",
      ],
    },
    {
      id: 2,
      period: "2 День",
      title: "Архитектурные жемчужины  ",
      blocks: [
        "Встреча группы по адресу: г. Ташкент, Hilton  Hotel, ориентир: метро Бадамзар",
        "Трансфер на скоростном поезде «Афросиаб»",
        "Заселение в отель “ Wellness Park Hotel Bactria”",
        "Вечерняя прогулка по Регистану и ужин в национальном ресторане",
      ],
      photos: [
        "/images/program1.png",
        "/images/program2.png",
        "/images/program3.png",
        "/images/program4.png",
      ],
    },
    {
      id: 3,
      period: "3 День",
      title: "Культура и ремесла",
      blocks: [
        "Встреча группы по адресу: г. Ташкент, Hilton  Hotel, ориентир: метро Бадамзар",
        "Трансфер на скоростном поезде «Афросиаб»",
        "Заселение в отель “ Wellness Park Hotel Bactria”",
        "Вечерняя прогулка по Регистану и ужин в национальном ресторане",
      ],
      photos: [
        "/images/program1.png",
        "/images/program2.png",
        "/images/program3.png",
        "/images/program4.png",
      ],
    },
    {
      id: 4,
      period: "4 День",
      title: "Возвращение",
      blocks: [
        "Встреча группы по адресу: г. Ташкент, Hilton  Hotel, ориентир: метро Бадамзар",
        "Трансфер на скоростном поезде «Афросиаб»",
        "Заселение в отель “ Wellness Park Hotel Bactria”",
        "Вечерняя прогулка по Регистану и ужин в национальном ресторане",
      ],
      photos: [
        "/images/program1.png",
        "/images/program2.png",
        "/images/program3.png",
        "/images/program4.png",
      ],
    },
  ];
  return (
    <div className={classes.detailed}>
      <h2 className={classes.title}>Что вас ждёт</h2>
      {data.map((item) => (
        <ProgramDay key={item.id} {...item} />
      ))}
    </div>
  );
}

export default Detailed;
