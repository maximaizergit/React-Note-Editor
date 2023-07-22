import {
  createAction,
  createReducer,
  PayloadAction,
  combineReducers,
} from "@reduxjs/toolkit";

interface Note {
  id: number;
  text: string;
}

interface EditNotePayload {
  id: number;
  text: string;
}

// Добавление действий для добавления, редактирования и удаления заметок
export const addNote = createAction<Note>("ADD_NOTE");
export const editNote = createAction<EditNotePayload>("EDIT_NOTE");
export const deleteNote = createAction<number>("DELETE_NOTE");
export const addNotes = createAction<Note[]>("ADD_NOTES");

const notesReducer = createReducer<Note[]>([], (builder) => {
  builder
    .addCase(addNote, (state, action: PayloadAction<Note>) => {
      state.push(action.payload);
    })
    .addCase(addNotes, (state, action: PayloadAction<Note[]>) => {
      return action.payload;
    })
    .addCase(editNote, (state, action: PayloadAction<EditNotePayload>) => {
      const { id, text } = action.payload;
      const noteIndex = state.findIndex((note) => note.id === id);
      if (noteIndex !== -1) {
        state[noteIndex].text = text;
      }
    })
    .addCase(deleteNote, (state, action: PayloadAction<number>) => {
      const id = action.payload;
      return state.filter((note) => note.id !== id);
    });
});

const rootReducer = combineReducers({
  notes: notesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
