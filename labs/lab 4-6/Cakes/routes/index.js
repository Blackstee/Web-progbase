"use strict";

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var express = require('express');
var router = express.Router();
var User = require ('./user');
var Post = require('./post');
var mongoose_delete = require('mongoose-delete');


//===================================HOME PAGE=====================================


router.get('/', function(req, res, next){
	const user = req.session.user;
	res.render('index', { user: user });
})

router.get('/hello', (req, res) => res.render("home", { user: req.session.user }));
//===================================REGISTER======================================

router.get('/register', (req, res) => res.render("register", { user: req.user }));

router.post('/register', function(req, res){
  var username = req.body.username;
  var password = req.body.pass;
  var password2 = req.body.pass2;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  console.log(username);
		if (!username || !password || password !== password2) {
			res.redirect('/register');
		}
  User.findOne({ username: username})
			.then(x => {
				if (x) {
					res.end("Such username exists " + JSON.stringify(x));
				} else {
  var newuser = new User ();
  newuser.username = username;
  newuser.password = password;
  newuser.firstname = firstname;
  newuser.lastname = lastname;
	if (newuser.username == "BOSS")
	newuser.status = "admin"
	else
	newuser.status = "user";
  newuser.save(function(err, savedUser){
    if (err){
      console.log(err);
      return res.status(500).send();
    }
    return res.status(200).send();
  })
	res.redirect ('/login');
}
})
});

router.get('/register-error', (req, res) => res.end("Register error"));

//==================================LOG IN LOG OUT SESSIONS========================

router.get('/login', (req, res) => res.render("login", { user: req.user }));

router.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/');

	return res.status(200).send();
});


router.post('/login', function (req, res){
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function (err, user){
    if (err){
      console.log(err);
			res.redirect ('/login');
      return res.status(500).send();
    }
    if (!user) {
			res.redirect ('/login');
      return res.status(404).send();
    }
    user.comparePassword(password, function(err, isMatch) {
        if (isMatch && isMatch ===  true){
          req.session.user = user;
					console.log ("logged in!!");
					res.redirect ('/');
          return res.status(200).send();
        } else {
					res.redirect ('/login');
					return res.status(401).send();
        }
    });
  })
});

router.get('/dashboard', function(req, res){
  if (!req.session.user){
    return res.status(401).send();
  }
  return res.status(200).send("Welcooome");
})

//===========================================NEW POST==============================

router.get('/cakes/newpost', (req, res) => res.render("newpost", { user: req.session.user }));

router.post('/cakes/newpost',	(req, res) => {
	let avaObj = req.files.post;
	let base64String = avaObj.data.toString('base64');
	var newpost = new Post();
			newpost.title = req.body.title;
			newpost.description = req.body.description;
			newpost.image = base64String;
			newpost.save(function(err) {
					if (err)
							res.send(err);
			});
     res.redirect ('/cakes');
	});



//====================================USERS========================================

router.post('/upload_avatar', (req, res) => {
	let avaFile = req.files.avatar;
	let username = req.body.username;
	let base64String = avaFile.data.toString('base64');
	User.findOne({ username: username})
		.then(user => {
			if (user) {
				return User.findAndModify({
				    query: { username: username },
				    update: { $set: { avatar: base64String } },
				    new: false
				});
			}
			else {
				res.status(400).end('user not exists');
			}
		})
		.then(() => res.redirect('/'))
		.catch(err => res.status(500).end(err));
});

router.get('/users', (req, res) => {
	User.find()
		.then(users => {
			res.render('users_users', {
				users: users,
				user: req.session.user
			});
		})
		.catch(err => res.status(500).end(err));
});

router.get('/users/deleteuser/:id', function(req, res){
	User.remove({
					_id: req.params.id
			}, function(err, post) {
					if (err)
							res.send(err);
					res.redirect('/users');
			});
});

//==================================CAKES==========================================

router.get('/cakes', function(req, res){
	Post.find()
		.then(posts => {
			res.render('cakes', {
         posts: posts,
				 user: req.session.user,
				 search: "nothing",
				 lol: "posts"
			});
		})
		.catch(err => res.status(500).end(err));
});

router.get('/cakes/deletepost/:id', function (req, res){
	Post.remove({
					_id: req.params.id
			}, function(err, post) {
					if (err)
							res.send(err);
					res.redirect('/cakes');
			});
});

router.get('/cakes/search', function(req, res) {
	console.log(req.query.title);
	var lol = "posts";
	if (req.query.title == '')
	res.redirect('/cakes');
	else {
	Post.find ({title: req.query.title}, function (err, posts) {
		if (err)
		res.send (err);
		else {
			Post.findOne( {title: req.query.title}, function(err, post) {
							if (err)
									res.send(err);
						  else {
								if (post == null){
								res.render('cakes', {
					         posts: posts,
									 user: req.session.user,
									 search: req.query.title,
									 lol : "noposts",
								});
							}
								else {
								res.render('cakes', {
					         posts: posts,
									 user: req.session.user,
									 search: req.query.title,
									 lol : lol,
								});
							}
							}
						});
		}
	})
}
});

router.get('/cakes/:id', function(req, res) {
	console.log(req.params.id);
	Post.findById(req.params.id, function(err, post) {
					if (err)
							res.send(err);
					res.render ("cake", {user:req.session.user, post:post})
			});
});

router.post('/cakes/deletepost', function (req, res){
	Post.remove({
					_id: req.body.todelete
			}, function(err, post) {
					if (err)
							res.send(err);
					res.redirect('/cakes');
			});
});



//=====================================API=========================================

router.get('/api/cakes', function(req, res){
	 Post.find(function(err, posts) {
					if (err)
							res.send(err);
					res.json(posts);
			});
});

router.post('/api/cakes', function(req, res) {

	var newpost = new Post();
	    newpost.title = req.body.title;
			newpost.description = req.body.description;
			newpost.author = req.user;
			newpost.save(function(err) {
					if (err)
							res.send(err);
			});
});

router.get('/api/cakes/:id', function(req, res) {
	console.log(req.params.id);
	Post.findById(req.params.id, function(err, post) {
					if (err)
							res.send(err);
					res.json(post);
			});
});

router.put('/api/cakes/:id', function (req, res){
	console.log(req.params.id);
	Post.findById(req.params.id, function(err, post) {
					if (err)
							res.send(err);
						post.title = req.body.title;
						post.description = req.body.description;
						post.author = req.body.author;
					post.save(function(err) {
							if (err)
									res.send(err);
							res.json({ message: 'post updated!' });
					});

			});
});

router.delete('/api/cakes/:id', function (req, res){
	Post.remove({
					_id: req.params.id
			}, function(err, bear) {
					if (err)
							res.send(err);
					res.json({ message: 'Successfully deleted' });
			});
});


module.exports = router;
