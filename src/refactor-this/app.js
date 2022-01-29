import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "./css/styles.css";

import NavBar from "./components/NavBar";
import AppRouter from "./router";

const App = () => (
  <BrowserRouter>
    <NavBar />
    <AppRouter />
  </BrowserRouter>
);

createRoot(document.getElementById("main-view")).render(<App />);
