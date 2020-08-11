import React, {useState, useEffect, useContext} from 'react';
import request from '../utils/makeRequest';
import Review from '../utils/Review';
import ReactLoading from 'react-loading';
import {SearchContext} from '../utils/context';
import {ReviewItem} from './ReviewList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faStar, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import JDL from '../media/jdl.png';
import KenJac from '../media/kenjac.png';
import OscarsLogo from '../media/oscars_logo.png';
import GlobesLogo from '../media/globes_logo.png';
import Buttered from '../media/buttered.png';
import NotButtered from '../media/not_buttered.png';

const Landing:React.FC = (props: any) => {

    const {loading, isLoading, currentView, resetPage} = useContext(SearchContext);
    const [reviews, setReviews] = useState<Review[][]>([]);
    const landingTitles = [
        "Top 10 All-Time",
        "Top 10 of 2020",
        "Jeff D. Lowe's Streaming Picks of the Week",
        "KenJac's Streaming Picks of the Week",
    ]

    useEffect(() => {
        getReviews();
    }, [])

    const showList = (e: any) => {
        if(e.target.id === '1') resetPage({years: [{value: '2020', label: '2020'}]})
        isLoading(true);
        currentView(true); 
    }

    const getReviews = async(reset?: boolean) => {
        request('reviews/landing', {skip: 0})
        .then(async(res: any) => {
            setReviews(res.data)
            isLoading(false);
        })
        .catch(err => console.error(err))
	}

    return (
        loading? <ReactLoading type={"spin"} color={"yellow"}/> :
        <>
            <div id="landing-glossary">
                <h2 id="avg" ><FontAwesomeIcon className="glossary-icon" icon={faStar} /> Average Rating</h2>
                <h2 id="jeff" ><img className="glossary-img" alt='jeff' src={JDL} /> Jeff D. Lowe's Rating</h2>
                <h2 id="kjc" ><img className="glossary-img" alt='kenjac' src={KenJac} /> KenJac's Rating</h2>
                <h2 id="oscars" ><img className="glossary-img" alt='oscars' src={OscarsLogo} /> Best Picture (Oscars)</h2>
                <h2 id="globes" ><img className="glossary-img" alt='globes' src={GlobesLogo} /> Best Picture (Golden Globes)</h2>
                <h2 id="butter" ><img className="glossary-img" alt='butter' src={Buttered} /> Buttered</h2>
                <h2 id="no_butter"><img className="glossary-img" alt='not_butter' src={NotButtered} /> Not Buttered</h2>
            </div>
            {reviews.map(r => {
                const index = reviews.indexOf(r);
                return(
                    <div className="landing-container" key={index}>
                        <div className="landing-label">
                            <h3 className="landing-title title-font">{landingTitles[index]}</h3>
                            <h3 id={`${index}`} className="landing-toList" hidden={index > 1} onClick={showList}> (Full Rankings <FontAwesomeIcon className="toList-icon" icon={faAngleDoubleRight} />)</h3>
                        </div>
                        <div className="landing-list">
                            {r.map(({id, avgrank, jlrank, kjrank, movie, avgtotal, jeff, kenjac, poster, buttered, oscars, goldenglobes}) => 
                                <ReviewItem key={id} id={id} movie={movie} avgrank={jlrank || kjrank || avgrank} avgtotal={jeff || kenjac || avgtotal}  poster={poster} 
                                buttered={buttered} oscars={oscars} goldenglobes={goldenglobes} actors={index < 2? 'avg' : index === 2? 'jdl' : "kenjac"} /> )}
                        </div>
                    </div>
                )
            })}
        </>
    )
}

export default Landing;