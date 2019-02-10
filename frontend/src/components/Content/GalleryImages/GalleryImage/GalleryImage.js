import React from 'react';

const GalleryImage = (props) => {

    return(
        <img src={props.baseURL + props.id + "." + props.fileType + props.queryString} alt="meep" />
    )
}


export default GalleryImage;