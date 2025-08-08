import { API } from "./http-client";
import { ErrorResponse, ResponseTour, TourType, UserType } from "./types";
import { Locale } from "./i18n-config";
import { cache } from "react";
const YANDEX = "AIzaSyBnjwmO6DLPoSChny0l-4yeJRoViEbbdhw";
type FullLocaleCode = "en-US" | "ru-RU" | "uz-UZ" | "zh-CN";
const languageMap = new Map<Locale, FullLocaleCode>([
  ["en", "en-US"],
  ["ru", "ru-RU"],
  ["uz", "uz-UZ"],
  ["cn", "zh-CN"],
]);

export const authUser = async ({
  email,
  isGuide,
  lang,
}: {
  email: string;
  isGuide: number;
  lang: Locale;
}) => {
  const response = await API.post<{ message: string }>(
    `/auth/request-code`,
    {
      email,
      type: isGuide ? "partner" : "customer",
    },
    {
      headers: {
        "Accept-Language": languageMap.get(lang) || "en-US",
      },
    }
  );
  return response.data;
};

export const verifyCode = async ({
  email,
  code,
  isGuide,
}: {
  email: string;
  code: string;
  isGuide: number;
}) => {
  type VerifyCodeResponse = UserType | ErrorResponse | { status: string };

  const response = await API.post<VerifyCodeResponse>(`/auth/verify-code`, {
    email,
    code,
    type: isGuide ? "partner" : "customer",
  });
  return response.data;
};

export const completeGuideData = async ({
  phone,
  name,
  lastName,
  isCompany,
  companyName,
  email,
}: {
  phone: string;
  name: string;
  lastName: string;
  isCompany: boolean;
  companyName: string;
  email: string;
}) => {
  const response = await API.post<{ message: string }>(
    "/auth/complete-profile",
    {
      phone,
      firstName: name,
      lastName,
      partnerType: isCompany ? "company" : "individual",
      companyName: companyName ? companyName : undefined,
      email,
    }
  );
  return response.data;
};

export const verifyPhone = async ({
  phone,
  email,
  smsCode,
}: {
  phone: string;
  email: string;
  smsCode: string;
}) => {
  type VerifyCodeResponse = UserType | ErrorResponse | { status: string };
  const response = await API.post<VerifyCodeResponse>(`/auth/verify-phone`, {
    phone,
    email,
    smsCode,
  });
  return response.data;
};

export const getUser = async () => {
  const response = await API.get<{ partner: { id: string } }>(
    `/users/profile`,
    {}
  );
  return response.data;
};

