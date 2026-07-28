import bjj from "../assets/iconos artes marciales/arte marcial logos/bjj-removebg-preview.png";
import boxeo from "../assets/iconos artes marciales/arte marcial logos/boxeo-removebg-preview.png";
import lucha from "../assets/iconos artes marciales/arte marcial logos/lucha-removebg-preview.png";
import muaythai from "../assets/iconos artes marciales/arte marcial logos/muay_tai-removebg-preview.png";
import kickboxing from "../assets/iconos artes marciales/arte marcial logos/kick_boxing-removebg-preview.png";
import judo from "../assets/iconos artes marciales/arte marcial logos/judo-removebg-preview.png";
import ejercicio from "../assets/iconos artes marciales/arte marcial logos/ejercicio_fisico-removebg-preview.png";
import mma from "../assets/iconos artes marciales/arte marcial logos/mma-removebg-preview.png";


export const disciplinas = [
 {
        id: 1,
        slug: "bjj",
        nombre: "BJJ",
        categoria: "Grappling",
        color: "#d4af37",
        imagen: bjj,

        tiposMovimiento: [
            "Posición",
            "Control",
            "Barrido",
            "Escape",
            "Sumisión",
            "Transición"
        ]
    },

    {
        id: 2,
        slug: "boxeo",
        nombre: "Boxeo",
        categoria: "Striking",
        color: "#d35400",
        imagen: boxeo,

        tiposMovimiento: [
            "Golpe",
            "Defensa",
            "Esquiva",
            "Footwork",
            "Combinación"
        ]
    },

    {
        id: 3,
        slug: "lucha",
        nombre: "Lucha",
        categoria: "Grappling",
        color: "#00bcd4",
        imagen: lucha,

        tiposMovimiento: [
            "Derribo",
            "Control",
            "Escape",
            "Transición"
        ]
    },

    {
        id: 4,
        slug: "muay-thai",
        nombre: "Muay Thai",
        categoria: "Striking",
        color: "#c0392b",
        imagen: muaythai,

        tiposMovimiento: [
            "Puños",
            "Patadas",
            "Rodillas",
            "Codos",
            "Clinch"
        ]
    },

    {
        id: 5,
        slug: "kick-boxing",
        nombre: "Kick Boxing",
        categoria: "Striking",
        color: "#cfcfcf",
        imagen: kickboxing,

        tiposMovimiento: [
            "Puños",
            "Patadas",
            "Combinación",
            "Defensa"
        ]
    },

    {
        id: 6,
        slug: "judo",
        nombre: "Judo",
        categoria: "Grappling",
        color: "#00d4c8",
        imagen: judo,

        tiposMovimiento: [
            "Proyección",
            "Control",
            "Inmovilización",
            "Sumisión"
        ]
    },

    {
        id: 7,
        slug: "ejercicio-fisico",
        nombre: "Ejercicio físico",
        categoria: "Acondicionamiento",
        color: "#bbbbbb",
        imagen: ejercicio,

        tiposMovimiento: [
            "Cardio",
            "Fuerza",
            "Movilidad",
            "Flexibilidad",
            "Potencia"
        ]
    },

    {
        id: 8,
        slug: "mma",
        nombre: "MMA",
        categoria: "Mixto",
        color: "#8e44ad",
        imagen: mma,

        tiposMovimiento: [
            "Striking",
            "Clinch",
            "Derribo",
            "Ground and Pound",
            "Sumisión",
            "Transición"
        ]
    }

];