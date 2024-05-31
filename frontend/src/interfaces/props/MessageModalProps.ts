
import React from "react";
import {Anuncio} from "../AnuncioInterface.ts";

export interface MessageModalProps {
    showMessageModal: boolean;
    setShowMessageModal: (show: boolean) => void;
    selectedAnuncio: Anuncio | null;
    messageText: string;
    setMessageText: (message: string) => void;
    handleMessageSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
