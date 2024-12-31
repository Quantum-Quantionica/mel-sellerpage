import { Outlet } from "react-router-dom";

export default function MainContent() {
  return <section>
    <h2>Main Content</h2>
    <Outlet />
  </section>;
}