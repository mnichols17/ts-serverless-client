import React, {useState, useContext, useEffect} from 'react';
import Select from 'react-select';
import {genreOptions, subGenreOptions, decadeOptions, providerOptions} from '../utils/filterData';
import request from '../utils/makeRequest';
import ReactLoading from 'react-loading';
import {Review} from '../utils/entities';
import handleTitle from '../utils/handleTitle';
import {ScoreTable} from './Review';
import {SearchContext, RandomType} from '../utils/context';
import {ProviderLogos} from './Review';

import Back from '../media/back.png';
import Home from '../media/home.png';
// import RandomLogo from '../media/home.jpg';
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
        <label className="random-label">{label}</label>
        <Select className="sort" placeholder={'ALL'} label={label} isMulti closeMenuOnSelect={false} blurInputOnSelect={false} isSearchable={false} onChange={onChange} options={options} value={value}/>
    </div>
)

interface RandomReviewProps {
    passedProps: any;
    review: Review;
    streamingOptions: object[],
    selectNew: () => void;
    getRandom: () => void;
    scores: {icon: string, score: number, rank: number}[]
}

const RandomReview: React.FC<RandomReviewProps> = ({passedProps, review, streamingOptions, selectNew, getRandom, scores}) => {
    const img_src = review.poster? false
    : review.id === 6969? "https://lh3.googleusercontent.com/-hE37W6LEh0M/XzoUom1xj1I/AAAAAAAAApc/X5_tkwnlmEsCVgNgFaUxEdOyIRgTUteiACK8BGAsYHg/s512/2020-08-16.jpg"
    : 'https://pbs.twimg.com/media/ELsOD8iWwAEd_9b.jpg:large'

    return(        
        <div id="random-content">
            <h3 id="random-info">Click on the poster to see the full review and streaming options</h3>
            <button className="random-nav random-btn title-font" onClick={selectNew}>New Filters</button>
            <button className="random-nav random-btn title-font" onClick={getRandom}>Randomize</button>
            <h1 id="random-title">{review.movie}</h1>
            <img id="random-poster" onClick={() => passedProps.history.push(`/review/${review.id}`)} src={img_src || `https://image.tmdb.org/t/p/w600_and_h900_bestv2${review.poster}`} alt="POSTER" />
            <div id="random-total">
                {scores.map(({icon, score, rank}) => {
                    return <ScoreTable key={icon} icon={icon} score={score as number} rank={rank as number} />
                })}
            </div>
            <ProviderLogos providers={streamingOptions} />
        </div>
    )
}

