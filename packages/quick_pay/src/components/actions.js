// import 'regenerator-runtime/runtime';
import * as types from './ActionTypes';

import getFirebase from '../common/firebase/firebase';
import { trackQPevent } from '../common/tracking';

let firebase = null;
let storageRef = null;

const windowGlobal = typeof window !== 'undefined' && window

if (windowGlobal) {
    firebase = getFirebase();
    storageRef = firebase.storage().ref();
}


const dateNow = Date.now();

export function returnToSnap(){
    return { type: types.QP_RETURN_TO_SNAP }
}

export function loginBegin() {
    return { type: types.QP_ANON_USER_LOAD_BEGIN }
}

export function loginSuccess(userId) {
    return { type: types.QP_ANON_USER_SUCCESS, userId }
}

export function loginFailed() {
    return { type: types.QP_ANON_USER_FAILURE }
}


export function loginAnon() {
    return async (dispatch, getState) => {
        dispatch(loginBegin())
        
        firebase.auth().signInAnonymously().catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
      
            if(errorCode){
                dispatch(loginFailed(errorMessage))
            }
        });

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                dispatch(loginSuccess(user.uid))
            } else {
                // User is signed out.
                // ...
            }
        })
    }
}



export function stepChange(newStep) {
    return { type: types.QP_CHANGE_STEP, newStep }
}


export function attachSubmissionImg(imgUrl) {
    return { type: types.QP_ATTACH_SUBMISSION_IMG, imgUrl };
}


// upload_picture and create sub
export function uploadDocumentBegin() {
    return { type: types.QP_CREATE_SUB_START }
}

export function uploadDocumentSuccess(docId) {
    return { type: types.QP_CREATE_SUB_SUCCESS, docId }
}

export function uploadDocumentFailed(){
    return { type: types.QP_CREATE_SUB_FAILED}
}

export function uploadDocumentAndCreateSubmission(file, userId, cameraApiType) {
    return async (dispatch, getState) => {
        dispatch(uploadDocumentBegin())


        firebase
            .firestore()
            .collection("user_submission")
            .add({
                user_id: userId,
                created_at: dateNow
            })
            .then(function(docRef) {
            console.log(docRef);
            storageRef
                .child(
                `user_submission_imgs/${userId}/${docRef.id}-${dateNow}.jpg`
                )
                .put(file)
                .then(function(snapshot) {
                snapshot.ref.getDownloadURL().then(function(downloadUrl) {
                    firebase
                    .firestore()
                    .collection("user_submission")
                    .doc(docRef.id)
                    .update({ img_url: downloadUrl });
                    dispatch(uploadDocumentSuccess(docRef.id));
                    dispatch(attachSubmissionImg(downloadUrl));
                    dispatch(stepChange("guess_price_and_update_details"));
                    dispatch(
                      trackQPevent("picture_uploaded", userId, {
                        url: downloadUrl,
                        cameraApiType: cameraApiType
                      })
                    );
                });
                })
                .catch(error => {
                    console.log(error, "error");
                    dispatch(uploadDocumentFailed(error));
                });
            })
            .catch(function(error) {
                console.log("Error adding document: ", error);
                dispatch(uploadDocumentFailed(error));
            });
        }
}






// guess_price and populate form
export function subscribeUploadAnalysisBegin() {
    return { type: types.QP_ANALYSE_DOC_START }
}

export function subscribeUploadAnalysisSuccess(guessPrice) {
    return { type: types.QP_ANALYSE_DOC_SUCCESS, guessPrice }
}

export function subscribeUploadAnalysisFailed() {
    return { type: types.QP_ANALYSE_DOC_FAILED }
}


export function subscribeUploadAnalysis(subId){
    return async (dispatch, getState) => {
        console.log(subId, 'subscribeUploadAnalysis')
        dispatch(subscribeUploadAnalysisBegin())
        const query = firebase.firestore()
            .collection('user_submission')
            .doc(subId)
        query.onSnapshot(function (doc) {
            const docData = doc.data()
            if (docData && 'guess_price' in docData){
                dispatch(subscribeUploadAnalysisSuccess(docData['guess_price']))
            }
        });
    }
}

export function updatePrice(userPrice){
    return { type: types.UPDATE_USER_PRICE, userPrice}
}

export function updateEmail(userEmail) {
    return { type: types.UPDATE_USER_EMAIL, userEmail }
}

// update_submit_details
export function submitDetailsBegin() {
    return { type: types.QP_SUBMIT_START }
}

export function submitDetailsSuccess(result) {
    return { type: types.QP_SUBMIT_SUCCESS, result }
}

export function submitDetailsFailed() {
    return { type: types.QP_SUBMIT_FAILED }
}


export function finalizeSubmit(subId, email, price, token) {
    return async (dispatch, getState) => {
        dispatch(submitDetailsBegin())

        firebase.firestore().collection("user_submission").doc(subId).update({
            user_price: price,
            stripe_token: token,
            email: email
        }) .then(function () {
                dispatch(submitDetailsSuccess())
            })
            .catch(function (error) {
                dispatch(submitDetailsFailed(error))
            });
    }
}
