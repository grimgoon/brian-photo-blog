import React from 'react';

const GalleryImage = (props) => {

    let orientation = "portrait";

    if(props.width > props.height) {

        orientation = "landscape";

        if(props.width > (props.height * 1.5)) {
            orientation = "bigLandscape"
        }
    }

    return(
            <img
                onClick={() => props.clickHandler(props.id,props.fileType,orientation)}
                src={props.baseURL + props.id + "." + props.fileType + props.queryString}
                alt={props.index} />

    )
}


export default GalleryImage;