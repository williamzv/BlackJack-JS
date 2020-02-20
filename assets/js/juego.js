/**
* 2C = Two of Clubs - Dos de Treboles
* 2D = Two of Diamonds - Dos de Diamantes
* 2H = Two of Hearts - Dos de Corazones
* 2S = Two of Spades - Dos de Espadas
**/

// Patrón Modulo
const miModulo = (() => {
    'use strict'

    let deck = [];
    const tipos      = ['C','D','H','S'],
          especiales = ['A','J','Q','K'];
    
    let puntosJugadores = [];
    
    // Referencias del HTML
    const btnNuevo       = document.querySelector('#btnNuevo'),
          btnPedir       = document.querySelector('#btnPedir'),
          btnDetener     = document.querySelector('#btnDetener'),
          ptsJugador     = document.querySelector('#PtsJugador'),
          ptsComputadora = document.querySelector('#PtsComputadora'),
          divCartasJugadores = document.querySelectorAll('.divCartas');

    const inicializaJuego = ( numJugadores = 2 ) => {
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        activarBtns();
        ptsJugador.innerHTML = 0;
        ptsComputadora.innerHTML = 0;
        divCartasJugadores.forEach(element => {
            element.innerHTML = '';
        });
    };
    
    
    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (const tipo of tipos) {
                deck.push(i+tipo);
            }
        }
        for (const especial of especiales) {
            for (const tipo of tipos) {
                deck.push(especial+tipo);
            }
        }
        return _.shuffle(deck);
    };
    
    const pedirCarta = () => {
        if (deck.length===0) {
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    };
    
    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length-1);
        return isNaN(valor) ? (valor==='A') ? 11 : 10 : valor * 1;
    };
    
    const desactivarBtns = () => {
        btnDetener.disabled = true;
        btnPedir.disabled = true
    };
    
    const activarBtns = () => {
        btnDetener.disabled = false;
        btnPedir.disabled = false
    };
    
    
    btnNuevo.addEventListener('click', () => {
        inicializaJuego(2); // 2 jugadores
    });
    
    // Eventos

    // Jugador: 0 = primer jugador y el último será la computadora
    const acumularPuntos = ( carta, jugador ) => {
        puntosJugadores[jugador] += valorCarta(carta);
        return puntosJugadores[jugador];
    };


    const crearCarta = ( carta, jugador ) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[jugador].append(imgCarta);
    };

    const evaluarGanador = (ptosMin, jugador) => {
        setTimeout(() => {
            if (puntosJugadores[jugador] === ptosMin ) {
                alert('Juego empatado!');
            } else if (ptosMin > 21) {
                alert('Computadora Gana!');
            } else if (puntosJugadores[jugador] > 21) {
                alert('Jugador Gana!');
            } else {
                alert('Computadora Gana!');
            } 
        }, 500);
    };

    // Turno de la computadora
    const turnoComputadora = (puntosMinimos, jugador) => {
        do {
            const carta = pedirCarta();
            ptsComputadora.innerHTML = acumularPuntos(carta, jugador);
            crearCarta(carta, jugador);

            if (puntosMinimos > 21) break;
        } while ((puntosJugadores[jugador] <= puntosMinimos) && (puntosJugadores[jugador]<=21));
    };
    
    
    const ejecutaAI = (ptosMin) => {
        const jugador = puntosJugadores.length-1; // La Computadora siempre será el último
        while (puntosJugadores[jugador] < 10) {
            turnoComputadora(ptosMin, jugador);
        }
        // Determinar quien es el ganador
        evaluarGanador(ptosMin, jugador);
    };
    
    btnDetener.addEventListener('click', () => {
        desactivarBtns();
        ejecutaAI(puntosJugadores[0]);
    });
    
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const jugador = 0;
        ptsJugador.innerHTML = acumularPuntos(carta, jugador);
    
        crearCarta(carta, jugador);
    
        if (puntosJugadores[jugador] > 21) {
            desactivarBtns();
            ejecutaAI(puntosJugadores[jugador]);
        }else if (puntosJugadores[jugador] === 21) {
            desactivarBtns();
            ejecutaAI(puntosJugadores[jugador]);
        }
    });
    
    desactivarBtns();

    return {
        nuevoJuego: inicializaJuego
    };
})();