import React, {Component} from 'react';
import styles from './Admin.module.css';


import Modal from 'react-responsive-modal';
import Overlay from '../UI/Overlay/Overlay';

import Button from '../UI/Button/Button';
import ButtonSpecial from '../UI/Button/ButtonSpecial';
import ListImages from './ListImages/ListImages';
import ImagesNotification from './UploadingImagesStatusNotification/UploadingImagesStatusNotification';
import CategorySettings from './CategorySettings/CategorySettings';

import Firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';
import FirebaseConfig from '../Firebase/Config/Config';

class Admin extends Component {

    state = {
        uploadingImages: null,
        imageList: null,
        categoryList: null,
        folderReference : 'photographs/',
        checkedItemList : [],
        categorySettingsOpen : false,
        deleteImageOpen : false,
        disableButtons: false,
        addCategoryName : "",
    }

    componentDidMount() {
        Firebase.initializeApp(FirebaseConfig);
        this.getImageList();
        this.getCategoryList();


    }

    componentDidUpdate() {

        // Enable Buttons after uploading Images
        if(this.state.disableButtons && this.state.uploadingImages) {
            let enableButtons = this.state.uploadingImages.find((obj,i) => (
                obj.status !== "uploaded" && obj.status !== "error" 
            ));

            if(!enableButtons) {
                this.setState({disableButtons : false});
            }
        }
    }

    uploadImage = (event) => {

        const files = Array.from(event.target.files);

        const folderReference = this.state.folderReference;

        const storageRef  = Firebase.storage().ref();
        const database = Firebase.database();

        let uploadingImages = files.map((file,i) => {
            return {
                name : file.name,
                status: "uploading",
                errorMessage : null,
            }    
        });

        this.setState({disableButtons : true, uploadingImages : uploadingImages})

        let updateOrderCounter = 0;

        files.forEach((file, i) => {

            let fileData = file.name.split('.');
            let imageName = fileData[0];
            let fileType = fileData[fileData.length -1];

            if(fileData.length > 2) {
                this.updateItemUploadingImageList(file.name,'error','Image Name can\'t contain "."');

                return;
            }
            else if (file.type !== "image/jpeg" && file.type !== "image/png") {
                this.updateItemUploadingImageList(file.name,'error','Image needs to be of file format JPG or PNG');
                return;        
            }
            else {
                updateOrderCounter++;    
            }

            let fileReference = folderReference + file.name;
            let imageReference = storageRef.child(fileReference);

            imageReference.put(file).then((snapshot) => {
                database.ref(folderReference).child(imageName).set({
                    fileType : fileType,
                    date : Date.now(),
                    categories : {
                        all : "All"
                    },
                    group : "unset",
                    order: i
                }).then(() => {

                    this.updateItemUploadingImageList(file.name,"uploaded");

                }).error((error) => {
                    // Error to add file to database
                });

            }).catch((error) => {
                // Error to upload file 
            });
        })

        this.updateOrderGroup(updateOrderCounter);
    }

    updateItemUploadingImageList = (name,status,errorMessage) => {

        this.setState((prevState,props) => {

            let imageList = prevState.uploadingImages

            let index = imageList.findIndex((obj,i) => (
                obj.name === name
            ));

            let objectErrorMessage = null;

            if(errorMessage) {
                objectErrorMessage = errorMessage; 
            }
      
            imageList[index].status = status;
            imageList[index].errorMessage = objectErrorMessage;

            

            //this.setState({uploadErrorMessage : ''})

            return {uploadingImages : imageList}
        });

        
    }

    updateOrderGroup = (newImageLength,groupName = "unset") => {

        if(this.state.imageList && this.state.imageList.length >= 1) {

            const database = Firebase.database();
            const folderReference = this.state.folderReference;

            let updateGroupArray = this.state.imageList.filter(image => image.group = groupName);

            updateGroupArray.forEach((file, i) => {

                database.ref(folderReference + file.id).update({
                    order : newImageLength+i,
                });    
            });
        }
    }

