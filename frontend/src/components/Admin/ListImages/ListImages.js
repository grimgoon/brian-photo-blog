import React from 'react'; 
import styles from './ListImages.module.css';

const ListImages = (props) => {

    // TODO: Make this text prettier if no images were found
    let List = "No Images could be found";

    // TODO: Outsource to Redux
    const baseImageURL = "https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/photographs%2F";
    const queryString =  "?alt=media";


    if(props.images) {
        List = props.images.map(listItem => (
            <div 
                key={listItem.id} 
                className={styles.listItem}>
                    <img 
                        className={styles.listItemThumbnail}
                        alt={listItem.id}
                        src={baseImageURL + listItem.id + "." + listItem.fileType + queryString}
                    />
            </div>
        ))
    }

    return (
        <div className={styles.listImages}>
            {List}
        </div>
    )
}

export default ListImages;