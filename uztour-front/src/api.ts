import { API } from "./http-client";
import { ErrorResponse, UserType } from "./types";

export const authUser = async ({
  email,
  isGuide,
}: {
  email: string;
  isGuide: number;
}) => {
  const response = await API.post<{ message: string }>(`/auth/request-code`, {
    email,
    type: isGuide ? "partner" : "customer",
  });
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
  const response = await API.get<{ data: { message: string } }>(
    `/users/profile`,
    {}
  );
  console.log(response);
};
