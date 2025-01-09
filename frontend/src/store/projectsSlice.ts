import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "../types/types";

interface ProjectsState {
  projects?: Project[];
}

const initialState: ProjectsState = {
  projects: undefined,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    clearProjects: (state) => {
      state.projects = undefined;
    },
  },
});

export const { setProjects, clearProjects } = projectsSlice.actions;

export default projectsSlice.reducer;
