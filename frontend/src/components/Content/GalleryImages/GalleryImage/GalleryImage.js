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
        alt={props.index}
        onLoad={props.imageHandler}/>  

    if(props.index >= props.imageCountCap){
        return(
            <LazyLoading once offset={800}>
                {image}
            </LazyLoading>
        )
    }
    else {
        return image
    }
}


export default GalleryImage;