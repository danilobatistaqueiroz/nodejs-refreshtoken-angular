const {createLogger, format, transports} = require("winston");
const { combine, timestamp, metadata, json, prettyPrint, colorize, errors, simple, printf, splat } = format;

const fs = require("fs");
let cl = console.log
console.log = function(...args){
  let d = new Date();
  args.unshift('Info:');
  args.push('| '+d.toISOString());
  fs.appendFileSync("logs/console.log",args.join(' ')+'\n');
  cl.apply(console, args)
}
let ce = console.error
console.error = function(...args){
  let d = new Date();
  args.unshift('Error:');
  args.push('| '+d.toISOString());
  fs.appendFileSync("logs/console.log",args.join(' ')+'\n');
  args = args.map(a => a='\x1b[31m'+a+'\x1b[0m');
  ce.apply(console, args)
}

const datetime = printf(info => {
  let d = new Date();
  info.message = `${info.message} | ${d.toISOString()}`;
  return `${info.level}: ${info.message}`;
});

const red = printf(info => {
  if(info.level=='error')
    return `\x1b[31m${info.level}: ${info.message}\x1b[0m`;
  else
    return `${info.level}: ${info.message}`;
});

const logger = createLogger({
  exitOnError:false,
  level:"info", 
  format:combine(simple(),datetime),
  transports: [
    new transports.Console({format:combine(red)}),
    new transports.File({filename:"logs/info.log"}),
    new transports.File({filename:"logs/error.log", level:"error", handleExceptions:true, handleRejections:true})
  ]
});

module.exports = logger;