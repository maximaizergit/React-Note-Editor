import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducers";
import Checkbox from "@mui/material/Checkbox";
import EastIcon from "@mui/icons-material/East";
import Button from "@mui/material/Button";

interface TagFilterProps {
  onFilterChange: (selectedTags: string[]) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ onFilterChange }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const notes = useSelector((state: RootState) => state.notes);

  // Функция для создания тегов из текста заметки
  const createTagsFromText = (text: string) => {
    const words = text.split(" ");
    return words.filter((word) => word.startsWith("#"));
  };

  // Получаем список всех доступных тегов из заметок
  const allTags = Array.from(
    new Set(notes.flatMap((note) => createTagsFromText(note.text)))
  );

  const handleTagChange = (tag: string) => {
    // Обновляем выбранные теги
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Обработчик фильтрации заметок по выбранным тегам
  const applyTagFilter = () => {
    onFilterChange(selectedTags);
  };

  return (
    <div>
      <h3>Фильтр по тегам:</h3>
      {allTags.map((tag) => (
        <label key={tag}>
          <Checkbox
            checked={selectedTags.includes(tag)}
            onChange={() => handleTagChange(tag)}
            sx={{ marginRight: 0, marginLeft: 3 }}
          />
          {tag}
        </label>
      ))}
      <Button
        variant="contained"
        endIcon={<EastIcon />}
        sx={{ marginLeft: 3 }}
        onClick={applyTagFilter}
      >
        Применить фильтр
      </Button>
    </div>
  );
};

export default TagFilter;
