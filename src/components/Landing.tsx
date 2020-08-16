import React, {useState, useEffect, useContext} from 'react';
import request from '../utils/makeRequest';
import Review from '../utils/Review';
import ReactLoading from 'react-loading';
import {SearchContext} from '../utils/context';
import {ReviewItem} from './ReviewList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import OMDB from '../media/omdb.png';

const Landing:React.FC = (props: any) => {

    const {loading, isLoading, currentView, resetPage} = useContext(SearchContext);
    const [reviews, setReviews] = useState<Review[][]>([]);

    const landingTitles = [
        "Top 10 All-Time",
        "Jeff D. Lowe's Picks of the Week",
        "Jeff D. Lowe's Top 10",
        "KenJac's Picks of the Week",
        "KenJac's Top 10",
        "Top 10 of 2020",
    ]

    useEffect(() => {
        getReviews();
    }, [])

    const showList = (e: any) => {
        switch(e.target.id){
            case('2'):
                resetPage({ratings: {value: 'jeff', label: 'Jeff D. Lowe'}})
                break;
            case('4'):
                resetPage({ratings: {value: 'kenjac', label: 'KenJac'}})
                break;
            case('5'):
                resetPage({years: [{value: '2020', label: '2020'}]})
                break;
            default:
                break;
        }
        isLoading(true);
        currentView(true); 
    }

    const getReviews = async() => {
        request('reviews/landing', {skip: 0}) // Remove skip?
        .then(async(res: any) => {
            setReviews(res.data)
            isLoading(false);
        })
        .catch(err => console.error(err))
	}

    return (
        loading? <ReactLoading type={"spin"} color={"yellow"}/> :
        <>
            {reviews.map(r => {
                const index = reviews.indexOf(r);
                return(
                    <div className="landing-container" key={index}>
                        <div className="landing-label">
                            <h3 className="landing-title title-font">{landingTitles[index]}</h3>
                            <h3 id={`${index}`} className="landing-toList" hidden={index === 1 || index === 3} onClick={showList}> (Full Rankings <FontAwesomeIcon className="toList-icon" icon={faAngleDoubleRight} />)</h3>
                        </div>
                        <div className="landing-list">
                            {r.map(({id, avgrank, jlrank, kjrank, movie, avgtotal, jeff, kenjac, poster, buttered, oscars, goldenglobes}) => 
                                <ReviewItem key={id} id={id} movie={movie} avgrank={jlrank || kjrank || avgrank} avgtotal={jeff || kenjac || avgtotal}  poster={poster} 
                                buttered={buttered} oscars={oscars} goldenglobes={goldenglobes} actors={(index === 0 || index === 5)? 'average' : index < 3? 'jdl' : "kenjac"} /> )}
                        </div>
                    </div>
                )
            })}
            <div id="landing-credit">
                <h4>Movie information and posters from</h4>
                <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer"><img alt="TMDB" src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" /></a>
                <a href="http://www.omdbapi.com/" target="_blank" rel="noopener noreferrer"><img id="landing-omdb" alt="OMDB" src={OMDB} /></a>
            </div>
        </>
    )
}

export default Landing;
