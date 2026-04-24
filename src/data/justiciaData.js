// IMÁGENES DE FONDOS
import aldea1 from '../assets/justicia/fondos/aldea1.png';
import aldea2 from '../assets/justicia/fondos/aldea2.png';
import aldea3 from '../assets/justicia/fondos/aldea3.png';
import aldea4 from '../assets/justicia/fondos/aldea4.png';

// IMÁGENES DE CASAS
import casa1_1 from '../assets/justicia/casas/casa1_1.png';
import casa1_2 from '../assets/justicia/casas/casa1_2.png';
import casa1_3 from '../assets/justicia/casas/casa1_3.png';
import casa1_4 from '../assets/justicia/casas/casa1_4.png';
import casa2_1 from '../assets/justicia/casas/casa2_1.png';
import casa2_2 from '../assets/justicia/casas/casa2_2.png';
import casa2_3 from '../assets/justicia/casas/casa2_3.png';
import casa2_4 from '../assets/justicia/casas/casa2_4.png';
import casa3_1 from '../assets/justicia/casas/casa3_1.png';
import casa3_2 from '../assets/justicia/casas/casa3_2.png';
import casa3_3 from '../assets/justicia/casas/casa3_3.png';
import casa3_4 from '../assets/justicia/casas/casa3_4.png';
import casa4_1 from '../assets/justicia/casas/casa4_1.png';
import casa4_2 from '../assets/justicia/casas/casa4_2.png';
import casa4_3 from '../assets/justicia/casas/casa4_3.png';
import casa4_4 from '../assets/justicia/casas/casa4_4.png';

// IMÁGENES DE PERSONAJES
import Garcia from '../assets/justicia/personajes/Garcia.png';
import Lopez from '../assets/justicia/personajes/Lopez.png';
import Martinez from '../assets/justicia/personajes/Martinez.png';
import Torres from '../assets/justicia/personajes/Torres.png';
import Rivera from '../assets/justicia/personajes/Rivera.png';
import Gomez from '../assets/justicia/personajes/Gomez.png';
import Fernandez from '../assets/justicia/personajes/Fernandez.png';
import Pena from '../assets/justicia/personajes/Pena.png';
import Morales from '../assets/justicia/personajes/Morales.png';
import Navarro from '../assets/justicia/personajes/Navarro.png';
import Ruiz from '../assets/justicia/personajes/Ruiz.png';
import Castillo from '../assets/justicia/personajes/Castillo_birefnet.png';
import Marques from '../assets/justicia/personajes/Marques.png';
import Vega from '../assets/justicia/personajes/Vega.png';
import Delgado from '../assets/justicia/personajes/Delgado.png';
import Salazar from '../assets/justicia/personajes/Salazar.png';


// IMÁGENES DE RECURSOS
import pan from '../assets/justicia/recursos/pan.png';
import medicina from '../assets/justicia/recursos/medicina.png';
import agua from '../assets/justicia/recursos/agua.png';
import lena from '../assets/justicia/recursos/lena.png'; // Renombrado de leña
import ropa from '../assets/justicia/recursos/abrigo.png'; // Usamos abrigo.png como ropa
import material from '../assets/justicia/recursos/material.png'; // Renombrado

export const recursosImg = {
    pan, medicina, agua, lena, ropa, material
};

