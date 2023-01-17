const jscodeshift = require("jscodeshift");
const utils = require('@codeshift/utils')

const transform = (file, api) => {
  const j = api.jscodeshift;
  const source = j(file.source)
  // Use jscodeshift to find all calls to enzyme.find

  source
    .find(j.CallExpression, {
      callee: {
        property: { name: "find" },
      },
    })
    .forEach((path) => {
      if (path.value.callee.object.name === "wrapper") {
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

  source.find(j.VariableDeclaration, {
    kind: "const"
  }).forEach((path) => {
    console.log(path.value.declarations)
    if (path.value.declarations[0].id.name === "wrapper") {
      j(path).replaceWith(
        j.identifier("render")
      )
    }
  })

  const addRTLImport = (
    j.importDeclaration(
      [j.importDefaultSpecifier(j.identifier('{ getByRole, render, screen }'))],
      j.stringLiteral('react-testing-library')
    )
  )

  // Add RTL import
  source.get().node.program.body.unshift(addRTLImport)

  // Return the modified source code
  return source.toSource();
};

module.exports = transform;
