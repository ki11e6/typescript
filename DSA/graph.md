### **What Are Graphs?**

A **graph** is a non-linear data structure used to represent relationships between pairs of elements. It consists of:
- **Vertices (Nodes)**: Represent entities or objects.
- **Edges (Arcs)**: Represent relationships or connections between the vertices.

Graphs can be **directed** or **undirected** and can have weights or be unweighted.

---

### **Types of Graphs**

1. **Undirected Graph**
   - Edges do not have a direction. If there’s an edge between vertex A and vertex B, you can travel from A to B and vice versa.
   - Example: Social networks (friends are mutual).

2. **Directed Graph (Digraph)**
   - Edges have a direction, meaning each edge has a starting vertex and an ending vertex.
   - Example: Web pages (a link from page A to page B is directed).

3. **Weighted Graph**
   - Each edge has a weight or cost associated with it.
   - Example: Roads with distances or flight paths with travel costs.

4. **Unweighted Graph**
   - All edges are assumed to have the same weight or no weight at all.
   - Example: A simple social network with connections.

5. **Cyclic Graph**
   - A graph that contains at least one cycle (a path from a vertex back to itself).
   - Example: Road maps that form loops.

6. **Acyclic Graph**
   - A graph that does not contain any cycles.
   - Example: Task scheduling.

7. **Directed Acyclic Graph (DAG)**
   - A directed graph with no cycles. Used to represent dependency structures.
   - Example: Workflow scheduling, project planning.

8. **Complete Graph**
   - A graph where every pair of vertices is connected by an edge.
   - Example: A clique in social network analysis.

9. **Bipartite Graph**
   - A graph where vertices can be divided into two disjoint sets, with edges only between the sets.
   - Example: Job matching problems, network flow problems.

10. **Sparse Graph**
    - A graph with relatively few edges compared to the number of vertices.
    - Example: Airline routes between cities.

11. **Dense Graph**
    - A graph with a large number of edges relative to the number of vertices.
    - Example: Network interconnections.

---

### **Graph Representations**

1. **Adjacency Matrix**
   - A 2D array where element `matrix[i][j]` is 1 if there is an edge between vertex `i` and vertex `j`.
   - **Space Complexity**: O(V^2), where V is the number of vertices.
   - **Time Complexity**: O(1) for checking if an edge exists; O(V) for listing neighbors.

2. **Adjacency List**
   - A collection of lists or arrays, one for each vertex, where each list contains all the neighboring vertices.
   - **Space Complexity**: O(V + E), where E is the number of edges.
   - **Time Complexity**: O(1) for adding edges; O(degree of vertex) for listing neighbors.

3. **Edge List**
   - A list of edges, where each edge is represented by a pair of vertices.
   - **Space Complexity**: O(E), where E is the number of edges.
   - **Time Complexity**: O(E) for searching or adding edges.

---

### **Manipulations and Time/Space Complexity**

| **Operation**                           | **Time Complexity**      | **Space Complexity**   | **Description**                                                       |
| --------------------------------------- | ------------------------ | ---------------------- | --------------------------------------------------------------------- |
| **DFS (Depth-First Search)**            | O(V + E)                 | O(V) (recursive stack) | Explore deeply first (used for searching, topological sorting, etc.). |
| **BFS (Breadth-First Search)**          | O(V + E)                 | O(V) (queue)           | Explore level by level (used for shortest path in unweighted graphs). |
| **Dijkstra's Algorithm**                | O(V^2) or O(E + V log V) | O(V)                   | Find the shortest path in weighted graphs (using a priority queue).   |
| **Bellman-Ford Algorithm**              | O(V * E)                 | O(V)                   | Find the shortest paths, even with negative weights.                  |
| **Prim's Algorithm**                    | O(E log V)               | O(V)                   | Minimum Spanning Tree (MST) for connected, undirected graphs.         |
| **Kruskal's Algorithm**                 | O(E log E) or O(E log V) | O(V)                   | MST for connected, undirected graphs (works with edge list).          |
| **Topological Sorting**                 | O(V + E)                 | O(V)                   | Linear ordering of vertices in a Directed Acyclic Graph (DAG).        |
| **Find Shortest Path (Floyd-Warshall)** | O(V^3)                   | O(V^2)                 | Shortest path between all pairs of vertices.                          |

