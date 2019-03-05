import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import styles from './NavLinks.module.css';
import axios from '../../Firebase/Database/Database';

class NavLinks extends Component {

    state = {
        categories: [],
        dropdownLength : 3
    };

    componentDidMount() {
        this.getCategories();

    }

    getCategories = () => {

        axios.get('/categories.json')
        .then(res => {
            let categoryLinks = [];
            for(let key in  res.data) {
                categoryLinks.push({
                    id: key,
                    value : res.data[key]
                });
            }
            this.setState({categories : categoryLinks});
        }).catch(err => {
            // Fix Error Handling
        });

        
    }

    //TODO: Create dropdown for categories if the amount of categories go over X amount 

    createDesktopLinks = () => {

        const categories = this.state.categories;
        const navlinks = categories.map((mapCategory) => (
            <NavLink 
                key={mapCategory.id}
                exact
                className={styles.link} 
                activeClassName={styles.active} 
                to={"/category/" + mapCategory.id}>
                {mapCategory.value}
            </NavLink>
        ));   

        if(categories.length > this.state.dropdownLength) {

            const dropdownContent = 
                <div className={styles.dropdown}>
                    <div className={styles.dropbtn}>Categories <img src="https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fdrop-down-arrow.png?alt=media&token=2eb80e6c-bff9-457f-80ba-7d6214617c0f" alt="Dropdown Arrow"/></div>
                    <div className={styles.dropdown_content}>
                        {navlinks}
                    </div>
                </div>

            
            return dropdownContent;
        }
        else {
            return navlinks;  
        }  
    }


    createMobileLinks = () => {
        return this.state.categories.map((mapCategory) => (
            <NavLink 
                key={mapCategory.id}
                exact
                className={styles.mobileLink}
                activeClassName={styles.active}
                to={"/category/" + mapCategory.id}>
                {mapCategory.value}
            </NavLink>
        ));
    }

    render () {

        const desktopLinks = this.createDesktopLinks();
        const mobileLinks = this.createDesktopLinks();

        const isDropdown = this.state.categories.length > this.state.dropdownLength;

        const containerJustify = isDropdown ? "flex-start" : "space-evenly"
        const homeMargin = isDropdown ? "10%" : "0px";

        return (
            <>
                <div
                    style={{justifyContent : containerJustify}} 
                    className={styles.linkContainer}>
                    <NavLink style={{marginLeft : homeMargin}} exact className={styles.link} activeClassName={styles.active} to="/">Home</NavLink>
                    {desktopLinks}
                </div>
    
                <div className={styles.mobileLinkContainer}>
                    <NavLink exact className={styles.mobileLink} activeClassName={styles.active} to="/">Home</NavLink>
                    {mobileLinks}
                </div>
            </>
    
            
        );
    }

}

export default NavLinks;