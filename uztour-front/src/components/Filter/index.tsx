"use client";
import { cities, langs, listType } from "@/consts";
import classes from "./Filter.module.css";
import { useEffect, useState } from "react";
import { Dict } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import Select, { SingleValue } from "react-select";

interface FilterOption {
  value: string;
  label: string;
  min?: number;
  max?: number;
}

interface FilterData {
  city: string;
  type: string;
  languages: string;
  price: string;
  duration: string;
  sort: string;
}

function Filter({ dict }: { dict: Dict }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterData, setFilterData] = useState<FilterData>({
    city: "",
    type: "",
    languages: "",
    price: "",
    duration: "",
    sort: "",
  });

  // Filter options
  const listCity = ["city", ...cities];
  const listPrice = [
    { label: dict["price"] || "Price", value: "", min: 0, max: 0 },
    { label: "0 - 35 USD", value: "0-35", min: 0, max: 35 },
    { label: "35-70 USD", value: "35-70", min: 35, max: 70 },
    { label: "70-120 USD", value: "70-120", min: 70, max: 120 },
    { label: `${dict["from2"] || "From"} 120 USD`, value: "120+", min: 120 },
  ];
  const listDuration = [
    { label: dict["duration"] || "Duration", value: "" },
    { label: `0-5 ${dict["hour"] || "hours"}`, value: "0-5" },
    { label: `5-12` + " " + dict["hour"] || "hours", value: "5-12" },
    ...Array.from({ length: 1 }, (_, i) => ({
      label: `${i + 2} ${dict["day"] || "days"}`,
      value: `${i + 2}`,
    })),
  ];
  // const listSort = [
  //   { label: dict["sort"] || "Sort", value: "" },
  //   { label: dict["fromPopular"] || "Popular", value: "popular" },
  //   { label: dict["fromCheap"] || "Price: Low to High", value: "price-asc" },
  //   {
  //     label: dict["fromExpensive"] || "Price: High to Low",
  //     value: "price-desc",
  //   },
  // ];
  const langsList = ["lang", ...langs];

  // Initialize filters from URL params
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setFilterData({
      city: params.city || "",
      type: params.type || "",
      languages: params.languages || "",
      price: params.price || "",
      duration: params.duration || "",
      sort: params.sort || "",
    });
  }, [searchParams]);

  // Update URL when filters change
  const updateUrlParams = (newFilters: Partial<FilterData>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or delete each filter parameter
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset pagination when filters change
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  // Handle filter changes
  const handleFilterChange = (
    key: keyof FilterData,
    value: string,
    defaultValue = ""
  ) => {
    const newValue = value !== defaultValue ? value : "";
    setFilterData((prev) => ({ ...prev, [key]: newValue }));
    updateUrlParams({ [key]: newValue });
  };

  // @ts-expect-error aaa
  const getLabel = (key: string) => dict[key] || key;

  // Current selected values
  const selectedCity = filterData.city || listCity[0];
  const selectedType = filterData.type || listType[0];
  const selectedLang = filterData.languages || langsList[0];
  const selectedPrice =
    listPrice.find((p) => p.value === filterData.price) || listPrice[0];
  const selectedDuration =
    listDuration.find((d) => d.value === filterData.duration) ||
    listDuration[0];
  // const selectedSort =
  //   listSort.find((s) => s.value === filterData.sort) || listSort[0];

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        {/* City Filter */}
        <Select
          options={listCity.map((city) => ({
            value: city,
            label: getLabel(city),
          }))}
          value={{ value: selectedCity, label: getLabel(selectedCity) }}
          onChange={(selected: SingleValue<FilterOption>) =>
            selected && handleFilterChange("city", selected.value, listCity[0])
          }
          placeholder={dict["city"] || "City"}
        />

        {/* Type Filter */}
        <Select
          options={listType.map((type) => ({
            value: type,
            label: getLabel(type),
          }))}
          value={{ value: selectedType, label: getLabel(selectedType) }}
          onChange={(selected: SingleValue<FilterOption>) =>
            selected && handleFilterChange("type", selected.value, listType[0])
          }
          // @ts-expect-error aaa
          placeholder={dict["type"] || "Type"}
        />

        {/* Language Filter */}
        <Select
          options={langsList.map((lang) => ({
            value: lang,
            label: getLabel(lang),
          }))}
          className={classes.price}
          value={{ value: selectedLang, label: getLabel(selectedLang) }}
          onChange={(selected: SingleValue<FilterOption>) =>
            selected &&
            handleFilterChange("languages", selected.value, langsList[0])
          }
          placeholder={dict["lang"] || "Language"}
        />

        {/* Price Filter */}
        <Select
          options={listPrice}
          value={selectedPrice}
          onChange={(selected: SingleValue<FilterOption>) =>
            selected && handleFilterChange("price", selected.value, "")
          }
          className={classes.price}
          placeholder={dict["price"] || "Price"}
        />
        <Select
          options={listDuration}
          value={selectedDuration}
          onChange={(selected: SingleValue<FilterOption>) =>
            selected && handleFilterChange("duration", selected.value, "")
          }
          placeholder={dict["duration"] || "Duration"}
        />
      </div>

      <div className={classes.right}>
        {/* Duration Filter */}

        {/* Sort Filter */}
        {/* <Select
          options={listSort}
          value={selectedSort}
          onChange={(selected: SingleValue<FilterOption>) =>
            selected && handleFilterChange("sort", selected.value, "")
          }
          placeholder={dict["sort"] || "Sort"}
        /> */}
      </div>
    </div>
  );
}

export default Filter;
