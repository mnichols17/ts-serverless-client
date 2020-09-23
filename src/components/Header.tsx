import React, {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import { SearchContext } from '../utils/context';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
// import ReactCSSTransitionGroup from 'react-transition-group';

import { IconDefinition, faUser, faBars, faFilm, faDoorOpen, faList} from '@fortawesome/free-solid-svg-icons'
import Logo from '../media/newLogo.jpg';

interface HeaderMenuProps {
    nav: (route: string) => (e:any) => void;
    options: {route: string, icon: IconDefinition, text: string}[];
    // horizontal: boolean;
    width: number;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({nav, options, width}) => (
    <div className="header-nav">
        {options.map(({route, icon ,text}) => 
            <button key={route} onClick={nav(route)}><FontAwesomeIcon className="header-icon" icon={icon} size={'2x'}/>{text}</button>
        )}
    </div>
    // <div className="header-menu">
    //     {options.map(({route, icon ,text}) => 
    //         <button key={route} onClick={nav(route)}><span><FontAwesomeIcon className="header-icon" icon={icon} size='lg'/></span>{text}</button>
    //     )}
    // </div>
)

const getWindowDimensions = () => {
    const {innerWidth: width, innerHeight: height} = window;
    return {width, height};
  }


const Header: React.FC = () => {

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const history = useHistory();
    const {loggedIn, viewList, resetPage} = useContext(SearchContext);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
          setWindowDimensions(getWindowDimensions());
        }
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

    // const showMenu = () => {
    //     setOpen(prev => !prev)
    // }

    const toHome = () => {
        if(open) setOpen(false)
        if(viewList) resetPage();
        history.push('/');
    }

    const nav = (route: string) => (e: any) => {
        setOpen(false)
        history.push(`/${route}`);
    }

    const menuOptions = loggedIn?
    [
        {route: "profile", icon: faUser, text: "Profile"},
        {route: "lists", icon: faList, text: "Lists"},
    ]:
    [
        {route: "register", icon: faUser, text: "Register"},
        {route: "login", icon: faDoorOpen, text: "Login"},
    ]

	return (
        <>
            <div id="header">
                <div id="header-content">
                    <img id="logo" onClick={toHome} src={Logo} alt="LOGO" />
                    <HeaderMenu 
                        nav={nav} 
                        options={[{route: "random", icon: faFilm, text: "Random"}, ...menuOptions]}
                        width={windowDimensions.width}
                    />
                    {/* {windowDimensions.width > 500? <HeaderMenu 
                        nav={nav} 
                        options={[{route: "random", icon: faFilm, text: "RMG"}, ...menuOptions]}
                        horizontal={true}
                    />:
                    <button onClick={showMenu}><FontAwesomeIcon className="header-icon" icon={faBars} size="2x" /></button>} */}
                </div>
            </div>
            {/* {open && <HeaderMenu 
                nav={nav} 
                options={[{route: "random", icon: faFilm, text: "Random Movie Generator"}, ...menuOptions]}
                horizontal={false}
            />} */}
            {/* <ReactCSSTransitionGroup
                in={open}
                appear={true}
                timeout={300}
                classNames="header-men"
                unmountOnExit
            >
                <HeaderMenu nav={nav} options={[{route: "random", icon: faFilm, text: "Random Movie Generator"}, ...menuOptions]}/>
            </ReactCSSTransitionGroup> */}
        </>
	)
}

export default Header;