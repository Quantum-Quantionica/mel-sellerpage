import { Outlet } from "react-router-dom";

export default function MainContent() {
  return <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
    <div className="content">
      <Outlet />
    </div>
  </div>;
}