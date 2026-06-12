import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./app";
import { BrowserRouter as Router } from "react-router-dom";
import { queryClient } from "./queryClient";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container element not found");
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  </React.StrictMode>,
);
