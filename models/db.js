const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/myLogsAppDB", {
  useUnifiedTopology: true,
});

require('./user');