export const gameData = {
    "niveles": [
        {
            "id": 1,
            "titulo": "La Aldea Necesitada",
            "descripcion": "Una aldea con desigualdades marcadas. Distribuye los recursos básicos (pan y medicina) justamente.",
            "fondo": aldea1,
            "recursosDisponibles": {
                "pan": 10,
                "medicina": 5
            },
            "familias": [
                {
                    "id": 1,
                    "nombre": "Familia García",
                    "sprite": casa1_1,
                    "personaje": Garcia,
                    "x": 47,
                    "y": 35,
                    "situacion": "El padre trabaja en el campo, madre cuida niños. Tienen un bebé enfermo. Necesitan pan y mucho medicina.",
                    "necesidades": { "pan": 4, "medicina": 2 }
                },
                {
                    "id": 2,
                    "nombre": "Casa López",
                    "sprite": casa1_2,
                    "personaje": Lopez,
                    "x": 69,
                    "y": 52,
                    "situacion": "Abuelo vive solo con su perrito fiel. Recursos muy limitados.",
                    "necesidades": { "pan": 2, "medicina": 1 }
                },
                {
                    "id": 3,
                    "nombre": "Casa Martínez",
                    "sprite": casa1_3,
                    "personaje": Martinez,
                    "x": 35,
                    "y": 55,
                    "situacion": "Comerciante rico: tiene moneda y comida. Puede donar, no necesita.",
                    "necesidades": { "pan": 0, "medicina": 0 }
                },
                {
                    "id": 4,
                    "nombre": "Familia Torres",
                    "sprite": casa1_4,
                    "personaje": Torres,
                    "x": 63,
                    "y": 80,
                    "situacion": "Hija Ana (6 años) está enferma. Necesitan medicina urgente y pan.",
                    "necesidades": { "pan": 4, "medicina": 2 }
                }
            ]
        },
        {
            "id": 2,
            "titulo": "La Sequía del Verano",
            "descripcion": "El calor ha secado los pozos. La prioridad es el agua y el alimento.",
            "fondo": aldea2,
            "recursosDisponibles": {
                "agua": 5,
                "pan": 12
            },
            "familias": [
                {
                    "id": 1,
                    "nombre": "Casa Rivera",
                    "sprite": casa2_2,
                    "personaje": Rivera,
                    "x": 69,
                    "y": 52,
                    "situacion": "Familia numerosa con abuela hipertensa. Necesitan mucha agua.",
                    "necesidades": { "agua": 2, "pan": 5 }
                },
                {
                    "id": 2,
                    "nombre": "Casa Gómez",
                    "sprite": casa2_3,
                    "personaje": Gomez,
                    "x": 35,
                    "y": 55,
                    "situacion": "Recursos escasos, pero la gallina ofrece algo de alimento. Necesitan agua.",
                    "necesidades": { "agua": 2, "pan": 5 }
                },
                {
                    "id": 3,
                    "nombre": "Casa Fernández",
                    "sprite": casa2_4,
                    "personaje": Fernandez,
                    "x": 63,
                    "y": 80,
                    "situacion": "Tienen agua y moneda. Ayudan a otros, no necesitan recursos.",
                    "necesidades": { "agua": 0, "pan": 0 }
                },
                {
                    "id": 4,
                    "nombre": "Casa Peña",
                    "sprite": casa2_1,
                    "personaje": Pena,
                    "x": 47,
                    "y": 35,
                    "situacion": "Madre soltera con hijo. Necesitan agua y pan urgentemente.",
                    "necesidades": { "agua": 1, "pan": 2 }
                }
            ]
        },
        {
            "id": 3,
            "titulo": "El Invierno Helado",
            "descripcion": "El frío azota la región. La leña (madera) y la ropa son vitales.",
            "fondo": aldea3,
            "recursosDisponibles": {
                "lena": 5,
                "ropa": 8,
                "pan": 15
            },
            "familias": [
                {
                    "id": 1,
                    "nombre": "Casa Morales",
                    "sprite": casa3_1,
                    "personaje": Morales,
                    "x": 47,
                    "y": 35,
                    "situacion": "Abuelos con nieta pequeña. Necesitan leña y ropa abrigadora.",
                    "necesidades": { "lena": 2, "ropa": 3, "pan": 4 }
                },
                {
                    "id": 2,
                    "nombre": "Casa Navarro",
                    "sprite": casa3_2,
                    "personaje": Navarro,
                    "x": 69,
                    "y": 52,
                    "situacion": "Agricultores. Necesitan mucha leña y abrigos para los niños.",
                    "necesidades": { "lena": 1, "ropa": 2, "pan": 3 }
                },
                {
                    "id": 3,
                    "nombre": "Casa Ruiz",
                    "sprite": casa3_3,
                    "personaje": Ruiz,
                    "x": 35,
                    "y": 55,
                    "situacion": "Necesitan leña y ropa en cantidad moderada.",
                    "necesidades": { "lena": 2, "ropa": 3, "pan": 4 }
                },
                {
                    "id": 4,
                    "nombre": "Casa Castillo",
                    "sprite": casa3_4,
                    "personaje": Castillo,
                    "x": 63,
                    "y": 80,
                    "situacion": "Hijo con discapacidad motora y abuela. Tienen mucha calefacción.",
                    "necesidades": { "lena": 0, "ropa": 0, "pan": 4 }
                }
            ]
        },
        {
            "id": 4,
            "titulo": "Tormenta y Viento",
            "descripcion": "Una tormenta ha dañado las casas. Se necesita material de construcción y suministros.",
            "fondo": aldea4,
            "recursosDisponibles": {
                "pan": 14,
                "agua": 14,
                "medicina": 2,
                "material": 7
            },
            "familias": [
                {
                    "id": 1,
                    "nombre": "Familia Marques",
                    "sprite": casa4_1,
                    "personaje": Marques,
                    "x": 47,
                    "y": 35,
                    "situacion": "Daños moderados. Necesitan pan, agua y medicina para la abuela.",
                    "necesidades": { "pan": 5, "agua": 5, "medicina": 1, "material": 1 }
                },
                {
                    "id": 2,
                    "nombre": "Familia Vega",
                    "sprite": casa4_2,
                    "personaje": Vega,
                    "x": 69,
                    "y": 52,
                    "situacion": "Daños menores. Bebé de 8 meses necesita cuidados.",
                    "necesidades": { "pan": 3, "agua": 3, "medicina": 1, "material": 1 }
                },
                {
                    "id": 3,
                    "nombre": "Familia Delgado",
                    "sprite": casa4_3,
                    "personaje": Delgado,
                    "x": 35,
                    "y": 55,
                    "situacion": "Daños leves. Necesitan suministros básicos.",
                    "necesidades": { "pan": 3, "agua": 3, "material": 2 }
                },
                {
                    "id": 4,
                    "nombre": "Familia Salazar",
                    "sprite": casa4_4,
                    "personaje": Salazar,
                    "x": 63,
                    "y": 80,
                    "situacion": "Casa muy dañada (prioridad). Necesitan suministros básicos.",
                    "necesidades": { "pan": 3, "agua": 3, "material": 3 }
                }
            ]
        }
    ]
};
