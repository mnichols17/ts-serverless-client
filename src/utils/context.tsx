import React from 'react';
import { createContext, useState, useContext, useCallback } from 'react';

export type FiltersType = {
    sort: {value: string, label: string},
    genres: object[],
    subGenres: object[],
    universes: object[],
    subUniverses: object[],
    characters: object[],
    sportholidays: object[],
}

interface Search {
    url: string;
    query: string;
    filters: FiltersType;
    currentUrl: (newUrl: string) => void;
    currentQuery: (newQuery: string) => void;
    currentFilters: (newFilters: object) => void;
}


export const SearchContext = createContext<Search>({
    url: 'reviews/all',
    query: "",
    filters: {
		sort: {value: "ASC", label: "Rating High to Low"},
		genres: [],
		subGenres: [],
		universes: [],
		subUniverses: [],
		characters: [],
		sportholidays: []
    },
    currentUrl: () => {},
    currentQuery: () => {},
    currentFilters: () => {},
});

interface ProviderProps {
    children: React.ReactNode
}

export const SearchProvider = ({children}: ProviderProps) => {
    const[url, setUrl] = useState<string>('reviews/all');
    const[query, setQuery] = useState<string>("");
    const[filters, setFilters] = useState<FiltersType>({
        sort: {
            value: "ASC",
            label: "Rating High to Low"
        },
        genres: [],
        subGenres: [],
        universes: [],
        subUniverses: [],
        characters: [],
        sportholidays: [],
    });

    const currentUrl = useCallback((newUrl: string) => {
        setUrl(newUrl);
    }, [])

    const currentQuery = useCallback((newQuery: string) => {
        setQuery(newQuery);
    }, [])

    const currentFilters = useCallback((newFilters: object) => {
        setFilters(newFilters as FiltersType);
    }, [])

    return (
        <SearchContext.Provider value={{url, query, filters, currentUrl, currentQuery, currentFilters}}>
            {children}
        </SearchContext.Provider>
    )
}