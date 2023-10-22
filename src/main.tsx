import { StrictMode } from "react";
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
import Buckets from "./pages/buckets";
import Billing from "./pages/billing";
import CallHistory from "./pages/call-history";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password";
import AlphaDialerFab from "./pages/dialer/AlphaDialerFab";

Sentry.init({
  dsn: "https://dbc6c090143fce815721f48b790b3810@o4505859893231616.ingest.sentry.io/4505859896442880",
  integrations: [
    new Sentry.BrowserTracing({
      // TODO: update these values to be proper or remove
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
  <StrictMode>
    <Provider store={store}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <StyleProvider>
          <Notifications />
          <AlphaDialerFab />
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
                path={routes.forgotPassword}
                element={<ForgotPassword />}
              />
              <Route path={routes.resetPassword}>
                <Route path=":resetPasswordToken" element={<ResetPassword />} />
                <Route path="" element={<NotFound />} />
              </Route>
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
                path={routes.callHistory}
                element={
                  <ProtectedRoute>
                    <AuthenticatedUserLayout>
                      <CallHistory />
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
              <Route path={routes.buckets}>
                <Route
                  path={routes.buckets}
                  element={
                    <ProtectedRoute>
                      <AuthenticatedUserLayout>
                        <Buckets />
                      </AuthenticatedUserLayout>
                    </ProtectedRoute>
                  }
                />
                <Route path={`${routes.buckets}/:bucketId`} />
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
  </StrictMode>
);
