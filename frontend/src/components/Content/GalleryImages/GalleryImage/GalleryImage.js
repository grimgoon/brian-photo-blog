import React from 'react';

const GalleryImage = (props) => {

    return(
        <div>
            <img 
                src={props.baseURL + props.id + "." + props.fileType + props.queryString}
                alt={props.index} />
        </div>

    )
}


export default GalleryImage;