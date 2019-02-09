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

    render () {

        let desktopLinks = this.state.categories.map((mapCategory) => (<NavLink key={mapCategory.id} exact className={styles.link} activeClassName={styles.active} to={"/category/" + mapCategory.id}>{mapCategory.value}</NavLink>));
        let mobileLinks = this.state.categories.map((mapCategory) => (<NavLink key={mapCategory.id} exact className={styles.mobileLink} activeClassName={styles.active} to={"/category/" + mapCategory.id}>{mapCategory.value}</NavLink>));

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