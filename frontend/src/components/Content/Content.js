import React, { Component } from 'react';
import {Route} from 'react-router-dom';

// Redux
import * as actionCreators from '../../utils/store/actions/actions';
import {connect} from 'react-redux';


import LoadingScreen from 'react-loading-screen';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import GalleryImages from './GalleryImages/GalleryImages'; 

class Content extends Component {

    imageCount = 0;
    imageCountCap = 5; // TODO: Fix so it does this scales depending on the amount of images per category

    state = {
        errorMessage : false,
        categories: null,
        route: null,
        isLoading : false,
        isLoadingMessage : "Loading...",
    }

    componentDidMount() {
        
        this.props.fetchPhotographList();
        this.props.fetchCategoryList();
        // this.getCategory();
        this.isLoading();
    }

//     getCategory = async () => {
//         const requestCategories = await requests.getCategoryList();
//         this.props.updateCategoryList(requestCategories);
// }

    imageLoadHandler = () => {
        this.imageCount++;
    }

    isLoading = () => {

        let i = 0;
        
        let loading = setInterval(() => {

            if(i > 10) {
                this.setState({isLoadingMessage : "An error occured. Please try again later."});
                clearInterval(loading);
            }
            else if(this.props.photographList && this.props.categoryList && this.imageCount >= this.imageCountCap) {
                clearInterval(loading);
                this.setState({isLoading : false})
            }
            i++;

        }, 1500)
    }

    setRoute = () => {
        if(this.props.categoryList) {
            
            let routeCheck = false;

            if(this.props.match.url === "/" & this.props.match.isExact) {
                routeCheck = "all";     
            }
            else if(this.props.match.url === "/category" && !this.props.match.isExact) {
 
                let splitLocation = this.props.location.pathname.split('/category/');

                const findCategory = this.props.categoryList.find((category) => (category.id === splitLocation[1]));
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
        if(this.props.categoryList) {
            let routes = [
                <Route 
                    key={0}
                    exact
                    path="/"
                    render={() => 
                        <GalleryImages 
                            imageCountCap={this.imageCountCap}
                            imageHandler={this.imageLoadHandler}
                            error={this.state.errorMessage}
                            photoList={this.props.photographList}
                            getList={this.getPhotographList} 
                            filter="all">
                        </GalleryImages>
                    }
                />
            ];
            
            
            
            for(let key in this.props.categoryList) {
                let categoryId = this.props.categoryList[key].id;
                routes.push(<Route key={key+1} exact path={"/category/" + categoryId} render={() => <GalleryImages imageCountCap={this.imageCountCap} imageHandler={this.imageLoadHandler} error={this.state.errorMessage} photoList={this.props.photographList} getList={this.getPhotographList} filter={categoryId}></GalleryImages>}/>);
            }

            let returnRoutes = <>{routes.map((route) => (route))}</>
            return returnRoutes;
        }
        else {
            // 404 Route
        }
    }

    render() {
        let routes = this.setRoute2();
        
        return (
            <>  
                <LoadingScreen 
                    loading={this.state.isLoading}
                    text={this.state.isLoadingMessage}
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

const mapStateToProps = state => {
    return {
        photographList : state.photographList,
        categoryList : state.categoryList
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPhotographList : () => dispatch(actionCreators.fetchPhotographs()),
        fetchCategoryList : () => dispatch(actionCreators.fetchCategories()),
        // updatePhotographList : (photographList) => dispatch({type : actionCreators.UPDATE_PHOTOGRAPH_LIST, payload : {photographList}}),
        // updateCategoryList : (categoryList) => dispatch({type : actionCreators.UPDATE_CATEGORY_LIST, payload : {categoryList}}),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Content);
