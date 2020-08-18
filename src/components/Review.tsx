import React, {useState, useEffect, useContext} from 'react';
import {useParams, Redirect} from 'react-router-dom';
import request from '../utils/makeRequest';
import Review from '../utils/Review';
import handleTitle from '../utils/handleTitle';
import ReactLoading from 'react-loading';
import ReactPlayer from 'react-player/youtube';
import {SearchContext} from '../utils/context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Back from '../media/back.png';
import Home from '../media/home.png';
import Average from '../media/average.png';
import JDL from '../media/jdl.png';
import KenJac from '../media/kenjac.png';
import GV from '../media/gv.png';
// import OscarsLogo from '../media/oscars_logo.png';
// import GlobesLogo from '../media/globes_logo.png';
import Buttered from '../media/buttered.png';
import NotButtered from '../media/not_buttered.png';
import RT from '../media/rt.png';
import IMDB from '../media/imdb.png';
import Metacritic from '../media/metacritic.png';
import { faSearch } from '@fortawesome/free-solid-svg-icons'

interface ScoreTableProps {
    icon: string;
    score: number;
    rank: number
}

export const ScoreTable: React.FC<ScoreTableProps> = ({icon, score, rank}) => {
    return (
        <div className="score-row">
            <h1 className="title-font">{rank !== null? `#${rank}` : 'N/A'}</h1>
            <img className="score-img" alt='icon' src={icon} />
            <h1 className="title-font">{rank !== null? `${score}/100` : "N/A"}</h1>
        </div>
    )
}

interface ProviderLogosProps {
    providers: object[];
}

const ProviderLogos: React.FC<ProviderLogosProps> = ({providers}) => {
    const main:number[] = [8,15,9,337,384,27,386,387,78,350,43]
    let logos:any[] = [];
    console.log(providers)
    providers.forEach((provider:any) => {
        const logo = <a target="_blank" rel="noopener noreferrer" href={provider.url} key={provider.provider_id}>
                        <img className="provider" src={require(`../media/providers/${provider.provider_id}.png`)} alt={provider.provider_id}/>
                    </a>

        main.includes(parseInt(provider.provider_id))? logos.push(logo) : logos.unshift(logo);
    })
    return (
        <div id="review-streaming">
            <h3 id="streaming-title" className="title-font">Streaming Options</h3>
            <hr />
            {providers.length? <><p>Click to Watch</p>
            <div>
                {logos.slice().reverse().map(l => l)}
            </div></> : <h2>No Streaming Options Available</h2>}
        </div>
    )
}

interface ReviewInfoProps {
    review: Review;
    providers: object[];
    fromCategory: (category?: string, value?: string | number) => void
    navClick: () => void
}

