import { MatchDetails } from '../MatchDetailsInterface.ts';

export interface MatchStatsSectionProps {
    matchStats: MatchDetails[];
    error: string;
    loading: boolean;
    gameName: string;
    tagLine: string;
}
