import React from 'react'; 
import styles from './ListImages.module.scss';
import LazyLoad from 'react-lazyload';

const ListImages = (props) => {

    // TODO: Make this text prettier if no images were found or pass to the errorMessage state
    let List = "";

    // TODO: Outsource to Redux
    const baseImageURL = "https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/photographs%2F";
    const queryString =  "?alt=media";

    const lazyLoadOffset = props.images.length > 5 ? -100 : 0 

    if(props.images) {
        List = props.images.map(listItem => (
            <LazyLoad offset={lazyLoadOffset} height={60} key={listItem.id}>
                <div 
                    onChange={props.checkboxHandler}
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
                                src={baseImageURL + listItem.id + '.' + listItem.fileType + queryString}
                            />
                            <span className={styles.categories}>
                                <b>Categories: </b>{Object.values(listItem.categories).map(category => category + ', ')}
                            </span>
                        </label>
                </div>
        </LazyLoad>
        ))
    }

    return (
        <div className={styles.listImages}>
            {List}
        </div>
    )
}

export default ListImages;