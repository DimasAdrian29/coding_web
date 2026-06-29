import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./bootstrap";
import "../css/app.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/KonteksAuth";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ErrorBoundary>
                    <App />
                </ErrorBoundary>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
