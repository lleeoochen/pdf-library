---
---
class FirebaseStorage {
	constructor() {
		this.storage = firebase.storage().ref();
	}

	list(path) {
		return this.storage.child(path).listAll().then(function(res) {
			return {
				folders: res.prefixes,
				files: res.items
			};
		});
	}

	add(path, data) {
		return this.storage.child(path).put(data);
	}

	get(path) {
		return this.storage.child(path).getDownloadURL();
	}

	delete(path) {
		return this.storage.child(path).delete();
	}

	move(old_path, new_path) {
		return this.get(old_path).then(async url => {
			await Util.request(url).then(async data => {
				await this.add(new_path, data);
				await this.delete(old_path);
			});
		});
	}
}
