import {Message} from "../MessageInterface.ts";
import {UserProfile} from "../UserProfileInterface.ts";


export interface MessageModalProps {
    showModal: boolean;
    handleCloseModal: () => void;
    selectedMessage: Message | null;
    userProfiles: { [key: string]: UserProfile };
    handleAccept: () => void;
    handleReject: () => void;
}