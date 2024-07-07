import Header from './pages/Header';
import Footer from './pages/Footer';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className='min-h-screen w-full min-w-96'>
      <Header/>
        <Outlet/>
      <Footer/>
    </div>
  )
}

export default App;