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
import routes from "./configs/routes";
import NotFound from "./pages/not-found";
import Dialer from "./pages/dialer";
import Features from "./pages/features";
import Pricing from "./pages/pricing";
import Layout from "./components/layouts/Layout";
import AuthenticatedUserLayout from "./components/layouts/AuthenticatedUserLayout";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <StyleProvider>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <BrowserRouter>
            <Routes>
              <Route
                path={routes.landing}
                element={
                  <Layout>
                    <Landing />
                  </Layout>
                }
              />
              <Route path={routes.signIn} element={<SignIn />} />
              <Route path={routes.tryL34ds} element={<TryL34ds />} />
              <Route
                path={routes.features}
                element={
                  <Layout>
                    <Features />
                  </Layout>
                }
              />
              <Route
                path={routes.pricing}
                element={
                  <Layout>
                    <Pricing />
                  </Layout>
                }
              />
              <Route
                path={routes.dashboard}
                element={
                  <ProtectedRoute>
                    <AuthenticatedUserLayout>
                      <Dashboard />
                    </AuthenticatedUserLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={routes.dialer}
                element={
                  <ProtectedRoute>
                    <AuthenticatedUserLayout>
                      <Dialer />
                    </AuthenticatedUserLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={routes.settings}
                element={
                  <ProtectedRoute>
                    <AuthenticatedUserLayout>
                      <Settings />
                    </AuthenticatedUserLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MantineProvider>
      </StyleProvider>
    </Provider>
  </React.StrictMode>
);
