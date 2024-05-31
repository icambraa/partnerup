import { UserProfile } from './UserProfileInterface';
import { RankInfo } from '../components/inside/SummonerDisplays/RankInfoDisplay';

export interface UserInfoSectionProps {
    userProfile: UserProfile;
    gameName: string;
    tagLine: string;
    rankInfo: RankInfo | null;
    setRankInfo: (rankInfo: RankInfo | null) => void;
}