import React from 'react'; 
import styles from './ListImages.module.css';

const ListImages = (props) => {

    let List = "Neep";

    if(props.images) {
        List = "Yeep";
    }

    return (
        <div>
            {List}
        </div>
    )
}

export default ListImages;