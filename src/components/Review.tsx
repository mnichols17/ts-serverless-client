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
import { faSearch } from '@fortawesome/free-solid-svg-icons'

interface ProviderLogosProps {
    providers: object[];
}

const ProviderLogos: React.FC<ProviderLogosProps> = ({providers}) => {
    const main:number[] = [8,15,9,337,384,27,386,387,78,350,43]
    let logos:any[] = [];
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
    fromCategory: (category?: string, value?: string) => void
    navClick: () => void
}

const ReviewInfo: React.FC<ReviewInfoProps> = ({review, providers, fromCategory, navClick}) => {
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
            <h1 id="review-rank" className="title-font">Rank: #{review.avgrank}</h1>
            <img id="review-poster" src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${review.poster}`} alt="POSTER" />
            <div id="review-card">
                <h1 id="review-total" className="title-font">Score: {review.avgtotal}/100</h1>
                <p id="review-plot">{review.plot}</p>
                <h3 className="review-detail title-font">Director</h3>
                <p className="review-people">{review.director}</p>
                <h3 className="review-detail title-font">Starring</h3>
                <p className="review-people">{review.actors}</p>
                <h3 className="review-detail title-font">Awards</h3>
                {(review.oscars || review.goldenglobes)? <><p className="review-people">{review.oscars? `${review.oscars} at The Oscars` : null}</p>
                <p className="review-people">{review.goldenglobes? `${review.goldenglobes} at The Golden Globes` : null}</p></> : 
                <p className="review-people">N/A</p>}
                <ProviderLogos providers={providers} />
                <div id="review-trailer-wrapper">
                    <h3 className="review-detail title-font">Trailer</h3>
                    <ReactPlayer className="react-player" url={`https://www.youtube.com/watch?v=${review.video_key}`} height="100%" width="100%" controls={true}/>
                </div>
            </div>
            <table id="review-info">
                <tbody>
                    <tr>
                        <td>Year Released:</td>
                        <td>{review.year}</td>
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
                        <td>Sport/Holiday:</td>
                        <td>{review.sportholiday? <button className="review-info-button search-icon" onClick={() => fromCategory('sportholidays', review.sportholiday as string)}>{review.sportholiday} <FontAwesomeIcon icon={faSearch} /></button> : "N/A"}</td>
                    </tr>
                </tbody>
            </table> 
        </>
    )
}

const ReviewPage: React.FC = (props:any) => {

    const {rank} = useParams();
    const {currentView, resetPage} = useContext(SearchContext);
    
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
                console.log(res.data)
                const {movie} = res.data[0]
                if(movie.substring(movie.length-5).toLowerCase() === ", the") res.data[0].movie = handleTitle(movie);
                setReview(res.data[0]);
                setProviders(res.data[1]);
            }
            setLoading(false);
        })
    }, [rank])

    const navClick = () => {
        props.history.goBack();
    }

    const fromCategory = (category?: string, value?: string) => {
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

{/* <table id="review-info">
                <tbody>
                    <tr>
                        <td>Year Released:</td>
                        <td>{review.year}</td>
                    </tr>
                    <tr>
                        <td>Runtime:</td>
                        <td>{review.runtime} minutes</td>
                    </tr>
                    <tr>
                        <td>Genre:</td>
                        <td>{review.genre? <button className="review-info-button" onClick={() => fromCategory('genres', review.genre as string)}>{review.genre}</button> : "N/A"}</td>

                    </tr>
                    <tr>
                        <td>Sub-Genre:</td>
                        <td>{review.subgenre? <button className="review-info-button" onClick={() => fromCategory('subGenres', review.subgenre as string)}>{review.subgenre}</button> : "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Studio/Company:</td>
                        <td>{review.studiocompany? <button className="review-info-button" onClick={() => fromCategory('studiocompanies', review.studiocompany as string)}>{review.studiocompany}</button> : "N/A"}</td>

                    </tr>
                    <tr>
                        <td>Universe:</td>
                        <td>{review.universe? <button className="review-info-button" onClick={() => fromCategory('universes', review.universe as string)}>{review.universe}</button> : "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Sub-Universe:</td>
                        <td>{review.subuniverse? <button className="review-info-button" onClick={() => fromCategory('subUniverses', review.subuniverse as string)}>{review.subuniverse}</button> : "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Character:</td>
                        <td>{review.character? <button className="review-info-button" onClick={() => fromCategory('characters', review.character as string)}>{review.character}</button> : "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Sport/Holiday:</td>
                        <td>{review.sportholiday? <button className="review-info-button" onClick={() => fromCategory('sportholidays', review.sportholiday as string)}>{review.sportholiday}</button> : "N/A"}</td>
                    </tr>
                </tbody>
            </table> */}