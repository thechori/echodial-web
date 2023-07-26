import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
//
import "./index.css";
import Landing from "./pages/landing";
import SignIn from "./pages/sign-in";
import TryL34ds from "./pages/try-l34ds";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";
import StyleProvider from "./styles";
import store from "./store";
import ProtectedRoute from "./components/protected-route";
import Header from "./components/header";
import routes from "./configs/routes";
import NotFound from "./pages/not-found";
import Dialer from "./pages/dialer";
import Sidebar from "./components/sidebar";
import Content from "./components/_common/Content";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <StyleProvider>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <BrowserRouter>
            <Header />
            <Content>
              <Sidebar />
              <Routes>
                <Route path={routes.landing} element={<Landing />} />
                <Route path={routes.signIn} element={<SignIn />} />
                <Route path={routes.tryL34ds} element={<TryL34ds />} />
                <Route
                  path={routes.dashboard}
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={routes.dialer}
                  element={
                    <ProtectedRoute>
                      <Dialer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={routes.settings}
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Content>
          </BrowserRouter>
        </MantineProvider>
      </StyleProvider>
    </Provider>
  </React.StrictMode>
);
