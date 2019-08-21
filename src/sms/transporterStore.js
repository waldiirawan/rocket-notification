class transporterStore {
    constructor() {
        this._transporters = {}
    }

    add(name, transporter) {
        this._transporters[name] = transporter
    }

    clear() {
        this._transporters = {}
    }

    list(name = null) {
        if (name) {
            return this._transporters[name] ? this._transporters[name] : null
        }
        return this._transporters
    }
}

module.exports = new transporterStore()
