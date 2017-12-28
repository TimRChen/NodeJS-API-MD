var gaze = require('gaze');

// Watch all .txt files/dirs in process.cwd()
gaze('**/*.txt', function(err, watcher) {
  // Files have all started watching
  // watcher === this

  // Get all watched files
  var watched = this.watched();

  // On file changed
  this.on('changed', function(filepath) {
    console.log(filepath + ' was changed');
  });

  // On file added
  this.on('added', function(filepath) {
    console.log(filepath + ' was added');
  });

  // On file deleted
  this.on('deleted', function(filepath) {
    console.log(filepath + ' was deleted');
  });

  // On changed/added/deleted
  this.on('all', function(event, filepath) {
    console.log(filepath + ' was ' + event);
  });

  // Get watched files with relative paths
  var files = this.relative();
});



// 不生效，废弃..
// var fs = require('fs');

// fs.watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
//   if (filename) {
//     console.log(filename);
//     // 输出: <Buffer ...>
//   }
// });