import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import { SearchContext } from '../utils/context';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { CSSTransition } from 'react-transition-group';

import { IconDefinition, faUser, faBars, faFilm, faDoorOpen} from '@fortawesome/free-solid-svg-icons'
import Logo from '../media/newLogo.jpg';
import Random from '../media/random.png';

interface HeaderMenuProps {
    nav: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    options: {route: string, icon: IconDefinition, text: string}[];
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({nav, options}) => (
    <div className="header-menu">
        {options.map(({route, icon ,text}) => 
            <button key={route} id={`${route}`} onClick={nav}><span><FontAwesomeIcon className="header-icon" icon={icon} size='lg'/></span>{text}</button>
        )}
    </div>
)


const Header: React.FC = () => {

    const history = useHistory();
    const {loggedIn, viewList, resetPage} = useContext(SearchContext);
    const [open, setOpen] = useState<boolean>(false);

    const showMenu = () => {
        setOpen(prev => !prev)
    }

    const toHome = () => {
        if(open) setOpen(false)
        if(viewList) resetPage();
        history.push('/');
    }

    const nav = (e: any) => {
        setOpen(false)
        history.push(`/${e.target.id}`);
    }

    const menuOptions = loggedIn?
    [
        {route: "profile", icon: faUser, text: "Profile"},
        {route: "logout", icon: faDoorOpen, text: "Logout"},
    ]:
    [
        {route: "register", icon: faUser, text: "Register"},
        {route: "login", icon: faDoorOpen, text: "Login"},
    ]

	return (
        <>
            <div id="header">
                <img id="logo" onClick={toHome} src={Logo} alt="LOGO" />
                {/* <div id="header-logo">
                    <img id="logo" src={Logo} alt="LOGO" />
                    
                </div> */}
                <button onClick={showMenu}><FontAwesomeIcon className="header-icon" icon={faBars} size="2x" /></button>
            </div>
            <CSSTransition
                in={open}
                appear={true}
                timeout={300}
                classNames="header-men"
                unmountOnExit
            >
                <HeaderMenu nav={nav} options={[{route: "random", icon: faFilm, text: "Random Movie Generator"}, ...menuOptions]}/>
            </CSSTransition>
        </>
	)
}

export default Header;