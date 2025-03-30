import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../src/index.css";

import CreateUserForm from "../../src/components/createUserForm/CreateUserForm.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CreateUserForm />
  </StrictMode>
);