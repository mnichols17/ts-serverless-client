import React from 'react';
import { createContext, useState, useCallback } from 'react';

export type FiltersType = {
    ratings: {value: string, label: string},
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
    awards: []
}

interface Search {
    loading: boolean;
    viewList: boolean;
    url: string;
    query: string;
    filters: FiltersType;
    isLoading: (l: boolean) => void;
    currentView: (isList: boolean) => void;
    currentUrl: (newUrl: string) => void;
    currentQuery: (newQuery: string) => void;
    currentFilters: (newFilters: object) => void;
    resetPage: (newFilters?: object) => void;
}


export const SearchContext = createContext<Search>({
    loading: true,
    viewList: false,
    url: 'reviews/all',
    query: "",
    filters: {
        ratings: {value: "avg", label: "Average"},
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
        awards: []
    },
    isLoading: () => {},
    currentView: () => {},
    currentUrl: () => {},
    currentQuery: () => {},
    currentFilters: () => {},
    resetPage: () => {},
});

interface ProviderProps {
    children: React.ReactNode
}

export const SearchProvider = ({children}: ProviderProps) => {
    const emptyFilters: FiltersType = {
        ratings: {
            value: "avg",
            label: "Average"
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
    }

    const[loading, setLoading] = useState<boolean>(true);
    const[viewList, setView] = useState<boolean>(false);
    const[url, setUrl] = useState<string>('reviews/all');
    const[query, setQuery] = useState<string>("");
    const[filters, setFilters] = useState<FiltersType>(emptyFilters);

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

    const currentFilters = useCallback((newFilters: object) => {
        setFilters(newFilters as FiltersType);
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
        <SearchContext.Provider value={{loading, viewList, url, query, filters, isLoading, currentView, currentUrl, currentQuery, currentFilters, resetPage}}>
            {children}
        </SearchContext.Provider>
    )
}