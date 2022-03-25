const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const Student = require('./studentSchema');

describe('Student model', () => {

    it('should return error is required', (done) => {
        let user = new Student();

        user.validate((err) => {
            expect(err.errors.firstName).to.exist;
            expect(err.errors.lastName).to.exist;
            expect(err.errors.email).to.exist;
            expect(err.errors.image).to.not.exist;
            done();
        })
    })
    it('should return error Minimum length is 3 characters for firstName', (done) => {
        let user = new Student({
            firstName: "mo"
        });
        const error = user.validateSync();
        expect(error.errors.firstName.message).to.equal("Minimum length is 3 characters");
        done();
    })

    it('should return error Email Syntax for email', (done) => {
        let user = new Student({
            email: "mohamed"
        });
        const error = user.validateSync();
        expect(error.errors.email.message).to.equal("Email Syntax is wrong");
        done();
    })

    it('should have match password with confirm password', async () => {
        let user = new Student({
            firstName: "Mohamed",
            lastName: "Sayed",
            email: "test@gmail.com",
            password: "Ms123456",
            passwordConfirm: "Ms12345678",
            image: "",
        })

        expect(user).to.have.property('verified').to.equal(false);
        await expect(user.save()).to.eventually.be.rejectedWith("Two Passwords doesn't Match.")
    })
})