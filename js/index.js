var auth_user;
var database = new Firebase();

database.authenticate().then(_auth_user => {
	auth_user = _auth_user;
	// TODO
});
