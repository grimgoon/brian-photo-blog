import React, { Component } from 'react';
import {Route} from 'react-router-dom';

import Header from '../Header/Header';
import GalleryImage from './GalleryImage/GalleryImage'; 


class Content extends Component {

    state = {
        errorMessage : false
    }

    componentDidMount() {
    }

    getRoute = () => {

    }

    render() {

        let route = "";

        return (
            <>
            <Header/>
            {route}
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


// import FirebaseConfig from '../Firebase/Firebase';
// import Firebase from 'firebase/app';
// import 'firebase/storage';