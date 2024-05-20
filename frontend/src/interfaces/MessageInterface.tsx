export interface Message {
    id: number;
    senderId: string;
    receiverId: string;
    messageText: string;
    createdAt: string;
    slideOut?: boolean;
    read:boolean;
    anuncioId?: number;
}