// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2026 Gamma Sublang <gamma@sublang.ai>

//! Verifies graph-9 in specs/packages/graph.md through the public API.

use graph_crate::{Graph, NodeId};

fn collect(traverse: impl FnOnce(&mut dyn FnMut(NodeId))) -> Vec<NodeId> {
    let mut order = Vec::new();
    traverse(&mut |n| order.push(n));
    order
}

#[test]
fn traversals_handle_a_cycle_and_a_disconnected_node() {
    let mut g = Graph::new();
    for _ in 0..5 {
        g.add_node();
    }
    // Cycle 0 - 1 - 3 - 2 - 0; node 4 isolated.
    g.add_edge(0, 1);
    g.add_edge(0, 2);
    g.add_edge(1, 3);
    g.add_edge(2, 3);

    let bfs = |s| collect(|v| g.bfs(s, v));
    let dfs = |s| collect(|v| g.dfs(s, v));

    assert_eq!(bfs(0), vec![0, 1, 2, 3]);
    assert_eq!(bfs(3), vec![3, 1, 2, 0]);
    assert_eq!(dfs(0), vec![0, 1, 3, 2]);
    assert_eq!(dfs(3), vec![3, 1, 0, 2]);

    assert_eq!(bfs(4), vec![4]);
    assert_eq!(dfs(4), vec![4]);

    assert_eq!(bfs(99), Vec::<NodeId>::new());
    assert_eq!(dfs(99), Vec::<NodeId>::new());
}
