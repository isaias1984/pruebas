import * as firebase from "firebase";

export const uploadImage = async (uri, nameImage, folder) => {
  await fetch(uri)
    .then(async result => {
      let ref = firebase
        .storage()
        .ref()
        .child(`${folder}/${nameImage}`);

      await ref.put(result._bodyBlob);

      return await firebase
        .storage()
        .ref(`${folder}/${nameImage}`)
        .getDownloadURL()
        .then(resolve => {
          return resolve;
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
    });
};
