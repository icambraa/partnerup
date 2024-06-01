import React, { useState } from 'react';
import {Card, Container, Row, Col, Alert, Spinner} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserProfileStyles.css';
import { useFetchUserProfile } from './hooks/useFetchUserProfile';
import { useFetchMatchStats } from './hooks/useFetchMatchStats';
import UserInfoSection from './sections/UserInfoSection';
import MatchStatsSection from './sections/MatchStatsSection';
import {RankInfo} from "../../../utils/SummonerDisplays/RankInfoDisplay.tsx";

interface UserProfileComponentProps {
    riotnickname?: string;
}

const UserProfile: React.FC<UserProfileComponentProps> = ({ riotnickname }) => {
    const { userProfile, error: userProfileError, loading: userProfileLoading } = useFetchUserProfile(riotnickname);
    const { matchStats, error: matchStatsError, loading: matchStatsLoading } = useFetchMatchStats(userProfile?.riotnickname);
    const [rankInfo, setRankInfo] = useState<RankInfo | null>(null);

    if (userProfileError) {
        return <Alert variant="danger">Error: {userProfileError}</Alert>;
    }

    if (userProfileLoading || matchStatsLoading) {
        return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>;
    }

    if (!userProfile) {
        return null;
    }

    const [gameName, tagLine] = userProfile.riotnickname.split('#');

    return (
        <Container className="custom-margin-top">
            <Card className="custom-card">
                <Card.Header>
                    <h2>{userProfile.nombreusuario || 'Perfil de usuario'}</h2>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <UserInfoSection
                            userProfile={userProfile}
                            gameName={gameName}
                            tagLine={tagLine}
                            rankInfo={rankInfo}
                            setRankInfo={setRankInfo}
                        />
                        <Col lg={7}>
                            <MatchStatsSection
                                matchStats={matchStats}
                                error={matchStatsError}
                                loading={matchStatsLoading}
                                gameName={gameName}
                                tagLine={tagLine}
                            />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserProfile;