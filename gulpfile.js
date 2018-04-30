const gulp = require('gulp')
const jest = require('gulp-jest').default
const eslint = require('gulp-eslint')
const notify = require('gulp-notify')
const runSequence = require('run-sequence')

gulp.task('jest', function () {
    return gulp.src('tests')
        .pipe(notify({ title: 'EXPERIMENT', message: 'Ready To Testing' }))
        .pipe(jest({
            'preprocessorIgnorePatterns': [
                '<rootDir>/dist/', '<rootDir>/node_modules/'
            ],
            'automock': false
        }))
})

gulp.task('lint', () => {
    return gulp.src(['**/*.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
})

gulp.task('test', function () {
    runSequence('lint', 'jest')

    gulp.watch(['**/*.js','!node_modules/**'], function () {
        runSequence('lint', 'jest')
    })
})

gulp.task('default', ['test'], function () {

})
