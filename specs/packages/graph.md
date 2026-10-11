<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 Gamma Sublang <gamma@sublang.ai> -->

# graph: Undirected Graph

## Intent

This package lets crate users build an unweighted undirected graph and query a shortest path between two of its nodes.
Its public API is the `graph_crate::Graph` type with `new`, `add_node`, `add_edge`, and `shortest_path`.

## External Behavior

### graph-1

When `Graph::new` is called, the graph shall be empty, with no nodes and no edges.

### graph-2

When `add_node` is called, the graph shall add one node and return its `NodeId` (a `usize`), assigned consecutively from `0` in insertion order.

### graph-3

When `add_edge(a, b)` is called with two existing nodes, the graph shall connect `a` and `b` so that each is reachable from the other in one step.

### graph-4

When `add_edge(a, b)` is called with `a` or `b` not a node of the graph, the graph shall panic.

### graph-5

When `shortest_path(from, to)` is called, the graph shall return the outcome for the case:

| Case | Result |
| --- | --- |
| `from` or `to` is not a node | `None` |
| `to` is unreachable from `from` | `None` |
| `from == to` | `Some(vec![from])` |
| otherwise | `Some(path)`: a path with the fewest edges, starting at `from`, ending at `to`, each consecutive pair connected by an edge |

## Verification

### graph-6

When a caller builds the graph `0-1-2-3` plus edge `0-3` and an isolated node `4` through the public API, the test shall assert:

- `add_node` returned `0` through `4` [[graph-1](#graph-1)] [[graph-2](#graph-2)];
- `shortest_path(0, 3)` is `[0, 3]` and `shortest_path(3, 0)` is `[3, 0]` [[graph-3](#graph-3)] [[graph-5](#graph-5)];
- `shortest_path(1, 3)` has 3 nodes, not 4 [[graph-5](#graph-5)];
- `shortest_path(2, 2)` is `[2]`, and `shortest_path(0, 4)` and `shortest_path(0, 99)` are `None` [[graph-5](#graph-5)];
- `add_edge(0, 99)` panics [[graph-4](#graph-4)].
