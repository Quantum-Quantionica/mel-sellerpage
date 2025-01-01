import { Link, Outlet } from "react-router-dom";

import Icon, {  Icons } from '../components/Icons';
import MenuItem from "../app/MenuItemInterface";
import ProductsPage from "./pages/Products";
import ProductsProvider from "../data/products";

export const menuItems: MenuItem[] = [
  { 
    name: 'Consultas / Avaliações', link: 'atendimentos', params: '/:id?', icon: Icons.solid.faClipboardList,
    page: <ProductsPage provider={new ProductsProvider('appointment')} title="Cadastro de Consulta / Avaliações" name="Consulta" />
  },
  { 
    name: 'Cursos', link: 'cursos', params: '/:id?', icon: Icons.solid.faHouse,
    page: <ProductsPage provider={new ProductsProvider('course')} title="Cadastro de Cursos" name="Curso" />
  },
  { 
    name: 'Livros e Ebooks', link: 'livros', params: '/:id?', icon: Icons.solid.faBuilding,
    page: <ProductsPage provider={new ProductsProvider('book')} title="Cadastro de livros" name="Livro" />
  },
  { name: 'Videos', link: 'videos', icon: Icons.solid.faHeadset },
  { name: 'Indicações', link: 'indicações', icon: Icons.solid.faChalkboardTeacher },
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