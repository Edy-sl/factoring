import { Outlet } from 'react-router-dom';
import './App.css';
import { Menu } from './components/menu/menu';

function App() {
    return (
        <>
            <div className="divGeral">
                <div className="divPrincipalLeft">
                    <Menu />
                </div>
                <div className="divPrincipalRight">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default App;