export const createTour = async ({
  data,
  id,
  availability,
  programsList,
  isSubmit,
  active,
  departure_address,
  departure_landmark,
  departure_lat,
  departure_lng,
}: {
  data: TourType;
  id?: string;
  availability: {
    date: string;
    total_slots: string;
    available_slots: string;
  }[];
  programsList: {
    description: string;
    photos: string[];
  }[];
  isSubmit?: boolean;
  active?: boolean;
  departure_address: string;
  departure_landmark: string;
  departure_lat: number;
  departure_lng: number;
}) => {
  if (!id) {
    const response = await API.post<{ id: string }>(`/tours`, {
      title: data?.title,
      status: isSubmit ? "moderation" : "not_complete",
      main_photo: data?.poster,
      photos: data?.gallery,
      city: data?.cities,
      duration: data?.duration ? data.duration : null,
      duration_unit: data?.duration_unit,
      type: data?.type,
      difficulty: data?.difficulty,
      departure_city: data?.departure_city,
      departure_time: data?.departure_time,
      price: data?.type === "group" ? data?.price : data?.whole_price,
      child_price: data?.type === "group" ? data?.child_price : 0,
      group_price: data?.type !== "group" ? data?.whole_price : 0,
      languages: data?.languages,
      availability,
      days: programsList,
      included: data?.included,
      excluded: data?.excluded,
      description: data?.description,
      departure_address: departure_address,
      departure_landmark: departure_landmark,
      departure_lat: departure_lat,
      departure_lng: departure_lng,
      max_persons: data?.max_persons,
      min_persons: data?.min_persons,
      // data: data?.category,
    });
    return response.data;
  } else {
    const response = await API.patch<{ id: string }>(`/tours/` + id, {
      title: data?.title,
      status: isSubmit ? "moderation" : active ? "active" : "not_complete",
      main_photo: data?.poster,
      photos: data?.gallery,
      city: data?.cities,
      duration: data?.duration ? data.duration : null,
      duration_unit: data?.duration_unit,
      type: data?.type,
      difficulty: data?.difficulty,
      departure_city: data?.departure_city,
      departure_time: data?.departure_time,
      price: data?.type === "group" ? data?.price : data?.whole_price,
      child_price: data?.type === "group" ? data?.child_price : 0,
      group_price: data?.type !== "group" ? data?.whole_price : 0,
      languages: data?.languages,
      availability,
      days: programsList,
      included: data?.included,
      excluded: data?.excluded,
      description: data?.description,
      departure_address: departure_address,
      departure_landmark: departure_landmark,
      departure_lat: departure_lat,
      departure_lng: departure_lng,
      max_persons: data?.max_persons,
      min_persons: data?.min_persons,
      // category:data?.category
    });
    return response.data;
  }
};

export const getTours = async ({
  partner_id = undefined,
  limit,
  sortOrder,
  page,
  city,
  date,
  type,
  minPrice,
  maxPrice,
  languages,
  minDuration,
  maxDuration,
}: // city,
// page,
// city,
// date,
// type,
// sortBy,
{
  partner_id?: string;
  limit?: number;
  page?: number;
  city?: string;
  date?: string;
  type?: string;
  sortBy?: "created_at" | "popularity";
  sortOrder?: "ASC" | "DESC";
  minPrice?: number;
  maxPrice?: number;
  languages?: string;
  minDuration?: number;
  maxDuration?: number;
}) => {
  const response = await API.get<{
    tours: ResponseTour[];
    total: number;
    totalPages: number;
  }>(`/tours`, {
    params: {
      partner_id,
      limit,
      sortOrder,
      page,
      city,
      date,
      type: type ? (type == "individual" ? "private" : "group") : undefined,
      minPrice,
      maxPrice,
      languages: languages,
      minDuration,
      maxDuration,
    },
  });
  return response.data;
};

export const getExactTours = cache(async ({ id }: { id: string }) => {
  const response = await API.get<ResponseTour>(`/tours/${id}`);
  return response.data;
});

export async function geocodeAddress(address: string) {
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    address
  )}&types=address&key=${YANDEX}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "OK")
    throw new Error(data.error_message || "Autocomplete failed");

  return data.predictions.map((item: any) => ({
    description: item.description,
    placeId: item.place_id,
  }));
}

export async function createBooking({
  tourId,
  date,
  adultsCount,
  name,
  phone,
  email,
  childrenCount,
  whatsapp,
  telegram,
  isGroup,
}: {
  tourId: string;
  date: string;
  name: string;
  phone: string | null;
  email: string;
  adultsCount: number;
  whatsapp: string | null;
  childrenCount: number | null;
  telegram: string | null;
  isGroup: boolean;
}) {
  const response = await API.post<{ message: string }>(`/bookings`, {
    tourId: tourId,
    tourDate: date,
    adultsCount: adultsCount,
    childrenCount: childrenCount,
    contactFullname: name,
    whatsapp: whatsapp,
    telegram: telegram,
    contactPhone: phone ? "+" + phone : null,
    contactEmail: email,
    isGroup: isGroup,
  });
  return response.data;
}

export const getBooking = async () => {
  const response = await API.get(`/bookings`, {
    params: {},
  });
  return response.data;
};
