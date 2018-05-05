const moment = require('moment');

moment.locale('zh-cn');//中文时间
exports.relative = time => moment(new Date(time)).fromNow();//相对时间