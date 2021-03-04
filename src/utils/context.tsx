import React, { useEffect } from 'react';
import { createContext, useState, useCallback } from 'react';
import request from '../utils/makeRequest';
import {Review} from './entities';
import makeRequest from '../utils/makeRequest';

export type FiltersType = {
    ratings: {value: string, label: string | JSX.Element},
    directors: object[],
    sort: {value: string, label: string},
    genres: object[],
    subGenres: object[],
    studiocompanies: object[],
    universes: object[],
    country: object[],
    characters: object[],
    sportholidays: object[],
    years: object[],
    decades: object[],
    providers: object[]
    awards: object[],
    runtime: {value: string, label: string},
    ratingRange: number[],
    type: string;
}

export type RandomType = {
    genres: object[],
    subGenres: object[],  
    decades: object[], 
    providers: object[],
    ratingRange: number[],
    runtime: {value: string, label: string},
}

const emptyFilters: FiltersType = {
    ratings: {
        value: "avg",
        label: <span className="filter-flex">Average <img className="filter-provider" src={require(`../media/average.png`)} alt={'test'}/></span>
    },
    directors: [],
    sort: {
        value: "rating@ASC",
        label: "High to Low (Rating)"
    },
    genres: [],
    subGenres: [],
    universes: [],
    country: [],
    studiocompanies: [],
    characters: [],
    sportholidays: [],
    years: [],
    decades: [],
    providers: [],
    awards: [],
    runtime: {value: "233", label: "233"},
    ratingRange: [0, 100],
    type: "",
}

const emptyRandom: RandomType = {
    genres: [],
    subGenres: [],
    decades: [],
    providers: [],
    ratingRange: [0, 100],
    runtime: {value: '233', label:'233'}
}

interface Search {
    checkAuth: boolean;
    loggedIn: boolean;
    reviews: Review[];
    loading: boolean;
    viewList: boolean;
    url: string;
    query: string;
    page: number;
    totalPages: number;
    more: boolean;
    filters: FiltersType;
    randomFilters: RandomType,
    getReviews: (searchUrl: string, searchFilters: FiltersType, searchPage: number, reset?: boolean) => void;
    currentAuth: (lin: boolean) => void;
    isLoading: (l: boolean) => void;
    currentView: (isList: boolean) => void;
    currentUrl: (newUrl: string) => void;
    currentQuery: (newQuery: string) => void;
    currentPage: (newPage: number) => void;
    currentFilters: (newFilters: object, reset?: boolean) => void;
    currentRandom: (newRandom: object, reset?: boolean) => void;
    resetPage: (newFilters?: object) => void;
}

const createStrings = ({ratings, sort, directors, genres, subGenres, studiocompanies, universes, country, characters, sportholidays, years, decades, providers, awards, runtime, ratingRange, type}: FiltersType) => ({
	ratings: ratings.value,
	directors: directors.map((select: any) => select.value).join('@'),
	sort: sort.value,
	genres: genres.map((select: any) => select.value).join('@'),
	subGenres: subGenres.map((select: any) => select.value).join('@'),
	studiocompanies: studiocompanies.map((select: any) => select.value).join('@'),
	universes: universes.map((select: any) => select.value).join('@'),
	country: country.map((select: any) => select.value).join('@'),
	characters: characters.map((select: any) => select.value).join('@'),
	sportholidays: sportholidays.map((select: any) => select.value).join('@'),
	years: years.map((select: any) => select.value).join('@'),
	decades: decades.map((select: any) => select.value).join('@'),
	providers: providers.map((select: any) => select.value).join('@'),
	awards: awards.map((select: any) => select.value).join('@'),
	runtime: runtime.value,
    ratingRange: ratingRange.join('@'),
    type
})


export const SearchContext = createContext<Search>({
    checkAuth: true,
    loggedIn: false,
    reviews: [],
    loading: true,
    viewList: false,
    url: 'reviews/all',
    query: "",
    page: 1,
    totalPages: 0,
    more: true,
    filters: emptyFilters,
    randomFilters: emptyRandom,
    getReviews: () => {},
    currentAuth: () => {},
    isLoading: () => {},
    currentView: () => {},
    currentUrl: () => {},
    currentQuery: () => {},
    currentPage: () => {},
    currentFilters: () => {},
    currentRandom: () => {},
    resetPage: () => {},
});

