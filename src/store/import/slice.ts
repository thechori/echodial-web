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
        initializeHeaderToProperties: (state, action) => {
            state.headersToProperties = action.payload;
        },

        setHeaderProperties: (state, action) => {
            const newProperty = action.payload.newProperty;
            const headerIndex = action.payload.headerIndex;
            if (newProperty) {
                state.headersToProperties[headerIndex].mapped = true;
              } else {
                state.headersToProperties[headerIndex].mapped = false;
              }
            state.headersToProperties[headerIndex].property = newProperty;
        },

        setExcludeCheckbox: (state, action) => {
            const checked = action.payload.checked;
            const headerIndex = action.payload.headerIndex;
            state.headersToProperties[headerIndex].excludeHeader = checked;
        }
    }
});
export const { setAllMapped, setFileHeaders, setFileRows, setHeaderProperties, initializeHeaderToProperties, setExcludeCheckbox } = importSlice.actions;
export default importSlice.reducer;