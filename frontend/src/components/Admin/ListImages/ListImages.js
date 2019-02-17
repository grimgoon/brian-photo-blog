import React from 'react'; 
import styles from './ListImages.module.scss';

const ListImages = (props) => {

    // TODO: Make this text prettier if no images were found
    let List = "No Images could be found";

    // TODO: Outsource to Redux
    const baseImageURL = "https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/photographs%2F";
    const queryString =  "?alt=media";

    if(props.images) {
        List = props.images.map(listItem => (
            <div 
                onChange={props.checkboxHandler}
                key={listItem.id} 
                className={styles.listItem}>
                    <input
                        name={listItem.id}
                        type="checkbox"
                        id={listItem.id}
                        className={styles.checkbox}     
                    />
                    <label htmlFor={listItem.id}>
                        <img 
                            className={styles.listItemThumbnail}
                            alt={listItem.id}
                            src={baseImageURL + listItem.id + "." + listItem.fileType + queryString}
                        />
                        <span className={styles.categories}>
                            <b>Categories: </b>{Object.values(listItem.categories).map(category => category + ', ')}
                        </span>
                    </label>
            </div>
        ))
    }

    // TODO: Add LazyLoading / Pagination to not load everything at once.

    return (
        <div className={styles.listImages}>
            {List}
        </div>
    )
}

export default ListImages;