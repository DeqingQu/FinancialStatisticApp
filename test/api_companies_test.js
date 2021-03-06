const chai = require('chai');
const expect = chai.expect;
const superagent = require('superagent')

var BASE_URL = 'http://localhost:3000/api';
var exist_company_id = 5;
var no_exist_company_id = 1;

var testItem = {'company_name':'test_name', 'ticker_symbol':'ticker_symbol'};
var modifyItem1 = {'company_name':'test_name1', 'ticker_symbol':'ticker_symbol1'};
var modifyItem2 = {'ticker_symbol':'ticker_symbol2'};

describe("test site with superagent", () => {
    it("test GET /url/api/companies", (done) => {
        superagent.get(BASE_URL + '/companies')
            .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(res.text).to.exist;

                var companies = JSON.parse(res.text);
                expect(companies).to.be.an.instanceof(Array);

                done();
            });
    });

    it("test Create company API", (done) => {
        superagent.post(BASE_URL + '/companies/')
            .type('form')
            .send(testItem)
            .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(201);
                expect(res.text).to.exist;

                var company = JSON.parse(res.text);
                testItem['company_id'] = company['company_id'];
                modifyItem1['company_id'] = company['company_id'];
                modifyItem2['company_id'] = company['company_id'];
                expect(company).to.be.an('object').that.is.not.empty;

                done();
            });
    });

    it("test Get the company just created", (done) => {
        superagent.get(BASE_URL + '/companies/' + testItem['company_id'])
            .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(res.text).to.exist;

                var company = JSON.parse(res.text);
                expect(company['company_id']).to.equal(testItem['company_id']);
                expect(company['company_name']).to.equal(testItem['company_name']);
                expect(company['ticker_symbol']).to.equal(testItem['ticker_symbol']);

                done();
            });
    });

    it("test modify the company just created", (done) => {
        superagent.put(BASE_URL + '/companies/' + modifyItem1['company_id'])
            .type('form')
            .send(modifyItem1)
            .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(201);
                expect(res.text).to.exist;

                var company = JSON.parse(res.text);
                expect(company['company_id']).to.equal(modifyItem1['company_id']);
                expect(company['company_name']).to.equal(modifyItem1['company_name']);
                expect(company['company_category']).to.equal(modifyItem1['company_category']);

                done();
        });
    });

    it("test Get the company just modified", (done) => {
        superagent.get(BASE_URL + '/companies/' + testItem['company_id'])
            .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(res.text).to.exist;

                var company = JSON.parse(res.text);
                expect(company['company_id']).to.equal(modifyItem1['company_id']);
                expect(company['company_name']).to.equal(modifyItem1['company_name']);
                expect(company['ticker_symbol']).to.equal(modifyItem1['ticker_symbol']);

                done();
            });
    });

    it("test modify the company with one attribution", (done) => {
        superagent.put(BASE_URL + '/companies/' + modifyItem2['company_id'])
            .type('form')
            .send(modifyItem2)
            .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(201);
                expect(res.text).to.exist;

                var company = JSON.parse(res.text);
                expect(company['company_id']).to.equal(modifyItem2['company_id']);
                expect(company['ticker_symbol']).to.equal(modifyItem2['ticker_symbol']);

                done();
        });
    });

    it("test Get the company just modified with one attribution", (done) => {
        superagent.get(BASE_URL + '/companies/' + testItem['company_id'])
            .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(res.text).to.exist;

                var company = JSON.parse(res.text);
                expect(company['company_id']).to.equal(modifyItem2['company_id']);
                expect(company['ticker_symbol']).to.equal(modifyItem2['ticker_symbol']);

                done();
            });
    });

    it("test Delete a company with id", (done) => {
        superagent.delete(BASE_URL + '/companies/' + testItem['company_id'])
            .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(204);

                done();
            });
    });

    it("test Get a company which has been deleted", (done) => {
        superagent.get(BASE_URL + '/companies/' + testItem['company_id'])
            .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(res.text).to.exist;

                var company = JSON.parse(res.text);
                expect(company).to.be.an('object').that.is.empty;

                done();
            });
    });

    // it("test Create company API with missing parameter", (done) => {
    //     superagent.post(BASE_URL + '/companies/')
    //         .type('form')
    //         .send({'company_name':'test'})
    //         .end(function(err, res) {
    //             expect(err).to.exist;
    //             expect(res).to.exist;
    //             expect(res.status).to.equal(400);
    //             expect(res.text).to.exist;
    //             console.log(res.text);
    //             done();
    //         });
    // });

});
