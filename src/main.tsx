import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Notifications } from "@mantine/notifications";
import * as Sentry from "@sentry/react";
//
import "./index.css";
import Landing from "./pages/landing";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import Faq from "./pages/faq";
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
import Leads from "./pages/leads";
import CallerIds from "./pages/caller-ids";
import Reports from "./pages/reports";
import Phases from "./pages/phases";
import Billing from "./pages/billing";

Sentry.init({
  dsn: "https://8cc56131e046a73c78d21f51eaa7d72b@o4505682068242432.ingest.sentry.io/4505682074140672",
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", "https:yourserver.io/api/"],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <StyleProvider>
          <Notifications />
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
              <Route path={routes.signUp} element={<SignUp />} />
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
                path={routes.faq}
                element={
                  <Layout>
                    <Faq />
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
                path={routes.leads}
                element={
                  <ProtectedRoute>
                    <AuthenticatedUserLayout>
                      <Leads />
                    </AuthenticatedUserLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={routes.callerIds}
                element={
                  <ProtectedRoute>
                    <AuthenticatedUserLayout>
                      <CallerIds />
                    </AuthenticatedUserLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={routes.reports}
                element={
                  <ProtectedRoute>
                    <AuthenticatedUserLayout>
                      <Reports />
                    </AuthenticatedUserLayout>
                  </ProtectedRoute>
                }
              />
              <Route path={routes.phases}>
                <Route
                  path={routes.phases}
                  element={
                    <ProtectedRoute>
                      <AuthenticatedUserLayout>
                        <Phases />
                      </AuthenticatedUserLayout>
                    </ProtectedRoute>
                  }
                />
                <Route path={`${routes.phases}/:phaseId`} />
              </Route>
              <Route
                path={routes.billing}
                element={
                  <ProtectedRoute>
                    <AuthenticatedUserLayout>
                      <Billing />
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
        </StyleProvider>
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
