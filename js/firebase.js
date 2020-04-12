class Firebase {

	constructor() {
		this.db = null;
		this.auth_user = null;

		// Firebase Init
		var firebaseConfig = {
			apiKey: "AIzaSyD4lbQ9qEOXckuOxrGWp1ETZvmQ7-oOlJo",
			authDomain: "pdf-library-d47b7.firebaseapp.com",
			databaseURL: "https://pdf-library-d47b7.firebaseio.com",
			projectId: "pdf-library-d47b7",
			storageBucket: "pdf-library-d47b7.appspot.com",
			messagingSenderId: "586656070466",
			appId: "1:586656070466:web:66f579139b98a9d788a6db",
			measurementId: "G-11Z8XRE9Y4"
		};

		firebase.initializeApp(firebaseConfig);
		this.db = firebase.firestore();

		// Authentication Init
		let firebaseAuthConfig = {
			signInSuccessUrl: window.location.href,
			signInOptions: [
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			],
			tosUrl: 'www.weitungchen.com',
			privacyPolicyUrl: function() {
				window.location.assign('www.weitungchen.com');
			}
		};

		let ui = new firebaseui.auth.AuthUI(firebase.auth());
		ui.start('#firebase-modal #main-content', firebaseAuthConfig);
	}

	authenticate() {
		var self = this;

		return new Promise((resolve, reject) => {
			firebase.auth().onAuthStateChanged(auth_user => {
				if (auth_user) {
					self.auth_user = auth_user;

					self.db.collection(USERS_TABLE).doc(self.auth_user.uid).set({
						email: self.auth_user.email,
						photo: self.auth_user.photoURL,
						name: self.auth_user.displayName
					}, { merge: true });
					resolve(self.auth_user);
				}
				else {
					$('#firebase-modal').modal({ backdrop: 'static', keyboard: false })
				}
			});
		});
	}

	getUser(id) {
		return this.db.collection(USERS_TABLE).doc(id).get().then(doc => {
			return doc.data();
		});
	}

	listenUser(id) {
		return this.db.collection(USERS_TABLE).doc(id).onSnapshot(doc => {
			return doc.data();
		});
	}
}
