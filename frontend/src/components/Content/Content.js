import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import axios from  '../Firebase/Database/Database';

import LoadingScreen from 'react-loading-screen';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import GalleryImages from './GalleryImages/GalleryImages'; 

class Content extends Component {

    state = {
        errorMessage : false,
        categories: null,
        photographList: null,
        route: null,
        isLoading : true,
        isLoadingMessage : "Loading...",
    }

    componentDidMount() {
        this.getCategories();
        this.getPhotographList();
        console.log("Did Mount");
        this.isLoading();
    }

    
    isLoading = () => {

        let i = 0;
        
        let loading = setInterval(() => {

            if(i > 10) {
                this.setState({isLoadingMessage : "An error occured. Please try again later."});
                clearInterval(loading);
            }
            else if(this.state.photographList && this.state.categories) {
                clearInterval(loading);
                this.setState({isLoading : false})
            }

            i++;

        }, 1500)
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
                <LoadingScreen 
                    loading={this.state.isLoading}
                    text="Loading..."
                    bgColor="#5eadc5"
                    textColor="white"
                    logoSrc="https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Floading_icon.gif?alt=media&token=b45c1ef0-cbbf-4227-8264-0c7fb15d7db9">
                    <Header/>
                    {routes}
                    <Footer/>
                </LoadingScreen>
            </>

        );
    }
}

export default Content;
