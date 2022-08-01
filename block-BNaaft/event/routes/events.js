var express = require('express');
var router = express.Router();

var Event = require('../models/Event');
var Remark = require('../models/Remark');

/* GET users listing. */

router.get('/new', (req, res) => {
  res.render('eventForm');
});

router.post('/', (req, res, next) => {
  Event.create(req.body, (err, event) => {
    console.log(req.body);
    if (err) return next(err);
    res.redirect('/');
  });
});

router.get('/', (req, res) => {
  Event.find({}, (err, events) => {
    res.render('eventList', { events: events });
  });
});

router.get('/:id', (req, res, next) => {
  var id = req.params.id;
  Event.findById(id)
    .populate('remarks')
    .exec((err, event) => {
      if (err) return next(err);
      res.render('eventDetail', { event: event });
    });
});

router.get('/:id/category/:category', (req, res, next) => {
  var category = req.params.category;
  Event.find({ event_category: category }, (err, events) => {
    if (err) return next(err);
    res.render('eventByCategory', { events });
  });
});

router.get('/:id/location/:location', (req, res, next) => {
  var location = req.params.location;
  Event.find({ location: location }, (err, events) => {
    if (err) return next(err);
    res.render('eventByLocation', { events });
  });
});

//update event form
router.get('/:id/edit', (req, res, next) => {
  var id = req.params.id;
  Event.findById(id, (err, event) => {
    if (err) return next(err);
    res.render('eventEditForm', { event });
  });
});

//update event
router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  Event.findByIdAndUpdate(id, req.body, (err, event) => {
    if (err) return next(err);
    res.redirect('/events/' + id);
  });
});

//delete event
router.get('/:id/delete', (req, res, next) => {
  var id = req.params.id;
  Event.findByIdAndDelete(id, (err, event) => {
    if (err) return next(err);
    Remark.deleteMany({ eventId: event.id }, (err, info) => {
      res.redirect('/events');
    });
  });
});

// add remarks
router.post('/:id/remarks', (req, res, next) => {
  var id = req.params.id;
  req.body.eventId = id;
  Remark.create(req.body, (err, remark) => {
    if (err) return next(err);
    Event.findByIdAndUpdate(
      id,
      { $push: { remarks: remark._id } },
      (err, updatedEvent) => {
        res.redirect('/events/' + id);
      }
    );
  });
});

module.exports = router;
