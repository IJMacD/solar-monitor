export class API {
    #endpoint;

    constructor (endpoint) {
        this.#endpoint = endpoint;
    }

    fetchData() {
      return fetch(`${this.#endpoint}/data`).then(r => r.json());
    }

    fetchScheduleData() {
      return fetch(`${this.#endpoint}/schedule`).then(r => r.json());
    }

    setLoad (on) {
      const body = new URLSearchParams({ load: on ? "1" : "0" });

      return fetch(`${this.#endpoint}/control`, {
        method: "post",
        body
      });
    }

    scheduleLoad (date, load) {
      const body = new URLSearchParams({ time: `${date}:00+08:00`, load });

      return fetch(`${this.#endpoint}/schedule`, {
        method: "post",
        body
      });
    }

    setCoil (coil, value) {
        const body = new URLSearchParams({ coil, value });

        return fetch(`${this.#endpoint}/control`, {
            method: "post",
            body
        });
    }

    setRegister (register, value) {
        const body = new URLSearchParams({ register, value });

        return fetch(`${this.#endpoint}/control`, {
            method: "post",
            body
        });
    }

    setControlMode (mode) {
        let value;
        switch (mode) {
            case "MANUAL":      value = 0; break;
            case "LIGHT":       value = 1; break;
            case "LIGHT_TIME":  value = 2; break;
            case "TIME":        value = 3; break;
            default:
                throw Error("Unrecognised value for Control Mode: " + mode);
        }

        this.setRegister("903D", value);
    }
}