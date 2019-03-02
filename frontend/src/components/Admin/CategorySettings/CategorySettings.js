import React from 'react';
import styles from './CategorySettings.module.css';

const CategorySettings = (props) => {

    console.log(props.categories);

    return (
        <div className={styles.container}>
            <div className={styles.header}>Category Settings</div>
            {props.categories.map(category => (
                <div 
                    className={styles.item} 
                    key={category.id}>
                    <div className={styles.name}>
                        {category.name}         
                    </div>
                    <div className={styles.deleteCategory}>
                        <img alt="Delete Button" src="https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fdelete_image.png?alt=media&amp;token=111cebaa-7814-49c9-a2fb-050082ce04ea"/>
                    </div>
                </div>
            ))}
        </div>
    );

}

export default CategorySettings;