const Random: React.FC = (props:any) => {

    const {randomFilters, currentRandom, resetPage} = useContext(SearchContext);
    const[error, setError] = useState<string>('');
    const[loading, setLoading] = useState<boolean>(false);
    const[random, setRandom] = useState<Review>({
        movie: "",
        avgtotal: -1
    });
    const[streamingOptions, setOptions] = useState<object[]>([]);
    const[selectedFilters, setFilters] = useState<RandomType>(randomFilters)
    const[min, setMin] = useState<number>(randomFilters.ratingRange[0]);
    const[max, setMax] = useState<number>(randomFilters.ratingRange[1]);

    const selects = [
        {label: "Genre:", onChange: (e:any) => changeFilter(e, 'genres'), options: genreOptions, value: selectedFilters.genres},
        {label: "Sub-Genre:", onChange: (e:any) => changeFilter(e, 'subGenres'), options: subGenreOptions, value: selectedFilters.subGenres},
        {label: "Decade:", onChange: (e:any) => changeFilter(e, 'decades'), options: decadeOptions, value: selectedFilters.decades},
        {label: "Streaming Provider:", onChange: (e:any) => changeFilter(e, 'providers'), options: providerOptions, value: selectedFilters.providers},
    ]

    const scores = [
        {icon: JDL, score: random.jeff as number, rank: random.jlrank as number},
        {icon: KenJac, score: random.kenjac as number, rank: random.kjrank as number},
        {icon: Average, score: random.avgtotal as number, rank: random.avgrank as number}
    ]

    useEffect(() => {
        document.title = `Random Movie Generator | The Movie Ranking Database`;
    }, [])

    const changeFilter = (e: any, key: string) => {
        setFilters((prevState: RandomType) => {
            return {
                ...prevState,
                [key]: e || []
            }
        })
    }

    const getRandom = () => {
        currentRandom({...selectedFilters, ratingRange: [min, max]});
        const {genres, subGenres, decades, providers, runtime} = selectedFilters;
        const headers = {
            runtime: runtime.label,
            min, 
            genres: genres.map((select: any) => select.value).join('@'), 
            subgenres: subGenres.map((select: any) => select.value).join('@'), 
            decades: decades.map((select: any) => select.value).join('@'), 
            providers: providers.map((select: any) => select.value).join('@'),
            ratingRange: min + "@" + max
        }
        setLoading(true); 
        if(error) setError('');
        request('GET','reviews/random', headers)
        .then(async(res: any) => {
            setLoading(false);
            if(!res.data) setError('Sorry, there are no reviews that match those categories');
            else {
                let {movie, poster, avgtotal, jeff, kenjac, avgrank, jlrank, kjrank, id} = res.data[0];
                if(movie.substring(movie.length-5).toLowerCase() === ", the") movie = handleTitle(movie);
                setOptions(res.data[1])
                setRandom({movie, poster, avgtotal, jeff, kenjac, avgrank, jlrank, kjrank, id})
            }
        })
        .catch(err => console.error(err))
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
            resetPage();
            props.history.push("/");
        }
    }

    const handleMin = (e:any) => {
        const newMin = parseInt(e.target.value)
        if(newMin === 100) setMax(100)
        else if(newMin >= max) setMax(newMin+1)
        setMin(newMin)
    }

    const handleMax = (e:any) => {
        const newMax = parseInt(e.target.value)
        if(newMax === 0) setMin(0)
        else if(newMax <= min) setMin(newMax-1)
        setMax(newMax)
    }

	return (
		<div className="random" id="content">
            <div id="review-navbar">
                <div id="navbar-content">
                    <img id="nav-back" onClick={navClick} className="img-button" src={Back} alt="Back" />
                    <img id="nav-home" onClick={navClick} className="img-button" src={Home} alt="Home" /> 
                </div>
            </div>
            <img id="logo" hidden={random.avgtotal > -1} src={Logo} onClick={navClick} alt="LOGO" />
            {loading? <ReactLoading className="random-loading" type={"spin"} color={"yellow"}/>:
                random.avgtotal >= 0? <RandomReview passedProps={props} review={random} streamingOptions={streamingOptions} selectNew={selectNew} getRandom={getRandom} scores={scores}/> : <>
                    <h2>Find a random movie based on</h2>
                    <h4 id="random-error" hidden={!error}>{error}</h4>
                    {selects.map(({label, onChange, options, value}) => <RandomFilterSelect key={label} label={label} onChange={onChange} options={options} value={value}/>)}
                    <div className="filter-select random-select">
                        <label className="random-label">Rating: {min} - {max}</label>
                        <div className="double-range">
                            <input hidden={max === 0} id="dr-1" className="double-input-range" type='range' min='0' max='100' value={min} onChange={handleMin} /> 
                            <input hidden={min === 100} id="dr-2" className="double-input-range" type='range' min='0' max='100' value={max} onChange={handleMax} />
                        </div>
                    </div>
                    <div className="filter-select random-select">
                        <label className="random-label">Runtime: <span>Under</span> {selectedFilters.runtime.value} <span>minutes</span></label>
                        <input id="random-range" className="range" type='range' min='63' max='233' defaultValue={selectedFilters.runtime.value} onChange={(e:any) => changeFilter({label: e.target.value, value: e.target.value}, 'runtime')} />
                    </div>

                    <button id="randomize" className="random-btn title-font" onClick={getRandom}>Randomize</button>
                </>
            }
        </div>
	)
}

export default Random;