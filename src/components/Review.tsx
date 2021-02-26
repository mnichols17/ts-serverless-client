import React, {useState, useEffect, useContext} from 'react';
import {useParams, Redirect} from 'react-router-dom';
import request from '../utils/makeRequest';
import {Review} from '../utils/entities';
import handleTitle from '../utils/handleTitle';
import ReactLoading from 'react-loading';
import ReactPlayer from 'react-player/youtube';
import {SearchContext} from '../utils/context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {ReviewItem} from './ReviewList';

import Back from '../media/back.png';
import Home from '../media/home.png';
import Average from '../media/average.png';
import JDL from '../media/jdl.png';
import KenJac from '../media/kenjac.png';
import GV from '../media/gv.png';
import Buttered from '../media/buttered.png';
import NotButtered from '../media/not_buttered.png';
import RT from '../media/rt.png';
import IMDB from '../media/imdb.png';
import Metacritic from '../media/metacritic.png';
import Podcast from '../media/podcast.jpg';
import Spotify from '../media/spotify.jpg';
import iTunes from '../media/itunes.jpg';
import { faSearch, faPlus, faTicketAlt} from '@fortawesome/free-solid-svg-icons'

const UserInteractions: React.FC = () => {

    const[text, setText] = useState<{body: string; add: boolean}>({body: "", add: false});
    const[watchlist, setWatchlist] = useState<boolean>(false);
    const[seenIt, setSeenIt] = useState<boolean>(false);

    const updateList = (list:string) => {
        console.log(list)
        if(list === 'seenit'){
            setSeenIt(prev => {
                setText({
                    body: prev? 'Movie removed from your SEEN IT' : 'Movie added to your SEEN IT',
                    add: !prev
                })
                return !prev
            });
        } else {
            setWatchlist(prev => {
                setText({
                    body: prev? 'Movie removed from your Watchlist' : 'Movie added to your Watchlist',
                    add: !prev
                })
                return !prev
            });
        }
    }

    return(
        <>
            <p hidden={!text.body.length} style={{color: text.add? '#6CEA4A':'tomato'}} id="review-userInteractions-text">{text.body}</p>
            <div id="review-userInteractions">
                <button id="watchlist" className={watchlist? 'active title-font' : 'title-font'} onClick={() => updateList('watchlist')} >
                    <FontAwesomeIcon icon={faPlus} size='xs'/>
                    Watchlist
                </button>
                <button id="seenit" className={seenIt? 'active title-font' : 'title-font'} onClick={() => updateList('seenit')}>
                    <FontAwesomeIcon icon={faTicketAlt} size='xs'/>
                    SEEN IT
                </button>
            </div>
        </>
    )
}

interface AwardProps {
    awards: (string|undefined)[][];
}

const ReviewAwards: React.FC<AwardProps> = ({awards}) => {

    const oscars: any[] = [];
    const gg: any[] = [];

    awards.forEach((award:any) => {
        if(award[0]){
            if(award[1] === "GoldenGlobes") gg.push(award)
            else oscars.push(award)
        }
    })

    return (
        (oscars.length && gg.lastIndexOf)? 
        <div id="review-awards">
            <p hidden={!oscars.length} className="review-people">Oscars</p>
            <ul className="awards-list">
                {oscars.map((oscar:any, index:number) => <li key={index} className="award">{oscar[1]} {oscar[0]}</li>)}
            </ul>
            <p hidden={!gg.length} className="review-people">Golden Globes</p>
            <ul className="awards-list">
                {gg.map((globe:any, index:number) => <li key={index} className="award">{globe[0]}</li>)}
            </ul>
        </div> : <p className="review-people">N/A</p>
    )
}

interface ScoreTableProps {
    icon: string;
    score: number;
    rank: number;
    holiday?: boolean;
}

