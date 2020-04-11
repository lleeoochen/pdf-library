class Firebase {

	constructor() {
		this.db = null;
		this.auth_user = null;

		// General Init
		let firebaseConfig = {
			apiKey: "stub",
			authDomain: "stub",
			databaseURL: "stub",
			projectId: "stub",
			storageBucket: "stub",
			messagingSenderId: "stub",
			appId: "stub",
			measurementId: "stub"
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
