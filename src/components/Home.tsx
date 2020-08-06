import React, {useState, useEffect, useContext, useRef} from 'react';
import request from '../utils/makeRequest';
import ReviewList from './ReviewList';
import Review from '../utils/Review';
import Search from './Search';
import ReactLoading from 'react-loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import smoothscroll from 'smoothscroll-polyfill';
import {SearchContext, FiltersType} from '../utils/context';


import List from './List';
import Landing from './Landing';

import Logo from '../media/logo.jpg';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import '../styles/home.css';

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

const Home:React.FC = (props: any) => {
    smoothscroll.polyfill();
    
    const {loading, viewList, url, filters, query, isLoading, currentView, currentUrl, currentFilters, currentQuery} = useContext(SearchContext);
    const initial = useRef(true);

	const[reviews, setReviews] = useState<Review[]>([]);
    const[itemSkips, setSkips] = useState<number>(0);
	const[typingTimeout, setTyping] = useState<NodeJS.Timeout | undefined>();
	const[more, setMore] = useState<boolean>(true);
	const[showTop, setTop] = useState<boolean>(false);
    const[open, setOpen] = useState<boolean>(false);

	useEffect(() => {
		window.addEventListener('scroll', checkTop)

		return () => {
			window.removeEventListener('scroll', checkTop)
		}
    }, [showTop, open])

	useEffect(() => {
		const queryHandler = async(q: string) => {
            isLoading(true);
			if(typingTimeout) clearTimeout(typingTimeout)

			if(q === "") {
				currentUrl('reviews/all')
			} else {
				setTyping(setTimeout(async() => {
					currentUrl(`reviews/search/?query=${query}`)
                    if(!viewList) currentView(true);
				}, 600))
			}
		}
		queryHandler(query)
	}, [query])

	const logoClick = async() => {
        if(viewList) {
            currentView(false);
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
                studiocompanies: [],
                characters: [],
                sportholidays: [],
                years: [],
                decades: [],
                providers: [],
                oscars: [],
                goldenglobes: []
            })
        }
    }
    
	const checkTop = () => {
		if(!showTop && window.pageYOffset > (open? 1500:700)){
			setTop(true)
		} else if(showTop && window.pageYOffset <= (open? 1500:700)){
			setTop(false)
		}
	}

    return(
		<div id="content">
			<img id="logo" src={Logo} onClick={logoClick} alt="LOGO" />
			{/* <button id="to-random" onClick={() => props.history.push(`/random`)}>Random Movie Generator</button> */}
			<Search open={open} setOpen={setOpen}/>	
            <FiltersApplied filters={filters} />
            {viewList? <List />: <Landing />}
			<button id="send-top" hidden={!(showTop && viewList)} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Top <FontAwesomeIcon icon={faChevronUp} /></button>
		</div>
    )
}

export default Home;