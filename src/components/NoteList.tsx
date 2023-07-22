import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducers";
import { Card, CardContent, Typography, Chip } from "@mui/material";

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
        setFilteredNotes(notes); // вывод всех тегов записей если нет выбранного тега
      } else {
        const filtered = notes.filter((note) =>
          selectedTags.some((tag) => note.text.includes(tag))
        );
        setFilteredNotes(filtered); // вывод записей по тегам
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
            {createTagsFromText(note.text).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                sx={{
                  backgroundColor: "blue",
                  color: "white",
                  margin: "2px",
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
