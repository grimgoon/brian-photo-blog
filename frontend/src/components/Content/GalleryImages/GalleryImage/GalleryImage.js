import React from 'react';

const GalleryImage = (props) => {

    return(
            <img 
                src={props.baseURL + props.id + "." + props.fileType + props.queryString}
                alt={props.index} />

    )
}


export default GalleryImage;