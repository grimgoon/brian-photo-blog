import React from 'react';
import LazyLoading from 'react-lazyload'


const GalleryImage = (props) => {

    let orientation = "portrait";

    if(props.width > props.height) {

        orientation = "landscape";

        if(props.width > (props.height * 1.5)) {
            orientation = "bigLandscape"
        }
    }

    let image = <img
        onClick={() => props.clickHandler(props.id,props.fileType,orientation)}
        src={props.baseURL + props.id + "." + props.fileType + props.queryString}
        alt={props.index} />  

    if(props.index >= 10){
        return(
            <LazyLoading once offset={400}>
                {image}
            </LazyLoading>
        )
    }
    else {
        return image
    }
}


export default GalleryImage;