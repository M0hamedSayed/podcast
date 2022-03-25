// Installation:

// install mocha global and inside project
// 1-npm install --global mocha
// 2-npm install --save-dev mocha
//***********************************************
// install chai with plugins and import it inside test file
// - npm install chai --save-dev
// - const chai = require('chai');
// -const expect = chai.expect;

// **plugins:
// * npm i chai-as-promised
// const chaiAsPromised = require('chai-as-promised')
// chai.use(chaiAsPromised);

// Instead of manually wiring up your expectations to a promise's fulfilled and rejected handlers:

// doSomethingAsync().then(
//     function (result) {
//         result.should.equal("foo");
//         done();
//     },
//     function (err) {
//        done(err);
//     }
// );
// you can write code that expresses what you really mean:

// return doSomethingAsync().should.eventually.equal("foo");
// *****************************************************
// * npm i sinon-chai
// const sinonChai = require('sinon-chai');
// chai.use(sinonChai);

// Instead of using Sinon.JS's assertions:

// sinon.assert.calledWith(mySpy, "foo");
// or awkwardly trying to use Chai's should or expect interfaces on spy properties:

// mySpy.calledWith("foo").should.be.ok;
// expect(mySpy.calledWith("foo")).to.be.ok;

// * npm install chai-http
// *****************************************************

// install rewire
// -npm install rewire
// const rewire = require('rewire');
// rewire adds a special setter and getter to modules so you can modify their behaviour for better unit testing.

// *****************************************************
// install sinon
// -npm install sinon
// -const sinon = require('sinon');
// Standalone test spies, stubs and mocks for JavaScript.
// Works with any unit testing framework.