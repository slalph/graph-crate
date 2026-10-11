// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2026 Gamma Sublang <gamma@sublang.ai>

//! Verifies graph-6 in specs/packages/graph.md through the public API.

use graph_crate::Graph;

#[test]
fn shortest_path_through_public_api() {
    let mut g = Graph::new();
    let ids: Vec<_> = (0..5).map(|_| g.add_node()).collect();
    assert_eq!(ids, vec![0, 1, 2, 3, 4]);
    // 0 - 1 - 2 - 3, plus shortcut 0 - 3; node 4 isolated.
    g.add_edge(0, 1);
    g.add_edge(1, 2);
    g.add_edge(2, 3);
    g.add_edge(0, 3);

    assert_eq!(g.shortest_path(0, 3), Some(vec![0, 3]));
    assert_eq!(g.shortest_path(3, 0), Some(vec![3, 0]));
    assert_eq!(g.shortest_path(1, 3).map(|p| p.len()), Some(3));
    assert_eq!(g.shortest_path(2, 2), Some(vec![2]));
    assert_eq!(g.shortest_path(0, 4), None);
    assert_eq!(g.shortest_path(0, 99), None);

    let panicked = std::panic::catch_unwind(move || {
        let mut g = g;
        g.add_edge(0, 99);
    });
    assert!(panicked.is_err());
}
