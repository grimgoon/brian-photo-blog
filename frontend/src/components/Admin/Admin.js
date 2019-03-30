import React, {Component} from 'react';
import styles from './Admin.module.css';

import Modal from 'react-responsive-modal';
import Button from '../../utils/UI/Button/Button';
import ButtonSpecial from '../../utils/UI/Button/ButtonSpecial';

import ListImages from './ListImages/ListImages';
import ImagesNotification from './UploadingImagesStatusNotification/UploadingImagesStatusNotification';
import CategorySettings from './CategorySettings/CategorySettings';
import EditCategory from './EditCategory/EditCategory.js'


import axios from 'axios';

import Firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';
import 'firebase/auth';
import FirebaseConfig from '../../utils/Firebase/Config/Config';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class Admin extends Component {

    state = {
        uploadingImages: null,
        imageList: null,
        categoryList: null,
        folderReference : 'photographs/',
        checkedItemList : [],
        categorySettingsOpen : false,
        editCategoryOpen : false,
        deleteImageOpen : false,
        disableButtons: false,
        addCategoryName : "",
        editCategoryValue: null,
        isSignedIn : false,
        isLoading: true,
        isLoadingMessage : "Loading...",
    }

    baseImageURL = "https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/photographs%2F";
    queryString =  "?alt=media";

     componentDidMount() {

        Firebase.initializeApp(FirebaseConfig);
        this.getImageList();
        this.getCategoryList();

        this.isLoading();
    
        // Listen to the Firebase Auth state and set the local state.
        this.unregisterAuthObserver = Firebase.auth().onAuthStateChanged(
            (user) => this.setState({isSignedIn: !!user})
        );
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

    componentWillUnmount() {
        // Make sure we un-register Firebase observers when the component unmounts.
        this.unregisterAuthObserver();
    }

    isLoading = () => {

        let i = 0;
        
        let loading = setInterval(() => {

            if(i > 10) {
                this.setState({isLoadingMessage : "An error occured. Please try again later."});
                clearInterval(loading);
            }
            else if(this.state.imageList && this.state.categoryList) {
                clearInterval(loading);
                this.setState({isLoading : false})
            }

            i++;

        }, 1500)
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

                const instance = axios.create({
                    baseURL : "https://api.cloudinary.com/v1_1/grimgoon/upload"
                });

                const formData = new FormData;
                formData.append("image", file);

                // imageReference.put(file).then((snapshot) => {
                    instance.post('/orders.json', formData, {headers : {'Content-Type': 'multipart/form-data'}}).then(respone => {

                    console.log(file);

                    let image = new Image();
                    image.src = this.baseImageURL + imageName + "." + fileType + this.queryString;
        
                    image.onload = () => {

                        Firebase.database().ref(folderReference).child(imageName).set({
                            fileType : fileType,
                            date : Date.now(),
                            categories : {
                                all : "All"
                            },
                            group : "unset",
                            order: i,
                            height: image.height,
                            width: image.width,

                        }).then(() => {
                            this.updateItemUploadingImageList(file.name,"uploaded");
                        });
                    }
                }).catch((error) => {
                    // Error to upload file 
                });
            
        });

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
            this.removeCategoryFromPhotographs(this.state.imageList,id);
        });
    }

    removeCategoryFromPhotographs = (photographsArray, deleteCategory) => {


        let removeCategoryFromPhotograph = {};

        photographsArray.forEach((photograph => {
            let findCategory = Object.keys(photograph.categories).find(category => category === deleteCategory);

            if(findCategory) {
                let key = '/' + photograph.id + '/categories/' + deleteCategory; 
                removeCategoryFromPhotograph[key] = null; 
            }
        }));

        if(Object.keys(removeCategoryFromPhotograph).length) {
            // Error Handling?
            Firebase.database().ref('photographs').update(removeCategoryFromPhotograph).then((result) => {
            
            });
        }
        
    }

    addCategoryToPhotographs = (photographsArray,addCategory) => {

        let addCategoryToPhotographs = {};
        const categories = [...this.state.categoryList];
        const categoryData = categories.find(category => category.id === addCategory);

        if(categoryData) {
            photographsArray.forEach((photograph => {

                let findCategory = Object.keys(photograph.categories).find(category => category === categoryData.id)

                console.log(findCategory);

                let key = '/' + photograph.id + '/categories/' + categoryData.id; 
                addCategoryToPhotographs[key] = categoryData.name; 
            }));    

            console.log(addCategoryToPhotographs);

            if(Object.keys(addCategoryToPhotographs).length) {
                // Error Handling?
                Firebase.database().ref('photographs').update(addCategoryToPhotographs).then((result) => {
                });
            }
        } else {
            //Error Handling:  Log that someone tried to send in a faulty category
        }
       


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

    editCategoryClickHandler = () => {
        this.setState({editCategoryOpen : true})
    }

    editCategoryCloseHandler = () => {
        this.setState({editCategoryOpen : false});
    }

    editCategoryAddCategoryClickHandler = (images,category) => {
        console.log(images, category);
        this.addCategoryToPhotographs(images,category);
    }

    editCategoryDeleteCategoryClickHandler = (images, category) => {
        console.log(images, category);
        this.removeCategoryFromPhotographs(images,category);
    }


    uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
          Firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        callbacks: {
          // Avoid redirects after sign-in.
          signInSuccessWithAuthResult: () => false
        }
      };


    render() {

        // TODO: Fix Error Message to display properly 
        if(this.state.isLoading) {
            return (
                <div className="loadingScreen">
                    <div className="sk_folding_cube">
                        <div className="sk_cube1 sk_cube"></div>
                        <div className="sk_cube2 sk_cube"></div>
                        <div className="sk_cube3 sk_cube"></div>
                        <div className="sk_cube4 sk_cube"></div>
                    </div>
                    <div>{this.state.isLoadingMessage}</div>
                </div>
            )       
        }

        if (!this.state.isSignedIn) {
            return (
                <div className={styles.loginHeader}>
                  <h1>Admin Panel</h1>
                  <p>Please sign-in:</p>
                  <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={Firebase.auth()}/>
                </div>
            );
        }
    
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
                        buttonHandler={this.editCategoryClickHandler}/>
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
                    blockScroll={false}
                    classNames={{
                        closeButton : styles.modalCloseButton,
                        modal : styles.modalContent}}> 
                    <CategorySettings categoryName={this.state.addCategoryName} categoryNameHandler={this.categoryAddHandler} submitHandler={this.categorySettingsAddHandler} deleteHandler={(id, status) => this.categorySettingsDeleteCategoryClickHandler(id, status)} categories={this.state.categoryList}/>
                </Modal>

                <Modal 
                    open={this.state.editCategoryOpen}
                    onClose={this.editCategoryCloseHandler}
                    blockScroll={false}
                    classNames={{
                        closeButton : styles.modalCloseButton,
                        modal : styles.modalContent}}> 
                    <EditCategory
                        deleteCategory={(images,category) => this.editCategoryDeleteCategoryClickHandler(images,category)}
                        addCategory={(images,category) => this.editCategoryAddCategoryClickHandler(images,category)}
                        categories={this.state.categoryList}
                        selectedImages={this.state.checkedItemList}
                        images={this.state.imageList}/>
                </Modal>

                <Modal 
                    open={this.state.deleteImageOpen}
                    onClose={this.deleteImageCloseHandler}
                    blockScroll={false}
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