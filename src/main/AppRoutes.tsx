import { ReactNode, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";

import EmptyPage from "../pages/EmptyPage";
import { analytics, logEvent } from './configs/firebase';
import MenuItem from "./MenuItemInterface";

interface RoutesInfo {
  base: string;
  routes: MenuItem[];
  rootElement: ReactNode;
}

interface AppRoutesProps {
  routes: RoutesInfo[];
}

function AnalyticsListener() {
  const location = useLocation();

  useEffect(() => {
    logEvent(analytics, "page_view", {
      page_path: location.pathname,
    });
  }, [location]);

  return null;
}

export default function AppRoutes({ routes }: AppRoutesProps) {
  return (
    <Router>
      <AnalyticsListener />
      {routes.map(info =>
        <Routes key={info.base}>
          <Route path={info.base} element={info.rootElement} key={info.base}>
            {info.routes.map(item =>
              item.page !== null && <Route
                index={item.link === ''}
                element={item.page ?? <EmptyPage name={item.name} />}
                path={info.base + item.link + (item.params ?? '')}
                key={item.link}
              />
            )}
          </Route>
        </Routes>
      )}
    </Router>
  );
}