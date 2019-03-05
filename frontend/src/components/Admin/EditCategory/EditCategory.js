import React from 'react';
import styles from './EditCategory.module.css';
import Button from '../../UI/Button/Button';

const EditCategory = (props) => {

    //Props
        // SelectedImages
        // Categories
        // AddCategoryHandler
        // DeleteCategoryHandler

        console.log(props);

        const selectCategoryList = props.categories.map(category => 
            <option key={category.id} value={category.id}>
                {category.name}
            </option>
        );

        const imageList = props.images.filter(isSelectedImage => props.selectedImages.find(image => image.id === isSelectedImage.id)).map(image => 
            <div key={image.id}>
                {image.id} | Categories: {Object.values(image.categories).join(', ')}
            </div>
        );

    return (
        <div className={styles.container}>
            <div>
                <select>
                    {selectCategoryList}
                </select>
                <Button
                        text="Add Category"
                        imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fedit_category.png?alt=media&token=104aca03-159a-4def-8acc-9b3fbe65bff3"} 
                        buttonHandler={props.addCategory}/>
                <Button
                        text="Delete Category"
                        imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fedit_category.png?alt=media&token=104aca03-159a-4def-8acc-9b3fbe65bff3"} 
                        buttonHandler={props.deleteCategory}/>
            </div>
            <div>
                {imageList}
            </div>
        </div>
    );
}

export default EditCategory;