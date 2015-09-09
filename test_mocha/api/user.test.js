var app = require('../../server/app');
var request = require('supertest')(app);
var should = require("should"); 
var mongoose = require('mongoose');
var User = mongoose.model('User');
var TagCategory = mongoose.model('TagCategory');
var Tag = mongoose.model('Tag');


describe('test/api/user.test.js',function () {
	var token,mockUserId,mockAdminId,mockUpdateNickName,mockAdminNickname = '测试' + new Date().getTime();
		before(function (done) {
			User.createAsync({
				nickname:mockAdminNickname,
				email:'test' + new Date().getTime() + '@tets.com',
				password:'test',
				role:'admin',
				status:1
			}).then(function (user) {
				mockAdminId = user._id;
				request.post('/auth/local')        
				.send({
	          email: user.email,
	          password: 'test'
	       })
				.end(function (err,res) {
					token = res.body.token;
					done();
				})
			});
		});

		after(function (done) {
			User.findByIdAndRemoveAsync(mockAdminId).then(function () {
				done();
			});
		});

	describe('post /api/users/addUser', function() {
		it('should when not nickname return error', function(done) {
			request.post('/api/users/addUser')
			.set('Authorization','Bearer ' + token)
			.send({
				email:'test@test.com' + new Date().getTime(),
				password:'test'
			})
			.end(function (err,res) {
				should.exists(err);
				err.status.should.be.equal(422);
				done();
			})
		});

		it('should when not email return error', function(done) {
			request.post('/api/users/addUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname: "呢称" + new Date().getTime(),
				password:'test'
			})
			.end(function (err,res) {
				should.exists(err);
				err.status.should.be.equal(422);
				done();
			})
		});

		it('should when nickname error return error', function(done) {
			request.post('/api/users/addUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname: 'jakc^^&&',
				email:'test@test.com' + new Date().getTime(),
				password:'test'
			})
			.end(function (err,res) {
				should.exists(err);
				err.status.should.be.equal(422);
				done();
			})
		});

		it('should when email error return error', function(done) {
			request.post('/api/users/addUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname: "呢称" + new Date().getTime(),
				email:'test.com' + new Date().getTime(),
				password:'test'
			})
			.end(function (err,res) {
				should.exists(err);
				err.status.should.be.equal(422);
				done();
			})
		});
		var nickname = '呢称' + new Date().getTime();
		it('should return new user', function(done) {
			request.post('/api/users/addUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname: nickname,
				email:'test@test.com' + new Date().getTime(),
				password:'test'
			})
			.end(function (err,res) {
				should.not.exists(err);
				mockUserId = res.body.user_id;
				res.body.user_id.should.be.String();
				res.body.success.should.be.true();
				done();
			})
		});

		it('should same nickname return error', function(done) {
			request.post('/api/users/addUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname: nickname,
				email:'test@test.com' + new Date().getTime(),
				password:'test'
			})
			.end(function (err,res) {
				should.exists(err);
				err.status.should.be.equal(500);
				done();
			})
		});

	});

	describe('put /api/users/:id/updateUser', function() {
		mockUpdateNickName = '呢称' + new Date().getTime();

		it('should when not nickname return error', function(done) {
			request.put('/api/users/' + mockUserId + '/updateUser')
			.set('Authorization','Bearer ' + token)
			.send({
				email:'test@test.com' + new Date().getTime(),
				status:1
			})
			.end(function (err,res) {
				should.exists(err);
				err.status.should.be.equal(422);
				done();
			})
		});
		it('should when not email return error', function(done) {
			request.put('/api/users/' + mockUserId + '/updateUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname:mockUpdateNickName,
				status:1
			})
			.end(function (err,res) {
				should.exists(err);
				err.status.should.be.equal(422);
				done();
			})
		});
		it('should when nickname error return error', function(done) {
			request.put('/api/users/' + mockUserId + '/updateUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname:'jack^^%%',
				email:'test@test.com' + new Date().getTime(),
				status:1
			})
			.end(function (err,res) {
				should.exists(err);
				err.status.should.be.equal(422);
				done();
			})
		});
		it('should when email error return error', function(done) {
			request.put('/api/users/' + mockUserId + '/updateUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname:mockUpdateNickName,
				email:'test.com',
				status:1
			})
			.end(function (err,res) {
				should.exists(err);
				err.status.should.be.equal(422);
				done();
			})
		});
		it('should return update user', function(done) {
			request.put('/api/users/' + mockUserId + '/updateUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname:mockUpdateNickName,
				email:'test@test.com' + new Date().getTime(),
				status:1
			})
			.end(function (err,res) {
				should.not.exists(err);
				res.body.user_id.should.be.String();
				res.body.success.should.be.true();
				done();
			})
		});
		it('should update password return success', function(done) {
			request.put('/api/users/' + mockUserId + '/updateUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname:mockUpdateNickName,
				email:'test@test.com' + new Date().getTime(),
				status:1,
				newPassword:'testpwd'
			})
			.end(function (err,res) {
				should.not.exists(err);
				res.body.user_id.should.be.String();
				res.body.success.should.be.true();
				done();
			})
		});

		it('should same nickname return error', function(done) {
			request.put('/api/users/' + mockUserId + '/updateUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname:mockAdminNickname,
				email:'test@test.com' + new Date().getTime(),
				status:1
			})
			.end(function (err,res) {
				should.exists(err);
				err.status.should.be.equal(500);
				done();
			})
		});


	});

	describe('put /api/users/mdUser', function() {

		it('should when not nickname return error', function(done) {
			request.put('/api/users/mdUser')
			.set('Authorization','Bearer ' + token)
			.end(function (err,res) {
				should.exists(err);
				err.status.should.be.equal(422);
				done();
			})
		});

		it('should when nickname error return error', function(done) {
			request.put('/api/users/mdUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname:'jack^^&&'
			})
			.end(function (err,res) {
				should.exists(err);
				err.status.should.be.equal(422);
				done();
			})
		});
		it('should return my user', function(done) {
			request.put('/api/users/mdUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname:'呢称' + new Date().getTime()
			})
			.end(function (err,res) {
				should.not.exists(err);
				res.body.data.nickname.should.be.String();
				res.body.success.should.be.true();
				done();
			})
		});

		it('should when same nickname return error', function(done) {
			request.put('/api/users/mdUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname: mockUpdateNickName
			})
			.end(function (err,res) {
				should.exists(err);
				err.status.should.be.equal(500);
				done();
			})
		});

	});

	describe('get /api/users/getUserList',function () {
			it('should return users list',function (done) {
				request.get('/api/users/getUserList')
				.set('Authorization','Bearer ' + token)
				.end(function (err,res) {
					should.not.exists(err);
					res.body.data.length.should.be.above(0);
					res.body.count.should.be.above(0);
					done();
				})
			});
			it('should sort false return users list',function (done) {
				request.get('/api/users/getUserList')
				.set('Authorization','Bearer ' + token)
				.query({
					itemsPerPage:1,
					sortName:'',
					sortOrder:'false'
				})
				.end(function (err,res) {
					should.not.exists(err);
					res.body.data.length.should.be.above(0);
					res.body.count.should.be.above(0);
					done();
				})
			});
	});

	describe('get /api/users/getUserProvider', function() {
		it('should return User Provider', function(done) {
			request.get('/api/users/getUserProvider')
			.set('Authorization','Bearer ' + token)
			.end(function (err,res) {
				should.not.exists(err);
				res.body.data.should.be.Object();
				done();
			})
		});
	});

	describe('get /api/users/getCaptcha', function() {
		it('should return captcha image', function(done) {
			request.get('/api/users/getCaptcha')
			.end(function (err,res) {
				should.not.exists(err);
				done();
			})
		});
	});

	describe('get /api/users/me', function() {
		it('should return me info', function(done) {
			request.get('/api/users/me')
			.set('Authorization','Bearer ' + token)
			.end(function (err,res) {
				should.not.exists(err);
				res.body.nickname.should.be.String();
				done();
			})
		});
	});

	describe('del /api/users/:id', function() {
		it('should if userid === req.user._id return error', function(done) {
			request.del('/api/users/' + mockAdminId)
			.set('Authorization','Bearer ' + token)
			.end(function (err,res) {
				should.exists(err);
				err.status.should.be.equal(403);
				done();
			})
		});

		it('should if userId error return error', function(done) {
			request.del('/api/users/dddddd')
			.set('Authorization','Bearer ' + token)
			.end(function (err,res) {
				should.exists(err);
				err.status.should.be.equal(500);
				done();
			})
		});

		it('should return me info', function(done) {
			request.del('/api/users/' + mockUserId)
			.set('Authorization','Bearer ' + token)
			.end(function (err,res) {
				should.not.exists(err);
				res.body.success.should.be.true();
				done();
			})
		});
	});

});