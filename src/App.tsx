import React, { useEffect, useState } from "react";
import "./App.css";
import { db } from "./firebase";
import { collection, query, onSnapshot } from "firebase/firestore";

const App: React.FC = () => {
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
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

  return (
    <div className="App">
      {tasks.map((task) => (
        <h3>{task.title}</h3>
      ))}
    </div>
  );
};

export default App;
