import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Board: React.FC = () => {
    return (
        <section className="content">
            <div className="container">
                <div className="table-responsive">
                    <table className="table table-bordered table-dark table-striped table-borderless">
                        <thead>
                        <tr>
                            <th className="text-center">Riot nickname</th>
                            <th className="text-center">Rol</th>
                            <th className="text-center">Rango</th>
                            <th className="text-center">-</th>
                            <th className="text-center">-</th>
                            <th className="text-center">-</th>
                            <th className="text-center">-</th>
                            <th className="text-center">Comentario</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* <tr>
                            <td>NombreJugador1</td>
                            <td>Top</td>
                            <td>E2</td>
                            <td><i className="bi bi-check-circle-fill"></i></td>
                            <td style={{ width: '50px' }}></td>
                            <td></td>
                            <td></td>
                            <td>Alguna nota</td>
                            <td>Ahora</td>
                        </tr> */}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default Board;