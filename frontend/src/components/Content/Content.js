import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import axios from  '../Firebase/Database/Database';

// import FirebaseStorage from '../Firebase/Storage';
// import Firebase from 'firebase/app';
// import 'firebase/storage';

import Header from '../Header/Header';
import GalleryImages from './GalleryImages/GalleryImages'; 


class Content extends Component {

    state = {
        errorMessage : false,
        categories: null,
        photographList: null,
        route: null,
    }

    componentDidMount() {
        this.getCategories();
        console.log("Did Mount");
    }

    getPhotographList = () => {

        axios.get('/photographs.json')
        .then(res => {
            let photographs = [];
            for(let key in  res.data) {
                photographs.push({
                    id: key,
                    ...res.data[key]
                });
            }

            this.setState({photographList : photographs});
        }).catch(err => {
            // Fix Error Handling
        });
  
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
            this.setRoute();
            this.setState({categories : categoryLinks});
        }).catch(err => {
            // Fix Error Handling
        });
    }


    setRoute = () => {
        if(this.state.categories) {
            
            let routeCheck = false;

            if(this.props.match.url === "/" & this.props.match.isExact) {
                routeCheck = "all";     
            }
            else if(this.props.match.url === "/category" && !this.props.match.isExact) {
 
                let splitLocation = this.props.location.pathname.split('/category/');

                const findCategory = this.state.categories.find((category) => (category.id === splitLocation[1]));
                if(findCategory) {
                    routeCheck = splitLocation[1]
                }
                else {
                    // RETURN 404
                }
            }

            if(routeCheck) {
                return <GalleryImages filter={routeCheck}></GalleryImages>
            }

            else
            {
                // return <Route path={this.props.match.url + "/:category"} render={() => <GalleryImages></GalleryImages>}/>;
                // RETURN 404 Route
            }  
        }
        else {
            // Error Handling
        }
    }

    setRoute2 = () => {
        if(this.state.categories) {
            let routes = [<Route key={0} exact path="/" render={() => <GalleryImages error={this.state.errorMessage} photoList={this.state.photographList} getList={this.getPhotographList} filter="all"></GalleryImages>}/>];
            for(let key in this.state.categories) {
                let categoryId = this.state.categories[key].id;
                routes.push(<Route key={key+1} exact path={"/category/" + categoryId} render={() => <GalleryImages error={this.state.errorMessage} photoList={this.state.photographList} getList={this.getPhotographList} filter={categoryId}></GalleryImages>}/>);
            }

            let returnRoutes = <>{routes.map((route) => (route))}</>
            return returnRoutes;
        }
        else {
            // 404 Route
        }
    }

    render() {

        let routes = this.setRoute2()

        return (
            <>
            <Header/>
            {routes}
            </>
        );
    }
}

export default Content;

// Create Spinner
//Get list of all photographs from Database
// Get list of exisiting categories
// Define which route you're on
// If you're on an exisiting route, keep going. Otherwise Display 404-page
// Apply filter to list of which photographs should be be generated
// Generate GalleryImage image components
// Display images
// Hide Spinner 