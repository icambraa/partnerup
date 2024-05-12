import React, { useEffect, useState } from 'react';
import { Message } from '../../../interfaces/MessageInterface.tsx';

const MessagesPage = () => {
    const [messages, setMessages] = useState<Message[]>([]); // Usa la interfaz Message como tipo de estado

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/mensajes');
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                } else {
                    console.error('Error al obtener los mensajes:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener los mensajes:', error);
            }
        };
        fetchMessages();
    }, []);
    return (
        <div className="container mt-4">
            <h2>Mensajes</h2>
            <ul className="list-group">
                {messages.map(message => (
                    <li key={message.id} className="list-group-item">
                        <div><strong>De:</strong> {message.senderId}</div>
                        <div><strong>Para:</strong> {message.receiverId}</div>
                        <div><strong>Mensaje:</strong> {message.messageText}</div>
                        <div><strong>Fecha:</strong> {new Date(message.createdAt).toLocaleString()}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessagesPage;