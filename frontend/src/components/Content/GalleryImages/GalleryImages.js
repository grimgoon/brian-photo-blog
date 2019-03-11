import React, {Component} from 'react';
import GalleryImage from './GalleryImage/GalleryImage';
import styles from './GalleryImages.module.css';
import Modal from 'react-responsive-modal';
import {isMobile} from "react-device-detect";


class GalleryImages extends Component {

     baseImageURL = "https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/photographs%2F";
     queryString =  "?alt=media";

     state = {
         imageModalOpen : false,
         imageModalContent : null,
         imageModalContentOrientation : "portrait",
     }

    clickImageOpenHandler = (id,fileType,imageOrientation) => {

        if(!isMobile) {
            let imageClass = styles.modalImagePortrait;

            if(imageOrientation === "landscape" || imageOrientation === "bigLandscape") {
                imageClass = styles.modalImageLandscape
            }
    
            const image = <img className={imageClass} src={this.baseImageURL + id + "." + fileType + this.queryString} alt="Modal" />
            this.setState({imageModalContent : image, imageModalOpen : true, imageModalContentOrientation : imageOrientation})
        }
    }

    clickImageCloseHandler = () => {
            this.setState({imageModalOpen : false})
    }
     
    listImages() {

        let imageList;

        if(this.props.photoList && !this.props.error) {

            let photoFilter;

            let groupHeight = {
                group1 : 0,
                group2 : 0,
                group3 : 0,
            };

            let groups = {
                group1 : [],
                group2 : [],
                group3 : [],
            };

            if(this.props.filter === "all") {
                photoFilter = () => true;
            }
            else {
                photoFilter = (photo) => (Object.keys(photo.categories).find(category => category === this.props.filter) === undefined ? false : true)
            }
    
            this.props.photoList.filter(photoFilter).forEach((photo,i) => {

                let smallest = '';
                for (var name in groupHeight) {
                    if(smallest !== '' && groupHeight[name] < groupHeight[smallest]) {
                        smallest = name;
                    } else if (smallest === '') {
                        smallest = name;
                    }
                }

                let compareValue = 100;
                let widthComparision = compareValue / photo.width;
                let compareHeight = photo.height * widthComparision;

                groupHeight[smallest] += compareHeight;

                groups[smallest].push(
                    <GalleryImage
                        key={photo.id}
                        height={photo.height}
                        width={photo.width}
                        baseURL={this.baseImageURL}
                        queryString={this.queryString}
                        id={photo.id}
                        fileType={photo.fileType}
                        index={i}
                        clickHandler={(id,fileType,orientation) => this.clickImageOpenHandler(id,fileType,orientation)}
                />)

                
            });

            imageList = 
                <>
                    <div>
                        {groups["group1"]}
                    </div>
                    <div>
                        {groups["group2"]}
                    </div>
                    <div>
                        {groups["group3"]}
                    </div>
                </>
        
            return imageList
        }
        return null;
    }

    render() {

        let listImages = this.listImages();
        let modalContent = this.state.imageModalContent;

        let modalOrientation =  styles.modalContentPortrait;

        if(this.state.imageModalContentOrientation === "bigLandscape") {
            modalOrientation = styles.modalContentBigLandscape
        }   
        else  if(this.state.imageModalContentOrientation === "landscape") {
            modalOrientation = styles.modalContentLandscape
        }   

        return (
            <>
                <div className={styles.images2}>
                    {listImages}
                </div>

                <Modal 
                    open={this.state.imageModalOpen}
                    onClose={this.clickImageCloseHandler}
                    animationDuration={200}
                    blockScroll={false}
                    classNames={{
                        closeButton : styles.modalCloseButton,
                        modal : modalOrientation
                    }}> 
                    {modalContent}
                </Modal>
            </>
        );
    }

    

}



export default GalleryImages;