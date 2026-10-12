// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2026 Gamma Sublang <gamma@sublang.ai>

//! A small undirected graph with a breadth-first shortest-path query and
//! breadth-first and depth-first traversals.
//!
//! # Example
//!
//! ```
//! use graph_crate::Graph;
//!
//! let mut g = Graph::new();
//! let a = g.add_node();
//! let b = g.add_node();
//! let c = g.add_node();
//! let d = g.add_node();
//! g.add_edge(a, b);
//! g.add_edge(b, c);
//! g.add_edge(a, c);
//!
//! assert_eq!(g.shortest_path(a, c), Some(vec![a, c]));
//! assert_eq!(g.shortest_path(c, a), Some(vec![c, a]));
//! assert_eq!(g.shortest_path(a, d), None);
//! ```

use std::collections::VecDeque;

/// Identifier of a node, returned by [`Graph::add_node`].
pub type NodeId = usize;

/// An unweighted, undirected graph.
#[derive(Debug, Clone, Default)]
pub struct Graph {
    adjacency: Vec<Vec<NodeId>>,
}

impl Graph {
    /// Creates an empty graph.
    pub fn new() -> Self {
        Self::default()
    }

    /// Adds a node and returns its identifier.
    ///
    /// Identifiers are assigned consecutively from `0`.
    pub fn add_node(&mut self) -> NodeId {
        self.adjacency.push(Vec::new());
        self.adjacency.len() - 1
    }

    /// Adds an undirected edge between `a` and `b`.
    ///
    /// # Panics
    ///
    /// Panics if `a` or `b` is not a node of this graph.
    pub fn add_edge(&mut self, a: NodeId, b: NodeId) {
        let n = self.adjacency.len();
        assert!(a < n && b < n, "add_edge: node out of range");
        self.adjacency[a].push(b);
        if a != b {
            self.adjacency[b].push(a);
        }
    }

    /// Returns a shortest path from `from` to `to`, inclusive of both ends,
    /// found by breadth-first search.
    ///
    /// Returns `None` if `to` is unreachable from `from` or either is not a
    /// node of this graph. A path from a node to itself is `[from]`.
    pub fn shortest_path(&self, from: NodeId, to: NodeId) -> Option<Vec<NodeId>> {
        let n = self.adjacency.len();
        if from >= n || to >= n {
            return None;
        }
        let mut parent: Vec<Option<NodeId>> = vec![None; n];
        let mut visited = vec![false; n];
        let mut queue = VecDeque::from([from]);
        visited[from] = true;
        while let Some(node) = queue.pop_front() {
            if node == to {
                let mut path = vec![to];
                let mut cur = to;
                while let Some(p) = parent[cur] {
                    path.push(p);
                    cur = p;
                }
                path.reverse();
                return Some(path);
            }
            for &next in &self.adjacency[node] {
                if !visited[next] {
                    visited[next] = true;
                    parent[next] = Some(node);
                    queue.push_back(next);
                }
            }
        }
        None
    }

    /// Calls `visit` once for each node reachable from `start`, `start`
    /// included, in breadth-first order.
    ///
    /// Neighbors are explored in the order their edges were added. Does
    /// nothing if `start` is not a node of this graph.
    pub fn bfs(&self, start: NodeId, mut visit: impl FnMut(NodeId)) {
        let n = self.adjacency.len();
        if start >= n {
            return;
        }
        let mut discovered = vec![false; n];
        let mut queue = VecDeque::from([start]);
        discovered[start] = true;
        while let Some(node) = queue.pop_front() {
            visit(node);
            for &next in &self.adjacency[node] {
                if !discovered[next] {
                    discovered[next] = true;
                    queue.push_back(next);
                }
            }
        }
    }

    /// Calls `visit` once for each node reachable from `start`, `start`
    /// included, in depth-first preorder.
    ///
    /// Neighbors are explored in the order their edges were added. Does
    /// nothing if `start` is not a node of this graph.
    pub fn dfs(&self, start: NodeId, mut visit: impl FnMut(NodeId)) {
        let n = self.adjacency.len();
        if start >= n {
            return;
        }
        let mut visited = vec![false; n];
        // Each frame is a node and the index of its next neighbor to try.
        let mut stack = vec![(start, 0)];
        visited[start] = true;
        visit(start);
        while let Some((node, i)) = stack.last_mut() {
            match self.adjacency[*node].get(*i) {
                None => {
                    stack.pop();
                }
                Some(&next) => {
                    *i += 1;
                    if !visited[next] {
                        visited[next] = true;
                        visit(next);
                        stack.push((next, 0));
                    }
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn line(n: usize) -> (Graph, Vec<NodeId>) {
        let mut g = Graph::new();
        let ids: Vec<NodeId> = (0..n).map(|_| g.add_node()).collect();
        for w in ids.windows(2) {
            g.add_edge(w[0], w[1]);
        }
        (g, ids)
    }

    #[test]
    fn add_node_assigns_consecutive_ids() {
        let mut g = Graph::new();
        assert_eq!(g.add_node(), 0);
        assert_eq!(g.add_node(), 1);
        assert_eq!(g.add_node(), 2);
    }

    #[test]
    fn path_to_self_is_single_node() {
        let mut g = Graph::new();
        let a = g.add_node();
        assert_eq!(g.shortest_path(a, a), Some(vec![a]));
    }

    #[test]
    fn edges_are_undirected() {
        let (g, ids) = line(4);
        assert_eq!(g.shortest_path(ids[0], ids[3]), Some(ids.clone()));
        let mut rev = ids.clone();
        rev.reverse();
        assert_eq!(g.shortest_path(ids[3], ids[0]), Some(rev));
    }

    #[test]
    fn picks_shortest_of_several_paths() {
        let (mut g, ids) = line(5);
        g.add_edge(ids[0], ids[4]);
        assert_eq!(g.shortest_path(ids[0], ids[4]), Some(vec![ids[0], ids[4]]));
        assert_eq!(g.shortest_path(ids[1], ids[4]).map(|p| p.len()), Some(3));
    }

    #[test]
    fn handles_cycles_and_self_loops() {
        let (mut g, ids) = line(3);
        g.add_edge(ids[2], ids[0]);
        g.add_edge(ids[1], ids[1]);
        assert_eq!(g.shortest_path(ids[1], ids[2]), Some(vec![ids[1], ids[2]]));
    }

    #[test]
    fn unreachable_returns_none() {
        let (mut g, ids) = line(2);
        let lonely = g.add_node();
        assert_eq!(g.shortest_path(ids[0], lonely), None);
        assert_eq!(g.shortest_path(lonely, ids[1]), None);
    }

    #[test]
    fn unknown_node_returns_none() {
        let (g, ids) = line(2);
        assert_eq!(g.shortest_path(ids[0], 99), None);
        assert_eq!(g.shortest_path(99, ids[0]), None);
        assert_eq!(Graph::new().shortest_path(0, 0), None);
    }

    #[test]
    #[should_panic(expected = "node out of range")]
    fn add_edge_to_unknown_node_panics() {
        let mut g = Graph::new();
        let a = g.add_node();
        g.add_edge(a, a + 1);
    }
}
