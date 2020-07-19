import React, {useState, useEffect} from 'react';
import { useParams} from 'react-router-dom';
import request from '../utils/makeRequest';
import Review from '../utils/Review';
import handleTitle from '../utils/handleTitle';
import ReactLoading from 'react-loading';

interface ReviewInfoProps {
    review: Review;
}

const ReviewInfo: React.FC<ReviewInfoProps> = ({review}) => {
    const {rank, movie, total, director, genre, subgenre, universe, subuniverse, character, sportholiday, year, poster} = review;
    return(
        <>
            <h2>{movie}</h2>
            <h2>Score: {total} (#{rank})</h2>
            <img src={poster} />
            <table id="movieReviews">
                <thead>
                    <tr>
                        <th>Streaming</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>0000</td>
                        <td>0000</td>
                        <td>0000</td>
                        <td>0000</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <tbody>
                    <tr>
                        <td>Director:</td>
                        <td>{director}</td>
                    </tr>
                    <tr>
                        <td>Year Released:</td>
                        <td>{year}</td>
                    </tr>
                    <tr>
                        <td>Genre:</td>
                        <td>{genre}</td>
                    </tr>
                    <tr>
                        <td>Sub-Genre:</td>
                        <td>{subgenre || "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Universe:</td>
                        <td>{universe || "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Sub-Universe:</td>
                        <td>{subuniverse || "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Character:</td>
                        <td>{character || "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Sport/Holiday:</td>
                        <td>{sportholiday || "N/A"}</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

const ReviewPage: React.FC = () => {

    const {rank} = useParams();
    const[loading, setLoading] = useState<boolean>(true);
    const [review, setReview] = useState<Review>({
        movie: "",
        total: -1
    })

    useEffect(() => {
        request(`reviews/movie/${rank}`)
        .then((res: any) => {
            // if(!res.data) alert & back to home here
            setLoading(false);
            const {movie} = res.data
            if(movie.substring(movie.length-5).toLowerCase() === ", the") res.data.movie = handleTitle(movie);
            setReview(res.data);
        })
    }, [])

    return(
        <div id="reviewPage">
            {loading? <ReactLoading className="reviewPage-loading" type={"spin"} color={"yellow"} width={'25%'}/> : <ReviewInfo review={review} />}
        </div>
    )
}

export default ReviewPage;