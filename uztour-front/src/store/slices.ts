import { UserType } from "@/types";
import { StateCreator } from "zustand";
export interface UserState {
  user: UserType | null | 0;
  setUser: (user: UserType | null | 0) => void;
}

export const createUserSlice: StateCreator<UserState> = (set) => ({
  user: 0,
  setUser: (user) => set({ user }),
});
