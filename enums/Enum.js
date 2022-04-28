export default class Enum {
    // override this in derived types
    // this is for i18n and replaces `this.constructor.name`
    // which doesnt work in minified code! :(
    static get name() { return 'Enum'; }

    hasValue(val) {
        return !!this.values.contains(val);
    }

    get values() {
        return Object.keys(this).map(k => this[k]);
    }
}
