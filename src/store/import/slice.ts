import { createSlice } from "@reduxjs/toolkit";

export const importSlice = createSlice({ 
    name: "import",
    initialState: { 
        allMapped: false,
        fileHeaders: [],
        fileRows: []
    }, 
    reducers: { 
        setAllMapped: (state, action) => { 
            state.allMapped = action.payload;
        },
        setFileHeaders: (state, action) => { 
            state.fileHeaders = action.payload;
        },
        setFileRows: (state, action) => { 
            state.fileRows = action.payload;
        }
    }
});
export const { setAllMapped, setFileHeaders, setFileRows } = importSlice.actions;
export default importSlice.reducer;