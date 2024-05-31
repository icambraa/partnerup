import React from 'react';
import { Row, Col } from 'react-bootstrap';
import IconProfileDisplay from '../../SummonerDisplays/IconProfileDisplay.tsx';
import RankInfoDisplay from '../../SummonerDisplays/RankInfoDisplay';
import WinRateDisplayCircle from '../../SummonerDisplays/WinRateDisplayLShape.tsx';
import { getRankIconUrl } from '../../../../utils/rankUtils';
import '../UserProfileStyles.css';
import { UserInfoSectionProps } from '../../../../interfaces/UserInfoSectionProps';

const UserInfoSection: React.FC<UserInfoSectionProps> = ({ userProfile, gameName, tagLine, rankInfo, setRankInfo }) => {
    const rankIconUrl = rankInfo ? getRankIconUrl(rankInfo.tier) : '';

    const showAdditionalInfo = userProfile.email || userProfile.rolprincipal || userProfile.region;

    return (
        <Col lg={5}>
            <div className="profile-info-container">
                <Row className="align-items-center">
                    <Col md="auto" className="image-container">
                        <IconProfileDisplay
                            gameName={gameName}
                            tagLine={tagLine}
                            width="130px"
                            height="130px"
                            borderRadius="10%"
                        />
                    </Col>
                    <Col className="nickname-container">
                        <h5 className="nickname-text">{userProfile?.riotnickname || 'Sin apodo'}</h5>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {rankIconUrl && (
                                <>
                                    <img
                                        src={rankIconUrl}
                                        alt={rankInfo?.tier}
                                        style={{ width: '40px', height: '40px', marginRight: '10px' }}
                                    />
                                </>
                            )}
                            <RankInfoDisplay
                                gameName={gameName}
                                tagLine={tagLine}
                                onRankInfoChange={setRankInfo}
                            />
                        </div>
                    </Col>
                    <Col md="auto" className="circle-container">
                        <WinRateDisplayCircle
                            gameName={gameName}
                            tagLine={tagLine}
                        />
                    </Col>
                </Row>
            </div>
            {showAdditionalInfo && (
                <div className="profile-info-container mt-4 mb-3">
                    <Row>
                        <Col className="profile-details">
                            {userProfile.email && <p><strong>Email:</strong> {userProfile.email}</p>}
                            {userProfile.rolprincipal &&
                                <p><strong>Rol Principal:</strong> {userProfile.rolprincipal}</p>}
                            {userProfile.region && <p><strong>Región:</strong> {userProfile.region}</p>}
                        </Col>
                    </Row>
                </div>
            )}
        </Col>
    );
};

export default UserInfoSection;
