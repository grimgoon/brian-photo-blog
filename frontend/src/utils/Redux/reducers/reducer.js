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
            photographList : null,
        }
        case actionTypes.UPDATE_CATEGORY_LIST :
        return {
            ...state,
            categoryList : null,
        }
        default : 
            return {
                ...state
            }
    }
}

export default reducer;