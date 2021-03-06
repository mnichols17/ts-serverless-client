export interface Review {
    id?: number;
    avgrank?: number;
    movie: string;
    avgtotal: number;
    jlrank?: number;
    jeff?: number;
    kjrank?: number;
    kenjac?: number;
    buttered?: boolean;
    director?: string;
    genre?: string;
    subgenre?: string;
    studiocompany?: string;
    universe?: string;
    country?: string;
    character?: string;
    sport?: string;
    holiday?: string;
    year?: number;
    decade?: number
    poster?: string;
    plot?: string;
    actors?: string;
    video_key?: string;
    runtime?: number;
    revenue?: string;
    oscar_winner?: boolean;
    oscars?: string;
    oscars_animated?: string;
    oscars_foreign?: string;
    oscars_director?: string;
    best_actor?: string;
    best_actress?: string;
    support_actor?: string;
    support_actress?: string;
    goldenglobes?: string;
    rt?: string;
    imdb?: string;
    metacritic?: string;
    itunes?: string;
    spotify?: string;
    listed?: boolean;
    seen?: boolean;
}

export interface User {
    email?: string;
    username: string;
    firstname?: string;
    lastname?: string;
    // password?: string?
}

export interface Player {
    name: string;
    score: number[];
}