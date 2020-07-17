import React from 'react';
//import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import InfiniteScroll from "react-infinite-scroll-component";
import Review from '../utils/Review';

import '../styles/reviewList.css';

const ReviewItem: React.FC<Review> = ({title, rating}) => {
    return(
        <li>
            <h4>{title}</h4>
            <h2>{rating}</h2>
        </li>
    )
}

interface ReviewListProps {
    reviews: Review[];
    getReviews: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({reviews, getReviews}) => {
    const LoadingItem = <li id="loading"><ReactLoading type={"spin"} color={"yellow"}/></li>
    return (
        <ul>
            <InfiniteScroll loader={LoadingItem} dataLength={reviews.length} next={getReviews} hasMore={true}>
                {reviews.map(({title, rating}) => <ReviewItem key={title} title={title} rating={rating}/>)}
            </InfiniteScroll>
        </ul>
    );
}

export default ReviewList;