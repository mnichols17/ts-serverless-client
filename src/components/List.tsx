import React, {useState, useEffect, useContext} from 'react';
import request from '../utils/makeRequest';
import ReviewList from './ReviewList';
import Review from '../utils/Review';
import ReactLoading from 'react-loading';
import smoothscroll from 'smoothscroll-polyfill';
import {SearchContext, FiltersType} from '../utils/context';

const createStrings = ({sort, directors, genres, subGenres, studiocompanies, universes, subUniverses, characters, sportholidays, years, decades, providers, oscars, goldenglobes}: FiltersType) => ({
	directors: directors.map((select: any) => select.value).join('@'),
	sort: sort.value,
	genres: genres.map((select: any) => select.value).join('@'),
	subGenres: subGenres.map((select: any) => select.value).join('@'),
	studiocompanies: studiocompanies.map((select: any) => select.value).join('@'),
	universes: universes.map((select: any) => select.value).join('@'),
	subUniverses: subUniverses.map((select: any) => select.value).join('@'),
	characters: characters.map((select: any) => select.value).join('@'),
	sportholidays: sportholidays.map((select: any) => select.value).join('@'),
	years: years.map((select: any) => select.value).join('@'),
	decades: decades.map((select: any) => select.value).join('@'),
	providers: providers.map((select: any) => select.value).join('@'),
	oscars: oscars.map((select: any) => select.value).join('@'),
	goldenglobes: goldenglobes.map((select: any) => select.value).join('@'),
})

const List:React.FC = () => {
	smoothscroll.polyfill();

	const {loading, url, filters, isLoading} = useContext(SearchContext);

	const[reviews, setReviews] = useState<Review[]>([]);
    const[itemSkips, setSkips] = useState<number>(0);
	const[more, setMore] = useState<boolean>(true);
	
	useEffect(() => {
		if(!loading) isLoading(true);
		getReviews(true);
	}, [url, filters])
	
	const getReviews = async(reset?: boolean) => {
		if(itemSkips > 33) return; // Limits # of reviews a single route can get (990)
		const stringFilters = createStrings(filters);
        request(url, {...stringFilters, skip: reset? 0 : itemSkips})
        .then(async(res: any) => {
			isLoading(false);
			if(res.data.length < 30) setMore(false);
			else if(!more) setMore(true);

			setSkips(reset? 1 : itemSkips+1)
			setReviews(reset? res.data : [...reviews, ...res.data])
        })
        .catch(err => console.error(err))
	}

    return(
		loading? <ReactLoading type={"spin"} color={"yellow"}/> : <ReviewList reviews={reviews} getReviews={getReviews} more={more}/>
    )
}

export default List;