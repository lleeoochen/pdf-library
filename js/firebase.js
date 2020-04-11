class Firebase {

	constructor() {
		this.db = null;
		this.auth_user = null;

		// General Init
		let firebaseConfig = {
			apiKey: "AIzaSyDGTEzcebCXK3B4e--I2itLD0lBtXTQPYs",
			authDomain: "web-chess-e5c05.firebaseapp.com",
			databaseURL: "https://web-chess-e5c05.firebaseio.com",
			projectId: "web-chess-e5c05",
			storageBucket: "web-chess-e5c05.appspot.com",
			messagingSenderId: "730184283244",
			appId: "1:730184283244:web:34b7cb61dfe77db0049449",
			measurementId: "G-8C72YJXJ07"
		};
		firebase.initializeApp(firebaseConfig);
		this.db = firebase.firestore();

		// Authentication Init
		let firebaseAuthConfig = {
			signInSuccessUrl: window.location.href,
			signInOptions: [
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			],
			tosUrl: 'www.bing.com',
			privacyPolicyUrl: function() {
				window.location.assign('www.google.com');
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
