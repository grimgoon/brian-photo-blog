import React, {Component} from 'react';
import styles from './Admin.module.css';
import Modal from 'react-responsive-modal';

import Button from './Button/Button';
import ButtonSpecial from './Button/ButtonSpecial';
import ListImages from './ListImages/ListImages';

import Firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';
import FirebaseConfig from '../Firebase/Config/Config';

class Admin extends Component {

    state = {
        uploadingImage: false,
        imageList: null,
        folderReference : 'photographs/',
        checkedItemList : [],
        modalOpen : false,
        modalContent : null,
        errorMessage : false,
    }

    componentDidMount() {
        Firebase.initializeApp(FirebaseConfig);
        this.getImageList();
    }

    componentDidUpdate() {

    }

    uploadImage = (event) => {
        const files = Array.from(event.target.files);

        const folderReference = this.state.folderReference;

        const storageRef  = Firebase.storage().ref();
        const database = Firebase.database();
        
        this.setState({uploadingImage : true})

        let updateOrderCounter = 0;

        files.forEach((file, i) => {

            console.log(file);

            let fileReference = folderReference + file.name;
            let imageReference = storageRef.child(fileReference);

            let fileData = file.name.split('.');
            let imageName = fileData[0];
            let fileType = fileData[fileData.length -1];

            if(fileData.length > 2) {
                this.setState({errorMessage : 'Image Name can\'t contain "."'})
                return;
            }
            else if (file.type !== "image/jpeg" && file.type !== "image/png") {
                this.setState({errorMessage : 'Image needs to be a JPG or PNG'})
                return;        
            }
            else {
                updateOrderCounter++;    
            }

            imageReference.put(file).then(function(snapshot) {
                database.ref(folderReference).child(imageName).set({
                    fileType : fileType,
                    date : Date.now(),
                    categories : {
                        all : "All"
                    },
                    group : "unset",
                    order: i
                });

                //TODO: Learn to check if writing to Firebase fails. If so - Delete the image from storage (?)
      
                // TODO - figure out why Async + State aren't buddies
                if(files.length === i+1) {
                    this.setState({uploadingImage : false})
                }

            }).catch((error) => {
                // Error to upload file 
            });
        })

        this.updateOrderGroup(updateOrderCounter);
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
            Firebase.database().ref('photographs').child(file).remove();
        });
    }

    deleteImageModal = () => {

        let modalContent = 
            <div>
                <p>Are you sure you want to delete these images?</p>
                <Button 
                    buttonHandler={() => {this.deleteImage(); this.onCloseModal()}}
                    text="Delete it!"
                    imgSrc="https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fdelete_image.png?alt=media&token=111cebaa-7814-49c9-a2fb-050082ce04ea" 
                />
            </div>;
        this.setState({modalOpen: true, modalContent : modalContent})
    }

    onOpenModal = () => {
        this.setState({ modalOpen: true });
      };
    
      onCloseModal = () => {
        this.setState({ modalOpen: false });
      };

    render() {

        let modalState = this.state.modalOpen;
        let modalContent = this.state.modalContent

        // TODO: Fix Error Message to display properly 
        let errorMessage = this.state.errorMessage;
        
        //TODO: Fix so buttons that relies on a checked items are disabled when deemed right.
        // TODO: Complete Category Settings and Edit Category

        return (
            <>
                <div className={styles.content}>
                    <div className={styles.header}>
                    <ButtonSpecial
                        text="Upload Image(s)"
                        imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2FuploadImageButton_light.png?alt=media&token=f868e33f-5bee-42ee-aaa4-0d279f293113"} 
                        buttonHandler={this.uploadImage}/>
                    <Button
                        text="Category Settings"
                        type="button"
                        imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fedit_categories.png?alt=media&token=5ae3be3b-c84f-4abd-bb21-0b1133c6ed64"} 
                        buttonHandler={() => (console.log("HAH"))}/>
                    <Button
                        disabled
                        text="Edit Category"
                        imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fedit_category.png?alt=media&token=104aca03-159a-4def-8acc-9b3fbe65bff3"} 
                        buttonHandler={() => (console.log("HAH"))}/>
                    <Button
                        disabled
                        text="Delete Image(s)"
                        imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fdelete_image.png?alt=media&token=111cebaa-7814-49c9-a2fb-050082ce04ea"} 
                        buttonHandler={this.deleteImageModal}/>
                    </div>
                    {!errorMessage ? "No Error" : errorMessage}
                    <ListImages images={this.state.imageList} checkboxHandler={this.checkboxHandler} />
                </div>
                <Modal open={modalState} onClose={this.onCloseModal}>{modalContent}</Modal>

            </>
        )
    }
}

export default Admin;