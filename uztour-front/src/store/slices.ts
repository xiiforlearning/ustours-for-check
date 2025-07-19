import { UserType } from "@/types";
import { StateCreator } from "zustand";
export interface UserState {
  user: UserType | null | 0;
  setUser: (user: UserType | null | 0) => void;
  isProduction: boolean;
  setIsProduction: (isProduction: boolean) => void;
}

export const createUserSlice: StateCreator<UserState> = (set) => ({
  user: 0,
  setUser: (user) => set({ user }),
  isProduction: false,
  setIsProduction: (isProduction) => set({ isProduction }),
});
