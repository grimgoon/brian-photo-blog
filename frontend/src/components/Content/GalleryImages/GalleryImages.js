import React from 'react';

const GalleryImages = (props) => {

    const baseImageURL = "https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Photographs%2F";
    const queryString =  "?alt=media";



    return (<div>{props.filter}</div>);

}


export default GalleryImages;