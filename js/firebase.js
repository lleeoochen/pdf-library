---
---
class Firebase {

	constructor() {
		this.db = null;
		this.auth_user = null;

		// Firebase Init
		let firebaseConfig = {
			apiKey: "AIzaSyAjnKviJftJE7M0a4ylnMeVpMjI8Y-uG_Q",
			authDomain: "gamedb-f807e.firebaseapp.com",
			databaseURL: "https://gamedb-f807e.firebaseio.com",
			projectId: "gamedb-f807e",
			storageBucket: "gamedb-f807e.appspot.com",
			messagingSenderId: "364782423342",
			appId: "1:364782423342:web:9f0c875b6e988527e3bebf"
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
		ui.start('#firebase-modal .modal-body', firebaseAuthConfig);
	}

	authenticate() {
		var self = this;

		return new Promise((resolve, reject) => {
			firebase.auth().onAuthStateChanged(auth_user => {
				if (auth_user) {
					self.auth_user = auth_user;
					self.updateUser();
					resolve(self.auth_user);
				}
				else {
					$('#firebase-modal').modal({ backdrop: 'static', keyboard: false })
				}
			});
		});
	}

	updateUser() {
		let user = {
			email: this.auth_user.email,
			photo: this.auth_user.photoURL,
			name: this.auth_user.displayName
		};

		this.db.collection(USERS_TABLE).doc(this.auth_user.uid).set(user, { merge: true });
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
