import React from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import Review from '../utils/Review';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import handleTitle from '../utils/handleTitle';
import ReactLoading from 'react-loading';

import '../styles/reviewList.css';
import ButteredIcon from '../media/buttered.png';
import NotButteredIcon from '../media/not_buttered.png';
import OscarsLogo from '../media/oscars_logo.png';
import GlobesLogo from '../media/globes_logo.png';

export const ReviewItem: React.FC<Review> = ({id, movie, poster, avgtotal, avgrank, buttered, oscars, goldenglobes, actors}) => {
    if(movie.substring(movie.length-5).toLowerCase() === ", the") movie = handleTitle(movie);
    const total = avgtotal;
    const rank = avgrank;
    console.log(actors);
    return(
        <div className="movie">
            <Link className="movie-link" to={`/review/${id}`}>
                <img className="movie-poster" src={`https://image.tmdb.org/t/p//w220_and_h330_face${poster}`} alt={movie}/>
                <div className="info">
                    <div className="info-review">
                        <img className="butter" alt="butter" src={buttered? ButteredIcon : NotButteredIcon} />
                        <p className="movie-total">{total}/100</p>
                        {actors === 'avg'? <FontAwesomeIcon className="rank-type-star" icon={faStar} /> : <img className='rank-type-icon' alt="rank-type" src={require(`../media/${actors}.png`)} />}
                    </div>
                    <p className="movie-title">{movie}</p>
                    <div className="movie-accolades">
                        <img className="accolade-icon" alt="oscar" hidden={oscars !== "Best Picture (Winner)"} src={OscarsLogo} />
                        <img className="accolade-icon" alt="oscar" hidden={!(goldenglobes === "Best Picture: Musical or Comedy (Winner)" || goldenglobes === "Best Picture: Drama (Winner)")} src={GlobesLogo} />
                        <p className="movie-rank">#{rank}</p>
                    </div>
                </div>
            </Link>
        </div>
    )
}

interface ReviewListProps {
    reviews: Review[];
    getReviews: () => void;
    more: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({reviews, getReviews, more}) => {
    const LoadingItem = <div id="loading"><ReactLoading type={"spin"} color={"yellow"}/></div>

    return (
        !reviews.length ? <h2 id="empty">No results found</h2> : 
        <InfiniteScroll className="infinitescroll" loader={LoadingItem} dataLength={reviews.length} next={getReviews} hasMore={more}>
            {reviews.map(({id, avgrank, jlrank, kjrank, avgtotal, jeff, kenjac, movie, poster, buttered, oscars, goldenglobes}) =>
                <ReviewItem key={id} id={id} movie={movie} avgrank={jlrank || kjrank || avgrank} avgtotal={jeff || kenjac || avgtotal} 
                    poster={poster} buttered={buttered} actors={jeff? "jdl" : kenjac? 'kenjac' : 'avg'} oscars={oscars} goldenglobes={goldenglobes} />)}
        </InfiniteScroll>
    );
}

export default ReviewList;