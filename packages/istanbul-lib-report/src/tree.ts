/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

/**
 * A partial visitor only having the functions of interest to the caller.
 *
 *   * `onStart(root, state)` - called before traversal begins
 *   * `onSummary(node, state)` - called for every summary node
 *   * `onDetail(node, state)` - called for every detail node
 *   * `onSummaryEnd(node, state)` - called after all children have been visited for
 *      a summary node.
 *   * `onEnd(root, state)` - called after traversal ends
 */
export interface PartialVisitor<N extends BaseNode = BaseNode> {
  onStart?(root: N, state?: any): void;
  onSummary?(node: N, state?: any): void;
  onDetail?(node: N, state?: any): void;
  onSummaryEnd?(node: N, state?: any): void;
  onEnd?(root: N, state?: any): void;
}

/**
 * An object with methods that are called during the traversal of the coverage tree.
 * A visitor has the following methods that are called during tree traversal.
 *
 *   * `onStart(root, state)` - called before traversal begins
 *   * `onSummary(node, state)` - called for every summary node
 *   * `onDetail(node, state)` - called for every detail node
 *   * `onSummaryEnd(node, state)` - called after all children have been visited for
 *      a summary node.
 *   * `onEnd(root, state)` - called after traversal ends
 *
 * @param delegate - a partial visitor that only implements the methods of interest
 *  The visitor object supplies the missing methods as noops. For example, reports
 *  that only need the final coverage summary need implement `onStart` and nothing
 *  else. Reports that use only detailed coverage information need implement `onDetail`
 *  and nothing else.
 * @constructor
 */
class Visitor<N extends BaseNode = BaseNode> {
  declare delegate: PartialVisitor<N> | Visitor<N> | undefined;

  declare onStart: (root: N, state?: any) => void;
  declare onSummary: (node: N, state?: any) => void;
  declare onDetail: (node: N, state?: any) => void;
  declare onSummaryEnd: (node: N, state?: any) => void;
  declare onEnd: (root: N, state?: any) => void;

  constructor(delegate?: PartialVisitor<N> | Visitor<N>) {
    this.delegate = delegate;
  }
}

(["Start", "End", "Summary", "SummaryEnd", "Detail"] as const)
  .map((k) => `on${k}` as const)
  .forEach((fn) => {
    Object.defineProperty(Visitor.prototype, fn, {
      writable: true,
      value(this: Visitor, node: BaseNode, state: unknown) {
        const delegate = this.delegate as PartialVisitor;
        if (typeof delegate[fn] === "function") {
          delegate[fn](node, state);
        }
      },
    });
  });

class CompositeVisitor<N extends BaseNode = BaseNode> extends Visitor<N> {
  declare visitors: Visitor<N>[];

  constructor(visitors: (Visitor<N> | PartialVisitor<N>)[] | Visitor<N> | PartialVisitor<N>) {
    super();

    if (!Array.isArray(visitors)) {
      visitors = [visitors];
    }
    this.visitors = visitors.map((v) => {
      if (v instanceof Visitor) {
        return v;
      }
      return new Visitor(v);
    });
  }
}

(["Start", "Summary", "SummaryEnd", "Detail", "End"] as const)
  .map((k) => `on${k}` as const)
  .forEach((fn) => {
    Object.defineProperty(CompositeVisitor.prototype, fn, {
      value(this: CompositeVisitor, node: BaseNode, state: unknown) {
        this.visitors.forEach((v) => {
          v[fn](node, state);
        });
      },
    });
  });

abstract class BaseNode {
  abstract getParent(): BaseNode | null;
  abstract getChildren(): BaseNode[];
  abstract isSummary(): boolean;

  isRoot(): boolean {
    return !this.getParent();
  }

  /**
   * visit all nodes depth-first from this node down. Note that `onStart`
   * and `onEnd` are never called on the visitor even if the current
   * node is the root of the tree.
   * @param visitor a full visitor that is called during tree traversal
   * @param state optional state that is passed around
   */
  visit(visitor: Visitor<any>, state?: any): void {
    if (this.isSummary()) {
      visitor.onSummary(this, state);
    } else {
      visitor.onDetail(this, state);
    }

    this.getChildren().forEach((child) => {
      child.visit(visitor, state);
    });

    if (this.isSummary()) {
      visitor.onSummaryEnd(this, state);
    }
  }
}

/**
 * abstract base class for a coverage tree.
 * @constructor
 */
class BaseTree<N extends BaseNode = BaseNode> {
  declare root: N;

  constructor(root: N) {
    this.root = root;
  }

  /**
   * returns the root node of the tree
   */
  getRoot(): N {
    return this.root;
  }

  /**
   * visits the tree depth-first with the supplied partial visitor
   * @param visitor - a potentially partial visitor
   * @param state - the state to be passed around during tree traversal
   */
  visit(visitor: Visitor<N> | PartialVisitor<N>, state?: any): void {
    const v = !(visitor instanceof Visitor) ? new Visitor(visitor) : visitor;
    v.onStart(this.getRoot(), state);
    this.getRoot().visit(v, state);
    v.onEnd(this.getRoot(), state);
  }
}

export { BaseTree, BaseNode, Visitor, CompositeVisitor };
