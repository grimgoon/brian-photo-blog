import React, {Component} from 'react';
import styles from './Admin.module.css';

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
        checkboxList : {}
    }

    componentDidMount() {
        Firebase.initializeApp(FirebaseConfig);
        this.getImageList();
    }

    uploadImage = (event) => {
        const files = Array.from(event.target.files);

        const folderReference = this.state.folderReference;

        //TODO: Check if the files have right fileTypes etc.

        const storageRef  = Firebase.storage().ref();
        const database = Firebase.database();
        
        this.setState({uploadingImage : true})

        this.updateOrderGroup(files.length);

        files.forEach((file, i) => {

            let fileReference = folderReference + file.name;
            let imageReference = storageRef.child(fileReference);

            //TODO: Check if the image already exists in the list to not overwrite!

            imageReference.put(file).then(function(snapshot) {

                let fileData = file.name.split('.');

                let imageName = fileData[0];
                let fileType = fileData[1];

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
    }

    updateOrderGroup = (newImageLength,groupName = "unset") => {

        console.log("Tjena!");
        console.log(this.state.imageList,this.state.imageList.length);

        if(this.state.imageList && this.state.imageList.length >= 1) {

            const database = Firebase.database();
            const folderReference = this.state.folderReference;

            console.log("updateOrderNewImages : Success",this.state.imageList);

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
        if(event.target.checked);
    }

    render() {

        return (
            <div className={styles.content}>
                <div className={styles.header}>
                <ButtonSpecial
                    text="Upload Image(s)"
                    type="file"
                    imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2FuploadImageButton_light.png?alt=media&token=f868e33f-5bee-42ee-aaa4-0d279f293113"} 
                    buttonHandler={this.uploadImage}/>
                <Button
                    text="Category Settings"
                    type="button"
                    imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fedit_categories.png?alt=media&token=5ae3be3b-c84f-4abd-bb21-0b1133c6ed64"} 
                    buttonHandler={() => (console.log("HAH"))}/>
                <Button
                    text="Edit Category"
                    type="button"
                    imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fedit_categories.png?alt=media&token=5ae3be3b-c84f-4abd-bb21-0b1133c6ed64"} 
                    buttonHandler={() => (console.log("HAH"))}/>
                    <Button
                    text="Delete Image(s)"
                    type="button"
                    imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fedit_categories.png?alt=media&token=5ae3be3b-c84f-4abd-bb21-0b1133c6ed64"} 
                    buttonHandler={() => (console.log("HAH"))}/>
                </div>
                <ListImages images={this.state.imageList} checkboxHandler={this.checkboxHandler} />
            </div>
        )
    }
}

export default Admin;