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

const createStrings = ({sort, directors, genres, subGenres, universes, subUniverses, characters, sportholidays, years, decades}: FiltersType) => ({
	directors: directors.map((select: any) => select.value).join('@'),
	sort: sort.value,
	genres: genres.map((select: any) => select.value).join('@'),
	subGenres: subGenres.map((select: any) => select.value).join('@'),
	universes: universes.map((select: any) => select.value).join('@'),
	subUniverses: subUniverses.map((select: any) => select.value).join('@'),
	characters: characters.map((select: any) => select.value).join('@'),
	sportholidays: sportholidays.map((select: any) => select.value).join('@'),
	years: years.map((select: any) => select.value).join('@'),
	decades: decades.map((select: any) => select.value).join('@'),
})

interface FiltersAppliedProps {
	filters: FiltersType
}

const FiltersApplied:React.FC<FiltersAppliedProps> = ({filters}) => {
	let directedBy = "";
	let type = "";
	let fromYears = "";
	let total = 0;
	for(const[key, value] of Object.entries(filters)){
		if((value as object[]).length){
			(value as object[]).forEach((v:any) => {
				total++;
				if(key === 'directors') directedBy += ` ${v.value},` 
				else if(key === "years" || key === "decades") fromYears += ` ${v.value},`
				else (type += ` ${v.label},`)
			})
		}
	}

	if(total >= 7) return <p id="filters-applied-total"><span>{total}</span> filters applied</p>
	
	type = type.substr(0,type.length-1)
	directedBy = directedBy.substr(0,directedBy.length-1)
	fromYears = fromYears.substr(0,fromYears.length-1)
	const applied = <p id="filters-applied"><span>{type}</span>{type.length? " movies":"Movies"}{directedBy.length? " by":""}<span>{directedBy}</span>{fromYears.length? " from":""}<span>{fromYears}</span></p>

	return (total > 0)? applied : null
}

const Home:React.FC = () => {
	smoothscroll.polyfill();

	const {url, filters, query, currentUrl, currentFilters, currentQuery} = useContext(SearchContext);

	const[reviews, setReviews] = useState<Review[]>([]);
    const[itemSkips, setSkips] = useState<number>(0);
	const[typingTimeout, setTyping] = useState<NodeJS.Timeout | undefined>();
	const[more, setMore] = useState<boolean>(true);
	const[loading, setLoading] = useState<boolean>(true);
	const[showTop, setTop] = useState<boolean>(false);

	useEffect(() => {
		window.addEventListener('scroll', checkTop)

		return () => {
			window.removeEventListener('scroll', checkTop)
		}
	}, [showTop])
	
	useEffect(() => {
		if(!loading) setLoading(true);
		getReviews(true);
	}, [url, filters])

	useEffect(() => {
		const queryHandler = async(q: string) => {
			setLoading(true);
			if(typingTimeout) clearTimeout(typingTimeout)

			if(q === "") {
				currentUrl('reviews/all')
			} else {
				setTyping(setTimeout(async() => {
					currentUrl(`reviews/search/?query=${query}`)
				}, 600))
			}
		}
		queryHandler(query)
	}, [query])

	const logoClick = async() => {
		await currentQuery("")
		currentFilters({
            directors: [],
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
            years: [],
            decades: []
        })
	}
	
	const getReviews = async(reset?: boolean) => {
		if(itemSkips > 33) return; // Limits # of reviews a single route can get (990)
		const stringFilters = createStrings(filters);
        request(url, {...stringFilters, skip: reset? 0 : itemSkips})
        .then(async(res: any) => {
			setLoading(false);
			if(res.data.length < 30) setMore(false);
			else if(!more) setMore(true);

			setSkips(reset? 1 : itemSkips+1)
			setReviews(reset? res.data : [...reviews, ...res.data])
        })
        .catch(err => console.error(err))
	}

	const checkTop = () => {
		if(!showTop && window.pageYOffset > 750){
			setTop(true)
		} else if(showTop && window.pageYOffset <= 750){
			setTop(false)
		}
	}

    return(
		<div id="content">
			<img id="logo" src={Logo} onClick={logoClick} alt="LOGO" />
			<Search />
			<FiltersApplied filters={filters} />
			{loading? <ReactLoading type={"spin"} color={"yellow"}/> : <ReviewList reviews={reviews} getReviews={getReviews} more={more}/>}
			<button id="send-top" hidden={!showTop} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Top <FontAwesomeIcon icon={faChevronUp} /></button>
		</div>
    )
}

export default Home;