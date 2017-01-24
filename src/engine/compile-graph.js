import uniq from 'lodash.uniq';
import identity from 'lodash.identity';

import nodeSpecs from './nodes';

export default ({ nodes, edges }) => {
  let inject = [];

  const createNode = (nodeId) => {
    const graphNode = nodes.get(nodeId);

    const nodeMetadata = graphNode.get('metadata');
    const nodeInstance = new nodeSpecs[graphNode.get('type')](nodeMetadata && nodeMetadata.toJS());

    inject.push(graphNode.get('type'));

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

  const outputNodeType = 'sysOutput';
  const outputNode     = nodes.find(node => node.get('type') === outputNodeType);
  const outputEdge     = outputNode && edges.find(edge => edge.getIn([ 'to', 'id' ]) === outputNode.get('id'));

  return {
    model:  outputEdge && createNode(outputEdge.getIn([ 'from', 'id' ])).generate(),
    inject: uniq(inject).map(type => nodeSpecs[type].frag).filter(identity)
  };
};

