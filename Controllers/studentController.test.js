// //chai and plugins
// const chai = require('chai');
// const expect = chai.expect;
// const chaiAsPromised = require('chai-as-promised');
// chai.use(chaiAsPromised);
// const sinonChai = require('sinon-chai');
// chai.use(sinonChai);
// const chaiHttp = require('chai-http');
// chai.use(chaiHttp);

// //sinon => test spies and stubs for js
// const sinon = require('sinon');
// //create sandbox object
// let sandbox = sinon.createSandbox();
// let anotherBox = sinon.createSandbox();
// //rewire => modify in modules by setter and getter
// const rewire = require('rewire');

// const mongoose = require('mongoose');
// const { validationResult } = require("express-validator");
// const error = require('./../middleware/handleErrors')
// const Student = require("../Models/studentSchema");
// const auth = require('./loginController');
// const sendEmail = require("../middleware/emailTransporter");
// const permissions = require('../middleware/permissions');
// const studentController = require('./../Controllers/studentController');
// let app;
// function requireUncached(module) {
//     delete require.cache[require.resolve(module)];
//     return require(module);
// }
// describe('students', () => {
//     // let findStudent;
//     // let deleteStudent;
//     let student, authStub, saveStudent;
//     beforeEach(() => {

//         student = {
//             _id: 46,
//             firstName: "Mohamed",
//             lastName: "Sayed",
//             email: "test@gmail.com",
//             password: "Ms123456",
//             passwordConfirm: "Ms123456",
//             image: "",
//             personType: "student"
//         }
//         // findStudent = sandbox.stub(mongoose.Model, "findById").resolves(student);
//         saveStudent = sandbox.stub(mongoose.Model.prototype, "save").resolves(student);
//         // deleteStudent = sandbox.stub(mongoose.Model, "remove").resolves('fake remove student')
//         // const fakeAuth = (req, res, next) => {
//         //     req.user = student;
//         //     next();
//         // }

//         // authStub = sandbox.stub(permissions, 'validateToken').callsFake(fakeAuth);
//         // app = require('./../app');
//     });

//     afterEach(() => {
//         app = null;
//         // delete require.cache[require.resolve('./../app')];
//         // anotherBox.restore();
//         sandbox.restore();

//     })
//     // it('should call auth check function and student.update on fail due to wrong ID', (done) => {
//     //     console.log(authStub);
//     //     chai.request(app)
//     //         .put('/students/146')
//     //         .end((err, res) => {

//     //             expect(res).to.have.status(403);
//     //             expect(res.body).to.have.property('Error').to.equal('Error: User not found');
//     //             done(err);
//     //         })
//     // })
//     // it('should call auth check function and student.update on success', (done) => {

//     //     chai.request(app)
//     //         .put('/students/46')
//     //         .end((err, res) => {
//     //             // console.log(res.body);
//     //             expect(res).to.have.status(200);
//     //             expect(res.body.data).to.have.property('_id').to.equal(46);
//     //             done(err);
//     //         })
//     // })

//     describe('create student - register', () => {
//         let fakeErrors, mailStub, errorStub;
//         beforeEach(() => {
//             fakeErrors = (req, res, next) => {
//                 let errors = validationResult(req);
//                 if (!errors.isEmpty()) {
//                     let error = new Error();
//                     error.status = 422;
//                     error.message = "Invalid Data"
//                     throw error;
//                 }
//                 next();
//             }//instead of handle errors function

//             errorStub = sandbox.stub(error, 'handleErrors').callsFake(fakeErrors);
//             mailStub = sandbox.stub(auth, 'sendVerificationEmail').callsFake((req, res, next) => {
//                 res.status(201).json({ user: student })
//             });


//             app = require('./../app');
//             // app = requireUncached('./../app');
//         })
//         afterEach(() => {
//             app = null;
//             // delete require.cache[require.resolve('./../app')];
//             // anotherBox.restore();
//             sandbox.restore();

//         })

//         it('should call handleError on error', (done) => {
//             chai.request(app)
//                 .post('/register')
//                 .send({ firstName: "123" })
//                 .end((err, res) => {
//                     // expect(errorStub).to.have.been.calledOnce;
//                     // expect(mailStub).to.have.been.not.called;
//                     expect(res).to.have.status(422);
//                     expect(res.body).to.have.property('Error').to.equal('Error: Invalid Data');
//                     done(err);
//                 })
//         })

//         it('should call handleError on email existence', (done) => {

//             chai.request(app)
//                 .post('/register')
//                 .send({
//                     firstName: "Mohamed",
//                     lastName: "Sayed",
//                     email: "ms5@gmail.com",
//                     password: "Ms123456",
//                     passwordConfirm: "Ms123456",
//                     image: "",
//                     personType: "student"
//                 })
//                 .end((err, res) => {

//                     expect(res).to.have.status(422);
//                     expect(res.body).to.have.property('Error').to.equal('Error: Invalid Data');
//                     done(err);
//                 })
//         })


//         it('should call postLoginFunction', (done) => {
//             chai.request(app)
//                 .post('/register')
//                 .send(student)
//                 .end((err, res) => {

//                     expect(res).to.have.status(201);
//                     expect(res.body).to.have.property('user').to.deep.equal(student);
//                     done(err);
//                 })
//         })

//     })

//     describe('update student By ID', () => {
//         let authStub;
//         beforeEach(() => {

//             const fakeAuth = (req, res, next) => {
//                 req.user = student;
//                 next();
//             }

//             authStub = sandbox.stub(permissions, 'validateToken').callsFake(fakeAuth);
//             app = require('./../app');
//             // app = requireUncached('./../app');
//         })
//         afterEach(() => {
//             sandbox.restore();
//         })
//         it('should call auth check function and student.update on fail due to wrong ID', (done) => {
//             chai.request(app)
//                 .put('/students/146')
//                 .end((err, res) => {
//                     // console.log(res.body);
//                     expect(res).to.have.status(403);
//                     expect(res.body).to.have.property('Error').to.equal('Error: User not found');
//                     done(err);
//                 })
//         })
//         it('should call auth check function and student.update on success', (done) => {

//             chai.request(app)
//                 .put('/students/46')
//                 .end((err, res) => {
//                     // console.log(res.body);
//                     expect(res).to.have.status(200);
//                     expect(res.body.data).to.have.property('_id').to.equal(46);
//                     done(err);
//                 })
//         })
//     })

// })
//rewire => modify in modules by setter and getter
// const rewire = require('rewire');
// function requireUncached(module) {
//     delete require.cache[require.resolve(module)];
//     return require(module);
// }