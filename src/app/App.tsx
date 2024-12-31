import './App.css';
import AppRoutes from './AppRoutes';
import AdminApp, { menuItems as adminMenus } from '../admin/AdminApp';

import Header, { menuItems as appMenus } from '../components/Header';
import Carrosel from '../components/Carrosel';
import MainContent from '../components/MainContent';
import Footer from '../components/Footer';


function App() {
  return <AppRoutes routes={[
    { base: '/', routes: appMenus, rootElement: <>
      <Header />
      <Carrosel />
      <MainContent />
      <Footer />
    </>},
    { base: '/admin', routes: adminMenus, rootElement: <AdminApp /> },
  ]} />
}

export default App;
