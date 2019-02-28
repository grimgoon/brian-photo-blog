import React from 'react';
import styles from './CategorySettings.module.css';

const CategorySettings = (props) => {

    console.log(props.categories);

    return (
        <div styles={styles.container}>
            {props.categories.map(category => (
                <div key={category.id}>{category.name}</div>
            ))}
        </div>
    )

}

export default CategorySettings;