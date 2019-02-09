import React from 'react';
import {NavLink} from 'react-router-dom';
import styles from './NavLinks.module.css';


const NavLinks = (props) => {
    
    return (
        <>
            <div className={styles.linkContainer}>
                <NavLink exact className={styles.link} activeClassName={styles.active} to="/">Home</NavLink>
                <NavLink exact className={styles.link} activeClassName={styles.active} to="/">Landscape</NavLink>
                <NavLink exact className={styles.link} activeClassName={styles.active} to="/">Animals</NavLink>
                <NavLink exact className={styles.link} activeClassName={styles.active} to="/">Black & White</NavLink>
            </div>

            <div className={styles.mobileLinkContainer}>
                <NavLink exact className={styles.mobileLink} activeClassName={styles.active} to="/">Home</NavLink>
                <NavLink exact className={styles.mobileLink} activeClassName={styles.active} to="/">Landscape</NavLink>
                <NavLink exact className={styles.mobileLink} activeClassName={styles.active} to="/">Animals</NavLink>
                <NavLink exact className={styles.mobileLink} activeClassName={styles.active} to="/">Black & White</NavLink>
            </div>
        </>

        
    );
}

export default NavLinks;