export const ScoreTable: React.FC<ScoreTableProps> = ({icon, score, rank, holiday}) => {
    return (
        !holiday? <div className="score-row">
            <h1 className="title-font">{rank !== null? `#${rank}` : 'N/A'}</h1>
            <img className="score-img" alt='icon' src={icon} />
            <h1 className="title-font">{rank !== null? `${score}/100` : "N/A"}</h1>
        </div> : 
        <div className="score-row score-holiday">
            <h1 className="title-font">
                {rank !== null? <><span className="title-font">#</span>{rank}</> : <span className="title-font">N/A</span>}
            </h1>
            <img className="score-img" alt='icon' src={icon} />
            <h1 className="title-font">
                {rank !== null? <>{score}<span className="title-font">/</span>100</> : <span className="title-font">N/A</span>}
            </h1>
        </div>
    )
}

interface ProviderLogosProps {
    holiday?: boolean;
    providers: object[];
}

export const ProviderLogos: React.FC<ProviderLogosProps> = ({holiday, providers}) => {
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
            <h3 style={{color: holiday? '#9CE38B' : 'auto'}} id="streaming-title" className="title-font">Streaming Options</h3>
            <hr style={{borderColor: holiday? 'tomato' : 'auto'}} />
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
    similar: Review[];
    fromCategory: (category?: string, value?: string | number) => void
    navClick: () => void
}

const ReviewInfo: React.FC<ReviewInfoProps> = ({review, providers, similar, fromCategory, navClick}) => {

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
                {/* <UserInteractions /> */}
                <p id="review-plot">{review.plot}</p>
                <h3 className="review-detail title-font">Director</h3>
                <p id="review-director" className="review-people" onClick={() => fromCategory('directors', review.director)}>{review.director} <FontAwesomeIcon icon={faSearch} /></p>
                <h3 className="review-detail title-font">Starring</h3>
                <p className="review-people">{review.actors}</p>
                <h3 className="review-detail title-font">Awards</h3>
                <ReviewAwards awards={[[review.oscars, ""],
                            [review.oscars_animated, ""], 
                            [review.oscars_foreign, ""], 
                            [review.oscars_director, "Best Director:"], 
                            [review.best_actor, "Best Actor:"],
                            [review.support_actor, "Best Supporting Actor:"],
                            [review.best_actress, "Best Actress:"],
                            [review.support_actress, "Best Supporting Actress:"],
                            [review.goldenglobes, "GoldenGlobes"]
                        ]}/>
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
                    <tr hidden={review.avgrank === null}>
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
                    <tr hidden={review.revenue === "0"}>
                        <td>Box Office:</td>
                        <td>{review.revenue? `$${review.revenue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : 'N/A'} </td>
                    </tr>
                    <tr>
                        <td>Genre:</td>
                        <td>{(review.genre as string).split(', ').map((genre:string) => 
                                <button key={genre} className="review-info-button search-icon" onClick={() => fromCategory('genres', genre)}>{genre} <FontAwesomeIcon icon={faSearch} /></button>
                            )}
                        </td>

                    </tr>
                    <tr hidden={!review.subgenre}>
                        <td>Sub-Genre:</td>
                        <td>{review.subgenre? (review.subgenre as string).split(', ').map((sg:string) => 
                                <button key={sg} className="review-info-button search-icon" onClick={() => fromCategory('subGenres', sg)}>{sg} <FontAwesomeIcon icon={faSearch} /></button>
                            ): null}
                        </td>
                    </tr>
                    <tr hidden={!review.studiocompany}>
                        <td>Studio/Company:</td>
                        <td>{review.studiocompany? (review.studiocompany as string).split(', ').map((sc:string) => 
                                <button key={sc} className="review-info-button search-icon" onClick={() => fromCategory('studiocompanies', sc)}>{sc} <FontAwesomeIcon icon={faSearch} /></button>
                            ): null}
                        </td>
                    </tr>
                    <tr hidden={!review.universe}>
                        <td>Universe:</td>
                        <td>{review.universe? (review.universe as string).split(', ').map((sc:string) => 
                                <button key={sc} className="review-info-button search-icon" onClick={() => fromCategory('universes', sc)}>{sc} <FontAwesomeIcon icon={faSearch} /></button>
                            ) : null}
                        </td>
                    </tr>
                    <tr hidden={!review.subuniverse}>
                        <td>Sub-Universe:</td>
                        <td>{review.subuniverse? (review.subuniverse as string).split(', ').map((sc:string) => 
                                <button key={sc} className="review-info-button search-icon" onClick={() => fromCategory('subUniverses', sc)}>{sc} <FontAwesomeIcon icon={faSearch} /></button>
                            ) : null}
                        </td>
                    </tr>
                    <tr hidden={!review.character}>
                        <td>Character/Actor:</td>
                        <td>{review.character? (review.character as string).split(', ').map((c:string) => 
                                <button key={c} className="review-info-button search-icon" onClick={() => fromCategory('characters', c)}>{c} <FontAwesomeIcon icon={faSearch} /></button>
                            ): null}
                        </td>
                    </tr>
                    <tr hidden={!review.sport}>
                        <td>Sport:</td>
                        <td>{review.sport? <button className="review-info-button search-icon" onClick={() => fromCategory('sportholidays', review.sport as string)}>{review.sport} <FontAwesomeIcon icon={faSearch} /></button> : "N/A"}</td>
                    </tr>
                    <tr hidden={!review.holiday}>
                        <td>Holiday:</td>
                        <td>{review.holiday? <button className="review-info-button search-icon" onClick={() => fromCategory('sportholidays', review.holiday as string)}>{review.holiday} <FontAwesomeIcon icon={faSearch} /></button> : "N/A"}</td>
                    </tr>
                </tbody>
            </table> 
            <div style={{display: review.spotify? 'grid' : 'none'}} id="review-pod" className="pod-grid">
                <img alt="subscribe" src={Podcast} />
                <a href={`https://open.spotify.com/episode/${review.spotify}`} target="_blank" rel="noopener noreferrer"><img alt="spotify" src={Spotify} /></a>
                <a href={`https://podcasts.apple.com/us/podcast/lights-camera-barstool/id1279516571?i=${review.itunes}`} target="_blank" rel="noopener noreferrer"><img alt="itunes" src={iTunes} /></a>
            </div>
            <div id="review-similar" className="landing-container">
                <h3 className="review-detail title-font">Similar Movies</h3>
                <div className="landing-list">
                    {similar.map(({id, avgrank, movie, avgtotal, poster, oscar_winner, goldenglobes}) => 
                                <ReviewItem key={id} id={id} movie={movie} avgrank={avgrank} avgtotal={avgtotal}  poster={poster} 
                                oscar_winner={oscar_winner} goldenglobes={goldenglobes} actors={'average'} /> )}
                </div>
            </div>
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
    const[similar, setSimilar] = useState<Review[]>([])

    useEffect(() => {
        if(review.id !== rank && review.id !== undefined) setLoading(true);
        request('GET', `reviews/movie/${rank}`)
        .then((res: any) => {
            if(!res.data[0]) {
                alert("No Movie Found!")
            } else {
                const {movie} = res.data[0]
                if(movie.substring(movie.length-5).toLowerCase() === ", the") res.data[0].movie = handleTitle(movie);
                document.title = `${res.data[0].movie} (${res.data[0].year}) | The Movie Ranking Database`;
                setReview(res.data[0]);
                setProviders(res.data[1]);
                setSimilar(res.data[2]);
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
                : <ReviewInfo review={review} providers={providers} similar={similar} fromCategory={fromCategory} navClick={navClick} />}
        </div>
    )
}

export default ReviewPage;