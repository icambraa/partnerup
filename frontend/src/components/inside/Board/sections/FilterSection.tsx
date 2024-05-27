import React from 'react';

interface FilterSectionProps {
    selectedRole: string | null | undefined;
    selectedRange: string | null | undefined;
    handleFilterChange: (id: string, value: string | undefined | null) => void;
    setShowModal: (show: boolean) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ selectedRole, selectedRange, handleFilterChange, setShowModal }) => {
    return (
        <div className="row align-items-center">
            <div className="col-auto">
                <div className="mt-5">
                    <div className="icon-container">
                        <img className={`role-icon all ${selectedRole === null ? 'selected' : ''}`}
                             src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-fill.png"
                             alt="Todos"
                             title="Cualquier rol"
                             onClick={() => handleFilterChange('rol', null)} />
                        <img className={`role-icon top-icon ${selectedRole === 'Top' ? 'selected' : ''}`}
                             src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png"
                             alt="Top"
                             title="Top"
                             onClick={() => handleFilterChange('rol', 'Top')} />
                        <img className={`role-icon mid-icon ${selectedRole === 'Mid' ? 'selected' : ''}`}
                             src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png"
                             alt="Mid"
                             title="Mid"
                             onClick={() => handleFilterChange('rol', 'Mid')} />
                        <img className={`role-icon jungle-icon ${selectedRole === 'Jungle' ? 'selected' : ''}`}
                             src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png"
                             alt="Jungle"
                             title="Jungle"
                             onClick={() => handleFilterChange('rol', 'Jungle')} />
                        <img className={`role-icon adc-icon ${selectedRole === 'ADC' ? 'selected' : ''}`}
                             src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png"
                             alt="ADC"
                             title="ADC"
                             onClick={() => handleFilterChange('rol', 'ADC')} />
                        <img className={`role-icon support-icon ${selectedRole === 'Support' ? 'selected' : ''}`}
                             src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png"
                             alt="Support"
                             title="Support"
                             onClick={() => handleFilterChange('rol', 'Support')} />
                    </div>
                </div>
            </div>
            <div className="col-auto">
                <div className="mt-5">
                    <div className="form-group">
                        <select className="form-select" id="rango" value={selectedRange || ''}
                                onChange={(e) => handleFilterChange('rango', e.target.value || null)}>
                            <option value="">Todos los rangos</option>
                            <option value="Hierro">Hierro</option>
                            <option value="Bronce">Bronce</option>
                            <option value="Plata">Plata</option>
                            <option value="Oro">Oro</option>
                            <option value="Platino">Platino</option>
                            <option value="Diamante">Diamante</option>
                            <option value="Master">Master</option>
                            <option value="Grandmaster">Grandmaster</option>
                            <option value="Challenger">Challenger</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="col-auto" style={{ marginLeft: 'auto', marginRight: '50px' }}>
                <div className="mt-5">
                    <div className="icon-container">
                        <button type="button" className="btn btn-primary my-2" onClick={() => setShowModal(true)}>
                            Anunciarse
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSection;
