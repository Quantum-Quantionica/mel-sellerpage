import { Link } from "react-router-dom";

import Icon, { Icons } from './Icons';
import logo from '../images/logo.svg';

import Home from "../pages/Home";
import MenuItem from "../app/MenuItemInterface";

export const menuItems: MenuItem[] = [
  { name: 'Home', link: '', icon: Icons.solid.faHouse, page: <Home /> },
  { name: 'Quem Somos', link: 'sobre', icon: Icons.solid.faBuilding },
  { name: 'Fale com a gente', link: 'fale-conosco', icon: Icons.solid.faHeadset },
  { name: 'Cursos', link: 'cursos', params: '/:id?', icon: Icons.solid.faChalkboardTeacher },
  { name: 'Consultas / Avaliações', link: 'atendimentos', icon: Icons.solid.faClipboardList },
  { name: 'Livros / E-Books', link: 'livros', icon: Icons.solid.faBook },
  { name: 'Videos', link: 'videos', params: '/:id?', icon: Icons.solid.faVideo },
  { name: 'Indicações', link: 'indicacoes', icon: Icons.solid.faStar },
];

export default function Header() {
  return <header>
    <button>Menu</button>
    <nav>
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
    </nav>
    <img src={logo} alt="logo" width="50" />
    <input type="text" placeholder="Search" />
  </header>;
}