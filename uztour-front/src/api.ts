import { API } from "./http-client";
import { ErrorResponse, ResponseTour, TourType, UserType } from "./types";
import { Locale } from "./i18n-config";
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
}: {
  data: TourType;
  id?: string;
  availability: {
    date: string;
    total_slots: string;
    available_slots: string;
  }[];
  programsList: {
    title: string;
    description: string;
    photos: string[];
  }[];
  isSubmit?: boolean;
}) => {
  if (!id) {
    const response = await API.post<{ id: string }>(`/tours`, {
      title: data.title,
      status: isSubmit ? "moderation" : "not_complete",
      main_photo: data.poster,
      photos: data.gallery,
      city: data.cities,
      duration: data.duration ? data.duration : null,
      duration_unit: data.duration_unit,
      type: data.type,
      difficulty: data.difficulty,
      departure_city: data.departure_city,
      departure_time: data.departure_time,
      price: data.price ? data.price : null,
      child_price: data.child_price ? data.child_price : null,
      languages: data.languages,
      availability,
      days: programsList,
      included: data.included,
      excluded: data.excluded,
      description: data.description,
      departure_address: data.address,
      departure_landmark: data.orientation,
      departure_lat: data.selectedCordinates[0],
      departure_lng: data.selectedCordinates[1],
    });
    return response.data;
  } else {
    const response = await API.patch<{ id: string }>(`/tours/` + id, {
      title: data.title,
      status: isSubmit ? "moderation" : "not_complete",
      main_photo: data.poster,
      photos: data.gallery,
      city: data.cities,
      duration: data.duration ? data.duration : null,
      duration_unit: data.duration_unit,
      type: data.type,
      difficulty: data.difficulty,
      departure_city: data.departure_city,
      departure_time: data.departure_time,
      price: data.price ? data.price : null,
      child_price: data.child_price ? data.child_price : null,
      languages: data.languages,
      availability,
      days: programsList,
      included: data.included,
      excluded: data.excluded,
      description: data.description,
      departure_address: data.address,
      departure_landmark: data.orientation,
      departure_lat: data.selectedCordinates[0],
      departure_lng: data.selectedCordinates[1],
    });
    return response.data;
  }
};

export const getTours = async ({
  partner_id = undefined,
  limit,
  page,
}: {
  partner_id?: string;
  limit?: number;
  page?: number;
}) => {
  const response = await API.get<{
    tours: ResponseTour[];
    total: number;
  }>(`/tours`, {
    params: {
      partner_id,
      limit,
      page,
    },
  });
  return response.data;
};

export const getExactTours = async ({ id }: { id: string }) => {
  const response = await API.get<ResponseTour>(`/tours/${id}`);
  return response.data;
};

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
}: {
  tourId: string;
  date: string;
  name: string;
  phone: string;
  email: string;
  adultsCount: number;
  whatsapp: string;
  childrenCount: number;
  telegram: string;
}) {
  const response = await API.post<{ message: string }>(`/bookings`, {
    tour_id: tourId,
    tourDate: date,
    adultsCount: adultsCount,
    childrenCount: childrenCount,
    contactFullname: name,
    whatsapp: whatsapp,
    telegram: telegram,
    contactPhone: phone,
    contactEmail: email,
    currencyCode: "USD",
  });
  return response.data;
}
