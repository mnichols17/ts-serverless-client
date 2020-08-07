import React, {useState, useEffect, useContext} from 'react';
import request from '../utils/makeRequest';
import Review from '../utils/Review';
import ReactLoading from 'react-loading';
import {SearchContext} from '../utils/context';
import {ReviewItem} from './ReviewList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'

const Landing:React.FC = (props: any) => {

    const {loading, isLoading, currentView} = useContext(SearchContext);
    const [reviews, setReviews] = useState<Review[][]>([]);
    const landingTitles = [
        "Top 10 All-Time",
        "Top 10 of 2020",
        "Jeff D Lowe's Streaming Picks of the Week",
        "Kenjac's Streaming Picks of the Week",
    ]

    useEffect(() => {
        console.log("LANDING")
        getReviews();
    }, [])

    const showList = () => {
        currentView(true); 
    }

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
                    <div className="landing-container" key={index}>
                        <h3 className="landing-title">{landingTitles[index]}<span className="landing-toList" hidden={index > 1} onClick={showList}> (Full Rankings <FontAwesomeIcon className="toList-icon" icon={faAngleDoubleRight} />)</span></h3>
                        <div className="landing-list">
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