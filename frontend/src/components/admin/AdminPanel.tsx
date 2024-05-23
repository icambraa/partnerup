import React from 'react';
import { Link } from 'react-router-dom';

const AdminPanel: React.FC = () => {
    return (
        <div>
            <h1>Panel de Administrador</h1>
            <ul>
                <li>
                    <Link to="/admin-panel/reports">Ver reportes</Link>
                </li>
            </ul>
        </div>
    );
};

export default AdminPanel;