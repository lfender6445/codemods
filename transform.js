const jscodeshift = require("jscodeshift");
const utils = require('@codeshift/utils')

import { addRTLImport, replaceFindMethods } from "./transform-helpers";

const transform = (file, api) => {
  const j = api.jscodeshift;
  const source = j(file.source)

  // Add RTL import
  source.get().node.program.body.unshift(addRTLImport(j))

  // Remove enzyme import
  utils.removeImportDeclaration(j, source, 'enzyme')

  // Replace methods
  replaceFindMethods(j, source)

  // Return the modified source code
  return source.toSource();
};

module.exports = transform