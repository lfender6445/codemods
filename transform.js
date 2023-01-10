const jscodeshift = require("jscodeshift");

const transform = (file, api) => {
  const j = api.jscodeshift;
  // Use jscodeshift to find all calls to enzyme.find
  const enzymeCalls = j(file.source)
    .find(j.CallExpression, {
      callee: {
        // object: { name: "enzyme" },
        property: { name: "find" },
      },
    })
    .forEach((path) => {
      console.log({path})
      // Extract the argument passed to enzyme.find
      const argument = path.node.arguments[0];
      // Create a new call to the RTL method `getBy`
      const rtlCall = j.callExpression(
        j.memberExpression(j.identifier("getBy"), j.identifier("displayName")),
        [argument]
      );
      // Replace the enzyme call with the RTL call
      j(path).replaceWith(rtlCall);
    });
  // Return the modified source code
  return enzymeCalls.toSource();
};

module.exports = transform;
