import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNote, editNote, deleteNote, addNotes } from "../store/reducers";
import { RootState } from "../store/reducers"; // Добавлен импорт RootState
import {
  saveNotesToIndexedDB,
  getNotesFromIndexedDB,
} from "../IndexedDB/IndexedDBUtils";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
} from "@mui/material";

interface Note {
  id: number;
  text: string;
}

const NoteEditor: React.FC = () => {
  const [noteText, setNoteText] = useState("");
  const [editNoteId, setEditNoteId] = useState<number | null>(null);
  const dispatch = useDispatch();

  const notes = useSelector((state: RootState) => state.notes); // Используем RootState для типизации

  useEffect(() => {
    const fetchData = async () => {
      // Retrieve notes from local storage and update the Redux store
      const notesFromLocalStorage = await getNotesFromIndexedDB();
      if (notesFromLocalStorage) {
        // Dispatch an action to add the retrieved notes to the Redux store
        dispatch(addNotes(notesFromLocalStorage));
      }
    };
    fetchData();
  }, [dispatch]);

  const handleNoteSubmit = () => {
    if (noteText.trim() !== "") {
      if (editNoteId !== null) {
        // Если editNoteId не равно null, редактируем существующую заметку
        dispatch(editNote({ id: editNoteId, text: noteText }));
        setEditNoteId(null);
      } else {
        // создаем новую заметку
        const newNote: Note = { id: Date.now(), text: noteText };
        dispatch(addNote(newNote));
        console.log("saving");
        saveNotesToIndexedDB([newNote]);
      }
      setNoteText("");
    }
  };

  // Функция для создания тегов из текста заметки
  const createTagsFromText = (text: string) => {
    const words = text.split(" ");
    return words.filter((word) => word.startsWith("#"));
  };

  const handleEditNote = (id: number, text: string) => {
    setNoteText(text);
    setEditNoteId(id);
  };

  const handleDeleteNote = (id: number) => {
    dispatch(deleteNote(id));
  };

  // Функция для подсветки тегов в тексте заметки и отображения уникальных тегов
  const highlightTagsInText = (text: string) => {
    const words = text.split(" ");
    const uniqueTags = new Set<string>();

    words.forEach((word) => {
      if (word.startsWith("#")) {
        uniqueTags.add(word);
      }
    });

    if (uniqueTags.size === 0) {
      return <p></p>;
    }

    return (
      <div>
        <ul>
          {[...uniqueTags].map((tag) => (
            <li key={tag}>
              <span style={{ backgroundColor: "yellow" }}>{tag}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h2>Создание и редактирование заметок:</h2>
      <div className="input-container">
        <TextField
          label="Введите текст"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === " " && noteText.trim() !== "") {
              const tags = createTagsFromText(noteText);
              console.log("Созданные теги:", tags);
            }
          }}
          sx={{ width: "75%", marginRight: 1, marginLeft: 3 }}
        />
        <Button
          variant="contained"
          color="success"
          sx={{ height: "56px", width: "20%", marginRight: 1 }}
          endIcon={<SendIcon />}
          onClick={handleNoteSubmit}
        >
          {editNoteId !== null ? "Редактировать заметку" : "Добавить заметку"}
        </Button>
      </div>

      <div>
        <p>{highlightTagsInText(noteText)}</p>
      </div>
      <div>
        <h3>Список заметок:</h3>
        <ul>
          {notes.map((note) => (
            <Card sx={{ marginRight: 4 }} key={note.id} variant="outlined">
              <CardContent>
                <Typography>
                  {note.text}
                  {/* Добавляем Chip для отображения тегов */}
                  {createTagsFromText(note.text).map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      sx={{
                        backgroundColor: "blue", // Здесь можно указать нужный цвет фона
                        color: "white", // Цвет текста тега
                        margin: "2px", // Отступы вокруг тегов
                      }}
                    />
                  ))}
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ margin: 2, marginTop: 0, marginBottom: 1 }}
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditNote(note.id, note.text)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    size="small"
                    sx={{ marginTop: 0, marginBottom: 1 }}
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    Удалить
                  </Button>
                </Typography>
              </CardContent>
            </Card>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NoteEditor;
