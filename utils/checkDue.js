const moment = require("moment");

function checkDue(currentDate, dueDate) {
  return moment(currentDate).isSameOrAfter(moment(dueDate));
}

module.exports = checkDue;
