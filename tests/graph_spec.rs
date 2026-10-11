// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2026 Gamma Sublang <gamma@sublang.ai>

//! Verifies the External Behavior items graph-1 through graph-5 in
//! specs/packages/graph.md, one test per item, through the public API.

use std::collections::BTreeSet;
use std::panic::{catch_unwind, AssertUnwindSafe};

use graph_crate::{Graph, NodeId};

/// Builds a graph with `n` nodes and the given undirected edges.
fn build(n: usize, edges: &[(NodeId, NodeId)]) -> Graph {
    let mut g = Graph::new();
    for _ in 0..n {
        g.add_node();
    }
    for &(a, b) in edges {
        g.add_edge(a, b);
    }
    g
}

/// Asserts `path` starts at `from`, ends at `to`, has `edges_expected`
/// edges, and steps only along edges of `edges`.
fn assert_valid_path(
    path: &[NodeId],
    from: NodeId,
    to: NodeId,
    edges: &[(NodeId, NodeId)],
    edges_expected: usize,
) {
    let edge_set: BTreeSet<(NodeId, NodeId)> = edges
        .iter()
        .flat_map(|&(a, b)| [(a, b), (b, a)])
        .collect();
    assert_eq!(path.first(), Some(&from), "path {path:?} must start at {from}");
    assert_eq!(path.last(), Some(&to), "path {path:?} must end at {to}");
    assert_eq!(path.len() - 1, edges_expected, "path {path:?} must have the fewest edges");
    for w in path.windows(2) {
        assert!(edge_set.contains(&(w[0], w[1])), "{}-{} in {path:?} is not an edge", w[0], w[1]);
    }
}

/// graph-1: a new graph has no nodes and no edges.
#[test]
fn graph_1_new_graph_is_empty() {
    // No nodes: no id is a node, so every query is None and every edge panics.
    let g = Graph::new();
    assert_eq!(g.shortest_path(0, 0), None);
    let mut g2 = Graph::new();
    assert!(catch_unwind(AssertUnwindSafe(|| g2.add_edge(0, 0))).is_err());

    // No edges: once two nodes exist they are not connected to each other.
    let mut g = Graph::new();
    assert_eq!(g.add_node(), 0, "the first node of a new graph gets id 0");
    g.add_node();
    assert_eq!(g.shortest_path(0, 1), None);
    assert_eq!(g.shortest_path(1, 0), None);
}

/// graph-2: each `add_node` adds one node and returns consecutive ids from 0
/// in insertion order, unaffected by interleaved edges.
#[test]
fn graph_2_add_node_returns_consecutive_ids() {
    let mut g = Graph::new();
    let mut ids = Vec::new();
    for i in 0..10 {
        let id = g.add_node();
        ids.push(id);
        // The returned id is a node: it now answers a self query.
        assert_eq!(g.shortest_path(id, id), Some(vec![id]));
        // Exactly one node was added: the next id is not a node yet.
        assert_eq!(g.shortest_path(i + 1, i + 1), None);
        if i > 0 {
            g.add_edge(i - 1, i);
        }
    }
    assert_eq!(ids, (0..10).collect::<Vec<NodeId>>());
}

/// graph-3: `add_edge(a, b)` makes each endpoint reachable from the other in
/// one step.
#[test]
fn graph_3_add_edge_connects_both_ways() {
    let mut g = build(4, &[]);
    g.add_edge(2, 0);
    assert_eq!(g.shortest_path(2, 0), Some(vec![2, 0]));
    assert_eq!(g.shortest_path(0, 2), Some(vec![0, 2]));
    // A self-loop on an existing node is accepted and changes no result.
    g.add_edge(1, 1);
    assert_eq!(g.shortest_path(1, 1), Some(vec![1]));
    // A repeated edge keeps the one-step connection.
    g.add_edge(0, 2);
    assert_eq!(g.shortest_path(0, 2), Some(vec![0, 2]));
    // Other pairs stay unconnected.
    assert_eq!(g.shortest_path(0, 3), None);
}

/// graph-4: `add_edge` panics when either endpoint is not a node.
#[test]
fn graph_4_add_edge_with_unknown_node_panics() {
    // 3 nodes: ids 0..=2; 3 is the first id that is not a node.
    for (a, b) in [(0, 3), (3, 0), (3, 3), (0, 99), (99, 1), (usize::MAX, 0)] {
        let mut g = build(3, &[]);
        let result = catch_unwind(AssertUnwindSafe(|| g.add_edge(a, b)));
        assert!(result.is_err(), "add_edge({a}, {b}) must panic");
    }
}

/// graph-5: `shortest_path` returns the outcome for each case in its table.
#[test]
fn graph_5_shortest_path_cases() {
    // Two components: {0..=6} with several routes, and {7, 8}.
    //
    //   0 - 1 - 2 - 3
    //   |       |
    //   4 - 5 - 6        7 - 8
    let edges = [(0, 1), (1, 2), (2, 3), (0, 4), (4, 5), (5, 6), (6, 2), (7, 8)];
    let g = build(9, &edges);

    // Case: `from` or `to` is not a node.
    assert_eq!(g.shortest_path(9, 0), None);
    assert_eq!(g.shortest_path(0, 9), None);
    assert_eq!(g.shortest_path(9, 9), None);
    assert_eq!(g.shortest_path(usize::MAX, 0), None);

    // Case: `to` is unreachable from `from`.
    assert_eq!(g.shortest_path(0, 7), None);
    assert_eq!(g.shortest_path(8, 3), None);

    // Case: `from == to`.
    for n in 0..9 {
        assert_eq!(g.shortest_path(n, n), Some(vec![n]));
    }

    // Otherwise: a fewest-edges path along edges, from `from` to `to`.
    // (from, to, fewest edges), hand-computed on the graph above.
    for (from, to, dist) in [
        (0, 3, 3),
        (3, 0, 3),
        (4, 3, 4),
        (5, 3, 3),
        (6, 1, 2),
        (0, 6, 3),
        (7, 8, 1),
        (8, 7, 1),
    ] {
        let path = g
            .shortest_path(from, to)
            .unwrap_or_else(|| panic!("{from} -> {to} is reachable"));
        assert_valid_path(&path, from, to, &edges, dist);
    }
}
