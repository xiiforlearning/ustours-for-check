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

export type Dict = Awaited<ReturnType<typeof getDictionary>>;
