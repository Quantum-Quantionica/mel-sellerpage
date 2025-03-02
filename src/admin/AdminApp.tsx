import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import Icon, { Icons } from '../components/Icons';
import { configStorage } from "../main/configs/siteConfigs";
import ProductsProvider from "../main/data/products";
import MenuItem from "../main/MenuItemInterface";
import './AdminApp.css';
import AttendantsPage from "./pages/Attemdants/Attendants";
import ProductsPage from "./pages/Products";

export const menuItems: MenuItem[] = [
  { name: 'Atendentes', link: 'atendentes', params: '/:id?', icon: Icons.solid.faUserMd, page: <AttendantsPage /> },
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
  // { name: 'Videos', link: 'videos', icon: Icons.solid.faHeadset },
  // { name: 'Indicações', link: 'indicações', icon: Icons.solid.faChalkboardTeacher },
];

const auth = getAuth();
export default function AdminApp() {
  const location = useLocation();
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        configStorage.setItem('admin', 'true');
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  if (!user) {
    return (
      <div className="auth-page">
        <h1>Admin Login</h1>
        <button onClick={handleLogin}>Login with Google</button>
      </div>
    );
  }

  return <>
    <nav>
      <ul>
        {menuItems.map(item =>
          <li key={item.link} className={location.pathname.includes(item.link) ? 'active' : ''}>
            <Link to={item.link} title={item.name}>
              <Icon icon={item.icon} />
              {item.name}
            </Link>
          </li>
        )}
      </ul>
    </nav>
    <Outlet />
  </>;
}