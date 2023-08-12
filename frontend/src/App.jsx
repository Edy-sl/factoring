import { Outlet } from 'react-router-dom';
import './App.css';
import { Menu } from './components/menu/menu';
import { AuthProvider } from './context/authContext';
import { useContext } from 'react';
import { AuthContext } from './context/authContext';

function App() {
    const { autenticado, factoring } = useContext(AuthContext);

    return (
        <>
            <div className="divPrincipaMenu">
                <AuthProvider>
                    {factoring && autenticado && (
                        <div className="">
                            <Menu />
                        </div>
                    )}
                </AuthProvider>

                <div className="divPrincipal">
                    <AuthProvider>
                        <Outlet />
                    </AuthProvider>
                </div>
            </div>
        </>
    );
}

export default App;
