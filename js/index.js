---
---
var auth_user;
var database = new Firebase();
var storage = new FirebaseStorage();
var path = [];

database.authenticate().then(_auth_user => {
	auth_user = _auth_user;

	path.push(auth_user.uid);

	init();

	unhashPath();
});

function init() {
	$('#upload-form').on("submit", async e => {
		e.preventDefault();
		loading(true);

		let files = $('#upload-file').prop('files');
		let db_promises = [];

		for (let i = 0; i < files.length; i++) {
		    let file = files[i];
			db_promises.push(storage.add(path.join('/') + '/' + file.name, file));
		}

		$('#upload-file').val('');
		$('#upload-label-text').text('Select File...');
		$("#new-file-modal").modal('hide');

		await Promise.all(db_promises);

		updateFileList();
		loading(false);
	});

	$("#upload-form").on('change', function() {
		let file = $('#upload-file').prop('files')[0];
		$('#upload-label-text').text(file.name);
	});

	$("#new-folder-form").on('submit', async e => {
		e.preventDefault();
		loading(true);

		let folder_name = $('#new-folder-text').val();

		$('#new-folder-text').val('');
		$("#new-folder-modal").modal('hide');

		await storage.add(path.join('/') + '/' + folder_name + '/x', new Uint8Array([0x00]));

		updateFileList();
		loading(false);
	});

	$("#new-file-btn").on('click', () => {
		$("#new-file-modal").modal('show');
	});

	$("#new-folder-btn").on('click', () => {
		$("#new-folder-modal").modal('show');
	});
}

function updateFileList() {
	$('#file-list').html('');

	storage.list(path.join('/')).then(data => {
		data.folders.forEach(folder => {
			$('#file-list').append($(`
				<div class="btn folder-link"
				     ondrop="drop(event, '${ Util.escape(folder.name) }')"
				     ondragover="allowDrop(event)"
				     onclick="enterFolder('${ Util.escape(folder.name) }')">
					${ folder.name }
				</div>`
			));
		});

		data.files.forEach(file => {
			if (file.name == 'x') return;

			$('#file-list').append($(`
				<a class="btn file-link"
				   href="{{ site.baseUrl }}/game?file=${ path.join('/') + '/' + file.name }"
				   target="_blank"
				   draggable="true"
				   ondragstart="drag(event, '${ Util.escape(file.name) }')">
					${ file.name.replace(".pdf", "") }
				</a>`
			));
		});
	})
	.then(() => {
		if ($('#file-list').html() == '') {
			$('#file-list').html('<div class="sub-title">No existing file.</div>');
		}
	});
}

function enterFolder(folder) {
	document.location.hash += path.length > 1 ? "/" + folder : folder;
}

function allowDrop(e) {
	e.preventDefault();
}

function drag(e, file) {
	e.dataTransfer.setData("file", file);
}

function drop(e, folder) {
	e.preventDefault();
	let filename = e.dataTransfer.getData("file");

	let old_file_path = path.join('/') + '/' + filename;

	let new_file_path;
	if (folder == '..')
		new_file_path = path.slice(0, path.length - 1).join('/') + '/' + filename;
	else
		new_file_path = path.join('/') + '/' + folder + '/' + filename;

	move(old_file_path, new_file_path);
}

function move(old_file_path, new_file_path) {
	loading(true);
	storage.move(old_file_path, new_file_path).then(() => {
		updateFileList();
		loading(false);
	});
}

window.onhashchange = unhashPath;

function unhashPath() {
	// Redirect wrong path
	if (document.location.hash.includes(auth_user.uid)) {
		document.location.hash = document.location.hash.replace('#' + auth_user.uid, '');
		return;
	}

	// Parse path
	path = decodeURI(document.location.hash).replace('#', '').split('/').filter(n => n != '');
	path.unshift(auth_user.uid);

	// Parse parent directory
	if (path[path.length - 1] == '..') {
		document.location.hash = path.splice(0, path.length - 2).join('/');
		return;
	}

	// Update file list
	updateFileList();

	// Show/hide back button
	$('#back-btn').toggleClass('hidden', path.length <= 1);
}

$(".modal").on("shown.bs.modal", e => {
	$(e.target).css('display', 'flex');
});


function loading(toLoad) {
	if (toLoad) {
		$('#loading-modal').modal({
		  backdrop: 'static',
		  keyboard: false
		});
	}
	else {
		$('#loading-modal').modal('hide');
	}
}