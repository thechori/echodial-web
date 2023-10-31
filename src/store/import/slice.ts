import { createSlice } from "@reduxjs/toolkit";

export const importSlice = createSlice({ 
    name: "import",
    initialState: { 
        allMapped: false
    }, 
    reducers: { 
        setAllMapped: (state, action) => { 
            state.allMapped = action.payload;
        }
    }
});
export const { setAllMapped } = importSlice.actions;
export default importSlice.reducer;