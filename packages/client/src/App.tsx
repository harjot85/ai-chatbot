import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Loading ....");

  useEffect(() => {
    fetch("/api/test")
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return <div className="font-bold text-2xl">{message}</div>;
}
export default App;
