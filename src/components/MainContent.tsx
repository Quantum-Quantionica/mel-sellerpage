import { Outlet } from "react-router-dom";

export default function MainContent() {
  return <div style={{ flex: 1 }}>
    <h2>Main Content</h2>
    <Outlet />
  </div>;
}