interface ProviderProps {
    children: React.ReactNode
}

export const SearchProvider = ({children}: ProviderProps) => {
    const[checkAuth, setCheck] = useState<boolean>(true);
    const[loggedIn, setLoggedIn] = useState<boolean>(false);
    const[reviews, setReviews] = useState<Review[]>([]);
    const[loading, setLoading] = useState<boolean>(true);
    const[viewList, setView] = useState<boolean>(false);
    const[url, setUrl] = useState<string>('reviews/all');
    const[query, setQuery] = useState<string>("");
    const[page, setPage] = useState<number>(1);
    const[more, setMore] = useState<boolean>(true);
    const[filters, setFilters] = useState<FiltersType>(emptyFilters);
    const[randomFilters, setRandom] = useState<RandomType>(emptyRandom);
    const[totalPages, setTotal] = useState<number>(0);
    const[itemSkips, setSkips] = useState<number>(0);

    // useEffect(() => {
    //     makeRequest('GET', 'users/auth', {}, {})
    //     .then((res:any) => {
    //         console.log("LOG TRUE")
    //         setLoggedIn(true)
    //         setCheck(false)
    //     })
    //     .catch(err => {
    //         console.log("LOG FALSE")
    //         setLoggedIn(false)
    //         setCheck(false)
    //     })
    // }, [])

    const getReviews = async(searchUrl: string, searchFilters: FiltersType, searchPage: number, reset?: boolean) => {
        const stringFilters = createStrings(searchFilters);
        request('GET', searchUrl, {...stringFilters, skip: reset? 0 : itemSkips, page: searchPage})
        .then(async(res: any) => {
            isLoading(false);
			if(res.data[0].length < 30 || (!reset && itemSkips === 3)) setMore(false); 
            else setMore(true);

            setTotal(Math.ceil(res.data[1]/120));
			setSkips((itemSkips === 3 || reset)? 1 : itemSkips+1)
			setReviews(reset? res.data[0] : [...reviews, ...res.data[0]])
        })
        .catch(err => console.error(err))
    }
    
    const currentAuth = useCallback((lin: boolean) => {
        setLoggedIn(lin);
    }, [])

    const isLoading = useCallback((l: boolean) => {
        setLoading(l);
    }, [])

    const currentView = useCallback((isList: boolean) => {
        if(!isList) setReviews([])
        setView(isList);
    }, [])

    const currentUrl = useCallback((newUrl: string) => {
        setLoading(true);
        setUrl(newUrl);
        setView(true);
        setPage(1);
        getReviews(newUrl, filters, 1, true);
    }, [filters])

    const currentQuery = useCallback((newQuery: string) => {
        setQuery(newQuery);
    }, [])

    const currentPage = useCallback((newPage: number) => {
        setLoading(true);
        setPage(newPage);
        getReviews(url, filters, newPage, true);
    }, [filters, url])

    const currentFilters = useCallback((newFilters: object, reset?: boolean) => {
        setLoading(true);
        setFilters(reset? emptyFilters : newFilters as FiltersType);
        setPage(1);
        getReviews(url, reset? emptyFilters : newFilters as FiltersType , 1, true);
    }, [url])

    const currentRandom = useCallback((newRandom: object, reset?: boolean) => {
        setRandom(reset? emptyRandom : newRandom as RandomType);
    }, [])

    const resetPage = useCallback((newFilters?: object) => {
        setReviews([])
        setLoading(true);
        setUrl('reviews/all');
        setQuery("");
        setPage(1);
        setFilters(newFilters? {
            ...emptyFilters,
            ...newFilters
        }: {
            ...emptyFilters,
        });
        setView(!!newFilters)
    }, [])

    return (
        <SearchContext.Provider value={{checkAuth, loggedIn, reviews, loading, viewList, url, query, page, totalPages, more, filters, randomFilters, 
                            getReviews, currentAuth, isLoading, currentView, currentUrl, currentQuery, currentPage, currentFilters, currentRandom, resetPage}}>
            {children}
        </SearchContext.Provider>
    )
}