import React, {useState, useContext} from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import {Review} from '../utils/entities';
import handleTitle from '../utils/handleTitle';
import ReactLoading from 'react-loading';
import {SearchContext} from '../utils/context';
import updateList from '../utils/updateList';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTicketAlt } from '@fortawesome/free-solid-svg-icons'

import '../styles/reviewList.css';
import ButteredIcon from '../media/buttered.png';
import NotButteredIcon from '../media/not_buttered.png';
import OscarsLogo from '../media/oscars_logo.png';
import GlobesLogo from '../media/globes_logo.png';

export const ReviewItem: React.FC<Review> = ({id, movie, poster, avgtotal, avgrank, oscar_winner, goldenglobes, actors, listed, seen}) => {
    if(movie.substring(movie.length-5).toLowerCase() === ", the") movie = handleTitle(movie);
    const total = avgtotal;
    const rank = avgrank;
    const img_src = poster? false
    : id === 6969? "https://lh3.googleusercontent.com/-hE37W6LEh0M/XzoUom1xj1I/AAAAAAAAApc/X5_tkwnlmEsCVgNgFaUxEdOyIRgTUteiACK8BGAsYHg/s512/2020-08-16.jpg"
    : 'https://pbs.twimg.com/media/ELsOD8iWwAEd_9b.jpg:large'

    const {loggedIn} = useContext(SearchContext);
    const [watchlist, setWatchlist] = useState<boolean>(listed || false);
    const [seenIt, setSeenIt] = useState<boolean>(seen || false);

    const updateListIcons = (list:string) => {
        if(list === 'watchlist'){
            setWatchlist(prev => {
                updateList(id as number, 'watch', !prev)
                return !prev
            })
        } else {
            setSeenIt(prev => {
                updateList(id as number, 'seen', !prev)
                return !prev
            })
        }
    }
    
    return(
        <div className="movie">
            <Link className="movie-link" to={`/review/${id}`}>
                <img className="movie-poster" src={img_src || `https://image.tmdb.org/t/p//w220_and_h330_face${poster}`} alt={movie}/>
                <div className="info">
                    <div className="info-review">
                        <img className='rank-type-icon' alt="rank-type" src={require(`../media/${actors}.png`)} />
                        <p className="movie-total">{total !== null? `${total}/100` : "N/A"}</p>
                        <img hidden={total === null} className="butter" alt="butter" src={total >= 69 ? ButteredIcon : NotButteredIcon} />
                    </div>
                    <p className="movie-title">{movie}</p>
                    <div className="movie-accolades">
                        <img className="accolade-icon" alt="oscar" hidden={!oscar_winner} src={OscarsLogo} />
                        <img className="accolade-icon" alt="oscar" hidden={!(goldenglobes === "Best Picture: Musical or Comedy (Winner)" || goldenglobes === "Best Picture: Drama (Winner)")} src={GlobesLogo} />
                        <p className="movie-rank">#{rank}</p>
                    </div>
                </div>
            </Link>
            {loggedIn? <div className="movie-icons">
                <FontAwesomeIcon id="watchlist" onClick={() => updateListIcons('watchlist')} className={watchlist? "movie-icon watch-active" : "movie-icon"} icon={faPlus} />
                <FontAwesomeIcon id='seenIt' onClick={() => updateListIcons('seenit')}  className={seenIt? "movie-icon seen-active" : "movie-icon"} icon={faTicketAlt} />
            </div> : null}
        </div>
    ) 
}

interface ReviewListProps {
	fromUserList?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({fromUserList}) => {

    const {reviews, url, filters, page, more, getReviews} = useContext(SearchContext);
    
    const moreReviews = () => {
        getReviews(url, filters, page);
    }

    const LoadingItem = <div id="loading"><ReactLoading type={"spin"} color={"yellow"}/></div>
    return (
        !reviews.length? <h2 id="empty">No results found</h2> : 
        <InfiniteScroll className="infinitescroll" loader={LoadingItem} dataLength={reviews.length} next={moreReviews} hasMore={more}>
            {reviews.map(({id, avgrank, jlrank, kjrank, avgtotal, jeff, kenjac, movie, poster, oscar_winner, goldenglobes, listed, seen}) => {
                    const total = (jeff as number) >= 0? jeff as number : (kenjac as number) >= 0? kenjac as number : avgtotal;
                    return <ReviewItem key={id} id={id} movie={movie} avgrank={jlrank || kjrank || avgrank} avgtotal={total} 
                        poster={poster} oscar_winner={oscar_winner} actors={(jeff as number) >= 0? "jdl" : (kenjac as number) >= 0? 'kenjac' : 'average'} goldenglobes={goldenglobes} 
                        listed={listed} seen={seen}/>
                })}
        </InfiniteScroll>
    );
}

export default ReviewList;