import React from 'react';
import { AnuncioTableProps } from '../../../../interfaces/props/AnuncioTableProps.ts';
import AnuncioItem from './AnuncioItem.tsx';
import {Anuncio} from "../../../../interfaces/AnuncioInterface.ts";

const AnuncioTable: React.FC<AnuncioTableProps> = ({
                                                       anuncios,
                                                       currentUser,
                                                       handleOpenMessageModal,
                                                       handleDelete,
                                                       handleEdit,
                                                       handleOpenReportModal,
                                                       getRoleIconUrl,
                                                       getRankIconUrl,
                                                       timeSince
                                                   }) => {
    return (
        <table className="table table-bordered custom-table">
            <thead className="custom-dark-header">
            <tr>
                <th className="text-center"></th>
                <th className="text-center">Riot nickname</th>
                <th className="text-center winrate">Winrate</th>
                <th className="text-center">Rol</th>
                <th className="text-center">Busco rol</th>
                <th className="text-center">Busco rango</th>
                <th className="text-center">Comentario</th>
                <th className="text-center">Fecha de creación</th>
            </tr>
            </thead>
            <tbody>
            {anuncios.map((anuncio: Anuncio) => (
                <AnuncioItem
                    key={anuncio.id}
                    anuncio={anuncio}
                    currentUser={currentUser}
                    handleOpenMessageModal={handleOpenMessageModal}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    handleOpenReportModal={handleOpenReportModal}
                    getRoleIconUrl={getRoleIconUrl}
                    getRankIconUrl={getRankIconUrl}
                    timeSince={timeSince}
                />
            ))}
            </tbody>
        </table>
    );
};

export default AnuncioTable;
