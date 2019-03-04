import React from 'react';
import styles from './CategorySettings.module.css';

const CategorySettings = (props) => {

    
    console.log(props.categoryName);
    

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
                    <div>
                    {category.status === "deleteConfirm" ? 
                        <div className={styles.deleteConfirm}>
                            <div>Are you sure you want to delete?</div>
                            <div onClick={() => props.deleteHandler(category.id,"delete")} className={styles.deleteConfirmButton}>Yes!</div>
                        </div> :  
                        <div onClick={() => props.deleteHandler(category.id,"deleteConfirm")} className={styles.deleteCategory}>
                            <img alt="Delete Button" src="https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fdelete_image.png?alt=media&amp;token=111cebaa-7814-49c9-a2fb-050082ce04ea"/>
                        </div>
                    }
                    </div>
                </div>
            ))}
            <div className={styles.addCategory}>
                <div className={styles.addCategoryHeader}>add new category</div>
                <div className={styles.addCategorySubmit}>
                    <input type="text" value={props.categoryName} onChange={props.categoryNameHandler} placeholder="Category Name"></input>
                    <div onClick={props.submitHandler} className={styles.submitButton}>
                        <img alt="Submit Button" src="https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Faccept_image.png?alt=media&token=d341d92e-58bc-49fc-be83-001fd188b22a"/>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default CategorySettings;