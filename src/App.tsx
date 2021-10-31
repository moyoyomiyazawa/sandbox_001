import React, { useEffect, useState } from "react";
import "./App.css";
import { db } from "./firebase";
import { collection, query, onSnapshot, addDoc } from "firebase/firestore";
import { FormControl, TextField } from "@mui/material";
import { AddToPhotos } from "@mui/icons-material";
const App: React.FC = () => {
  type Task = {
    id: string;
    title: string;
  };

  const [tasks, setTasks] = useState<Task[]>([{ id: "", title: "" }]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const q = query(collection(db, "tasks"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setTasks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
        }))
      );
    });
    // onSnapshotの返り値がonSnapshotを停止する関数なので、クリーンナップ関数として設定することで、コンポーネントのアンマウント時にonSnapshotを停止できる
    return () => unsubscribe();
  }, []);

  const newTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await addDoc(collection(db, "tasks"), { title: input });
    setInput("");
  };

  return (
    <div className="App">
      <h1>Todo App by React/Firebase</h1>
      <FormControl>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="New Task?"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
        />
      </FormControl>
      <button disabled={!input} onClick={newTask}>
        <AddToPhotos />
      </button>

      {tasks.map((task) => (
        <h3 key={task.id}>{task.title}</h3>
      ))}
    </div>
  );
};

export default App;
