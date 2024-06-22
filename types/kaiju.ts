// types/kaiju.ts

export interface Incarnation {
    era: string;
    movie: string;
    image: string;
    abilities: string[];
    description?: string;
}

export interface Kaiju {
    name: string;
    description: string;
    image: string;
    first_appearance: string;
    abilities: string[];
    incarnations: Incarnation[];
}