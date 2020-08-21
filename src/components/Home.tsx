import React, {useState, useEffect, useContext} from 'react';
import Search from './Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import smoothscroll from 'smoothscroll-polyfill';
import {SearchContext, FiltersType} from '../utils/context';
import List from './List';
import Landing from './Landing';
import {provider_names} from '../utils/filterData';

import Logo from '../media/logo.jpg';
import Random from '../media/random.png';
import Average from '../media/average.png';
import JDL from '../media/jdl.png';
import KenJac from '../media/kenjac.png';
import OscarsLogo from '../media/oscars_logo.png';
import GlobesLogo from '../media/globes_logo.png';
import Buttered from '../media/buttered.png';
import NotButtered from '../media/not_buttered.png';
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
	const runtime = parseInt(filters.runtime.label) < 209? ` ${filters.runtime.label} minutes` : "";
	const maxRating = parseInt(filters.maxRating.label) < 100? ` ${filters.maxRating.label}` : "";

	for(const[key, value] of Object.entries(filters)){
		if((value as object[]).length){
			(value as object[]).forEach((v:any) => {
				total++;
				if(key === 'directors') directedBy += ` ${v.value},` 
				else if(key === "years" || key === "decades") fromYears += ` ${v.value},`
				else if(key === "providers") watchOn += ` ${provider_names[v.value]},`
				else (type += ` ${v.label},`)
			})
		}
	}

	if(total >= 7) return <p id="filters-applied-total"><span>{total}</span> filters applied</p>
	
	type = type.substr(0,type.length-1)
	directedBy = directedBy.substr(0,directedBy.length-1)
	fromYears = fromYears.substr(0,fromYears.length-1)
	watchOn = watchOn.substr(0,watchOn.length-1)
	const applied = <p id="filters-applied"><span>{type}</span>{type.length? " movies":"Movies"}{directedBy.length? " by":""}
		<span>{directedBy}</span>{fromYears.length? " from":""}<span>{fromYears}</span>{watchOn.length? " on":""}
		<span>{watchOn}</span>{runtime.length? " under":""}<span>{runtime}</span>{maxRating.length? " with a max score of":""}<span>{maxRating}</span></p>

	return (total > 0 || runtime.length || maxRating.length)? applied : null
}

const Home:React.FC = (props: any) => {
    smoothscroll.polyfill();
    
    const {viewList, filters, query, isLoading, currentView, currentUrl, currentQuery, currentFilters, currentRandom, resetPage} = useContext(SearchContext);
	const[typingTimeout, setTyping] = useState<NodeJS.Timeout | undefined>();
	const[showTop, setTop] = useState<boolean>(false);
	const[open, setOpen] = useState<boolean>(false);
	const [iconDetail, setDetail] = useState<string>("Click/hover on each icon to learn about it");
	
	const glossaryIcons: {detail: string, source: string}[] = [
        {detail: "Average Rating", source: Average},
        {detail: "Jeff D. Lowe's Rating", source: JDL},
        {detail: "KenJac's Rating", source: KenJac},
        {detail: "Buttered (69 or above)", source: Buttered},
        {detail: "Not Buttered (68 or below)", source: NotButtered},
        {detail: "Won an Oscar", source: OscarsLogo},
        {detail: "Won a Golden Globe", source: GlobesLogo},
	]
	
	useEffect(() => {
		document.title = `The Movie Ranking Database`;
	}, []);

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
			resetPage();
        }
	}
	
	const toRandom = () => {
		currentRandom({}, true);
		props.history.push(`/random`)
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
			<h1 className="title-font">What to watch, and where to watch it.</h1>
			<h6>(MOVIES STILL BEING ADDED)</h6>
			<img className="img-button" id="to-random" src={Random} alt="Random" onClick={toRandom} />
			<Search open={open} setOpen={setOpen}/>	
			<div id="glossary-content">
                <h2 className="title-font glossary-title">Icons Glossary</h2>
                <h2 id="glossary-detail">{iconDetail}</h2>
                <div id="glossary-icons">
                    {glossaryIcons.map(({detail, source}) => {
                        return <img key={source} onMouseEnter={() => setDetail(detail)} onMouseLeave={() => setDetail("Click/hover on each icon to learn about it")} className={iconDetail === detail? "glossary-img glossary-selected" : "glossary-img"} alt={detail} src={source} />
                    })}
                </div>
            </div>
            <FiltersApplied filters={filters} />
            {viewList? <List />: <Landing />}
			<button id="send-top" className="title-font" hidden={!(showTop && viewList)} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Top <FontAwesomeIcon icon={faChevronUp} /></button>
		</div>
    )
}

export default Home;