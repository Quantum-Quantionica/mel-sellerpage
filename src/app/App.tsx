import './App.css';
import AppRoutes from './AppRoutes';
import AdminApp, { menuItems as adminMenus } from '../admin/AdminApp';

import Header, { menuItems as appMenus } from '../components/Header';
import MainContent from '../components/MainContent';
import Footer from '../components/Footer';
import ConfigProvider from './ConfigProvider';


function App() {
  return <AppRoutes routes={[
    { base: '/', routes: appMenus, rootElement: <ConfigProvider>
      <Header />
      <MainContent />
      <Footer />
    </ConfigProvider>},
    { base: '/admin', routes: adminMenus, rootElement: <AdminApp /> },
  ]} />
}

export default App;


