import React from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import Review from '../utils/Review';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import handleTitle from '../utils/handleTitle';
import ReactLoading from 'react-loading';

import '../styles/reviewList.css';

const ReviewItem: React.FC<Review> = ({movie, total, poster, rank}) => {
    if(movie.substring(movie.length-5).toLowerCase() === ", the") movie = handleTitle(movie);

    return(
        <div className="movie">
            <Link className="movie-link" to={`/review/${rank}`}>
                <img className="movie-poster" src={poster} alt={movie}/>
                <div className="info">
                    <div className="info-review">
                        <p className="movie-total"><FontAwesomeIcon className="star" icon={faStar}/>{total}/100</p>
                        <p className="movie-rank">#{rank}</p>
                    </div>
                    <p className="movie-title">{movie}</p>
                </div>
            </Link>
        </div>
    )
}

interface ReviewListProps {
    reviews: Review[];
    getReviews: (reset: boolean, fromScroll: boolean) => void;
    more: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({reviews, getReviews, more}) => {
    const LoadingItem = <li id="loading"><ReactLoading type={"spin"} color={"yellow"}/></li>
    return (
        !reviews.length ? <h2 id="empty">No results found</h2> : 
        <InfiniteScroll style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}} loader={LoadingItem} dataLength={reviews.length} next={() => getReviews(false, true)} hasMore={more}>
            {reviews.map(({rank, movie, total, poster}) => <ReviewItem key={rank} movie={movie} total={total} poster={poster} rank={rank} /> )}
        </InfiniteScroll>
    );
}

export default ReviewList;