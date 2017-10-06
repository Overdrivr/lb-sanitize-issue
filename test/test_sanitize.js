'use strict';

var chai = require('chai');
var expect = chai.expect;
var server = require('../server/server');
var request = require('supertest');

describe('Book API', function() {
  var BOOK, NOTE;
  before(function createBook(cb) {
    server.models.Book.create({
      bookTitle: 'some-book'
    }, function(err, book) {
      if (err) return cb(err);
      if (!book) return cb(Error('Book could not be created'));
      BOOK = book;
      cb();
    });
  });

  it('creates a related Note instance', function(cb) {
      request(server)
        .post('/api/Books/' + BOOK.id + '/notes')
        .send({
          title: 'title-1',
          content: 'content-1'
        })
        .expect(200, function(err, res) {
          if (err) return cb(err);
          NOTE = res.body;
          cb();
        });
  });

  it('updates a related Note instance, with more fields than expected', function(cb) {
      request(server)
        .put('/api/Books/' + BOOK.id + '/notes/' + NOTE.id)
        .send({
          content: 'content-2',
          someOtherFieldThatShouldBeDiscarded: 'this-should-not-end-up-in-notes-model'
        })
        .expect(200, cb);
  });

  it('Note instance should not contain more fields than expected', function(cb) {
      request(server)
        .get('/api/Books/' + BOOK.id + '/notes/' + NOTE.id)
        .expect(200, function(err, res) {
          if (err) return cb(err);
          expect(res.body).to.not.contain.property('someOtherFieldThatShouldBeDiscarded');
          cb();
        });
  });
});