const ReviewInfo: React.FC<ReviewInfoProps> = ({review, providers, fromCategory, navClick}) => {

    const scores = [
        {icon: JDL, score: review.jeff, rank: review.jlrank},
        {icon: KenJac, score: review.kenjac, rank: review.kjrank},
        {icon: review.id !== 13767? Average : GV, score: review.avgtotal, rank: review.avgrank}
    ]

    const img_src = review.poster? false
    : review.id === 6969? "https://lh3.googleusercontent.com/-hE37W6LEh0M/XzoUom1xj1I/AAAAAAAAApc/X5_tkwnlmEsCVgNgFaUxEdOyIRgTUteiACK8BGAsYHg/s512/2020-08-16.jpg"
    : 'https://pbs.twimg.com/media/ELsOD8iWwAEd_9b.jpg:large'

    return(
        !review.director? <Redirect push to="/" /> :
        <>
            <div id="review-navbar">
                <div id="navbar-content">
                    <img id="nav-back" onClick={navClick} className="img-button" src={Back} alt="Back" />
                    <img id="nav-home" onClick={() => fromCategory()} className="img-button" src={Home} alt="Home" /> 
                </div>
            </div>
            <h2 id="reviewPage-title">{review.movie}</h2>
            <img id="review-poster" src={img_src || `https://image.tmdb.org/t/p/w600_and_h900_bestv2${review.poster}`} alt="POSTER" />
            <div id="review-card">
                <div id="review-total">
                    {scores.map(({icon, score, rank}) => {
                        return <ScoreTable key={icon} icon={icon} score={score as number} rank={rank as number} />
                    })}
                </div>
                <p id="review-plot">{review.plot}</p>
                <h3 className="review-detail title-font">Director</h3>
                <p id="review-director" className="review-people" onClick={() => fromCategory('directors', review.director)}>{review.director} <FontAwesomeIcon icon={faSearch} /></p>
                <h3 className="review-detail title-font">Starring</h3>
                <p className="review-people">{review.actors}</p>
                <h3 className="review-detail title-font">Awards</h3>
                {(review.oscar_winner || review.goldenglobes)? <><p hidden={!review.oscars} className="review-people">{review.oscars} at The Oscars</p>
                <p hidden={!review.oscars_animated} className="review-people">{review.oscars_animated} at The Oscars</p>
                <p hidden={!review.oscars_director} className="review-people">Best Director (Oscars): {review.oscars_director}</p>
                <p hidden={!review.best_actor} className="review-people">Best Actor (Oscars): {review.best_actor}</p>
                <p hidden={!review.support_actor} className="review-people">Best Supporting Actor (Oscars): {review.support_actor}</p>
                <p className="review-people">{review.goldenglobes? `${review.goldenglobes} at The Golden Globes` : null}</p></> : 
                <p className="review-people">N/A</p>}
                <ProviderLogos providers={providers} />
                <div id="review-trailer-wrapper">
                    <h3 className="review-detail title-font">Trailer</h3>
                    <ReactPlayer className="react-player" url={`https://www.youtube.com/watch?v=${review.video_key}`} height="100%" width="100%" controls={true}/>
                </div>
            </div>
            <div id="review-other-scores">
                <h3 className="review-detail title-font">Other Scores</h3>
                <span><a href="https://www.rottentomatoes.com/" target="_blank" rel="noopener noreferrer"><img alt="RT" src={RT}/></a> <p className="title-font">{review.rt || "N/A"}</p></span> 
                <span><a href="https://www.imdb.com/" target="_blank" rel="noopener noreferrer"><img alt="IMDB" src={IMDB}/></a> <p className="title-font">{review.imdb? `${review.imdb}/10` : "N/A"}</p></span>
                <span><a href="https://www.metacritic.com/" target="_blank" rel="noopener noreferrer"><img alt="MC" src={Metacritic} /></a> <p className="title-font">{review.metacritic? `${review.metacritic}/100` : "N/A"}</p></span>
            </div>
            <table id="review-info">
                <tbody>
                    <tr>
                        <td>Buttered Status:</td>
                        <td><span id="butter-row">{review.buttered? "Officially Buttered" : "Not Buttered"} <img alt="butter" src={review.buttered? Buttered : NotButtered} /></span></td>
                    </tr>
                    <tr>
                        <td>Year Released:</td>
                        <td><button className="review-info-button search-icon" onClick={() => fromCategory('years', review.year as number)}>{review.year} <FontAwesomeIcon icon={faSearch} /></button></td>
                    </tr>
                    <tr>
                        <td>Decade Released:</td>
                        <td><button className="review-info-button search-icon" onClick={() => fromCategory('decades', review.decade as number)}>{review.decade} <FontAwesomeIcon icon={faSearch} /></button></td>
                    </tr>
                    <tr>
                        <td>Runtime:</td>
                        <td>{review.runtime} minutes</td>
                    </tr>
                    <tr>
                        <td>Genre:</td>
                        <td>{review.genre? <button className="review-info-button search-icon" onClick={() => fromCategory('genres', review.genre as string)}>{review.genre} <FontAwesomeIcon icon={faSearch} /></button> : "N/A"}</td>

                    </tr>
                    <tr>
                        <td>Sub-Genre:</td>
                        <td>{review.subgenre? <button className="review-info-button search-icon" onClick={() => fromCategory('subGenres', review.subgenre as string)}>{review.subgenre} <FontAwesomeIcon icon={faSearch} /></button> : "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Studio/Company:</td>
                        <td>{review.studiocompany? <button className="review-info-button search-icon" onClick={() => fromCategory('studiocompanies', review.studiocompany as string)}>{review.studiocompany} <FontAwesomeIcon icon={faSearch} /></button> : "N/A"}</td>

                    </tr>
                    <tr>
                        <td>Universe:</td>
                        <td>{review.universe? <button className="review-info-button search-icon" onClick={() => fromCategory('universes', review.universe as string)}>{review.universe} <FontAwesomeIcon icon={faSearch} /></button> : "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Sub-Universe:</td>
                        <td>{review.subuniverse? <button className="review-info-button search-icon" onClick={() => fromCategory('subUniverses', review.subuniverse as string)}>{review.subuniverse} <FontAwesomeIcon icon={faSearch} /></button> : "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Character:</td>
                        <td>{review.character? <button className="review-info-button search-icon" onClick={() => fromCategory('characters', review.character as string)}>{review.character} <FontAwesomeIcon icon={faSearch} /></button> : "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Sport:</td>
                        <td>{review.sport? <button className="review-info-button search-icon" onClick={() => fromCategory('sports', review.sport as string)}>{review.sport} <FontAwesomeIcon icon={faSearch} /></button> : "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Holiday:</td>
                        <td>{review.holiday? <button className="review-info-button search-icon" onClick={() => fromCategory('holidays', review.holiday as string)}>{review.holiday} <FontAwesomeIcon icon={faSearch} /></button> : "N/A"}</td>
                    </tr>
                </tbody>
            </table> 
        </>
    )
}

const ReviewPage: React.FC = (props:any) => {

    const {rank} = useParams();
    const {resetPage} = useContext(SearchContext);
    
    const[loading, setLoading] = useState<boolean>(true);
    const[review, setReview] = useState<Review>({
        movie: "",
        avgtotal: -1
    })
    const[providers, setProviders] = useState<object[]>([])

    useEffect(() => {
        request(`reviews/movie/${rank}`)
        .then((res: any) => {
            if(!res.data[0]) {
                alert("No Movie Found!")
            } else {
                const {movie} = res.data[0]
                if(movie.substring(movie.length-5).toLowerCase() === ", the") res.data[0].movie = handleTitle(movie);
                document.title = `${res.data[0].movie} (${res.data[0].year}) | The Movie Ranking Database`;
                setReview(res.data[0]);
                setProviders(res.data[1]);
            }
            setLoading(false);
        })
    }, [rank])

    const navClick = () => {
        props.history.goBack();
    }

    const fromCategory = (category?: string, value?: string | number) => {
        if(category && value) resetPage({[category]: [{value, label: value}]})
        else resetPage();
        props.history.push('/');
    }

    return(
        <div id="reviewPage">
            {loading? <ReactLoading className="reviewPage-loading" type={"spin"} color={"yellow"} height={"10vh"} width={"10vh"}/> 
                : <ReviewInfo review={review} providers={providers} fromCategory={fromCategory} navClick={navClick} />}
        </div>
    )
}

export default ReviewPage;