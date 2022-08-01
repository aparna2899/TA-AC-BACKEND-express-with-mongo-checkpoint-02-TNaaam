var express = require('express');
var router = express.Router();

var Event = require('../models/Event');
var Remark = require('../models/Remark');

router.get('/:id/edit', (req, res, next) => {
  var id = req.params.id;
  Remark.findById(id, (err, remark) => {
    if (err) return next(err);
    res.render('remarkEditForm', { remark });
  });
});

router.post('/:id', (req, res) => {
  var id = req.params.id;
  Remark.findByIdAndUpdate(id, req.body, (err, updatedremark) => {
    if (err) return next(err);
    res.redirect('/events/' + updatedremark.eventId);
  });
});

router.get('/:id/delete', (req, res, next) => {
  var id = req.params.id;
  Remark.findByIdAndDelete(id, (err, remark) => {
    if (err) return next(err);
    Event.findByIdAndUpdate(
      remark.eventId,
      { $pull: { remarks: remark._id } },
      (err, event) => {
        res.redirect('/events/' + remark.eventId);
      }
    );
  });
});

module.exports = router;
