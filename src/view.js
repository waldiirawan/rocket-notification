'use stric'

const nunjucks = require('nunjucks')
const fs = require('fs')
const path = require('path')

const MyLoader = nunjucks.Loader.extend({
    init(searchPaths, options) {
        if (typeof options === 'boolean') {
            console.log(
                '[nunjucks] Warning: you passed a boolean as the second ' +
                'argument to FileSystemLoader, but it now takes an options ' +
                'object. See http://mozilla.github.io/nunjucks/api.html#filesystemloader'
            )
        }

        const opts = options || {}
        this.pathsToNames = {}
        this.noCache = !!opts.noCache

        if (searchPaths) {
            const SearchPaths = nunjucks.lib.isArray(searchPaths) ? searchPaths : [searchPaths]
            // For windows, convert to forward slashes
            this.searchPaths = SearchPaths.map(path.normalize)
        } else {
            this.searchPaths = ['.']
        }

        if (opts.watch) {
            // Watch all the templates in the paths and fire an event when
            // they change
            const chokidar = require('chokidar')
            const paths = this.searchPaths.filter(fs.existsSync)
            const watcher = chokidar.watch(paths)
            watcher.on('all', (event, fullname) => {
                const fullName = path.resolve(fullname)
                if (event === 'change' && fullName in _this.pathsToNames) {
                    _this.emit('update', _this.pathsToNames[fullName])
                }
            })
            watcher.on('error', (error) => {
                console.log('Watcher error: ' + error)
            })
        }
    },

    getSource(name) {
        let fullpath = null
        const paths = this.searchPaths
        for (let i = 0; i < paths.length; i++) {
            const basePath = path.resolve(paths[i])
            let p = path.resolve(paths[i], name)
            p = p.replace(/\./g, '/')
            if (path.extname(p) !== '.njk') {
                p += '.njk'
            }
            if (p.indexOf(basePath) === 0 && fs.existsSync(p)) {
                fullpath = p
                break
            }
        }
        if (!fullpath) {
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

class View {
    constructor(config) {
        this.nunjucks = new nunjucks.Environment(new MyLoader(config.views))
    }

    render(name, data) {
        return this.nunjucks.render(name, data)
    }
}

module.exports = View
