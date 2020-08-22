import React from 'react';
import { createContext, useState, useCallback } from 'react';

export type FiltersType = {
    ratings: {value: string, label: string | JSX.Element},
    directors: object[],
    sort: {value: string, label: string},
    genres: object[],
    subGenres: object[],
    studiocompanies: object[],
    universes: object[],
    subUniverses: object[],
    characters: object[],
    sportholidays: object[],
    years: object[],
    decades: object[],
    providers: object[]
    awards: object[],
    runtime: {value: string, label: string},
    ratingRange: number[],
}

export type RandomType = {
    genres: object[],
    subGenres: object[],  
    decades: object[], 
    providers: object[],
    min: number,
    runtime: {value: string, label: string},
}

interface Search {
    loading: boolean;
    viewList: boolean;
    url: string;
    query: string;
    filters: FiltersType;
    randomFilters: RandomType,
    isLoading: (l: boolean) => void;
    currentView: (isList: boolean) => void;
    currentUrl: (newUrl: string) => void;
    currentQuery: (newQuery: string) => void;
    currentFilters: (newFilters: object, reset?: boolean) => void;
    currentRandom: (newRandom: object, reset?: boolean) => void;
    resetPage: (newFilters?: object) => void;
}


export const SearchContext = createContext<Search>({
    loading: true,
    viewList: false,
    url: 'reviews/all',
    query: "",
    filters: {
        ratings: {value: "avg", label: <span className="filter-flex">Average <img className="filter-provider" src={require(`../media/average.png`)} alt={'test'}/></span>},
        directors: [],
		sort: {value: "ASC", label: "Rating High to Low"},
		genres: [],
        subGenres: [],
        universes: [],
        subUniverses: [],
        studiocompanies: [],
        characters: [],
        sportholidays: [],
        years: [],
        decades: [],
        providers: [],
        awards: [],
        runtime: {value: "229", label: "229"},
        ratingRange: [0, 100],
    },
    randomFilters: {genres: [], subGenres: [], decades: [], providers: [], min: 0, runtime: {value: '209', label:'209'}},
    isLoading: () => {},
    currentView: () => {},
    currentUrl: () => {},
    currentQuery: () => {},
    currentFilters: () => {},
    currentRandom: () => {},
    resetPage: () => {},
});

interface ProviderProps {
    children: React.ReactNode
}

export const SearchProvider = ({children}: ProviderProps) => {
    const emptyFilters: FiltersType = {
        ratings: {
            value: "avg",
            label: <span className="filter-flex">Average <img className="filter-provider" src={require(`../media/average.png`)} alt={'test'}/></span>
        },
        directors: [],
        sort: {
            value: "ASC",
            label: "Rating High to Low"
        },
        genres: [],
        subGenres: [],
        universes: [],
        subUniverses: [],
        studiocompanies: [],
        characters: [],
        sportholidays: [],
        years: [],
        decades: [],
        providers: [],
        awards: [],
        runtime: {value: "229", label: "229"},
        ratingRange: [0, 100],
    }

    const[loading, setLoading] = useState<boolean>(true);
    const[viewList, setView] = useState<boolean>(false);
    const[url, setUrl] = useState<string>('reviews/all');
    const[query, setQuery] = useState<string>("");
    const[filters, setFilters] = useState<FiltersType>(emptyFilters);
    const[randomFilters, setRandom] = useState<RandomType>({
        genres: [],
        subGenres: [],
        decades: [],
        providers: [],
        min: 0,
        runtime: {value: '229', label:'229'}
    });

    const isLoading = useCallback((l: boolean) => {
        setLoading(l);
    }, [])

    const currentView = useCallback((isList: boolean) => {
        setView(isList);
    }, [])

    const currentUrl = useCallback((newUrl: string) => {
        setUrl(newUrl);
    }, [])

    const currentQuery = useCallback((newQuery: string) => {
        setQuery(newQuery);
    }, [])

    const currentFilters = useCallback((newFilters: object, reset?: boolean) => {
        setFilters(reset? emptyFilters : newFilters as FiltersType);
    }, [])

    const currentRandom = useCallback((newRandom: object, reset?: boolean) => {
        setRandom(reset? {genres: [], subGenres: [], decades: [], providers: [], min: 0, runtime: {value: '229', label:'229'}}: newRandom as RandomType);
    }, [])

    const resetPage = useCallback((newFilters?: object) => {
        setLoading(true);
        setUrl('reviews/all');
        setQuery("");
        setFilters(newFilters? {
            ...emptyFilters,
            ...newFilters
        }: {
            ...emptyFilters,
        });
        setView(!!newFilters)
    }, [])

    return (
        <SearchContext.Provider value={{loading, viewList, url, query, filters, randomFilters, isLoading, 
                                currentView, currentUrl, currentQuery, currentFilters, currentRandom, resetPage}}>
            {children}
        </SearchContext.Provider>
    )
}