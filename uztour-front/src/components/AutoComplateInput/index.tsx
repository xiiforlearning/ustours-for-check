import React, { useEffect, useRef } from "react";
import TextField from "../ui/TextField";

interface AutocompleteInputProps {
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
  value: string;
  setValue: (value: string) => void;
  placeHolder: string;
  label?: string;
  svg?: React.ReactNode;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  onPlaceSelected,
  value,
  setValue,
  placeHolder,
  label,
  svg,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    console.log(window.google);
    if (!window.google || !inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["establishment"],
        componentRestrictions: { country: "uz" },
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (place && onPlaceSelected) {
        onPlaceSelected(place);
      }
    });
  }, []);

  return (
    <TextField
      value={value}
      inputRef={inputRef}
      setValue={setValue}
      svg={svg}
      placeHolder={placeHolder}
      label={label}
    />
  );
};

export default AutocompleteInput;
