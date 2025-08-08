// import { ResponseTour } from "./types";

// export const excursions: ResponseTour[] = [
//   {
//     main_photo: "/images/excursion1.png",
//     rating: 4.7,
//     rating_count: 128,
//     type: "group",
//     title: "Тайны древней Бухары: путешествие сквозь века",
//     description:
//       "Откройте для себя скрытые сокровища 2000-летней истории Бухары. Мы пройдем по лабиринтам ее улиц, раскроем истории купцов Великого шелкового пути, средневековых ученых и легендарных правителей. Наши гиды оживят великолепную архитектуру и богатое культурное наследие города.",
//     departure_city: "bukhara",
//     languages: ["russian", "english", "uzbek"],
//     price: "520",
//     child_price: "450",
//     id: "1",
//     photos: [
//       "/images/excursion2.png",
//       "/images/excursion3.png",
//       "/images/excursion4.png",
//     ],
//     status: "active",
//     city: ["bukhara"],
//     duration: 2,
//     duration_unit: "days",
//     difficulty: "medium",
//     departure_time: "8:30",
//     availability: [
//       { date: "15.09.2025", total_slots: "15", available_slots: "8" },
//     ],
//     days: [
//       {
//         title: "Сердце Шелкового пути: исторический центр Бухары",
//         description:
//           "Начните свое путешествие с Ляби-Хауза, старинного центра общественной жизни, где когда-то отдыхали караваны. Посетите медресе Кукельдаш и торговые купола XVI века, где до сих пор продают специи и ковры.",
//         photos: ["/images/excursion5.png", "/images/excursion6.png"],
//       },
//     ],
//     excluded: ["Авиабилеты", "Обеды в ресторанах"],
//     included: ["Трансфер из отеля", "Услуги гида", "Входные билеты в музеи"],
//     partner: {
//       id: "1",
//       firstName: "Ислом",
//       lastName: "Абдуллаев",
//       about:
//         "Опытный гид с 10-летним стажем, специализирующийся на истории и культуре Узбекистана.",
//       partnerType: "individual",
//       avatar: "/images/guide.png",
//       companyName: "",
//       certificates: ["/images/certificate1.png", "/images/certificate2.png"],
//       yearsOfExperience: 10,
//       phone: "+998901234567",
//       spokenLanguages: ["russian", "english", "uzbek"],
//     },
//   },
//   {
//     partner: {
//       id: "1",
//       firstName: "Ислом",
//       lastName: "Абдуллаев",
//       about:
//         "Опытный гид с 10-летним стажем, специализирующийся на истории и культуре Узбекистана.",
//       partnerType: "individual",
//       avatar: "/images/guide.png",
//       companyName: "",
//       certificates: ["/images/certificate1.png", "/images/certificate2.png"],
//       yearsOfExperience: 10,
//       phone: "+998901234567",
//       spokenLanguages: ["russian", "english", "uzbek"],
//     },
//     main_photo: "/images/excursion7.png",
//     rating: 4.9,
//     rating_count: 95,
//     type: "private",
//     title: "Самарканд: сокровища Тамерлана",
//     description:
//       "Погрузитесь в величие эпохи Тимуридов, исследуя знаменитые голубые купола Самарканда. Вы увидите Регистан, мавзолей Гур-Эмир и обсерваторию Улугбека, узнаете тайны древней астрономии и искусства.",
//     departure_city: "samarkand",
//     languages: ["russian", "french"],
//     price: "750",
//     child_price: "600",
//     id: "2",
//     photos: ["/images/excursion8.png", "/images/excursion9.png"],
//     status: "active",
//     city: ["samarkand"],
//     duration: 8,
//     duration_unit: "hours",
//     difficulty: "easy",
//     departure_time: "10:00",
//     availability: [
//       { date: "20.08.2025", total_slots: "6", available_slots: "3" },
//     ],
//     days: [
//       {
//         title: "Жемчужина Востока: ансамбль Регистан",
//         description:
//           "Вас ждет подробная экскурсия по трем величественным медресе Регистана, где вы узнаете о системе образования XIV века и увидите уникальную мозаику, сохранившуюся до наших дней.",
//         photos: ["/images/excursion10.png"],
//       },
//     ],
//     excluded: ["Личные расходы", "Фото в национальных костюмах (платно)"],
//     included: ["Входные билеты", "Профессиональный гид", "Бутилированная вода"],
//   },
//   {
//     partner: {
//       id: "1",
//       firstName: "Ислом",
//       lastName: "Абдуллаев",
//       about:
//         "Опытный гид с 10-летним стажем, специализирующийся на истории и культуре Узбекистана.",
//       partnerType: "individual",
//       avatar: "/images/guide.png",
//       companyName: "",
//       certificates: ["/images/certificate1.png", "/images/certificate2.png"],
//       yearsOfExperience: 10,
//       phone: "+998901234567",
//       spokenLanguages: ["russian", "english", "uzbek"],
//     },
//     main_photo: "/images/excursion11.png",
//     rating: 4.5,
//     rating_count: 64,
//     type: "group",
//     title: "Горный поход в Чимган",
//     description:
//       "Отправьтесь в захватывающий треккинг по живописным склонам Чимганских гор. Насладитесь свежим воздухом, кристально чистыми ручьями и панорамными видами, которые открываются с высоты.",
//     departure_city: "tashkent",
//     languages: ["russian", "english"],
//     price: "350",
//     child_price: "300",
//     id: "3",
//     photos: ["/images/excursion12.png", "/images/excursion13.png"],
//     status: "active",
//     city: ["tashkent"],
//     duration: 1,
//     duration_unit: "days",
//     difficulty: "hard",
//     departure_time: "7:00",
//     availability: [
//       { date: "12.09.2025", total_slots: "12", available_slots: "5" },
//     ],
//     days: [
//       {
//         title: "Восхождение на пик Большой Чимган",
//         description:
//           "Наш маршрут пролегает через альпийские луга и хвойные леса к вершине, откуда открывается вид на всю долину. По пути гид расскажет о местной флоре и фауне.",
//         photos: ["/images/excursion14.png"],
//       },
//     ],
//     excluded: ["Аренда снаряжения", "Обед (можно взять с собой)"],
//     included: [
//       "Трансфер из Ташкента",
//       "Сопровождение инструктора",
//       "Чай на привале",
//     ],
//   },
//   {
//     partner: {
//       id: "1",
//       firstName: "Ислом",
//       lastName: "Абдуллаев",
//       about:
//         "Опытный гид с 10-летним стажем, специализирующийся на истории и культуре Узбекистана.",
//       partnerType: "individual",
//       avatar: "/images/guide.png",
//       companyName: "",
//       certificates: ["/images/certificate1.png", "/images/certificate2.png"],
//       yearsOfExperience: 10,
//       phone: "+998901234567",
//       spokenLanguages: ["russian", "english", "uzbek"],
//     },
//     main_photo: "/images/excursion15.png",
//     rating: 4.8,
//     rating_count: 112,
//     type: "private",
//     title: "Гастрономический тур по Ташкенту",
//     description:
//       "Попробуйте настоящую узбекскую кухню в лучших чайханах и ресторанах города. От плова и мантов до редких региональных деликатесов – этот тур раскроет вкусовые традиции Узбекистана.",
//     departure_city: "tashkent",
//     languages: ["russian", "spanish"],
//     price: "420",
//     child_price: "350",
//     id: "4",
//     photos: [
//       "/images/excursion16.png",
//       "/images/excursion17.png",
//       "/images/excursion1.png",
//     ],
//     status: "active",
//     city: ["tashkent"],
//     duration: 4,
//     duration_unit: "hours",
//     difficulty: "easy",
//     departure_time: "18:00",
//     availability: [
//       { date: "05.10.2025", total_slots: "8", available_slots: "2" },
//     ],
//     days: [
//       {
//         title: "Вечер вкусов: от базара до чайханы",
//         description:
//           "Мы начнем с дегустации свежих лепешек и сухофруктов на Чорсу базаре, затем попробуем разные виды плова в аутентичном ресторане, а завершим вечер чаепитием с традиционными сладостями.",
//         photos: ["/images/excursion2.png"],
//       },
//     ],
//     excluded: ["Алкогольные напитки"],
//     included: ["Все дегустации", "Услуги гида", "Чай/кофе"],
//   },
//   {
//     partner: {
//       id: "1",
//       firstName: "Ислом",
//       lastName: "Абдуллаев",
//       about:
//         "Опытный гид с 10-летним стажем, специализирующийся на истории и культуре Узбекистана.",
//       partnerType: "individual",
//       avatar: "/images/guide.png",
//       companyName: "",
//       certificates: ["/images/certificate1.png", "/images/certificate2.png"],
//       yearsOfExperience: 10,
//       phone: "+998901234567",
//       spokenLanguages: ["russian", "english", "uzbek"],
//     },
//     main_photo: "/images/excursion3.png",
//     rating: 4.6,
//     rating_count: 87,
//     type: "group",
//     title: "Легенды Хивы: город-музей под открытым небом",
//     description:
//       "Хива – единственный полностью сохранившийся город Великого шелкового пути. Вы пройдете через древние ворота, поднимитесь на минарет Кальта-Минор и услышите легенды о хивинских ханах.",
//     departure_city: "khiva",
//     languages: ["russian", "german"],
//     price: "380",
//     child_price: "320",
//     id: "5",
//     photos: ["/images/excursion4.png", "/images/excursion5.png"],
//     status: "active",
//     city: ["khiva"],
//     duration: 6,
//     duration_unit: "hours",
//     difficulty: "medium",
//     departure_time: "9:30",
//     availability: [
//       { date: "28.08.2025", total_slots: "20", available_slots: "14" },
//     ],
//     days: [
//       {
//         title: "Ичан-Кала: за стенами старого города",
//         description:
//           "Экскурсия по внутренней крепости Ичан-Кала с посещением дворца Таш-Хаули, где вы увидите изразцовые дворы гарема и узнаете о жизни хивинской знати.",
//         photos: ["/images/excursion6.png"],
//       },
//     ],
//     excluded: ["Сувениры", "Фотосъемка в музеях (платно)"],
//     included: ["Входной билет в цитадель", "Экскурсовод"],
//   },
//   {
//     partner: {
//       id: "1",
//       firstName: "Ислом",
//       lastName: "Абдуллаев",
//       about:
//         "Опытный гид с 10-летним стажем, специализирующийся на истории и культуре Узбекистана.",
//       partnerType: "individual",
//       avatar: "/images/guide.png",
//       companyName: "",
//       certificates: ["/images/certificate1.png", "/images/certificate2.png"],
//       yearsOfExperience: 10,
//       phone: "+998901234567",
//       spokenLanguages: ["russian", "english", "uzbek"],
//     },
//     main_photo: "/images/excursion6.png",
//     rating: 4.3,
//     rating_count: 56,
//     type: "private",
//     title: "Ночная Бухара: минареты при лунном свете",
//     description:
//       "Уникальный тур по вечерней Бухаре, когда зажигаются тысячи огней, а древние памятники приобретают таинственное сияние. Вы услышите легенды о дервишах и посетите закрытые для дневных туристов места.",
//     departure_city: "bukhara",
//     languages: ["russian", "chinese"],
//     price: "670",
//     child_price: "550",
//     id: "6",
//     photos: ["/images/excursion7.png", "/images/excursion8.png"],
//     status: "active",
//     city: ["bukhara"],
//     duration: 3,
//     duration_unit: "hours",
//     difficulty: "easy",
//     departure_time: "20:00",
//     availability: [
//       { date: "10.09.2025", total_slots: "8", available_slots: "3" },
//     ],
//     days: [
//       {
//         title: "Тени прошлого: от Пои-Калян до Ляби-Хауза",
//         description:
//           "Ночная прогулка по подсвеченным площадям с рассказом о городских привидениях и забытых традициях. Включено посещение крыши медресе для панорамного вида.",
//         photos: ["/images/excursion9.png"],
//       },
//     ],
//     excluded: ["Ужин"],
//     included: ["Специальный доступ на закрытые объекты", "Фонарик в подарок"],
//   },
//   {
//     partner: {
//       id: "1",
//       firstName: "Ислом",
//       lastName: "Абдуллаев",
//       about:
//         "Опытный гид с 10-летним стажем, специализирующийся на истории и культуре Узбекистана.",
//       partnerType: "individual",
//       avatar: "/images/guide.png",
//       companyName: "",
//       certificates: ["/images/certificate1.png", "/images/certificate2.png"],
//       yearsOfExperience: 10,
//       phone: "+998901234567",
//       spokenLanguages: ["russian", "english", "uzbek"],
//     },
//     main_photo: "/images/excursion10.png",
//     rating: 4.9,
//     rating_count: 132,
//     type: "group",
//     title: "Пустыня Кызылкум: караванный путь к Аральскому морю",
//     description:
//       "Двухдневное сафари по следам древних караванов с ночевкой в юрточном лагере. Вы увидите высохшее дно Арала, встретите рассвет в пустыне и попробуете блюда кочевой кухни.",
//     departure_city: "nukus",
//     languages: ["russian", "english"],
//     price: "890",
//     child_price: "720",
//     id: "7",
//     photos: ["/images/excursion11.png", "/images/excursion12.png"],
//     status: "active",
//     city: ["nukus"],
//     duration: 2,
//     duration_unit: "days",
//     difficulty: "hard",
//     departure_time: "6:00",
//     availability: [
//       { date: "15.10.2025", total_slots: "10", available_slots: "4" },
//     ],
//     days: [
//       {
//         title: "Кладбище кораблей: трагедия Арала",
//         description:
//           "Драматичное путешествие к ржавеющим остовам рыболовных судов, оставшихся на песке бывшего моря. Гид расскажет об экологической катастрофе и жизни местных жителей.",
//         photos: ["/images/excursion13.png"],
//       },
//       {
//         title: "Звезды Кызылкума: ночь в юрте",
//         description:
//           "Ужин у костра под народные сказания, а после - наблюдение за Млечным Путем в одной из самых темных точек Евразии.",
//         photos: ["/images/excursion14.png"],
//       },
//     ],
//     excluded: ["Спальный мешок (можно арендовать)"],
//     included: [
//       "Проживание в юрте",
//       "3-разовое питание",
//       "Внедорожник с водителем",
//     ],
//   },
//   {
//     partner: {
//       id: "1",
//       firstName: "Ислом",
//       lastName: "Абдуллаев",
//       about:
//         "Опытный гид с 10-летним стажем, специализирующийся на истории и культуре Узбекистана.",
//       partnerType: "individual",
//       avatar: "/images/guide.png",
//       companyName: "",
//       certificates: ["/images/certificate1.png", "/images/certificate2.png"],
//       yearsOfExperience: 10,
//       phone: "+998901234567",
//       spokenLanguages: ["russian", "english", "uzbek"],
//     },
//     main_photo: "/images/excursion15.png",
//     rating: 4.4,
//     rating_count: 78,
//     type: "private",
//     title: "Мастер-класс: секреты узбекского плова",
//     description:
//       "Приготовьте настоящий ферганский плов под руководством потомственного повара. Вы узнаете о сортах риса, тонкостях казана и получите сертификат 'Пловмастера'.",
//     departure_city: "tashkent",
//     languages: ["russian", "japanese"],
//     price: "580",
//     child_price: "450",
//     id: "8",
//     photos: ["/images/excursion16.png"],
//     status: "active",
//     city: ["tashkent"],
//     duration: 5,
//     duration_unit: "hours",
//     difficulty: "medium",
//     departure_time: "10:00",
//     availability: [
//       { date: "03.11.2025", total_slots: "6", available_slots: "1" },
//     ],
//     days: [
//       {
//         title: "От базара до казана: полный цикл",
//         description:
//           "Сначала выберем мясо и овощи на рынке, затем освоим нарезку 'жульбен' и контроль температуры углей. В финале - торжественная дегустация с дехканским чаем.",
//         photos: ["/images/excursion17.png"],
//       },
//     ],
//     excluded: ["Алкоголь"],
//     included: ["Все ингредиенты", "Фартук на память", "Рецепт на 3 языках"],
//   },
//   {
//     partner: {
//       id: "1",
//       firstName: "Ислом",
//       lastName: "Абдуллаев",
//       about:
//         "Опытный гид с 10-летним стажем, специализирующийся на истории и культуре Узбекистана.",
//       partnerType: "individual",
//       avatar: "/images/guide.png",
//       companyName: "",
//       certificates: ["/images/certificate1.png", "/images/certificate2.png"],
//       yearsOfExperience: 10,
//       phone: "+998901234567",
//       spokenLanguages: ["russian", "english", "uzbek"],
//     },
//     main_photo: "/images/excursion1.png",
//     rating: 4.7,
//     rating_count: 91,
//     type: "group",
//     title: "Ферганская долина: шелк и керамика",
//     description:
//       "Тур по ремесленным мастерским, где сохранились технологии VIII века. Вы увидите ручное ткачество знаменитых хан-атласов, попробуете лепить кувшины по старинным образцам.",
//     departure_city: "fergana",
//     languages: ["russian"],
//     price: "620",
//     child_price: "500",
//     id: "9",
//     photos: ["/images/excursion2.png", "/images/excursion3.png"],
//     status: "active",
//     city: ["fergana"],
//     duration: 1,
//     duration_unit: "days",
//     difficulty: "easy",
//     departure_time: "7:30",
//     availability: [
//       { date: "22.09.2025", total_slots: "12", available_slots: "7" },
//     ],
//     days: [
//       {
//         title: "Город Риштана: рождение узора",
//         description:
//           "В мастерской шелкоткачей вам покажут, как из коконов получают нити, а затем создают сложнейшие узоры на деревянных станках. Возможность купить изделия без наценок.",
//         photos: ["/images/excursion4.png"],
//       },
//     ],
//     excluded: ["Материалы для мастер-класса (опционально)"],
//     included: ["Обед с ферганскими лепешками", "Трансфер между цехами"],
//   },
//   {
//     partner: {
//       id: "1",
//       firstName: "Ислом",
//       lastName: "Абдуллаев",
//       about:
//         "Опытный гид с 10-летним стажем, специализирующийся на истории и культуре Узбекистана.",
//       partnerType: "individual",
//       avatar: "/images/guide.png",
//       companyName: "",
//       certificates: ["/images/certificate1.png", "/images/certificate2.png"],
//       yearsOfExperience: 10,
//       phone: "+998901234567",
//       spokenLanguages: ["russian", "english", "uzbek"],
//     },
//     main_photo: "/images/excursion5.png",
//     rating: 5.0,
//     rating_count: 48,
//     type: "private",
//     title: "Вертолетный тур: Узбекистан с высоты",
//     description:
//       "Эксклюзивный облет главных достопримечательностей на частном вертолете. Вы увидите Гиссарскую крепость, Чарвакское водохранилище и предгорья Тянь-Шаня как на ладони.",
//     departure_city: "tashkent",
//     languages: ["russian", "arabic"],
//     price: "3200",
//     child_price: "2800",
//     id: "10",
//     photos: ["/images/excursion6.png", "/images/excursion7.png"],
//     status: "active",
//     city: ["tashkent"],
//     duration: 2,
//     duration_unit: "hours",
//     difficulty: "easy",
//     departure_time: "12:00",
//     availability: [
//       { date: "05.10.2025", total_slots: "4", available_slots: "0" },
//     ],
//     days: [
//       {
//         title: "Небесная прогулка: 150 км за 90 минут",
//         description:
//           "Маршрут включает пролет над древними крепостями, каньонами и цветущими долинами. Пилот сделает 2-3 посадки для фотосессий в живописных точках.",
//         photos: ["/images/excursion8.png"],
//       },
//     ],
//     excluded: ["Страховка (оформляется отдельно)"],
//     included: [
//       "Полный инструктаж",
//       "Шампанское после посадки",
//       "Видеозапись полета",
//     ],
//   },
// ];

export const cities = [
  "tashkent",
  "samarkand",
  "bukhara",
  "khiva",
  "shakhrisabz",
];

export const listType = ["typeExcursion", "individual", "group"];

export const converFirstLetterToUpperCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getDuration = (date1: Date, date2: Date) => {
  const from = new Date(date1);
  const to = new Date(date2);
  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);
  const diffTime = to.getTime() - from.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const langs = [
  "english",
  "russian",
  "chinese",
  "arabic",
  "german",
  "french",
  "spanish",
  "japanese",
];

export const YANDEX = "7fe61813-5a1f-42a7-8549-3641b268be1f";

export const currencies = [
  { value: "USD", label: "" },
  { value: "EUR", label: "EUR" },
  { value: "UZS", label: "UZS" },
  { value: "RMB", label: "RMB" },
];

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
