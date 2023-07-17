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
            <div className="divGeral">
                <AuthProvider>
                    {factoring && autenticado && (
                        <div className="divPrincipalLeft">
                            <Menu />
                        </div>
                    )}
                </AuthProvider>

                <div className="divPrincipalRight">
                    <AuthProvider>
                        <Outlet />
                    </AuthProvider>
                </div>
            </div>
        </>
    );
}

export default App;
