'use stric'

const nunjucks = require('nunjucks')
const fs = require('fs')
const path = require('path')

const MyLoader = nunjucks.Loader.extend({
    init: function(searchPaths, opts) {
        if(typeof opts === 'boolean') {
            console.log(
                '[nunjucks] Warning: you passed a boolean as the second ' +
                'argument to FileSystemLoader, but it now takes an options ' +
                'object. See http://mozilla.github.io/nunjucks/api.html#filesystemloader'
            )
        }

        opts = opts || {}
        this.pathsToNames = {}
        this.noCache = !!opts.noCache

        if(searchPaths) {
            searchPaths = nunjucks.lib.isArray(searchPaths) ? searchPaths : [searchPaths]
            // For windows, convert to forward slashes
            this.searchPaths = searchPaths.map(path.normalize)
        }
        else {
            this.searchPaths = ['.']
        }

        if(opts.watch) {
            // Watch all the templates in the paths and fire an event when
            // they change
            var chokidar = require('chokidar')
            var paths = this.searchPaths.filter(fs.existsSync)
            var watcher = chokidar.watch(paths)
            watcher.on('all', function(event, fullname) {
                fullname = path.resolve(fullname)
                if(event === 'change' && fullname in _this.pathsToNames) {
                    _this.emit('update', _this.pathsToNames[fullname])
                }
            })
            watcher.on('error', function(error) {
                console.log('Watcher error: ' + error)
            })
        }
    },

    getSource: function(name) {
        let fullpath = null
        const paths = this.searchPaths
        for(var i=0; i<paths.length; i++) {
            const basePath = path.resolve(paths[i])
            let p = path.resolve(paths[i], name)
            p = p.replace(/\./g, '/')
            if (path.extname(p) != '.njk') {
                p += '.njk'
            }
            if(p.indexOf(basePath) === 0 && fs.existsSync(p)) {
                fullpath = p
                break
            }
        }
        if(!fullpath) {
            return null
        }

        this.pathsToNames[fullpath] = name

        return {
            src: fs.readFileSync(fullpath, 'utf-8'),
            path: fullpath,
            noCache: this.noCache
        }
    }
})

module.exports = new nunjucks.Environment(new MyLoader('test/views'))
