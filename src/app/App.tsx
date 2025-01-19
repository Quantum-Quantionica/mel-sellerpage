import './App.css';
import AppRoutes from './AppRoutes';
import AdminApp, { menuItems as adminMenus } from '../admin/AdminApp';

import Header, { menuItems as appMenus } from '../components/Header';
import MainContent from '../components/MainContent';
import Footer from '../components/Footer';
import { useConfigs } from './ConfigProvider';
import Icon, { Icons } from '../components/Icons';
import { useEffect, useState } from 'react';
import { registerWindowMoveEvent } from '../pages/Product';

function App() {
  const [floatingBottomMargin, setFloatingBottomMargin] = useState(0);
  const configs = useConfigs();

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (!footer) return;
      setFloatingBottomMargin(window.innerHeight - footer.getBoundingClientRect().top + 20);
    }
    return registerWindowMoveEvent(handleScroll);
  }, []);

  return <AppRoutes routes={[
    {
      base: '/', routes: appMenus, rootElement: <>
        <Header />
        <MainContent />
        <Footer />
        <a href={configs.whatsappLink} target='_blank' rel='noreferrer' className='whatszapp floating'>
          <Icon icon={Icons.brands.faWhatsapp} size='3x' />
        </a>
        {floatingBottomMargin > 20 && <style>{`
.floating {
    bottom: ${floatingBottomMargin}px !important;
}
      `}</style>}
      </>
    },
    { base: '/admin', routes: adminMenus, rootElement: <AdminApp /> },
  ]} />
}

export default App;


