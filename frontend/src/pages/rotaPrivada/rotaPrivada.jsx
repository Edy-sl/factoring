import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

import { useNavigate } from 'react-router-dom';

export function PrivateRouter({ children }) {
    const navigate = useNavigate();

    const { autenticado } = useContext(AuthContext);

    if (autenticado) {
        return children;
    } else {
        navigate('/login');
    }
}
