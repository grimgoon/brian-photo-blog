import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';

import styles from './NavLinks.module.css';

class NavLinks extends Component {

    state = {
        dropdownLength : 3,
        isMobileMenuOpen : false,
    };

    componentDidMount() {
    }

    createDesktopLinks = () => {

        console.log("hah!")

        const categories = this.props.categories;
        const navlinks = categories.map((mapCategory) => (
            <NavLink 
                key={mapCategory.id}
                exact
                className={styles.link} 
                activeClassName={styles.active}
                to={"/category/" + mapCategory.id}>
                {mapCategory.name}
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

        const navlinks = this.props.categories.map((mapCategory,i) => (
            <div key={i} onClick={this.mobileToggleHandler}>
            <NavLink 
                key={mapCategory.id}
                exact
                className={styles.mobileLink}
                activeClassName={styles.active}
                to={"/category/" + mapCategory.id}>
                {mapCategory.name}
            </NavLink>
            </div>
        ));

         let isMenuOpen = this.state.isMobileMenuOpen ? "flex" : "none"; 

        const dropdownContent =
            <>
                <div onClick={this.mobileToggleHandler} className={styles.mobileMenuButton}>
                    <img src="https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fmenu.png?alt=media&token=eb1d6c10-21c1-4f61-950f-bcdba5d79c15" alt="Menu Navigation Icon"/>
                </div>
                <div className={styles.mobileMenuContent} style={{display : isMenuOpen}}>
                    <div onClick={this.mobileToggleHandler}><NavLink exact className={styles.mobileLink} activeClassName={styles.active} to="/">Home</NavLink></div>
                    {navlinks}
                </div>
            </>
        
        return dropdownContent;
    }

    mobileToggleHandler = () => {
        this.setState((prevState,props) => {
            return {isMobileMenuOpen : !prevState.isMobileMenuOpen}
        })
    }

    render () {

       

        const desktopLinks = this.props.categories ? this.createDesktopLinks() : null;
        const mobileLinks =  this.props.categories ? this.createMobileLinks() : null;

        const isDropdown =  this.props.categories ? this.props.categories.length > this.state.dropdownLength : false;

        const containerJustify = isDropdown ? "flex-start" : "space-evenly"
        const homeMargin = isDropdown ? "10%" : "0px";

        console.log(desktopLinks);

        return (
            <>
                <div
                    style={{justifyContent : containerJustify}} 
                    className={styles.linkContainer}>
                    <NavLink style={{marginLeft : homeMargin, marginRight : homeMargin}} exact className={styles.link} activeClassName={styles.active} to="/">Home</NavLink>
                    {desktopLinks}
                </div>
    
                <div className={styles.mobileLinkContainer}>
                    {mobileLinks}
                </div>
            </>
    
            
        );
    }

}

const mapStateToProps = state => ({
    categories : state.categoryList
})


export default connect(mapStateToProps)(NavLinks);