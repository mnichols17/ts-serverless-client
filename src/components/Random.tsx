import React, {useState, useContext} from 'react';
import Select from 'react-select';
import {genreOptions, decadeOptions, providerOptions} from '../utils/filterData';
import request from '../utils/makeRequest';
import ReactLoading from 'react-loading';
import Review from '../utils/Review';
import handleTitle from '../utils/handleTitle';
import {ScoreTable} from './Review';
import {SearchContext, RandomType} from '../utils/context';

import Back from '../media/back.png';
import Home from '../media/home.png';
import Logo from '../media/logo.jpg';
import Average from '../media/average.png';
import JDL from '../media/jdl.png';
import KenJac from '../media/kenjac.png';

interface RandomSelectProps {
    label: string;
    onChange: (e: any) => void;
    options: object[];
    value: object[];
}

const RandomFilterSelect:React.FC<RandomSelectProps> = ({label, onChange, options, value}) => (
    <div className="filter-select random-select">
        <label>{label}</label>
        <Select className="sort" label={label} isMulti closeMenuOnSelect={false} blurInputOnSelect={false} onChange={onChange} isSearchable={true} options={options} value={value}/>
    </div>
)

interface RandomReviewProps {
    passedProps: any;
    review: Review;
    selectNew: () => void;
    getRandom: () => void;
    scores: {icon: string, score: number, rank: number}[]
}

const RandomReview: React.FC<RandomReviewProps> = ({passedProps, review, selectNew, getRandom, scores}) => (
        <div id="random-content">
            <h3 id="random-info">Click on the poster to see the full review and streaming options</h3>
            <img id="random-poster" onClick={() => passedProps.history.push(`/review/${review.id}`)} src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${review.poster}`} alt="POSTER" />
            <h1 id="random-title">{review.movie}</h1>
            <div id="random-total">
                {scores.map(({icon, score, rank}) => {
                    return <ScoreTable key={icon} icon={icon} score={score as number} rank={rank as number} />
                })}
            </div>
            <button className="random-buttons" onClick={selectNew}>Select New Filters</button>
            <button className="random-buttons" onClick={getRandom}>Randomize Again</button>
        </div>
)

const Random: React.FC = (props:any) => {

    const {randomFilters, currentRandom, resetPage} = useContext(SearchContext);
    const[error, setError] = useState<string>('');
    const[loading, setLoading] = useState<boolean>(false);
    const[random, setRandom] = useState<Review>({
        movie: "",
        avgtotal: -1
    });
    const[selectedFilters, setFilters] = useState<RandomType>(randomFilters)

    const changeFilter = (e: any, key: string) => {
        setFilters((prevState: RandomType) => {
            return {
                ...prevState,
                [key]: e || []
            }
        })
    }

    const getRandom = () => {
        currentRandom(selectedFilters);
        const {genres, decades, providers} = selectedFilters;
        if(!genres.length) setError('Please enter at least once choice in Genre')
        else {
            setLoading(true); 
            if(error) setError('');
            request('reviews/random', {genres: genres.map((select: any) => select.value).join('@'), decades: decades.map((select: any) => select.value).join('@'), providers: providers.map((select: any) => select.value).join('@')})
            .then(async(res: any) => {
                setLoading(false);
                if(!res.data) setError('Sorry, there are no reviews that match those categories');
                else {
                    let {movie, poster, avgtotal, jeff, kenjac, avgrank, jlrank, kjrank, id} = res.data
                    if(movie.substring(movie.length-5).toLowerCase() === ", the") movie = handleTitle(movie);
                    setRandom({movie, poster, avgtotal, jeff, kenjac, avgrank, jlrank, kjrank, id})
                }
            })
            .catch(err => console.error(err))
        }
    }

    const selectNew = () => {
        setRandom({
            movie: "",
            avgtotal: -1
        })
    }

    const navClick = (e: any) => {
        if(e.target.id === "nav-back"){
            props.history.goBack();
        } else {
            props.history.push("/");
        }
    }

    const selects = [
        {label: "Genre:", onChange: (e:any) => changeFilter(e, 'genres'), options: genreOptions, value: selectedFilters.genres},
        {label: "Decade: (Optional)", onChange: (e:any) => changeFilter(e, 'decades'), options: decadeOptions, value: selectedFilters.decades},
        {label: "Streaming Provider: (Optional)", onChange: (e:any) => changeFilter(e, 'providers'), options: providerOptions, value: selectedFilters.providers},
    ]

    const scores = [
        {icon: JDL, score: random.jeff as number, rank: random.jlrank as number},
        {icon: KenJac, score: random.kenjac as number, rank: random.kjrank as number},
        {icon: Average, score: random.avgtotal as number, rank: random.avgrank as number}
    ]

	return (
		<div className="random" id="content">
            <div id="review-navbar">
                <div id="navbar-content">
                    <img id="nav-back" onClick={navClick} className="img-button" src={Back} alt="Back" />
                    <img id="nav-home" onClick={navClick} className="img-button" src={Home} alt="Home" /> 
                </div>
            </div>
            <img id="logo" src={Logo} onClick={navClick} alt="LOGO" />
            {loading? <ReactLoading className="random-loading" type={"spin"} color={"yellow"}/>:
                random.avgtotal >= 0? <RandomReview passedProps={props} review={random} selectNew={selectNew} getRandom={getRandom} scores={scores}/> : <>
                    <h2>Find a random movie based on <br /><span>Genre</span>, <span>Decade</span> and <span>Streaming Provider</span></h2>
                    <h4 id="random-error" hidden={!error}>{error}</h4>
                    {selects.map(({label, onChange, options, value}) => <RandomFilterSelect key={label} label={label} onChange={onChange} options={options} value={value}/>)}
                    <button id="randomize" onClick={getRandom}>Randomize</button>
                </>
            }
        </div>
	)
}

export default Random;