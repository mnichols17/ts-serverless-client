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
                <img className="movie-poster" src={`https://image.tmdb.org/t/p//w220_and_h330_face${poster}`} alt={movie}/>
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
    getReviews: () => void;
    more: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({reviews, getReviews, more}) => {
    console.log("HIT RL", reviews.length)
    const LoadingItem = <div id="loading"><ReactLoading type={"spin"} color={"yellow"}/></div>

    return (
        !reviews.length ? <h2 id="empty">No results found</h2> : 
        <InfiniteScroll className="infinitescroll" loader={LoadingItem} dataLength={reviews.length} next={getReviews} hasMore={more}>
            {reviews.map(({rank, movie, total, poster}) => 
                <ReviewItem key={rank} movie={movie} total={total} poster={poster} rank={rank} /> )}
        </InfiniteScroll>
    );
}

export default ReviewList;