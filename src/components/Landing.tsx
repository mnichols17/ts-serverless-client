import React, {useState, useEffect, useContext} from 'react';
import request from '../utils/makeRequest';
import ReviewList from './ReviewList';
import Review from '../utils/Review';
import Search from './Search';
import ReactLoading from 'react-loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import smoothscroll from 'smoothscroll-polyfill';
import {SearchContext, FiltersType} from '../utils/context';


import {ReviewItem} from './ReviewList';

import Logo from '../media/logo.jpg';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import '../styles/home.css';

const Landing:React.FC = (props: any) => {

    const {loading, isLoading} = useContext(SearchContext);
    const [reviews, setReviews] = useState<Review[][]>([]);
    const landingTitles = [
        "Top 10 All-Time",
        "Top 10 of 2020",
        "Jeff's Picks of the Week",
        "Kenjac's Picks of the Week",
    ]

    useEffect(() => {
        console.log("LANDING")
        getReviews();
    }, [])

    const getReviews = async(reset?: boolean) => {
        request('reviews/landing', {skip: 0})
        .then(async(res: any) => {
            console.log(res.data)
            setReviews(res.data)
            isLoading(false);
        })
        .catch(err => console.error(err))
	}

    console.log(loading)
    return (
        loading? <ReactLoading type={"spin"} color={"yellow"}/> :
        <>
            {reviews.map(r => {
                const index = reviews.indexOf(r);
                return(
                    <div className="test-container" key={index}>
                        <h3 className="landing-title">{landingTitles[index]}</h3>
                        <div className="test">
                            {r.map(({rank, movie, total, poster}) => 
                                <ReviewItem key={rank} movie={movie} total={total} poster={poster} rank={rank} /> )}
                        </div>
                    </div>
                )
            })}
        </>
    )
}

export default Landing;

{/* <h3 className="landing-title">Jeff's Picks of the Week:</h3>
        {<div id="test">
            {reviews[1].map(({rank, movie, total, poster}) => 
                <ReviewItem key={rank} movie={movie} total={total} poster={poster} rank={rank} /> )}
        </div>} */}