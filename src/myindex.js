import eruda from './index'
import { Base64 } from 'js-base64';
import { decode } from './decoder';

eruda.init();
eruda.get().config.set({
  displaySize: 100,
  transparency: 1,
  tinyNavBar: true,
  navBarBgColor: '#006ab2'
});
eruda.show();
var con = eruda.get('console');

function parse(log) {
  try {
    log = Base64.decode(log);
    return JSON.parse(log);
  } catch (e) {
    window.console.warn(log);
    throw e;
  }
}

function addLog(log) {
  var obj = parse(log);
  if (obj.args) {
    obj.args = decode(obj.args);
  }
  con.insert(obj);
}

/*
function addLog(log) {
  var obj = parse(log);

  switch (obj.type) {
    case 'debug':
      con.debug.apply(con, obj.args);
      break;
    case 'info':
      con.info.apply(con, obj.args);
      break;
    case 'log':
      con.log.apply(con, obj.args);
      break;
    case 'warn':
      con.warn.apply(con, obj.args);
      break;
    case 'error':
      con.insert(obj);
      break;
    case 'assert':
      con.error.apply(con, obj.args);
      break;
  }
}
*/

module.exports = addLog;
