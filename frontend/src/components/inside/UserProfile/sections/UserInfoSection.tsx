import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import IconProfileDisplay from '../../SummonerDisplays/IconProfileDisplay.tsx';
import RankInfoDisplay, { RankInfo } from '../../SummonerDisplays/RankInfoDisplay';
import WinRateDisplayCircle from '../../SummonerDisplays/WinRateDisplayCircle';
import { UserProfile as UserProfileInterface } from '../../../../interfaces/UserProfileInterface';
import { getRankIconUrl } from '../../../../utils/rankUtils';

interface UserInfoSectionProps {
    userProfile: UserProfileInterface;
    gameName: string;
    tagLine: string;
    rankInfo: RankInfo | null;
    setRankInfo: (rankInfo: RankInfo | null) => void;
}

const UserInfoSection: React.FC<UserInfoSectionProps> = ({ userProfile, gameName, tagLine, rankInfo, setRankInfo }) => {
    const rankIconUrl = rankInfo ? getRankIconUrl(rankInfo.tier) : '';

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
            <Row className="mb-3 mt-4">
                <Col>
                    {userProfile.email && <p><strong>Email:</strong> {userProfile.email}</p>}
                    {userProfile.rolprincipal &&
                        <p><strong>Rol Principal:</strong> {userProfile.rolprincipal}</p>}
                    {userProfile.region && <p><strong>Región:</strong> {userProfile.region}</p>}
                </Col>
            </Row>
        </Col>
    );
};

export default UserInfoSection;