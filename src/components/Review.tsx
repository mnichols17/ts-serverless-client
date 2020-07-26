import React, {useState, useEffect} from 'react';
import {useParams, Redirect} from 'react-router-dom';
import request from '../utils/makeRequest';
import Review from '../utils/Review';
import handleTitle from '../utils/handleTitle';
import ReactLoading from 'react-loading';

interface ReviewInfoProps {
    review: Review;
    providers: object[];
}

interface ProviderLogosProps {
    providers: object[];
}

const ProviderLogos: React.FC<ProviderLogosProps> = ({providers}) => {
    let logos = [];
    for (const [key, value] of Object.entries(providers)) {
        logos.push(<a target="_blank" rel="noopener noreferrer" href={value.toString()} key={key}><img className="provider" src={require(`../media/providers/${key}.png`)} /></a>)
    }
    return (
        <div style={{display: 'flex', justifyContent: 'center', flexWrap: "wrap"}}>
            {logos.map(l => l)}
        </div>
    )
}

// style={{fontSize: review.movie.length < 12 ? "2em" : ""}
const ReviewInfo: React.FC<ReviewInfoProps> = ({review, providers}) => {
    return(
        !review.director? <Redirect push to="/" /> :
        <>
            <h2 id="reviewPage-title">{review.movie}</h2>
            <h1 id="review-rank">Rank: #{review.rank}</h1>
            <img id="review-poster" style={{maxWidth: '300px'}} src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${review.poster}`} alt="POSTER" />
            <div id="review-card">
                <h1 id="review-total">Score: {review.total}/100</h1>
                <p>{review.plot}</p>
                <div id="review-streaming">
                    <h3>Streaming</h3>
                    <hr />
                    <div style={{color: "gray"}}>
                    </div>
                </div>
                <ProviderLogos providers={providers} />
                <h4>Cast</h4>
                <p>{review.actors}</p>
                <table id="review-info">
                    <tbody>
                        <tr>
                            <td>Director:</td>
                            <td>{review.director}</td>
                        </tr>
                        <tr>
                            <td>Year Released:</td>
                            <td>{review.year}</td>
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
            </div>
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
                console.log(res.data)
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