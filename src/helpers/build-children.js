import cleanText from "./clean-text";
import toFunctionCall from "./ast/to-function-call";
import injectRenderArbitrary from "./runtime/render-arbitrary";
import iDOMMethod from "./idom-method";
import isLiteralOrSpecial from "./is-literal-or-special";
import toString from "./ast/to-string";
import { getCompletionRecords } from "./completion-records";


// String concatenations are special cased, so template literals don't
// require a call to renderArbitrary.
function isStringConcatenation(path) {
  if (!(path.isBinaryExpression() && path.node.operator === "+")) {
    return false;
  }

  const left = path.get("left");
  const right = path.get("right");
  return left.isStringLiteral() ||
    right.isStringLiteral() ||
    isStringConcatenation(left) ||
    isStringConcatenation(right);
}

// Transforms the children into an array of iDOM function calls
export default function buildChildren(children, plugin) {
  const { replacedElements, fastRoots } = plugin;

  children = children.reduce((children, child) => {
    const wasInExpressionContainer = child.isJSXExpressionContainer();
    if (wasInExpressionContainer) {
      child = child.get("expression");
    }

    if (child.isJSXEmptyExpression()) {
      return children;
    }

    let sequence;
    while (child.isSequenceExpression() && !replacedElements.has(child)) {
      sequence = child;
      const expressions = child.get("expressions");
      let i;
      for (i = 0; i < expressions.length - 1; i++) {
        children.push(expressions[i].node);
      }
      child = expressions[i];
    }

    let { node } = child;

    if (child.isJSXText() || isLiteralOrSpecial(child)) {
      let value;

      // Clean up the text, so we don't have to have multiple TEXT nodes.
      if (child.isJSXText()) {
        value = cleanText(child);
      } else {
        value = toString(child, true);
      }

      // Only strings and numbers will print, anything else is skipped.
      if (!value) {
        return children;
      }

      node = toFunctionCall(iDOMMethod("text", plugin), [value]);
    } else if (isStringConcatenation(child)) {
      node = toFunctionCall(iDOMMethod("text", plugin), [node]);
    } else if (wasInExpressionContainer) {
      let element = sequence || child;
      if (!replacedElements.has(child) && !fastRoots.has(element)) {
        const completions = getCompletionRecords(child);
        const nonJSX = completions.some(c => !replacedElements.has(c));
        if (nonJSX) {
          // Arbitrary expressions, e.g. variables, need to be inspected at runtime
          // to determine how to render them.
          node = toFunctionCall(injectRenderArbitrary(plugin), [node]);
        }
      }
    }

    children.push(node);
    return children;
  }, []);

  return children;
}
