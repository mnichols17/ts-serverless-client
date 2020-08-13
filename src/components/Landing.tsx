import React, {useState, useEffect, useContext} from 'react';
import request from '../utils/makeRequest';
import Review from '../utils/Review';
import ReactLoading from 'react-loading';
import {SearchContext} from '../utils/context';
import {ReviewItem} from './ReviewList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import Average from '../media/average.png';
import JDL from '../media/jdl.png';
import KenJac from '../media/kenjac.png';
import OscarsLogo from '../media/oscars_logo.png';
import GlobesLogo from '../media/globes_logo.png';
import Buttered from '../media/buttered.png';
import NotButtered from '../media/not_buttered.png';

const Landing:React.FC = (props: any) => {

    const {loading, isLoading, currentView, resetPage} = useContext(SearchContext);
    const [reviews, setReviews] = useState<Review[][]>([]);
    const [iconDetail, setDetail] = useState<string>("Click/hover on each icon to learn about it");

    const landingTitles = [
        "Top 10 All-Time",
        "Top 10 of 2020",
        "Jeff D. Lowe's Top 10",
        "KenJac's Top 10",
        "Jeff D. Lowe's Picks of the Week",
        "KenJac's Picks of the Week",
    ]

    const glossaryIcons: {detail: string, source: string}[] = [
        {detail: "Average Rating", source: Average},
        {detail: "Jeff D. Lowe's Rating", source: JDL},
        {detail: "KenJac's Rating", source: KenJac},
        {detail: "Buttered (69 or above)", source: Buttered},
        {detail: "Not Buttered (68 or below)", source: NotButtered},
        {detail: "Best Picture (Oscars)", source: OscarsLogo},
        {detail: "Best Picture (Golden Globes)", source: GlobesLogo},
    ]

    useEffect(() => {
        getReviews();
    }, [])

    const showList = (e: any) => {
        if(e.target.id === '1') resetPage({years: [{value: '2020', label: '2020'}]})
        else if(parseInt(e.target.id) % 2 === 0) resetPage({ratings: {value: 'jeff', label: 'Jeff D. Lowe'}})
        else if(parseInt(e.target.id) % 2 === 1) resetPage({ratings: {value: 'kenjac', label: 'KenJac'}})
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
            <div id="glossary-content">
                <h2 className="title-font glossary-title">Icons Glossary</h2>
                <h2 id="glossary-detail">{iconDetail}</h2>
                <div id="glossary-icons">
                    {glossaryIcons.map(({detail, source}) => {
                        return <img key={source} onMouseEnter={() => setDetail(detail)} onMouseLeave={() => setDetail("Click/hover on each icon to learn about it")} className={iconDetail === detail? "glossary-img glossary-selected" : "glossary-img"} alt={detail} src={source} />
                    })}
                </div>
            </div>
            {reviews.map(r => {
                const index = reviews.indexOf(r);
                return(
                    <div className="landing-container" key={index}>
                        <div className="landing-label">
                            <h3 className="landing-title title-font">{landingTitles[index]}</h3>
                            <h3 id={`${index}`} className="landing-toList" hidden={index > 3} onClick={showList}> (Full Rankings <FontAwesomeIcon className="toList-icon" icon={faAngleDoubleRight} />)</h3>
                        </div>
                        <div className="landing-list">
                            {r.map(({id, avgrank, jlrank, kjrank, movie, avgtotal, jeff, kenjac, poster, buttered, oscars, goldenglobes}) => 
                                <ReviewItem key={id} id={id} movie={movie} avgrank={jlrank || kjrank || avgrank} avgtotal={jeff || kenjac || avgtotal}  poster={poster} 
                                buttered={buttered} oscars={oscars} goldenglobes={goldenglobes} actors={index < 2? 'average' : index % 2 === 0? 'jdl' : "kenjac"} /> )}
                        </div>
                    </div>
                )
            })}
        </>
    )
}

export default Landing;
