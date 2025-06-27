import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Header.css';

import { useConfigs } from "./ConfigProvider";
import { isAdmin } from "./configs/siteConfigs";
import ProductsProvider from "./data/products";
import MenuItem from "./MenuItemInterface";

import Icon, { Icons } from '../components/Icons';
import Home from "../pages/Home";
import ProductsPage from "../pages/Products";
import WhoWeAre from "../pages/WhoWeAre";

export const booksPageLink = 'livros';

const providers = {
  course: new ProductsProvider('course'),
  appointment: new ProductsProvider('appointment'),
  book: new ProductsProvider('book'),
  yinYang: new ProductsProvider('yin-yang'),
  meridians: new ProductsProvider('meridians'),
  evaluations: new ProductsProvider('evaluations'),
  therapeuticTechniques: new ProductsProvider('therapeutic-techniques'),
};

export const menuItems: MenuItem[] = [
  { name: 'Home', link: '', icon: Icons.solid.faHouse, page: <Home /> },
  { name: 'Quem Somos', link: 'sobre', icon: Icons.solid.faBuilding, page: <WhoWeAre /> },
  {
    name: 'Yin Yang', link: 'yin-yang', params: '/:id?', icon: Icons.solid.faYinYang,
    provider: providers.yinYang,
    page: <ProductsPage provider={providers.yinYang} title='Yin Yang' filter={{ category: 'Yin Yang' }} />,
  },
  {
    name: 'Meridianos', link: 'meridianos', params: '/:id?', icon: Icons.solid.faStream,
    provider: providers.meridians,
    page: <ProductsPage provider={providers.meridians} title='Meridianos' filter={{ category: 'Meridianos' }} />,
  },
  {
    name: 'Avaliações', link: 'avaliacoes', params: '/:id?', icon: Icons.solid.faClipboardCheck,
    provider: providers.evaluations,
    page: <ProductsPage provider={providers.evaluations} title='Avaliações' filter={{ category: 'Avaliações' }} />,
  },
  {
    name: 'Técnicas Terapêuticas', link: 'tecnicas-terapeuticas', params: '/:id?', icon: Icons.solid.faHands,
    provider: providers.therapeuticTechniques,
    page: <ProductsPage provider={providers.therapeuticTechniques} title='Técnicas Terapêuticas' filter={{ category: 'Técnicas Terapêuticas' }} />,
  },
  // { name: 'Fale com a gente', link: 'fale-conosco', icon: Icons.solid.faHeadset },
  {
    name: 'Cursos', link: 'cursos', params: '/:id?', icon: Icons.solid.faChalkboardTeacher,
    provider: providers.course,
    page: <ProductsPage provider={providers.course} title="Cursos" />
  },
  {
    name: 'Consultas & Avaliações', params: '/:id?', link: 'atendimentos', icon: Icons.solid.faClipboardList,
    provider: providers.appointment,
    page: <ProductsPage provider={providers.appointment} title="Consultas & Avaliações" />
  },
  {
    name: 'Livros & E-Books', params: '/:id?', link: booksPageLink, icon: Icons.solid.faBook,
    provider: providers.book,
    page: <ProductsPage provider={providers.book} title="Livros & E-Books" />
  },
  // { name: 'Videos', link: 'videos', params: '/:id?', icon: Icons.solid.faVideo },
  // { name: 'Indicações', link: 'indicacoes', icon: Icons.solid.faStar },
];

if (isAdmin) {
  menuItems.push({
    name: 'Administração', link: 'admin', icon: Icons.solid.faTools, page: null
  });
}

export default function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const configs = useConfigs();
  const closeMenu = () => setMenuVisible(false);

  return <>
    <header>
      <div className="content">
        <Icon
          icon={Icons.solid.faBars} color={configs.headerAssentColor} size="xl"
          onClick={() => setMenuVisible(!menuVisible)} />
        <img src={configs.logo} alt="logo" height="90" />
        <Icon icon={Icons.solid.faSearch} color={configs.headerAssentColor} size="xl" />
      </div>
    </header>
    <div className={[menuVisible ? 'visible' : 'hidden', 'sidebar'].join(' ')}>
      <div className="closeArea" onClick={closeMenu} />
      <nav>
        {menuItems.map(item => <MenuItemComponent key={item.link} item={item} close={closeMenu} />)}
      </nav>
    </div>
  </>;
}

interface MenuItemProps {
  item: MenuItem;
  close: () => void;
}

const MenuItemComponent = ({ item, close }: MenuItemProps) => {
  const configs = useConfigs();
  const [show, setShow] = useState(!item.provider || item.provider.hasItems());

  useEffect(() => {
    if(show || !item.provider) return;

    item.provider.countAll().then(() =>
      setShow(item.provider!.hasItems())
    );
  }, [item.provider, show]);

  return show && <Link to={item.link} title={item.name} key={item.link} onClick={close}>
    <Icon icon={item.icon} color={configs.menuAssentColor || configs.headerAssentColor} />
    {item.name}
  </Link>
}
