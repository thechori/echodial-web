import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
//
import "./index.css";
import Landing from "./pages/landing";
import SignIn from "./pages/sign-in";
import Settings from "./pages/settings";
import StyleProvider from "./styles";
import store from "./store";
import ProtectedRoute from "./components/protected-route";

// import Dashboard from "./pages/dashboard";
// import Campaigns from "./pages/campaigns";
// import Leads from "./pages/leads";
// import StyleProvider from "./styles/index.ts";
// import Listings from "./pages/listings";
// import Robocall from "./pages/robocall";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <StyleProvider>
        <RouterProvider router={router} />
      </StyleProvider>
    </Provider>
  </React.StrictMode>
);
