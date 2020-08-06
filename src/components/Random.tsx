import React, {useState} from 'react';
import Select from 'react-select';
import {genreOptions, decadeOptions, providerOptions} from '../utils/filterData';
import request from '../utils/makeRequest';
import ReactLoading from 'react-loading';
import Review from '../utils/Review';
import handleTitle from '../utils/handleTitle';

import Logo from '../media/logo.jpg';

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
}

const RandomReview: React.FC<RandomReviewProps> = ({passedProps, review, selectNew, getRandom}) => (
        <div id="random-content">
            <h3 id="random-info">Click the poster to see the full review</h3>
            <img id="random-poster" onClick={() => passedProps.history.push(`/review/${review.rank}`)} src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${review.poster}`} alt="POSTER" />
            <h1 id="random-title">{review.movie}</h1>
            <h1 id="random-total">Score: {review.total}/100</h1>
            <button className="random-buttons" onClick={selectNew}>Select New Filters</button>
            <button className="random-buttons" onClick={getRandom}>Randomize Again</button>
        </div>
)

type RandomFilter = {
    genres: object[],
    decades: object[],
    providers: object[]
}

const Random: React.FC = (props:any) => {

    const[error, setError] = useState<string>('');
    const[loading, setLoading] = useState<boolean>(false);
    const[random, setRandom] = useState<Review>({
        movie: "",
        total: -1
    });
    const[randomFilters, setRandomFilters] = useState<RandomFilter>({
        genres: [],
        decades: [],
        providers: []
    })

    const changeFilter = (e: any, key: string) => {
        setRandomFilters((prevState: RandomFilter) => {
            return {
                ...prevState,
                [key]: e || []
            }
        })
    }

    const getRandom = () => {
        const {genres, decades, providers} = randomFilters;
        if(!genres.length || !decades.length) setError('Please enter at least once choice in both Genre and Decade')
        else {
            setLoading(true); 
            if(error) setError('');
            request('reviews/random', {genres: genres.map((select: any) => select.value).join('@'), decades: decades.map((select: any) => select.value).join('@'), providers: providers.map((select: any) => select.value).join('@')})
            .then(async(res: any) => {
                setLoading(false);
                if(!res.data) setError('Sorry, there are no reviews that match those categories');
                else {
                    let {movie, poster, rank, total} = res.data
                    if(movie.substring(movie.length-5).toLowerCase() === ", the") movie = handleTitle(movie);

                    setRandom({movie, poster, rank, total})
                }
            })
            .catch(err => console.error(err))
        }
    }

    const selectNew = () => {
        setRandom({
            movie: "",
            total: -1
        })
    }

    const selects = [
        {label: "Genre:", onChange: (e:any) => changeFilter(e, 'genres'), options: genreOptions, value: randomFilters.genres},
        {label: "Decade:", onChange: (e:any) => changeFilter(e, 'decades'), options: decadeOptions, value: randomFilters.decades},
        {label: "Streaming Provider: (Optional)", onChange: (e:any) => changeFilter(e, 'providers'), options: providerOptions, value: randomFilters.providers},
    ]

	return (
		<div className="random" id="content">
            <img id="logo" src={Logo} onClick={() => props.history.push(`/`)} alt="LOGO" />
            {loading? <ReactLoading className="random-loading" type={"spin"} color={"yellow"}/>:
                random.total >= 0? <RandomReview passedProps={props} review={random} selectNew={selectNew} getRandom={getRandom} /> : <>
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