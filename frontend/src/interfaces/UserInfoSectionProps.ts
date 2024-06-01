import { UserProfile } from './UserProfileInterface';
import { RankInfo } from '../utils/SummonerDisplays/RankInfoDisplay';

export interface UserInfoSectionProps {
    userProfile: UserProfile;
    gameName: string;
    tagLine: string;
    rankInfo: RankInfo | null;
    setRankInfo: (rankInfo: RankInfo | null) => void;
}