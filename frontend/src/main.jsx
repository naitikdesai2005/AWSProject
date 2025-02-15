// import React from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter as Router } from "react-router-dom";
// import App from "./App";
// import "./index.css";

// const container = document.getElementById("root");
// const root = createRoot(container);

// root.render(
//   <Router>
//     <App />
//   </Router>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { StoreContextProvider } from "./pages/context/StoreContext.jsx";
import 'primereact/resources/primereact.min.css';  // core styles
import 'primeicons/primeicons.css';  // icons
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme (or any theme you prefer)


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </BrowserRouter>
);
