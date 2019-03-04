import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import styles from './NavLinks.module.css';
import axios from '../../Firebase/Database/Database';

class NavLinks extends Component {

    state = {
        categories: [],
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

        console.log(this.state.categories.length);

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


        if(categories.length > 3) {
            return <div>{navlinks}</div>
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

        return (
            <>
                <div className={styles.linkContainer}>
                    <NavLink exact className={styles.link} activeClassName={styles.active} to="/">Home</NavLink>
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