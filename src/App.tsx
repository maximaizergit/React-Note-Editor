import React, { useState } from "react";
import NoteEditor from "./components/NoteEditor";
import NoteList from "./components/NoteList";
import TagFilter from "./components/TagFilter";
import { AppBar, Toolbar, Typography } from "@mui/material";

const App: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleFilterChange = (selectedTags: string[]) => {
    setSelectedTags(selectedTags);
  };

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6">
            Текстовый редактор заметок с тегами
          </Typography>
        </Toolbar>
      </AppBar>
      <NoteEditor />
      <TagFilter onFilterChange={handleFilterChange} />
      <NoteList selectedTags={selectedTags} />
    </div>
  );
};

export default App;
