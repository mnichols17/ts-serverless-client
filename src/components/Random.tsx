import React, {useState} from 'react';
import Select from 'react-select';
import {Redirect} from 'react-router-dom';
import {genreOptions, decadeOptions, providerOptions} from '../utils/filterData';
import request from '../utils/makeRequest';
import ReactLoading from 'react-loading';

import Logo from '../media/logo.jpg';

interface RandomSelectProps {
    label: string;
    onChange: (e: any) => void;
    options: object[];
}

const RandomFilterSelect:React.FC<RandomSelectProps> = ({label, onChange, options}) => (
    <div className="filter-select random-select">
        <label>{label}</label>
        <Select className="sort" label={label} isMulti closeMenuOnSelect={false} blurInputOnSelect={false} onChange={onChange} isSearchable={true} options={options} />
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
    const[randomFilters, setRandomFilters] = useState<RandomFilter>({
        genres: [],
        decades: [],
        providers: []
    })

    const changeFilter = (e: any, key: string) => {
        console.log(e)
        setRandomFilters((prevState: RandomFilter) => {
            return {
                ...prevState,
                [key]: e || []
            }
        })
    }

    const getRandom = () => {
        const {genres, decades, providers} = randomFilters;
        console.log(genres, decades, providers)
        if(!genres.length || !decades.length) setError('Please enter at least once choice in both Genre and Decade')
        else {
            setLoading(true); 
            if(error) setError('');
            request('reviews/random', {genres: genres.map((select: any) => select.value).join('@'), decades: decades.map((select: any) => select.value).join('@'), providers: providers.map((select: any) => select.value).join('@')})
            .then(async(res: any) => {
                setLoading(false);
                if(!res.data) setError('Sorry, there are no reviews that match those categories');
                else props.history.push(`/review/${res.data.rank}`)
            })
            .catch(err => console.error(err))
        }
    }

    const selects = [
        {label: "Genre:", onChange: (e:any) => changeFilter(e, 'genres'), options: genreOptions},
        {label: "Decade:", onChange: (e:any) => changeFilter(e, 'decades'), options: decadeOptions},
        {label: "Provider: (Optional)", onChange: (e:any) => changeFilter(e, 'providers'), options: providerOptions},
    ]

	return (
		<div className="random" id="content">
            <img id="logo" src={Logo} onClick={() => props.history.push(`/`)} alt="LOGO" />
            <h2>Find a random movie based on <br /><span>Genre</span>, <span>Decade</span> and <span>Streaming Provider</span></h2>
            <h4 id="random-error" hidden={!error}>{error}</h4>
            {selects.map(({label, onChange, options}) => <RandomFilterSelect key={label} label={label} onChange={onChange} options={options} />)}
            <button id="randomize" onClick={getRandom}>Randomize</button>
            {loading? <ReactLoading className="random-loading" type={"spin"} color={"yellow"}/>: null}
        </div>
	)
}

export default Random;