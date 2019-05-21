import * as requests from '../../Firebase/Requests/requests';

export const UPDATE_PHOTOGRAPH_LIST = 'UPDATE_PHOTOGRAPH_LIST';
export const UPDATE_CATEGORY_LIST = 'UPDATE_CATEGORY_LIST';


export const fetchPhotographs = () => (dispatch,getState) => {
    requests.getPhotographList().then((result) => dispatch(updatePhotographList(result))).catch();
}

export const updatePhotographList = result => ({
    type: UPDATE_PHOTOGRAPH_LIST,
    photographList : result
})

export const fetchCategories = () => (dispatch,getState) => {
    requests.getCategoryList().then((result) => dispatch(updateCategoryList(result))).catch();   
}

export const updateCategoryList = result => ({
    type: UPDATE_CATEGORY_LIST,
    categoryList : result
});

/////////////////////////////