import React, {useState, useContext, useEffect} from 'react';
import request from '../utils/makeRequest';
import ReactLoading from 'react-loading';
import {Review} from '../utils/entities';
import handleTitle from '../utils/handleTitle';
import {ScoreTable} from './Review';
import {SearchContext, RandomType} from '../utils/context';
import {ProviderLogos} from './Review';

import HolidayBack from '../media/holiday_back.png';
import HolidayHome from '../media/holiday_home.png';
import HolidayRandom from '../media/holiday_random.png';
import Average from '../media/average.png';
import JDL from '../media/jdl.png';
import KenJac from '../media/kenjac.png';

interface RandomReviewProps {
    passedProps: any;
    review: Review;
    streamingOptions: object[],
    getRandom: () => void;
    scores: {icon: string, score: number, rank: number}[]
}

const RandomReview: React.FC<RandomReviewProps> = ({passedProps, review, streamingOptions, getRandom, scores}) => {
    const img_src = review.poster? false
    : review.id === 6969? "https://lh3.googleusercontent.com/-hE37W6LEh0M/XzoUom1xj1I/AAAAAAAAApc/X5_tkwnlmEsCVgNgFaUxEdOyIRgTUteiACK8BGAsYHg/s512/2020-08-16.jpg"
    : 'https://pbs.twimg.com/media/ELsOD8iWwAEd_9b.jpg:large'

    return(        
        <div className='holiday' id="random-content">
            <h3 id="random-info">Click on the poster to see the full review and streaming options</h3>
            {/* <button style={{gridColumn: '1/3', justifySelf: 'center'}}className="random-nav random-btn title-font" onClick={getRandom}>Randomize</button> */}
            <img style={{gridColumn: '1/3', justifySelf: 'center', padding: '.5rem'}} id="nav-home" onClick={getRandom} className="img-button" src={HolidayRandom} alt="random" /> 
            <h1 id="random-title">{review.movie}</h1>
            <img id="random-poster" onClick={() => passedProps.history.push(`/review/${review.id}`)} src={img_src || `https://image.tmdb.org/t/p/w600_and_h900_bestv2${review.poster}`} alt="POSTER" />
            <div id="random-total">
                {scores.map(({icon, score, rank}) => {
                    return <ScoreTable key={icon} icon={icon} score={score as number} rank={rank as number} holiday={true} />
                })}
            </div>
            <ProviderLogos holiday={true} providers={streamingOptions} />
        </div>
    )
}

const Holiday: React.FC = (props:any) => {
    
    const {resetPage} = useContext(SearchContext);

    const[error, setError] = useState<string>('');
    const[loading, setLoading] = useState<boolean>(true);
    const[random, setRandom] = useState<Review>({
        movie: "",
        avgtotal: -1
    });
    const[streamingOptions, setOptions] = useState<object[]>([]);

    const scores = [
        {icon: JDL, score: random.jeff as number, rank: random.jlrank as number},
        {icon: KenJac, score: random.kenjac as number, rank: random.kjrank as number},
        {icon: Average, score: random.avgtotal as number, rank: random.avgrank as number}
    ]

    useEffect(() => {
        document.title = `Random Movie Generator | The Movie Ranking Database`;
        request('GET','reviews/holiday', {})
        .then(async(res: any) => {
            setLoading(false);
            console.log(res.data)
            if(!res.data) setError('Sorry, there are no reviews that match those categories');
            else {
                let {movie, poster, avgtotal, jeff, kenjac, avgrank, jlrank, kjrank, id} = res.data[0];
                if(movie.substring(movie.length-5).toLowerCase() === ", the") movie = handleTitle(movie);
                setOptions(res.data[1])
                setRandom({movie, poster, avgtotal, jeff, kenjac, avgrank, jlrank, kjrank, id})
            }
        })
        .catch(err => console.error(err))
    }, [])

    const getRandom = () => {
        setLoading(true); 
        if(error) setError('');
        request('GET','reviews/holiday', {})
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

    const navClick = (e: any) => {
        if(e.target.id === "nav-back"){
            props.history.goBack();
        } else {
            resetPage();
            props.history.push("/");
        }
    }

	return (
		<div className="random" id="content">
            <div hidden={loading} id="review-navbar">
                <div id="navbar-content">
                    <img id="nav-back" onClick={navClick} className="img-button" src={HolidayBack} alt="Back" />
                    <img id="nav-home" onClick={navClick} className="img-button" src={HolidayHome} alt="Home" /> 
                </div>
            </div>
            {loading? 
                <ReactLoading className="random-loading" type={"spin"} color={"yellow"}/> :
                <RandomReview passedProps={props} review={random} streamingOptions={streamingOptions} getRandom={getRandom} scores={scores}/>
            }
        </div>
	)
}

export default Holiday;