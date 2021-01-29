import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

var firebaseConfig = {  
  apiKey: "AIzaSyAzwsI8vGmcA2qwso8VxSk-apZ2rhL7QdY",
  authDomain: "atlist-e0997.firebaseapp.com",
  projectId: "atlist-e0997",
  storageBucket: "atlist-e0997.appspot.com",
  messagingSenderId: "901067516146",
  appId: "1:901067516146:web:25a94d289acccb17aa886b"
};


class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig)
    this.auth = app.auth()
    this.db = app.database()
  }
  
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password)

  doSignOut = () => this.auth.signOut()

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email)
  
  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password)

    user = uid => this.db.ref(`users/${uid}`)
    users = () => this.db.ref('users')
}

export default Firebase