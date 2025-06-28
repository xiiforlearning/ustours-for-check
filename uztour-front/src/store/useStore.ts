import { create } from "zustand";

import { createUserSlice, UserState } from "./slices";

type StoreState = UserState;

const useStore = create<StoreState>()((...set) => ({
  ...createUserSlice(...set),
}));
export default useStore;
