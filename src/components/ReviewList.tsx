import React from 'react';
//import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import InfiniteScroll from "react-infinite-scroll-component";
import Review from '../utils/Review';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

import '../styles/reviewList.css';

const ReviewItem: React.FC<Review> = ({movie, total, poster, rank}) => {
    return(
        <div className="movie">
            <img className="movie-poster" src={poster} alt={movie}/>
            <div className="info">
                <div className="info-review">
                    <p className="movie-total"><FontAwesomeIcon className="star" icon={faStar}/>{total}</p>
                    <p className="movie-rank">#{rank}</p>
                </div>
                <p className="movie-title">{movie}</p>
            </div>
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