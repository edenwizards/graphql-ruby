import { ASTNode, FieldNode, InlineFragmentNode } from "graphql";
declare function addTypenameIfAbsent(node: FieldNode | InlineFragmentNode): undefined | FieldNode | InlineFragmentNode;
declare function addTypenameToSelectionSet(node: ASTNode): any;
export { addTypenameToSelectionSet, addTypenameIfAbsent };