    getImageList = () => {

        const database = Firebase.database();

        // TODO: Error Handling
        database.ref('photographs').on('value',(snapshot) => {
            let images = [];
            let values = snapshot.val();

            for(let key in  values) {
                images.push({
                    id: key,
                    ...values[key]
                });
            }

            images = images.sort((a, b) => (a.order) > b.order ? 1 : -1);

            this.setState({imageList : images});
        })
    }

    getCategoryList = () => {

        const database = Firebase.database();

        // TODO: Error Handling
        database.ref('categories').on('value',(snapshot) => {

            let categories = [];
            let values = snapshot.val();

            for(let key in values) {

                categories.push({
                    id: key,
                    name : values[key],
                    status : null
                });
            }

            categories = categories.sort((a, b) => a > b ? 1 : -1);

            this.setState({categoryList : categories});
        })
    }

    checkboxHandler = (event) => {

        const imageId = event.target.id;
        let checkedItemList = [...this.state.checkedItemList];
    
        if(event.target.checked) {
            checkedItemList.push(imageId);
        }
        else {
            var index = checkedItemList.indexOf(imageId);
            if(index !== -1) {
                checkedItemList.splice(index,1); 
            }
        }

        this.setState({checkedItemList : checkedItemList});

    }

    // TODO: Fix so when deleting an item it gets removed from the selected items list.

    deleteImage = () => {

        let checkedItemList = [...this.state.checkedItemList];

        // Should I update state of the checkedItemList after all the items have been removed? 
        //Or should I do it one by one?

        // Should I also remove the file from the storage or is that fine to keep?

        // Error Handling ??

        checkedItemList.forEach((file,i) => {

            Firebase.database().ref('photographs').child(file).remove().then(() => {

                let newSelectedList =  [...this.state.checkedItemList];
                newSelectedList.shift();

                this.setState({checkedItemList : newSelectedList})
            });
        });
    }

    buttonDisabled = (buttonType) => {

        let isDisabled = false;

        if(this.state.disableButtons) {
            isDisabled = true;    
        }
        else if(!this.state.imageList || !this.state.categoryList) {
            isDisabled = true;       
        }
        else if (buttonType === "listItem" && this.state.checkedItemList.length === 0) {
            isDisabled = true;
        }

        return isDisabled;

    }

    categorySettingsClickHandler = () => {
        this.setState({categorySettingsOpen : true})
    }

    
    categorySettingsCloseHandler = () => {

        let categories = [...this.state.categoryList];

        categories.forEach((category,i) => categories[i].status = "reset");

        this.setState({categorySettingsOpen : false, categoryList : categories});
    }

    deleteImageClickHandler = () => {
        this.setState({deleteImageOpen : true})
    }

    
    deleteImageCloseHandler = () => {
        this.setState({deleteImageOpen : false})
    }

    categorySettingsDeleteCategoryClickHandler = (id, newStatus) => {
        
        let categories = [...this.state.categoryList];

        let categoryIndex = categories.findIndex(category => category.id === id)

        if(categoryIndex !== -1) {

            if(newStatus === "deleteConfirm") {
                categories[categoryIndex].status = "deleteConfirm";
                this.setState({categoryList : categories}); 
            }
            else if(newStatus === "delete") {
                this.deleteCategory(id);
            }
            else if(newStatus === "reset") {
                categories[categoryIndex].status = null;
                this.setState({categoryList : categories}); 

            }

        } 
        else {
            // ? 
        }
    
    }

    categoryAddHandler = (e) => {
        this.setState({
            addCategoryName : e.target.value,
        });
     }

     categorySettingsAddHandler = () => {

        const categoryName = this.state.addCategoryName;
        const invalidNames = ["all", "home"];

        if(invalidNames.find(name => name === categoryName) || !categoryName) {
            // Error
        }
        else {
            const keyValue = this.slugifyString(categoryName);

            Firebase.database().ref('categories').child(keyValue).set(categoryName).then(result => {
                this.setState({addCategoryName : ""});
            });
            // Error Handling?
        }
     }

