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

  list() {
    return this._transporters
  }
}

module.exports = new transporterStore()
