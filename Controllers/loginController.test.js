//chai and plugins
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

//sinon => test spies and stubs for js
const sinon = require('sinon');
//create sandbox object
let sandbox = sinon.createSandbox();
let anotherBox = sinon.createSandbox();

const mongoose = require('mongoose');
const { validationResult } = require("express-validator");
const error = require('./../middleware/handleErrors')
const auth = require('./loginController');
const permissions = require('../middleware/permissions');
let app;

describe('students', () => {
    // let findStudent;
    let student, saveStudent, authStub;
    beforeEach(() => {
        /********* Fake student data ***********/
        student = {
            _id: 46,
            firstName: "Mohamed",
            lastName: "Sayed",
            email: "test@gmail.com",
            password: "Ms123456",
            passwordConfirm: "Ms123456",
            image: "",
            personType: "student"
        }

        /*******fake findByID , save in DB  **************/
        // findStudent = sandbox.stub(mongoose.Model, "findById").resolves(student);
        saveStudent = sandbox.stub(mongoose.Model.prototype, "save").resolves(student);
    });
    before(() => {
        /******** Fake Authorization ***************/
        const fakeAuth = (req, res, next) => {
            req.user = student;
            next();
        }

        authStub = anotherBox.stub(permissions, 'validateToken').callsFake(fakeAuth);
    });
    afterEach(() => {
        sandbox.restore();
    })


    describe('create student - register', function () {
        let fakeErrors, mailStub, errorStub;
        before((done) => {
            /*******fake handle errors for express validator **************/
            fakeErrors = (req, res, next) => {
                let errors = validationResult(req);
                if (!errors.isEmpty()) {
                    let error = new Error();
                    error.status = 422;
                    error.message = "Invalid Data"
                    throw error;
                }
                next();
            }//instead of handle errors function
            errorStub = anotherBox.stub(error, 'handleErrors').callsFake(fakeErrors);
            /*******skip send email verification and return fake response **************/
            mailStub = anotherBox.stub(auth, 'sendVerificationEmail').callsFake((req, res, next) => {
                res.status(201).json({ user: student })
            });
            app = require('./../app');
            done();
        })

        it('should call handleError on error', (done) => {
            chai.request(app)
                .post('/register')
                .send({ firstName: "123" })
                .end((err, res) => {
                    expect(errorStub).to.have.been.calledOnce;
                    expect(mailStub).to.have.been.not.called;
                    expect(res).to.have.status(422);
                    expect(res.body).to.have.property('Error').to.equal('Error: Invalid Data');
                    done(err);
                })
        })

        it('should call handleError on email existence', (done) => {

            chai.request(app)
                .post('/register')
                .send({
                    firstName: "Mohamed",
                    lastName: "Sayed",
                    email: "ms5@gmail.com",
                    password: "Ms123456",
                    passwordConfirm: "Ms123456",
                    image: "",
                    personType: "student"
                })
                .end((err, res) => {
                    expect(errorStub).to.have.been.calledTwice;
                    expect(mailStub).to.have.been.not.called;
                    expect(res).to.have.status(422);
                    expect(res.body).to.have.property('Error').to.equal('Error: Invalid Data');
                    done(err);
                })
        })


        it('should call postLoginFunction', (done) => {
            chai.request(app)
                .post('/register')
                .send(student)
                .end((err, res) => {
                    expect(errorStub).to.have.been.calledThrice;
                    expect(mailStub).to.have.been.calledOnce;
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('user').to.deep.equal(student);
                    done(err);
                })
        })
    })


    describe('update student By ID', function () {

        it('should call auth check function and student.update on fail due to wrong ID', (done) => {
            chai.request(app)
                .put('/students/146')
                .end((err, res) => {
                    expect(res).to.have.status(403);
                    expect(res.body).to.have.property('Error').to.equal('Error: User not found');
                    done(err);
                })
        })
        it('should call auth check function and student.update on success', (done) => {

            chai.request(app)
                .put('/students/46')
                .end((err, res) => {
                    expect(saveStudent).to.have.been.calledOnce;
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.have.property('_id').to.equal(46);
                    done(err);
                })
        })
    })

})