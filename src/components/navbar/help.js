import React from 'react';

import './help.css';

const SDF_EXAMPLE   = '-Kbe_8rRWc6YiK-bKZmx';
const CSG_EXAMPLE   = '-KbeaGJmVhufgiQMdzob';
const FINAL_EXAMPLE = '-KbeeFpULWveaUk44UTv';

export default () => {
  return <div>
    <h1 className='help__h1'>SDF-UI</h1>

    <p>
      SDF stands for Signed Distance Function - a function which returns shortest distance between given input point and some surface. Sign of returned value indicates if point is inside, or outside that surface.
    </p>

    <p>
      Complex scenes can be defined in terms of SDFs and calculated using raymarching.
    </p>

    <p>
      One of nicest properties of SDFs is ease of manipulating shapes with constructive solid geometry (CSG): intersection, union and difference can be represented as simple operations on distances from two surfaces.
    </p>

    <p>
      SDF-UI allows for quick and simple exploration of this technique using node-based UI.
    </p>

    <p>
      For more explanation on SDFs visit:
    </p>

    <ul className='help__list'>
      <li><a className='help__link' href='https://en.wikipedia.org/wiki/Signed_distance_function'>https://en.wikipedia.org/wiki/Signed_distance_function</a></li>
      <li><a className='help__link' href='http://jamie-wong.com/2016/07/15/ray-marching-signed-distance-functions/'>http://jamie-wong.com/2016/07/15/ray-marching-signed-distance-functions/</a></li>
      <li><a className='help__link' href='http://iquilezles.org/www/articles/raymarchingdf/raymarchingdf.htm'>http://iquilezles.org/www/articles/raymarchingdf/raymarchingdf.htm</a></li>
    </ul>

    <h1 className='help__h1'>Interface</h1>

    <p>
      Basic usage:
    </p>

    <ul className='help__list'>
      <li>to create node double click on empty space in editor pane (left side of the window)</li>
      <li>to connect nodes drag edge from one node outlet, to matching (<span className='help__bright'>f</span> to <span className='help__bright'>f</span> and <span className='help__bright'>3</span> to <span className='help__bright'>3</span>) and free inlet of another node</li>
      <li>to delete node or edge select it, and hit <span className='help__bright'>backspace</span> on keyboard</li>
    </ul>

    <p>
      Menu items:
    </p>

    <ul className='help__list'>
      <li>HELP - you are here</li>
      <li>SAVE - persists graph in database, URL will change and every time you visit it, same graph will load - when you make changes you can save again</li>
      <li>GLSL - shows generated GLSL code - you can copy it and use where you want</li>
      <li>FS - fullscreens preview (hides editor)</li>
    </ul>

    <h1 className='help__h1'>Howto</h1>

    <p>
      Each scene needs minimum of three nodes:
    </p>

    <ul className='help__list'>
      <li><span className='help__bright'>sysInput</span> - which represents input point for SDF and has one outlet named <span className='help__bright'>p</span></li>
      <li><span className='help__bright'>sdSphere</span> - or any other node starting with <span className='help__bright'>sd</span> - these represent different surfaces, and always have at least one inlet named <span className='help__bright'>p</span>, and output signed distance (<span className='help__bright'>d</span>)</li>
      <li><span className='help__bright'>sysOutput</span> - which raymarches distance (<span className='help__bright'>d</span>) and displays the scene</li>
    </ul>

    <p>
      You can check basic example here: <a className='help__link' href={ `/?id=${SDF_EXAMPLE}` }>SDF example</a>.
    </p>

    <p>
      Each inlet can only have single connection comming in, so to display more than one surface, we need to combine them together. There's set of operations which allow us to do just that: <span className='help__bright'>opIntersect</span>, <span className='help__bright'>opDifference</span>, <span className='help__bright'>opUnion</span> and their variants.
    </p>

    <p>
      You can check union example here: <a className='help__link' href={ `/?id=${CSG_EXAMPLE}` }>CSG example</a>.
    </p>

    <p>
      There's also set of operations which work on input point <span className='help__bright'>p</span>, rather than distances. These allow us to modify and bend space, and include: <span className='help__bright'>opMirror</span>, <span className='help__bright'>opRotate</span>, <span className='help__bright'>opTranslate</span>, and different versions of <span className='help__bright'>opRepeat</span>.
    </p>

    <p>
      Simple UIs can build with <span className='help__bright'>uiFloat</span> (which returns single float) and <span className='help__bright'>uiPack3</span> (which combines three floats into vec3). Nodes have their inlets and outlets described either with <span className='help__bright'>f</span> for floats or <span className='help__bright'>3</span> for vec3.
    </p>

    <p>
      Finally there's set of simple math operations, and another input named <span className='help__bright'>sysTime</span> which allow for building simple animations.
    </p>

    <p>
      You can check final example of UI, space and math operations working together here: <a className='help__link' href={ `/?id=${FINAL_EXAMPLE}` }>animation example</a>.
    </p>

    <h1 className='help__h1'>Info</h1>

    <p>
      SDF-UI was built by <a className='help__link' href='http://szymonkaliski.com'>Szymon Kaliski</a>, with parts of SDF code borrowed from <a href='http://stack.gl' className='help__link'>stack.gl</a> and <a href='http://mercury.sexy/hg_sdf/' className='help__link'>hg_sdf</a>.
    </p>

    <p>
      Source code is available on github: <a className='help__link' href='https://github.com/szymonkaliski/sdf-ui'>https://github.com/szymonkaliski/sdf-ui</a>
    </p>
  </div>;
};
