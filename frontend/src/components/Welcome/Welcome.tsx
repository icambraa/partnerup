import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';
import logo from '../../assets/logo2-rojo.png';
import lolLogo from '../../assets/lol-logo.png';
import valorantLogo from '../../assets/V_Lockup_Vertical_Red.png';

const Welcome: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [showHeader, setShowHeader] = useState(false);

    const smoothScroll = (targetY: number) => {
        const startY = window.scrollY;
        const distance = targetY - startY;
        const duration = 100;
        let startTime: number | null = null;

        const step = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            window.scrollTo(0, startY + distance * progress);
            if (timeElapsed < duration) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    const handleScrollToSection = () => {
        if (sectionRef.current) {
            smoothScroll(sectionRef.current.offsetTop);
        }
    };

    const handleScroll = () => {
        if (window.scrollY > 200) {
            setShowHeader(true);
        } else {
            setShowHeader(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (showHeader) {
            handleScrollToSection();
        }
    }, [showHeader]);

    return (
        <div className="d-flex flex-column vh-100">
            {showHeader && (
                <header className={`fixed-top bg-light py-2 ${showHeader ? 'header-with-shadow' : ''}`}>
                    <div className="container d-flex justify-content-end">
                        <Link to="/registration" className="btn btn-primary me-2">Registrarse</Link>
                        <Link to="/login" className="btn btn-secondary">Iniciar sesión</Link>
                    </div>
                </header>
            )}
            <section className="flex-grow-1">
                <div className="container-fluid h-custom">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-9 col-lg-6 col-xl-6">
                            <img src={logo} className="img-fluid large-img" alt="Logo de Partner UP!"/>
                        </div>
                        <div className="col-md-6 col-lg-4 col-xl-3">
                            <div className="container mt-5">
                                <div className="flex-row justify-content-center">
                                    <Link to="/registration" className="btn btn-primary">Registrarse</Link>
                                    <button onClick={handleScrollToSection} className="btn btn-secondary mx-2">¿Qué es
                                        Partner UP!?
                                    </button>
                                </div>
                                <div className="text-start mt-2 large-text">
                                    <p className="letraPeq">¿Ya tienes una cuenta? <Link to="/login"
                                                                                         className="text-primary">Haz
                                        clic aquí</Link> para iniciar sesión.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div ref={sectionRef} className="container mt-5 py-5" style={{paddingTop: '5vw'}}>
                    <h2 className="text-center mb-5"
                        style={{fontWeight: 'bold', color: '#333333', fontSize: '4em'}}>¿Qué es Partner UP!?</h2>
                    <p className="large-text mb-5"
                       style={{fontSize: '1.2em', color: '#333', lineHeight: '1.5'}}>
                        Partner UP! es la plataforma ideal para encontrar compañeros de juego para tus partidas
                        competitivas. Ya sea que juegues a Valorant o League of Legends,
                        aquí encontrarás a los mejores compañeros para formar un duo imbatible.
                    </p>
                    <div className="d-flex justify-content-center mb-5">
                        <img src={lolLogo} alt="League of Legends" className="game-logo mx-2 rounded"/>
                        <img src={valorantLogo} alt="Valorant" className="game-logo mx-2 rounded"/>
                    </div>
                    <p className="large-text mb-5"
                       style={{fontSize: '1.2em', color: '#333', lineHeight: '1.5'}}>
                        Con Partner UP! puedes buscar y conectar con jugadores que compartan tu nivel de habilidad y tus
                        intereses. No importa si eres un principiante o un experto, nuestra plataforma te ayuda a
                        encontrar el compañero perfecto para tus partidas.
                    </p>
                    <p className="large-text mb-5"
                       style={{fontSize: '1.2em', color: '#333', lineHeight: '1.5'}}>
                        Regístrate ahora y empieza a formar tu equipo ideal. Únete a la comunidad de jugadores que ya
                        están disfrutando de una experiencia de juego mejorada con Partner UP!
                    </p>
                </div>
            </section>
            <footer className="bg-custom text-white text-center py-4" style={{marginTop: '60px'}}>
                <div>
                    Copyright © 2024. Partner UP! - Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
};

export default Welcome;
