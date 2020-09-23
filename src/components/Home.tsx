import React, {useState, useEffect, useContext} from 'react';
import Search from './Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import smoothscroll from 'smoothscroll-polyfill';
import {SearchContext, FiltersType} from '../utils/context';
import List from './List';
import Landing from './Landing';
import {provider_names} from '../utils/filterData';

import Random from '../media/random.png';
import Average from '../media/average.png';
import JDL from '../media/jdl.png';
import KenJac from '../media/kenjac.png';
import OscarsLogo from '../media/oscars_logo.png';
import GlobesLogo from '../media/globes_logo.png';
import Buttered from '../media/buttered.png';
import NotButtered from '../media/not_buttered.png';
import { faChevronUp, faPlus, faTicketAlt } from '@fortawesome/free-solid-svg-icons'
import '../styles/home.css';

const ProfileIcons:React.FC = () => {
	return (
		<div id="profileIcons">
			<span><FontAwesomeIcon icon={faPlus} /> - Watchlist</span>
			<span><FontAwesomeIcon icon={faTicketAlt} /> - SEEN IT</span>
		</div>
	)
}

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
	const ratingRange = (filters.ratingRange[0] > 0 || filters.ratingRange[1] < 100);
	const sortLabel = filters.sort.label;
	const yearSort = (sortLabel === 'Oldest to Newest' || sortLabel === 'Newest to Oldest');

	for(const[key, value] of Object.entries(filters)){
		if((value as object[]).length && key !== "ratingRange" && key !== 'type'){
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
		<span>{watchOn}</span>{runtime.length? " under":""}<span>{runtime}</span>
		{ratingRange? " with a rating between":""}<span hidden={!ratingRange}>{` ${filters.ratingRange[0]} and ${filters.ratingRange[1]}`}</span>
		{yearSort? " sorted " : ""}<span hidden={!yearSort}>{sortLabel}</span></p>

	return (total > 0 || runtime.length || ratingRange || yearSort)? applied : null
}

const Home:React.FC = (props: any) => {
    smoothscroll.polyfill();
    
    const {viewList, filters, currentRandom, resetPage, loggedIn} = useContext(SearchContext);
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
		if(viewList === 2) {
			resetPage({type: ""})
		}
	}, []);

	useEffect(() => {
		window.addEventListener('scroll', checkTop)

		return () => window.removeEventListener('scroll', checkTop)
    }, [showTop, open])
	
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
			<h1 className="title-font">What to watch, and where to watch it.</h1>
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
				{loggedIn && <ProfileIcons />}
            </div>
            <FiltersApplied filters={filters} />
            {viewList? <List /> : <Landing />}
			<button id="send-top" className="title-font" hidden={!(showTop && viewList)} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Top <FontAwesomeIcon icon={faChevronUp} /></button>
		</div>
    )
}

export default Home;