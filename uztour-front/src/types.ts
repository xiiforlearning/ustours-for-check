import { ImageListType } from "react-images-uploading";
import { getDictionary } from "./get-dictionary";

export interface UserType {
  access_token: string;
  user: {
    email: string;
    id: string;
    isEmailVerified: boolean;
    type: "customer" | "partner";
  };
}
export type ErrorResponse = {
  message: string;
  error: string;
  statusCode: number;
};

export interface ExcursionType {
  name: string;
  image: string;
  rating: number;
  ratingCount: number;
  isIndividual: boolean;
  from: string;
  languages: string;
  price: number;
  forPerson: boolean;
  priceWithoutDiscount: number;
  id: number;
  images: string[];
}

export interface GuideSubmitData {
  name: string;
  lastName: string;
  phone: string;
  isCompany: boolean;
  companyName: string;
}

export interface PartnerType {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  partnerType: "individual" | "company";
  companyName: string;
  spokenLanguages: null | string[];
  certificates: null | string[];
  avatar: null | string;
  yearsOfExperience: number | null;
  about: string | null;
  whatsapp: string | null;
  telegram: string | null;
}

export interface GuideDataType {
  id: string;
  email: string;
  partner: PartnerType;
}

export type Dict = Awaited<ReturnType<typeof getDictionary>>;

export interface TypeProgram {
  name: string;
  description: string;
  images: ImageListType;
  photos: string[];
}

export interface TourType {
  title: string;
  duration: string;
  price: string;
  child_price: string;
  whole_price: string; // Добавляем поле для цены за всю экскурсию
  min_persons: string; // Добавляем поле для минимального количества человек
  max_persons: string; // Добавляем поле для максимального количества человек
  category?: string; // Добавляем поле для категории тура
  description: string;
  included: string[];
  excluded: string[];
  orientation: string;
  address: string;
  selectedCordinates: number[];
  poster: string;
  gallery: string[];
  cities: string[];
  duration_unit: "hours" | "days";
  type: "private" | "group";
  difficulty: "easy" | "medium" | "hard";
  departure_city: string;
  departure_time: string;
  languages: string[];
}

export interface ResponseTour {
  id: string;
  title: string;
  status: string;
  main_photo: string;
  photos: string[];
  city: string[];
  duration: number;
  duration_unit: "hours" | "days";
  type: "private" | "group";
  difficulty: "easy" | "medium" | "hard";
  departure_city: string;
  departure_time: string;
  departure_landmark: string;
  departure_lat: number;
  departure_lng: number;
  departure_address: string;
  price: string;
  child_price: string;
  languages: string[];
  availability: {
    date: string;
    total_slots: string;
    available_slots: string;
  }[];
  days: {
    title: string;
    description: string;
    photos: string[];
  }[];
  excluded: string[];
  included: string[];
  description: string;
  rating?: number;
  rating_count?: number;
  group_price: number;
  max_persons: number;
  min_persons: number;
  category?: string;
  partner: {
    about: string;
    avatar: string;
    certificates: string[];
    companyName: string;
    firstName: string;
    id: string;
    lastName: string;
    partnerType: "individual" | "company";
    phone: string;
    yearsOfExperience: number;
    spokenLanguages: string[];
  };
}
