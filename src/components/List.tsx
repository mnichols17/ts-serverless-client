import React, {useState, useEffect, useContext} from 'react';
import request from '../utils/makeRequest';
import ReviewList from './ReviewList';
import Review from '../utils/Review';
import Search from './Search';
import ReactLoading from 'react-loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import smoothscroll from 'smoothscroll-polyfill';
import {SearchContext, FiltersType} from '../utils/context';


import Logo from '../media/logo.jpg';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import '../styles/home.css';

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

interface FiltersAppliedProps {
	filters: FiltersType
}

const FiltersApplied:React.FC<FiltersAppliedProps> = ({filters}) => {
	let directedBy = "";
	let type = "";
	let fromYears = "";
	let watchOn = "";
	let total = 0;
	for(const[key, value] of Object.entries(filters)){
		if((value as object[]).length){
			(value as object[]).forEach((v:any) => {
				total++;
				if(key === 'directors') directedBy += ` ${v.value},` 
				else if(key === "years" || key === "decades") fromYears += ` ${v.value},`
				else if(key === "providers") watchOn += ` ${v.label},`
				else (type += ` ${v.label},`)
			})
		}
	}

	if(total >= 7) return <p id="filters-applied-total"><span>{total}</span> filters applied</p>
	
	type = type.substr(0,type.length-1)
	directedBy = directedBy.substr(0,directedBy.length-1)
	fromYears = fromYears.substr(0,fromYears.length-1)
	watchOn = watchOn.substr(0,watchOn.length-1)
	const applied = <p id="filters-applied"><span>{type}</span>{type.length? " movies":"Movies"}{directedBy.length? " by":""}<span>{directedBy}</span>{fromYears.length? " from":""}<span>{fromYears}</span>{watchOn.length? " on":""}<span>{watchOn}</span></p>

	return (total > 0)? applied : null
}

const List:React.FC = (props: any) => {
	smoothscroll.polyfill();

	const {loading, url, filters, query, isLoading, currentUrl, currentFilters, currentQuery} = useContext(SearchContext);

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
		// <div id="content">
		// 	<img id="logo" src={Logo} onClick={logoClick} alt="LOGO" />
		// 	<button id="to-random" onClick={() => props.history.push(`/random`)}>Random Movie Generator</button>
		// 	<Search open={open} setOpen={setOpen}/>
		// 	<FiltersApplied filters={filters} />
		// 	{loading? <ReactLoading type={"spin"} color={"yellow"}/> : <ReviewList reviews={reviews} getReviews={getReviews} more={more}/>}
		// 	<button id="send-top" hidden={!showTop} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Top <FontAwesomeIcon icon={faChevronUp} /></button>
		// </div>
    )
}

export default List;