import nodeSpecs from './nodes';

export default ({ nodes, edges }) => {
  const createNode = (nodeId) => {
    const graphNode = nodes.get(nodeId);

    const nodeInstance = new nodeSpecs[graphNode.get('type')](graphNode.get('metadata'));

    nodeInstance.getSpec().inlets.forEach(({ id }) => {
      const matchingInlet = edges.find(edge => {
        return edge.getIn([ 'to', 'id' ]) === nodeId && edge.getIn([ 'to', 'inlet' ]) === id;
      });

      if (matchingInlet) {
        nodeInstance.connect({
          [id]: createNode(matchingInlet.getIn([ 'from', 'id' ]))
        });
      }
    });

    return nodeInstance;
  };

  // TODO: 'output', 'input', magic strings -> turn into constants?
  const outputNode = nodes.find(node => node.get('type') === 'output');
  const outputEdge = outputNode && edges.find(edge => edge.getIn([ 'to', 'id' ]) === outputNode.get('id'));

  return outputEdge && createNode(outputEdge.getIn([ 'from', 'id' ])).generate();
}

