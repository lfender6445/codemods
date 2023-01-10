const jscodeshift = require("jscodeshift");

export const addRTLImport = (j) => (
  j.importDeclaration(
    [j.importDefaultSpecifier(j.identifier('{ screen, getByRole }'))],
    j.stringLiteral('react-testing-library')
  )
)

export const replaceFindMethods = (j, source) => {
  return (
    // Use jscodeshift to find all calls to enzyme.find
    source
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
      })
  )
}