import React, {useState, useEffect, useContext, useRef} from 'react';
import List from './List';
import Search from './Search';
import { SearchContext } from '../utils/context';
import makeRequest from '../utils/makeRequest';
import { Review, Player } from '../utils/entities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface GameFormProps {
    players: Player[],
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
    setGameState: React.Dispatch<React.SetStateAction<number>>,
}

const GameForm: React.FC<GameFormProps> = ({players, setPlayers, setGameState}) => {

    const handleChange = (num: number, updatedPlayer: Player) => {
        setPlayers(prev => {
            return prev.map((player, idx) => idx === num? {...player, ...updatedPlayer } : player) 
        })
    }

    const addNewPlayer = (e: any) => {
        e.preventDefault()
        setPlayers(prev => {
            console.log([...prev, {name: "", score: [0]}])
            return [...prev, {name: "", score: [0]}]
        })
    }

    const removePlayer = (index: number) => {
        if(players.length > 1) setPlayers(prev => prev.filter((p, idx) => idx !== index))
    }

    return (
        <form className="gameForm">
            {players.map((player, idx) => {
                return (
                    <div className="gameForm-playerLabel">
                        <label className='gameForm-label' key={idx}>Name
                            <input type="text" value={player.name} onChange={(e) => handleChange(idx, {...player, name: e.target.value})} />
                        </label>
                        <FontAwesomeIcon className="gameForm-removePlayer" onClick={() => removePlayer(idx)} icon={faTimes} size="lg"/>
                    </div>
                )
            })}
            <div className="gameForm-btnGroup">
                {players.length < 4 && <button className="gameForm-btn title-font" onClick={addNewPlayer}>Add Player</button>}
                <button className="gameForm-btn title-font" onClick={() => setGameState(1)}>Start Game</button>
            </div>
        </form>
    )
}

interface AssignTurnProps {
    players: Player[]
    turn: number;
    setGameState: React.Dispatch<React.SetStateAction<number>>,
}

const AssignTurn: React.FC<AssignTurnProps> = ({players, turn, setGameState}) => {

    useEffect(() => {
        setTimeout(() => setGameState(2), 1000)
    }, [])

    return (
        <h2>{players[turn].name} select a movie for {turn+1 > players.length? players[0].name : players[turn+1].name}</h2>
    )
}

interface SelectMovieProps {
}

const SelectMovie: React.FC<SelectMovieProps> = () => {

    const[open, setOpen] = useState<boolean>(false);

    // useEffect(() => {
    //     setTimeout(() => setGameState(2), 1000)
    // }, [])

    return (
        <React.Fragment>
            <Search open={open} setOpen={setOpen} hide={true}/>
            <List />
        </React.Fragment>
    )
}

const Game:React.FC = () => {

    const currList = useRef(true);
    const {loading, reviews, url, filters, page, getReviews, isLoading, currentUrl} = useContext(SearchContext);
    
    const[watchlist, setList] = useState<boolean>(true)

    const [players, setPlayers] = useState<Player[]>([{name: "", score: [0]}])
    const [gameState, setGameState] = useState<number>(0)
    const [turn, setTurn] = useState<number>(0);

    useEffect(() => {

    }, [])

    const startGame = () => {

    }



    console.log(watchlist)
    return(
        <div id="game">
            {gameState === 0 && <GameForm players={players} setPlayers={setPlayers} setGameState={setGameState} />}
            {gameState === 1 && <AssignTurn players={players} turn={turn} setGameState={setGameState} />}
            {gameState === 2 && <SelectMovie /> }
            {/* {gameState === 3 && GUESS RT SCORE */}
            {/* {gameState === 4 && SHOW CURRENT SCOREBOARD? */}
        </div>
    )
}

export default Game;