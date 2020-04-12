# Firebase App Template

1. Start by create an empty repository on GitHub for your new app (note the repository name for step 2).

2. Run the `./setup.py` script.

3. Register a new Firebase App on <https://console.firebase.google.com/>.

	- Register a web app
	- Copy firebaseConfig to `js/firebase.js`.
	- Create database and modify rules to the following:
		```
		rules_version = '2';
		service cloud.firestore {
		  match /databases/{database}/documents {
		    match /users/{user_id} {
		      allow read;
		      allow delete: if false;
		      allow create: if request.auth.uid != null;
		      allow update: if user_id == request.auth.uid;
		    }
		  }
		}

		```

4. Go to `Firebase` > `Authentication` > `Sign-in Method`.

	- Enable `Google Authentication`.
	- Add authorized domain `[Your GitHub Pages Domain]`.


5. For local development, change the following in `_config.yml`:

	- Change url and baseUrl to local settings. 
	- (Don't commit the changes to Git...) 
