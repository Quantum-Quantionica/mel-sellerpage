import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactNode } from "react";
import { MenuItem } from "../components/Header";
import EmptyPage from "../pages/EmptyPage";

interface AppRoutesProps {
  children: ReactNode;
  menus: MenuItem[]
}

export default function AppRoutes({ children, menus }: AppRoutesProps) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={children}>
        {menus.map(item => 
            <Route 
                index={item.link === '/'}
                element={item.page ?? <EmptyPage name={item.name} />}
                path={item.link}
                key={item.link}
            /> 
        )}
        </Route>
      </Routes>
    </Router>
  );
}