---

### **Why Use Graphs?**

#### **Advantages**
1. **Flexible Representation**:
   - Graphs can model various types of relationships, such as social connections, computer networks, etc.
2. **Efficient Searching**:
   - Algorithms like DFS, BFS, and Dijkstra's allow fast searching and finding paths.
3. **Versatility**:
   - Graphs can represent both real-world and abstract structures like decision-making trees, web crawlers, etc.

#### **Disadvantages**
1. **Complexity**:
   - Graph algorithms can be complex to implement and understand, especially when graphs are weighted or large.
2. **Memory Overhead**:
   - Graphs, especially dense ones, can consume a lot of memory.
3. **Computational Expense**:
   - Many graph algorithms have high time complexity (e.g., O(V^3) for Floyd-Warshall).

---

### **Where and Why to Use Graphs**

#### **Where to Use**
1. **Social Networks**:
   - Represent relationships and interactions between users.
2. **Navigation Systems**:
   - Represent roads, intersections, and the shortest paths between them.
3. **Recommendation Systems**:
   - Use graphs to model user preferences and item relations.
4. **Routing Algorithms**:
   - Used in computer networks or communication systems to find the best routes.
5. **Task Scheduling**:
   - Represent tasks and their dependencies (e.g., project planning, build systems).
6. **Web Crawling**:
   - Represent pages (nodes) and links (edges) in search engines.
7. **Knowledge Graphs**:
   - Represent relationships between concepts, objects, and facts in a knowledge base.

#### **Why Not to Use**
- For problems requiring fast access to data by index (arrays or hash maps are better).
- When relationships between elements are simple and do not require complex graph traversal (arrays or lists can be used).

---

### **Graph Methods and Where to Use**

| **Method**                     | **Description**                                                  | **Where to Use**                                                       |
| ------------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **DFS (Depth-First Search)**   | Traverse graph by going as deep as possible before backtracking. | Searching, finding connected components, topological sort.             |
| **BFS (Breadth-First Search)** | Traverse graph level by level.                                   | Shortest path in unweighted graphs, spreading processes (e.g., virus). |
| **Dijkstra’s Algorithm**       | Find the shortest path from a source vertex to all others.       | Navigation systems, routing protocols.                                 |
| **Kruskal’s Algorithm**        | Find Minimum Spanning Tree by sorting edges.                     | Network design, clustering, circuit design.                            |
| **Prim’s Algorithm**           | Find Minimum Spanning Tree by expanding tree one edge at a time. | Network design, infrastructure planning.                               |
| **Bellman-Ford Algorithm**     | Find the shortest path, even with negative weights.              | Financial calculations, pathfinding in negative-weighted graphs.       |
| **Topological Sorting**        | Sort vertices of a DAG in linear order.                          | Task scheduling, dependency resolution.                                |
| **Floyd-Warshall Algorithm**   | Find all pairs shortest paths in a graph.                        | All-pairs shortest path in small to medium-sized graphs.               |

---

### **Problems with Graphs**

1. **Complexity in Large Graphs**:
   - Algorithms may have high computational overhead, especially for dense or large graphs (e.g., O(V^3) for some algorithms).
2. **Storage Overhead**:
   - Dense graphs consume large amounts of memory, especially with adjacency matrices.
3. **Cycle Detection**:
   - Detecting cycles in directed or undirected graphs can be difficult and complex.

---

### **Real-World Applications**

1. **Social Media**:
   - Modeling relationships between users (Facebook, Twitter).
2. **Search Engines**:
   - Modeling the web as a graph of web pages and links (Google's PageRank).
3. **Route Planning**:
   - Navigation systems (e.g., GPS).
4. **Recommendation Systems**:
   - Product recommendations (e.g., Amazon, Netflix).
5. **Telecommunication Networks**:
   - Modeling communication between devices and routing messages.
6. **Computer Networks**:
   - Routing protocols like OSPF and BGP.
7. **E-commerce**:
   - Graph-based product recommendation engines.
8. **Biological Networks**:
   - Gene and protein interaction networks.
