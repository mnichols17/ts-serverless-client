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

const createStrings = ({sort, directors, genres, subGenres, universes, subUniverses, characters, sportholidays, years}: FiltersType) => ({
	directors: directors.map((select: any) => select.value).join('@'),
	sort: sort.value,
	genres: genres.map((select: any) => select.value).join('@'),
	subGenres: subGenres.map((select: any) => select.value).join('@'),
	universes: universes.map((select: any) => select.value).join('@'),
	subUniverses: subUniverses.map((select: any) => select.value).join('@'),
	characters: characters.map((select: any) => select.value).join('@'),
	sportholidays: sportholidays.map((select: any) => select.value).join('@'),
	years: years.map((select: any) => select.value).join('@'),
})

const Home: React.FC = () => {
	smoothscroll.polyfill();

	const {url, filters, currentUrl, query} = useContext(SearchContext);

	const[reviews, setReviews] = useState<Review[]>([]);
    const[itemSkips, setSkips] = useState<number>(0);
	const[typingTimeout, setTyping] = useState<NodeJS.Timeout | undefined>();
	const[more, setMore] = useState<boolean>(true);
	const[loading, setLoading] = useState<boolean>(true);
	const[showTop, setTop] = useState<boolean>(false);
	
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
	
	const getReviews = async(reset?: boolean) => {
		console.log(reset)
		if(itemSkips > 16) return; // Limits # of reviews a single route can get (~500)
		const stringFilters = createStrings(filters);
        request(url, {...stringFilters, skip: reset? 0 : itemSkips})
        .then((res: any) => {
			setLoading(false);
			if(res.data.length < 30) setMore(false);
			else if(!more) setMore(true);

			setSkips(reset? 1 : itemSkips+1)
			setReviews(reset? res.data : [...reviews, ...res.data])
        })
        .catch(err => console.error(err))
	}

	const checkTop = () => {
		if(!showTop && window.pageYOffset > 400){
			setTop(true)
		} else if(showTop && window.pageYOffset <= 400){
			setTop(false)
		}
	}

	window.addEventListener('scroll', checkTop)
    return(
		<div id="content">
			<img id="logo" src={Logo} alt="LOGO" />
			<Search />
			{loading? <ReactLoading type={"spin"} color={"yellow"}/> : <ReviewList reviews={reviews} getReviews={getReviews} more={more}/>}
			<button id="send-top" hidden={!showTop} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Top <FontAwesomeIcon icon={faChevronUp} /></button>
		</div>
    )
}

export default Home;