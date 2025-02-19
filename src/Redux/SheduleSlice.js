import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Տվյալների բեռնում backend-ից
export const fetchSchedule = createAsyncThunk("schedule/fetchSchedule", async () => {
    const response = await fetch("http://localhost:5000/get-schedule");
    const data = await response.json();
    
    // ✅ Համոզվում ենք, որ ստացված տվյալները ճիշտ են կառուցված
    if (!Array.isArray(data)) {
        console.error("Invalid schedule format received:", data);
        return [];
    }

    return data.map(day => ({
        day: day.day || "",
        periods: Array.isArray(day.periods) ? day.periods : [[], [], [], []]
    }));
});

// ✅ Տվյալների պահպանում backend-ում
export const saveSchedule = createAsyncThunk("schedule/saveSchedule", async (schedule) => {
    await fetch("http://localhost:5000/update-schedule", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ schedule }),
    });
});

const initialState = {
    schedule: [
        { day: "Երկուշաբթի", periods: [[], [], [], []] },
        { day: "Երեքշաբթի", periods: [[], [], [], []] },
        { day: "Չորեքշաբթի", periods: [[], [], [], []] },
        { day: "Հինգշաբթի", periods: [[], [], [], []] },
        { day: "Ուրբաթ", periods: [[], [], [], []] }
    ],
    loading: false,
};

const scheduleSlice = createSlice({
    name: "schedule",
    initialState,
    reducers: {
        updateClass: (state, action) => {
            const { dayIndex, periodIndex, subIndex, field, value } = action.payload;

            if (
                !state.schedule[dayIndex].periods || 
                !state.schedule[dayIndex].periods[periodIndex] || 
                !state.schedule[dayIndex].periods[periodIndex][subIndex]
            ) {
                console.error("Invalid update attempt: Missing schedule structure.");
                return;
            }

            state.schedule[dayIndex].periods[periodIndex][subIndex][field] = value;
        },

        // ✅ Ավելացնել դաս
        addClass: (state, action) => {
            const { dayIndex, periodIndex } = action.payload;
            console.log("pol",dayIndex)
            // Ստուգում, որ `periods`-ը գոյություն ունի
            if (!state.schedule[dayIndex].periods) {
                state.schedule[dayIndex].periods = [];
            }

            if (!state.schedule[dayIndex].periods[periodIndex]) {
                state.schedule[dayIndex].periods[periodIndex] = [];
            }

            state.schedule[dayIndex].periods[periodIndex].push({
                name: "",
                group: "",
                professor: "",
                audience: "",
            });
        },

        // ✅ Ջնջել դաս
        removeClass: (state, action) => {
            const { dayIndex, periodIndex, subIndex } = action.payload;
            if (
                state.schedule[dayIndex]?.periods &&
                state.schedule[dayIndex].periods[periodIndex]
            ) {
                state.schedule[dayIndex].periods[periodIndex].splice(subIndex, 1);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSchedule.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSchedule.fulfilled, (state, action) => {
              state.loading = false;
            
              if (!Array.isArray(action.payload)) {
                console.error("Invalid schedule format received:", action.payload);
                return;
              }
            
              state.schedule = action.payload.map(day => ({
                day: day.day || "",
                periods: Array.isArray(day.periods) ? day.periods : [[], [], [], []] // ✅ Նոր ֆիքս
              }))
              })
            
            .addCase(fetchSchedule.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { updateClass, addClass, removeClass } = scheduleSlice.actions;
export default scheduleSlice.reducer;
