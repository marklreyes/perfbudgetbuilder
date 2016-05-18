/*
	Project Configuration
*/

var folders = {
  base: 'src',
  src: 'src/js',
  i18n: 'src/i18n',
  dist: 'build/dist',
  // dist: '../..',
  build: 'build/tmp',
  min: 'build/min',
  templates: 'src/template'
};

var config = {
  appName: 'perfBudgetApp',
  fileName: 'perfbudget'
};

var langs = [
	['en','US']
];

/*
	Dependencies
*/
var gulp = require('gulp');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var templates  = require('gulp-angular-templatecache');
var jshint = require('gulp-jshint');
var fs = require('fs');

/*
	Functions
*/

// Converts an object to a flat array
function flattenObject(ob) {
	var toReturn = {};

	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;

		if ((typeof ob[i]) == 'object') {
			var flatObject = flattenObject(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;

				toReturn[i + '.' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
}

// Escapes content
function addslashes(string) {
	return string.replace(/\\/g, '\\\\').
	replace(/\u0008/g, '\\b').
	replace(/\t/g, '\\t').
	replace(/\n/g, '\\n').
	replace(/\f/g, '\\f').
	replace(/\r/g, '\\r').
	replace(/'/g, '\\\'').
	replace(/"/g, '\\"');
}

/*
	Tasks
*/

var defaultTasks = ['clean','templates','lint', 'src'];

//Clean out our dist and tmp folders
gulp.task('clean', function() {
	gulp.src(folders.build, {read: false}).pipe(clean());
});

//Build templates.js
gulp.task('templates', ['clean'], function () {
	return gulp.src([
			folders.templates+'/**/*.html'
			])
	.pipe(minifyHTML({
			quotes: true,
			empty: true,
			spare: true
	}))
	.pipe(templates('templates.js', {root: 'template/', module: config.appName}))
	.pipe(gulp.dest(folders.build));
});

//Lint our JS
gulp.task('lint', function() {
	return gulp.src(folders.src+'/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

//Build src.js
gulp.task('src', ['clean', 'lint'], function () {
	return gulp.src([
		folders.src+'/**/*.js'
	])
	.pipe(concat('src.js'))
	.pipe(gulp.dest(folders.build));
});

//Loop through languages defind above

var buildTasks = ['templates'];

for ( var i in langs ) {
	var langDetails = langs[i];
	(function() {

		var lang = langDetails[0];
		var iso = langDetails[1];
		var isExtended = langDetails[2];
		var name = '-'+lang+iso;

		defaultTasks.push('create'+name);
		defaultTasks.push('regionalize'+name);
		defaultTasks.push('dist'+name);

		buildTasks.push('create'+name);
		buildTasks.push('regionalize'+name);
		buildTasks.push('dist'+name);

		var useLang = lang;
		if ( useLang == 'zh' && iso == 'TW' ) useLang = 'tw';

		// Creates the initial JS file with all JS assets (.tmp.js)
		gulp.task('create'+name, ['templates','src'], function() {
				return gulp.src([
					folders.base+'/init.js', //top of file
					folders.build+'/templates.js',  //concatenated templates
					folders.i18n+'/'+useLang+'.js',  // regionalization
					folders.i18n+'/'+useLang+'_'+iso+'.js', // per region regionalization
					folders.build+'/src.js' //main js sources
				])
				.pipe(concat('/'+config.fileName+name+'.js'))
				.pipe(gulp.dest(folders.build));
		});

		// Translification station. Combines our scripts and htmlswith the i18n files for this region
		gulp.task('regionalize'+name, ['create'+name], function(){
			// This is not a webpage. window does not exist here!
			var window = {};

			// Pull in our i18n contents and assign to the window object using eval()
			// Bring in EN content as a default for region
			var translation = fs.readFileSync(folders.i18n+'/en.js').toString();
			eval(translation);

			// Flatten our i18n contents to a faster to read array
			var flattenedDefaultStrings = flattenObject(window.ltAccountLocalization);

			translation = fs.readFileSync(folders.i18n+'/'+useLang+'.js').toString();
			eval(translation);

			// Some regions have overrides for EN content
			if ( isExtended ) {
				translation = fs.readFileSync(folders.i18n+'/'+useLang+'_'+iso+'.js').toString();
				eval(translation);
			}

			// Flatten our i18n contents to a faster to read array
			var flattenedLocalizedStrings = flattenObject(window.ltAccountLocalization);

			// Merge the EN and regional content in the event that we don't have a key available in this region
			for ( var i in flattenedDefaultStrings ) {
				if ( !flattenedLocalizedStrings[i] ) flattenedLocalizedStrings[i] = flattenedDefaultStrings[i];
			}

			//Bring in our templates file
			var templates = fs.readFileSync(folders.build+'/'+config.fileName+name+'.js').toString();

			var totalReplaced = 0;
			var translateReplace = function(content,expression){

				var result;

				while ((result = expression.exec(content)) !== null ) {

					var thisReplace = result[0];
					var thisKey = result[3];

					if ( thisKey != 'undefined' ) {
						if ( typeof flattenedLocalizedStrings[thisKey] == 'string' ) {
							content = content.replace( thisReplace, addslashes(flattenedLocalizedStrings[thisKey])  );
							totalReplaced++;
						} else {
							console.warn('----[warning] Could not find value for '+thisReplace);
						}
					}
				}

				return content;
			};

			// Certain areas are double and even triple escaped. Enjoy the regex...
			//https://regex101.com/r/dX3rI5/2
			var expression = /\{\{(\ ?)(\\*)\'([\.A-Za-z0-9\_]*)(\\*)\' \| translate\}\}/gi;
			templates = translateReplace(templates,expression);

			console.log('[Done'+name+'] Translification complete... '+totalReplaced+' replaced.');

			fs.writeFileSync(folders.build+'/'+config.fileName+name+'.translified.js',templates);

			return true;
		});

		// Move to proper folder structure in dist/
		gulp.task('dist'+name, ['regionalize'+name], function() {
				return gulp.src([
					folders.build+'/'+config.fileName+name+'.translified.js' //top of file
				])
				.pipe(concat(config.fileName+'.js'))
				//.pipe(uglify())
				.pipe(gulp.dest(folders.dist+'/'+lang+'/'+iso+'/js/apps/'));
		});

	})();
}

// Default tasks, adds a copy of the array so we can keep using it below
gulp.task('defaultNoBuild', defaultTasks.slice(0));


//Sets up watchers on our JS and HTML source files
gulp.task('watch', function() {
		return gulp.watch(folders.base+'/**/*.js', buildTasks);
});
gulp.task('watch-html', function() {
		return gulp.watch(folders.templates+'/**/*.html', buildTasks);
});
defaultTasks.push('watch');
defaultTasks.push('watch-html');

// Default tasks - keeps the 'watch' active
gulp.task('default', defaultTasks);
