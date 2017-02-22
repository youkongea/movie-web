/**
 * Created by unsad on 2017/2/22.
 */
const crypto = require('crypto'),
    bcrypt = require('bcrypt-nodejs');

function getRandomString(len) {
    if (!len) len = 16;

    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex');
}

const should = require('should'),
    app = require('../../app'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

//test
describe('<Unit Test', function() {
    describe('Model User:', function() {
        before(function (done) {
            user = {
                name: getRandomString(),
                password: 'password'
            };
            done()
        });

        describe('Before Method save', function () {
            it('should begin without test user', function (done) {
                User.find({name: user.name}, function (err, users) {
                    users.should.have.length(0);

                    done()
                });
            });
        });

        describe('User save', function () {
            it('should save without problems', function (done) {
                let _user = new User(user);
                _user.save(function (err) {
                    should.not.exist(err);
                    _user.remove(function (err) {
                        should.not.exist(err);
                        done();
                    });
                });
            });

            it('should password be hashed correctly', function (done) {
                let password = user.password,
                    _user = new User(user);
                _user.save(function (err) {
                    should.not.exist(err);
                    _user.password.should.not.have.length(0);

                    bcrypt.compare(password, _user.password, function (err, isMatch) {
                        should.not.exist(err);
                        isMatch.should.equal(true);

                        _user.remove(function (err) {
                            should.not.exist(err);
                            done();
                        });
                    });
                });
            });
            it('should have default role 0', function (done) {
                let _user = new User(user);
                _user.save(function (err) {
                    _user.role.should.equal(0);

                    _user.remove(function (err) {
                        should.not.exist(err);
                        done();
                    });
                });
            });
            it('should fail to save an existing user', function (done) {
                let _user1 = new User(user);
                _user1.save(function (err) {
                    should.not.exist(err);

                    let _user2 = new User(user);
                    _user2.save(function (err) {
                        should.exist(err);

                        _user1.remove(function (err) {
                            if (!err) {
                                _user2.remove(function (err) {
                                    done();
                                });
                            }
                        });
                    });
                });
            });
        });

        after(function(done) {
            // clear user info
            done();
        })
    });
});