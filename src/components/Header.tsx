import { useState } from "react";
import { Link } from "react-router-dom";

import './Header.css';
import Icon, { Icons } from './Icons';
import Home from "../pages/Home";
import MenuItem from "../app/MenuItemInterface";
import { useConfigs } from "../app/ConfigProvider";
import ProductsPage from "../pages/Product";
import ProductsProvider from "../data/products";
import WhoWeAre from "../pages/WhoWeAre";

export const menuItems: MenuItem[] = [
  { name: 'Home', link: '', icon: Icons.solid.faHouse, page: <Home /> },
  { name: 'Quem Somos', link: 'sobre', icon: Icons.solid.faBuilding, page: <WhoWeAre /> },
  // { name: 'Fale com a gente', link: 'fale-conosco', icon: Icons.solid.faHeadset },
  {
    name: 'Cursos', link: 'cursos', params: '/:id?', icon: Icons.solid.faChalkboardTeacher,
    page: <ProductsPage provider={new ProductsProvider('course')} title="Cursos" />
  },
  { 
    name: 'Consultas / Avaliações', params: '/:id?', link: 'atendimentos', icon: Icons.solid.faClipboardList,
    page: <ProductsPage provider={new ProductsProvider('appointment')} title="Consultas / Avaliações" />
  },
  {
    name: 'Livros / E-Books', params: '/:id?', link: 'livros', icon: Icons.solid.faBook,
    page: <ProductsPage provider={new ProductsProvider('book')} title="Livros" />
  },
  // { name: 'Videos', link: 'videos', params: '/:id?', icon: Icons.solid.faVideo },
  // { name: 'Indicações', link: 'indicacoes', icon: Icons.solid.faStar },
];

if(window.localStorage.getItem('admin') === 'true') {
  menuItems.push({
    name: 'Administração', link: 'admin', icon: Icons.solid.faTools, page: null
  });
}

export default function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const configs = useConfigs();
  const closeMenu = () => setMenuVisible(false);

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
    <div className={[menuVisible ? 'visible' : 'hidden', 'sidebar'].join(' ')}>
      <div className="closeArea" onClick={closeMenu} />
      <nav style={{
        backgroundColor: configs.headerBackgroundColor,
        color: configs.headerFontColor,
      }}>
        {menuItems.map(item =>
          <Link to={item.link} title={item.name} key={item.link} onClick={closeMenu}>
            <Icon icon={item.icon} color={configs.menuAssentColor || configs.headerAssentColor} />
            {item.name}
          </Link>
        )}
      </nav>
    </div>
  </>;
}