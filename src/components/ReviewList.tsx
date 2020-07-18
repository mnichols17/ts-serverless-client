import React from 'react';
//import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import InfiniteScroll from "react-infinite-scroll-component";
import Review from '../utils/Review';

import '../styles/reviewList.css';

const ReviewItem: React.FC<Review> = ({movie, total, poster}) => {
    return(
        <div className="movie-card">
            <img className="movie-poster" src={poster} alt={movie}/>
            <p className="movie-total">{total}</p>
            <p className="movie-title">{movie}</p>
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
        <InfiniteScroll style={{display: 'flex', flexWrap: 'wrap'}} loader={LoadingItem} dataLength={reviews.length} next={() => getReviews(false, true)} hasMore={more}>
            {reviews.map(({rank, movie, total, poster}) => <ReviewItem key={rank} movie={movie} total={total} poster={poster} /> )}
        </InfiniteScroll>
    );
}

export default ReviewList;