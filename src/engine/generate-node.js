export default ({ spec, frag, ui, generate }) => {
  class AbstractNode {
    constructor(metadata) {
      this.spec = Object.assign({ inlets: [], }, spec);

      this.inlets = this.spec.inlets
        .reduce((memo, { id, value }) => Object.assign(memo, {
          [id]: value
        }), {});

      this.metadata = metadata || {};
    }

    getSpec() {
      return this.spec;
    }

    connect(args) {
      Object.keys(args).forEach(key => {
        this.inlets[key] = args[key];
      });
    }

    toString() { return generate(this.inlets, this.metadata); }
    generate() { return generate(this.inlets, this.metadata); }
  }

  AbstractNode.frag = frag;
  AbstractNode.spec = spec;
  AbstractNode.ui   = ui;

  return AbstractNode;
};
