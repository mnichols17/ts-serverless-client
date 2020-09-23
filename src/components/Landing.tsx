import React, {useState, useEffect, useContext} from 'react';
import request from '../utils/makeRequest';
import {Review} from '../utils/entities';
import ReactLoading from 'react-loading';
import {SearchContext} from '../utils/context';
import {ReviewItem} from './ReviewList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import OMDB from '../media/omdb.png';
import Subscribe from '../media/subscribe.jpg';
import Weekly from '../media/weekly.png';
import Spotify from '../media/spotify.jpg';
import iTunes from '../media/itunes.jpg';

const Landing:React.FC = (props: any) => {

    const {loading, isLoading, currentView, resetPage} = useContext(SearchContext);
    const [reviews, setReviews] = useState<Review[][]>([]);

    const landingTitles = [
        "Newest Releases",
        "Jeff D. Lowe's Picks",
        "KenJac's Picks",
        "Guest Picks: Glenny Balls (@Glenny_balls)",
        "Top 10 All-Time",
        "Jeff D. Lowe's Top 10",
        "KenJac's Top 10",
        "Top 10 of 2020",
    ]

    useEffect(() => {
        isLoading(true);
        getReviews();
    }, [])

    const showList = (e: any) => {
        switch(e.target.id){
            case('5'):
                resetPage({ratings: {value: 'jeff', label: <span className="filter-flex">Jeff D. Lowe <img className="filter-icon" src={require(`../media/jdl.png`)} alt={'test'}/></span>}})
                break;
            case('6'):
                resetPage({ratings: {value: 'kenjac', label: <span className="filter-flex">KenJac <img className="filter-icon" src={require(`../media/kenjac.png`)} alt={'test'}/></span>}})
                break;
            case('7'):
                resetPage({years: [{value: '2020', label: '2020'}]})
                break;
            default:
                break;
        }
        isLoading(true);
        currentView(true); 
        window.scrollTo({top: 0})
    }

    const getReviews = async() => {
        request('GET', 'reviews/landing')
        .then(async(res: any) => {
            setReviews(res.data)
            isLoading(false);
        })
        .catch(err => console.error(err))
    }
    
    let looper = -1;

    return (
        loading? <ReactLoading type={"spin"} color={"yellow"}/> :
        <>
            {reviews.map((r, index) => {
                looper = index === 4? 0 : looper + 1;
                return(
                    <div className="landing-container" key={index}>
                        <img hidden={index !== 1} src={Weekly} alt="Weekly"/>
                        <h3 className='landing-weekly' hidden={index !== 1}>Week of 9/20 - 9/26</h3>
                        <hr hidden={index !== 4} />
                        <div className="landing-label">
                            <h3 className="landing-title title-font">{landingTitles[index]}</h3>
                            <h3 id={`${index}`} className="landing-toList" hidden={index < 4} onClick={showList}> (Full Rankings <FontAwesomeIcon className="toList-icon" icon={faAngleDoubleRight} />)</h3>
                        </div>
                        <div className="landing-list">
                            {r.map(({id, avgrank, jlrank, kjrank, movie, avgtotal, jeff, kenjac, poster, buttered, oscar_winner, goldenglobes, listed, seen}) => {
                                return <ReviewItem key={id} id={id} movie={movie} avgrank={jlrank || kjrank || avgrank} avgtotal={jeff || kenjac || avgtotal}  poster={poster} 
                                buttered={buttered} oscar_winner={oscar_winner} goldenglobes={goldenglobes} actors={(looper % 3 === 0)? 'average' : (looper === 1 || looper === 4)? 'jdl' : "kenjac"} 
                                listed={listed} seen={seen}/> 
                            })}
                        </div>
                    </div>
                )
            })}
            <div id="footer">
                <div id="landing-credit">
                    <h4>Movie information and posters from</h4>
                    <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer"><img alt="TMDB" src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" /></a>
                    <a href="http://www.omdbapi.com/" target="_blank" rel="noopener noreferrer"><img id="landing-omdb" alt="OMDB" src={OMDB} /></a>
                </div>
                <div id='footer-podcast' className="pod-grid">
                    <img alt="subscribe" src={Subscribe} />
                    <a href="http://sptfy.com/lcbpod" target="_blank" rel="noopener noreferrer"><img alt="spotify" src={Spotify} /></a>
                    <a href="https://apple.co/lcbpodcast" target="_blank" rel="noopener noreferrer"><img alt="itunes" src={iTunes} /></a>
                </div>
            </div>
        </>
    )
}

export default Landing;