    deleteCategory = (id) => {

        Firebase.database().ref('categories').child(id).remove().then(() => {
            this.removeCategoryFromPhotograph(this.state.imageList,id);
        });
    }

    removeCategoryFromPhotograph = (photographsArray, deleteCategory) => {

        let removeCategoryFromPhotograph = {};

        photographsArray.forEach((photograph => {
            let findCategory = Object.keys(photograph.categories).find(category => category === deleteCategory);

            if(findCategory) {
                let key = '/' + photograph.id + '/categories/' + deleteCategory; 
                removeCategoryFromPhotograph[key] = null; 
            }
        }));

        // Error Handling?

        Firebase.database().ref('photographs').update(removeCategoryFromPhotograph).then((result) => {
            
        })
    }


    slugifyString = (string) => {

        const a = 'àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœṕŕßśșțùúüûǘẃẍÿź·/_,:;'
        const b = 'aaaaaaaaceeeeghiiiimnnnoooooprssstuuuuuwxyz------'
        const p = new RegExp(a.split('').join('|'), 'g');

        return string.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with ‘and’
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
    }



    render() {

        // TODO: Fix Error Message to display properly 
        // TODO: Complete Category Settings and Edit Category
        return (
            <> 
                <div className={styles.content}>
                    <div className={styles.header}>
                    <ButtonSpecial
                        disabled={this.buttonDisabled()}
                        text="Upload Image(s)"
                        imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2FuploadImageButton_light.png?alt=media&token=f868e33f-5bee-42ee-aaa4-0d279f293113"} 
                        buttonHandler={this.uploadImage}/>
                    <Button
                        disabled={this.buttonDisabled()}
                        text="Category Settings"
                        type="button"
                        imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fedit_categories.png?alt=media&token=5ae3be3b-c84f-4abd-bb21-0b1133c6ed64"} 
                        buttonHandler={this.categorySettingsClickHandler}/>
                    <Button
                        disabled={this.buttonDisabled("listItem")}
                        text="Edit Category"
                        imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fedit_category.png?alt=media&token=104aca03-159a-4def-8acc-9b3fbe65bff3"} 
                        buttonHandler={() => (console.log("HAH"))}/>
                    <Button
                        disabled={this.buttonDisabled("listItem")}
                        text="Delete Image(s)"
                        imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fdelete_image.png?alt=media&token=111cebaa-7814-49c9-a2fb-050082ce04ea"} 
                        buttonHandler={this.deleteImageClickHandler}/>
                    </div>
                    {this.state.uploadingImages ? <ImagesNotification buttonDisabled={this.buttonDisabled()} closeNotification={() => (this.setState({uploadingImages : null}))} uploadingImages={this.state.uploadingImages}/> : null}
                    <ListImages images={this.state.imageList} checkboxHandler={this.checkboxHandler} />
                </div>

                <Modal 
                    open={this.state.categorySettingsOpen}
                    onClose={this.categorySettingsCloseHandler}
                    classNames={{
                        closeButton : styles.modalCloseButton,
                        modal : styles.modalContent}}> 
                    <CategorySettings categoryName={this.state.addCategoryName} categoryNameHandler={this.categoryAddHandler} submitHandler={this.categorySettingsAddHandler} deleteHandler={(id, status) => this.categorySettingsDeleteCategoryClickHandler(id, status)} categories={this.state.categoryList}/>
                </Modal>

                <Modal 
                    open={this.state.deleteImageOpen}
                    onClose={this.deleteImageCloseHandler}
                    classNames={{
                        closeButton : styles.modalCloseButton,
                        modal : styles.modalContent}}> 
                     <>
                        <p>Are you sure you want to delete these images?</p>
                        <Button 
                            buttonHandler={() => {this.deleteImage(); this.deleteImageCloseHandler()}}
                            text="Delete it!"
                            imgSrc="https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fdelete_image.png?alt=media&token=111cebaa-7814-49c9-a2fb-050082ce04ea" 
                        />
                    </>
                </Modal>
            </>
        );
    }
}

export default Admin;