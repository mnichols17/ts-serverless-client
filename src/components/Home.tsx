import React, {useState, useEffect} from 'react';
import request from '../utils/makeRequest';
import ReviewList from './ReviewList';
import Review from '../utils/Review';
import Search from './Search';
import ReactLoading from 'react-loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'

import Logo from '../media/logo.jpg';
import '../styles/home.css';

const Home: React.FC = () => {

	const[reviews, setReviews] = useState<Review[]>([]);
	const[url, setUrl] = useState<string>('reviews/all');
	const[filters, setFilters] = useState<object>({
		sort: "ASC",
		genres: "",
		subgenres: "",
		universes: "",
		subuniverses: "",
		characters: "",
		sportholidays: ""
	});
    const[itemSkips, setSkips] = useState<number>(0);
	const[typingTimeout, setTyping] = useState<NodeJS.Timeout | undefined>();
	const[more, setMore] = useState<boolean>(true);
	const[loading, setLoading] = useState<boolean>(true);
	const[showTop, setTop] = useState<boolean>(false);
	
	useEffect(() => {
		if(!loading) setLoading(true);
		getReviews(true);
	}, [url, filters])

	const queryRequestCreator = async(query: string) => {
		setLoading(true);
		if(typingTimeout) clearTimeout(typingTimeout)

        if(query === "") {
			setUrl('reviews/all')
        } else {
			setTyping(setTimeout(async() => {
				setUrl(`reviews/search/?query=${query}`)
			}, 500))
		}
    }
	
	const getReviews = async(reset?: boolean, fromScroll?: boolean) => {
		console.log(url, filters);
		if(itemSkips > 16) return; // Limits # of reviews a single route can get (~500)
        request(url, {...filters, skip: reset? 0 : itemSkips})
        .then((res: any) => {
			console.log(res.data)
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
	console.log(itemSkips)
    return(
		<div id="content">
			<img id="logo" src={Logo} alt="LOGO" />
			<Search queryRequestCreator={queryRequestCreator} changeFilters={setFilters}/>
			{loading? <ReactLoading type={"spin"} color={"yellow"}/> : <ReviewList reviews={reviews} getReviews={getReviews} more={more}/>}
			<button id="send-top" hidden={!showTop} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Top <FontAwesomeIcon icon={faChevronUp} /></button>
		</div>
    )
}

export default Home;