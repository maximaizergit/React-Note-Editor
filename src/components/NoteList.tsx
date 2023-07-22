import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducers";
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

interface NoteListProps {
  selectedTags: string[];
}

const NoteList: React.FC<NoteListProps> = ({ selectedTags }) => {
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const notes = useSelector((state: RootState) => state.notes);

  const handleFilterChange = useCallback(
    (selectedTags: string[]) => {
      if (selectedTags.length === 0) {
        setFilteredNotes(notes); // Reset to all notes if no tags are selected
      } else {
        const filtered = notes.filter((note) =>
          selectedTags.some((tag) => note.text.includes(tag))
        );
        setFilteredNotes(filtered); // Set the filtered notes based on selected tags
      }
    },
    [notes]
  );
  // Обновление списка заметок при изменении выбранных тегов
  useEffect(() => {
    handleFilterChange(selectedTags);
  }, [selectedTags, notes, handleFilterChange]);
  function createTagsFromText(text: string) {
    const words = text.split(" ");
    return words.filter((word) => word.startsWith("#"));
  }

  return (
    <div>
      <h3>Список заметок:</h3>
      {filteredNotes.map((note) => (
        <Card
          sx={{ marginLeft: 4, marginRight: 4, marginBottom: 0, margintop: 0 }}
          key={note.id}
          variant="outlined"
        >
          <CardContent>
            <Typography>{note.text}</Typography>
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NoteList;
