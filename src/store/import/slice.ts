import { createSlice } from "@reduxjs/toolkit";
import { HeaderObject } from "../../pages/import-leads/DummyProperties";

export type importSliceType = {
    allMapped: boolean,
    fileHeaders: [],
    fileRows: [],
    headersToProperties: HeaderObject[];
}

const initialState: importSliceType = {
    allMapped: false,
    fileHeaders: [],
    fileRows: [],
    headersToProperties: []
}
export const importSlice = createSlice({ 
    name: "import",
    initialState,
    reducers: { 
        setAllMapped: (state, action) => { 
            state.allMapped = action.payload;
        },
        setFileHeaders: (state, action) => { 
            state.fileHeaders = action.payload;
        },
        setFileRows: (state, action) => { 
            state.fileRows = action.payload;
        },
        setHeadersToProperties: (state, action) => {
            state.headersToProperties = action.payload;
        }
    }
});
export const { setAllMapped, setFileHeaders, setFileRows, setHeadersToProperties } = importSlice.actions;
export default importSlice.reducer;