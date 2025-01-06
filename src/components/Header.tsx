import { useState } from "react";
import { Link } from "react-router-dom";

import './Header.css';
import Icon, { Icons } from './Icons';
import Home from "../pages/Home";
import MenuItem from "../app/MenuItemInterface";
import { useConfigs } from "../app/ConfigProvider";

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
  const [menuVisible, setMenuVisible] = useState(false);
  const configs = useConfigs();

  return <>
    <header style={{
      backgroundColor: configs.headerBackgroundColor,
      borderBottomColor: configs.headerAssentColor,
      color: configs.headerFontColor,
    }}>
      <div className="content" style={{
        borderColor: configs.headerAssentColor,
        backgroundColor: configs.headerBackgroundColor,
      }}>
        <Icon
          icon={Icons.solid.faBars} color={configs.headerAssentColor} size="xl"
          onClick={() => setMenuVisible(!menuVisible)} />
        <img src={configs.logo} alt="logo" height="90" />
        <Icon icon={Icons.solid.faSearch} color={configs.headerAssentColor} size="xl" />
      </div>
    </header>
    <div className={menuVisible ? 'visible' : 'hidden'}>
      <div className="closeArea" onClick={() => setMenuVisible(false)} />
      <nav>
        {menuItems.map(item =>
          <Link to={item.link} title={item.name} key={item.link}>
            <Icon icon={item.icon} color={configs.menuAssentColor || configs.headerAssentColor} />
            {item.name}
          </Link>
        )}
      </nav>
    </div>
  </>;
}