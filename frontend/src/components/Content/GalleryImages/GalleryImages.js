import React from 'react';
import GalleryImage from './GalleryImage/GalleryImage';
import styles from './GalleryImages.module.css';

const GalleryImages = (props) => {

    const baseImageURL = "https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/photographs%2F";
    const queryString =  "?alt=media";

    let images;

    let group1 = [];
    let group2 = [];

    if(!props.photoList && !props.error) {
        props.getList();
    }
    else {  

        let photoFilter;

        if(props.filter === "all") {
            photoFilter = () => true;
        }
        else {
            photoFilter = (photo) => (Object.keys(photo.categories).find(category => category === props.filter) === undefined ? false : true)
        }

        images = props.photoList.filter(photoFilter).map((photo) => (<GalleryImage key={photo.id} baseURL={baseImageURL} queryString={queryString} id={photo.id} fileType={photo.fileType} />));
        
        // TODO: Implement support for "Groups"

    }

    return (
        <div className={styles.images}>
            {images}
        </div>
    );

}

export default GalleryImages;