import { Link, Outlet } from "react-router-dom";

import Icon, {  Icons } from '../components/Icons';
import MenuItem from "../app/MenuItemInterface";
import ProductsPage from "./pages/Products";

export const menuItems: MenuItem[] = [
  { name: 'Consultas / Avaliações', link: 'atendimentos', icon: Icons.solid.faClipboardList },
  { name: 'Cursos', link: 'cursos', params: '/:id?', icon: Icons.solid.faHouse, page: <ProductsPage /> },
  { name: 'Livros e Ebooks', link: 'livros', icon: Icons.solid.faBuilding },
  { name: 'Videos', link: 'videos', icon: Icons.solid.faHeadset },
  { name: 'Indicações', link: 'cursos', icon: Icons.solid.faChalkboardTeacher },
];

export default function AdminApp() {
  return <nav>
    <ul>
      {menuItems.map(item => 
        <li key={item.link}>
          <Link to={item.link} title={item.name}>
            <Icon icon={item.icon}/>
            {item.name}
          </Link>
        </li>
      )}
    </ul>
    <Outlet />
  </nav>;
}