import './App.css';
import AppRoutes from './AppRoutes';
import Header, { menuItems } from '../components/Header';
import Carrosel from '../components/Carrosel';
import MainContent from '../components/MainContent';
import Footer from '../components/Footer';

function App() {
  return <AppRoutes menus={menuItems}>
    <Header />
    <Carrosel />
    <MainContent />
    <Footer />
  </AppRoutes>;
}

export default App;
