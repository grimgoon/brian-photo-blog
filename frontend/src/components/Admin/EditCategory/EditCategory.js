import React, {Component} from 'react';
import styles from './EditCategory.module.css';
import Button from '../../../utils/UI/Button/Button';

class EditCategory extends Component {

    state = {
        categoryValue : null,
        selectedImages : null,
    }

    componentDidMount() {
        this.setState({categoryValue : this.props.categories[0].id});
    }

    selectCategoryHandler = (event) => {
        this.setState({categoryValue : event.target.value});
    }
 
    render () {

        const selectedImages = this.props.selectedImages.map(imageId => this.props.images.find(image => imageId === image.id));

        const selectCategoryList = this.props.categories.map(category => 
            <option key={category.id} value={category.id}>
                {category.name}
            </option>
        );

        const imageList = selectedImages.map(image => 
            <div className={styles.imageItem} key={image.id}>
                <div>
                    {image.id}
                </div>
                <div>
                    <b>Categories:</b> {Object.values(image.categories).join(', ')}
                </div>
            </div> 
        );

        return (
            <div className={styles.container}>
                <div className={styles.menu}>
                    <select onChange={this.selectCategoryHandler}>
                        {selectCategoryList}
                    </select>
                    <Button
                            text="Add Category"
                            imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fedit_category.png?alt=media&token=104aca03-159a-4def-8acc-9b3fbe65bff3"} 
                            buttonHandler={() => this.props.addCategory(selectedImages,this.state.categoryValue)}/>
                    <Button
                            text="Delete Category"
                            imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fedit_category.png?alt=media&token=104aca03-159a-4def-8acc-9b3fbe65bff3"} 
                            buttonHandler={() => this.props.deleteCategory(selectedImages,this.state.categoryValue)}/>
                </div>
                <div>
                    {imageList}
                </div>
            </div>
        );
    }

    
}

export default EditCategory;