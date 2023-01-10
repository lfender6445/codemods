const jscodeshift = require("jscodeshift");
const utils = require('@codeshift/utils')

import { addRTLImport, replaceFindMethods } from "./transform-helpers";

const transform = (file, api) => {
  const j = api.jscodeshift;
  // Use jscodeshift to find all calls to enzyme.find
  const replaceFind = j(file.source)
    .find(j.CallExpression, {
      callee: {
        property: { name: "find" },
      },
    })
    .forEach((path) => {
      if (path.value.callee.object.name === 'wrapper') {
        // yay, we found wrapper.find
        // Extract the argument passed to enzyme.find
        const argument = path.node.arguments[0];
        // Create a new call to the RTL method `getByRole`
        const rtlCall = j.callExpression(
          j.memberExpression(
            j.identifier("screen"),
            j.identifier("getByRole")
          ),
          [argument]
        );
        // Replace the enzyme call with the RTL call
        j(path).replaceWith(rtlCall);
      }
    });
  // Return the modified source code
  return replaceFind.toSource();
};

module.exports = transform;
