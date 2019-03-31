import * as actionTypes from '../actions/actions';

const initialState = {
    photographList : null,
    categoryList : null,
}

const reducer = (state = initialState, action) => {

    switch(action.type) {
        case actionTypes.UPDATE_PHOTOGRAPH_LIST :
        return {
            ...state,
            photographList : action.payload.photographList
        }
        case actionTypes.UPDATE_CATEGORY_LIST :
        return {
            ...state,
            categoryList : action.payload.categoryList,
        }
        default : 
            return {
                ...state
            }
    }
}

export default reducer;