import React from 'react';
import LazyLoading from 'react-lazyload'
import cloudinary from 'cloudinary-core';



const GalleryImage = (props) => {

    const cloudinaryCore = new cloudinary.Cloudinary({cloud_name: 'grimgoon'});

    let orientation = "portrait";

    if(props.width > props.height) {

        orientation = "landscape";

        if(props.width > (props.height * 1.5)) {
            orientation = "bigLandscape"
        }
    }

    let image = <img
        onClick={() => props.clickHandler(props.id,props.fileType,orientation)}
        src={cloudinaryCore.url(props.id)}
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