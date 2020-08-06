import React, {useState, useEffect} from 'react';
import {useParams, Redirect} from 'react-router-dom';
import request from '../utils/makeRequest';
import Review from '../utils/Review';
import handleTitle from '../utils/handleTitle';
import ReactLoading from 'react-loading';
import ReactPlayer from 'react-player/youtube';

interface ReviewInfoProps {
    review: Review;
    providers: object[];
}

interface ProviderLogosProps {
    providers: object[];
}

const ProviderLogos: React.FC<ProviderLogosProps> = ({providers}) => {
    const main:number[] = [8,15,9,337,384,27,386,387,78,350,43]
    let logos:any[] = [];
    providers.forEach((provider:any) => {
        const logo = <a target="_blank" rel="noopener noreferrer" href={provider.url} key={provider.provider_id}>
                        <img className="provider" src={require(`../media/providers/${provider.provider_id}.png`)} alt={provider.provider_id}/>
                    </a>

        main.includes(parseInt(provider.provider_id))? logos.push(logo) : logos.unshift(logo);
    })
    return (
        <div id="review-streaming">
            <h3 style={{color: '#FEDE16'}}>Streaming Options</h3>
            <hr />
            {providers.length? <><p>Click to Watch</p>
            <div style={{display: 'flex', justifyContent: 'center', flexWrap: "wrap"}}>
                {logos.slice().reverse().map(l => l)}
            </div></> : <h2>No Streaming Options Available</h2>}
        </div>
    )
}

const ReviewInfo: React.FC<ReviewInfoProps> = ({review, providers}) => {
    return(
        !review.director? <Redirect push to="/" /> :
        <>
            <h2 id="reviewPage-title">{review.movie}</h2>
            <h1 id="review-rank">Rank: #{review.rank}</h1>
            <img id="review-poster" src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${review.poster}`} alt="POSTER" />
            <div id="review-card">
                <h1 id="review-total">Score: {review.total}/100</h1>
                <p id="review-plot">{review.plot}</p>
                <h3 style={{color: '#FEDE16'}}>Director</h3>
                <p className="review-people">{review.director}</p>
                <h3 style={{color: '#FEDE16'}}>Starring</h3>
                <p className="review-people">{review.actors}</p>
                <h3 style={{color: '#FEDE16'}}>Awards</h3>
                {(review.oscars || review.goldenglobes)? <><p className="review-people">{review.oscars? `${review.oscars} at The Oscars` : null}</p>
                <p className="review-people">{review.goldenglobes? `${review.goldenglobes} at The Golden Globes` : null}</p></> : 
                <p className="review-people">N/A</p>}
                <ProviderLogos providers={providers} />
                <div id="review-trailer-wrapper">
                    <ReactPlayer className="react-player" url={`https://www.youtube.com/watch?v=${review.video_key}`} height="100%" width="100%" controls={true}/>
                </div>
            </div>
            <table id="review-info">
                <tbody>
                    <tr>
                        <td>Year Released:</td>
                        <td>{review.year}</td>
                    </tr>
                    <tr>
                        <td>Runtime:</td>
                        <td>{review.runtime} minutes</td>
                    </tr>
                    <tr>
                        <td>Genre:</td>
                        <td>{review.genre}</td>
                    </tr>
                    <tr>
                        <td>Sub-Genre:</td>
                        <td>{review.subgenre || "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Studio/Company:</td>
                        <td>{review.studiocompany || "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Universe:</td>
                        <td>{review.universe || "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Sub-Universe:</td>
                        <td>{review.subuniverse || "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Character:</td>
                        <td>{review.character || "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Sport/Holiday:</td>
                        <td>{review.sportholiday || "N/A"}</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

const ReviewPage: React.FC = (props) => {

    const {rank} = useParams();
    const[loading, setLoading] = useState<boolean>(true);
    const[review, setReview] = useState<Review>({
        movie: "",
        total: -1
    })
    const[providers, setProviders] = useState<object[]>([])

    useEffect(() => {
        request(`reviews/movie/${rank}`)
        .then((res: any) => {
            if(!res.data) {
                alert("No Movie Found!")
            } else {
                const {movie} = res.data[0]
                if(movie.substring(movie.length-5).toLowerCase() === ", the") res.data[0].movie = handleTitle(movie);
                setReview(res.data[0]);
                setProviders(res.data[1]);
            }
            setLoading(false);
        })
    }, [rank])

    return(
        <div id="reviewPage">
            {loading? <ReactLoading className="reviewPage-loading" type={"spin"} color={"yellow"} height={"10vh"} width={"10vh"}/> : <ReviewInfo review={review} providers={providers} />}
        </div>
    )
}

export default ReviewPage;