### **What Are Stacks and Queues?**

#### **1. Stack**:
A **stack** is a linear data structure that follows the **Last In, First Out (LIFO)** principle. This means that the last element added to the stack is the first one to be removed.

- **Basic Operations**:
  - **Push**: Add an element to the top of the stack.
  - **Pop**: Remove the top element of the stack.
  - **Peek/Top**: View the top element without removing it.
  - **IsEmpty**: Check if the stack is empty.

---

#### **2. Queue**:
A **queue** is a linear data structure that follows the **First In, First Out (FIFO)** principle. This means that the first element added to the queue is the first one to be removed.

- **Basic Operations**:
  - **Enqueue**: Add an element to the rear of the queue.
  - **Dequeue**: Remove an element from the front of the queue.
  - **Front/Peek**: View the element at the front without removing it.
  - **IsEmpty**: Check if the queue is empty.

---

### **Types of Stacks and Queues**

#### **Types of Stacks**:
1. **Simple Stack**:
   - A basic LIFO stack.
2. **Dynamic Stack**:
   - Grows dynamically as more elements are pushed.
3. **Linked List-Based Stack**:
   - Uses linked nodes for storage instead of a contiguous array.

#### **Types of Queues**:
1. **Simple Queue**:
   - A basic FIFO queue.
2. **Circular Queue**:
   - The rear wraps around to the front when the queue is full, optimizing space usage.
3. **Priority Queue**:
   - Elements are dequeued based on priority rather than the order of insertion.
4. **Double-Ended Queue (Deque)**:
   - Allows insertion and removal from both ends.

---

### **Manipulations and Time/Space Complexity**

| **Operation**       | **Stack** (LIFO)                     | **Queue** (FIFO)                           | **Time Complexity** | **Space Complexity** |
| ------------------- | ------------------------------------ | ------------------------------------------ | ------------------- | -------------------- |
| **Push/Enqueue**    | Add element to top of the stack      | Add element to the rear of the queue       | O(1)                | O(1)                 |
| **Pop/Dequeue**     | Remove element from top of the stack | Remove element from the front of the queue | O(1)                | O(1)                 |
| **Peek/Front/Rear** | View the top element                 | View the front/rear element                | O(1)                | O(1)                 |
| **Search (Linear)** | Check for an element (rarely used)   | Check for an element (rarely used)         | O(n)                | O(n)                 |
| **IsEmpty**         | Check if the stack is empty          | Check if the queue is empty                | O(1)                | O(1)                 |

---

### **Why Use Stacks and Queues?**

#### **Advantages**
- **Stacks**:
  1. Easy to implement LIFO behavior.
  2. Excellent for recursive operations (e.g., function calls, backtracking).
  3. Efficient for parsing (e.g., matching parentheses).

- **Queues**:
  1. Perfect for FIFO-based processes like task scheduling.
  2. Useful for managing real-time data (e.g., buffers, streaming).
  3. Supports breadth-first search (BFS) in graphs.

#### **Disadvantages**
- **Stacks**:
  1. Restricted access (only top element accessible).
  2. Limited in scenarios requiring random access to elements.

- **Queues**:
  1. Slow for random access as traversal is required.
  2. Requires additional memory if implemented as an array.

---

### **Where and Why to Use Stacks and Queues**

#### **Use Cases for Stacks**:
1. **Function Calls**:
   - Call stack stores function calls in recursive programming.
2. **Expression Parsing**:
   - Evaluate or convert mathematical expressions (e.g., infix to postfix).
3. **Undo/Redo Mechanisms**:
   - Store states for undo/redo functionality in text editors.
4. **Backtracking**:
   - Solve maze or puzzle problems by exploring and retracting paths.
5. **Browser History**:
   - Maintain history of visited web pages.

#### **Use Cases for Queues**:
1. **Task Scheduling**:
   - OS job scheduling or printer task management.
2. **Real-Time Systems**:
   - Buffer management in streaming platforms or network routers.
3. **Breadth-First Search**:
   - Explore graphs or trees level by level.
4. **Resource Sharing**:
   - Manage shared resources like CPU or disk access.
5. **Customer Service**:
   - Maintain a waiting list for serving customers.

---

### **Stack and Queue Methods and Their Use**

| **Method**       | **Stack/Queue** | **Description**                                        | **Where to Use**                            |
| ---------------- | --------------- | ------------------------------------------------------ | ------------------------------------------- |
| **Push/Enqueue** | Stack/Queue     | Add an element to the top/rear of the structure.       | Dynamic list management or FIFO/LIFO tasks. |
| **Pop/Dequeue**  | Stack/Queue     | Remove the top/front element.                          | Cleanup tasks, job processing.              |
| **Peek/Front**   | Stack/Queue     | View the top/front element without removing it.        | Debugging, monitoring live tasks.           |
| **IsEmpty**      | Stack/Queue     | Check if the structure is empty.                       | Termination checks.                         |
| **IsFull**       | Stack/Queue     | Check if the structure is full (for bounded versions). | Managing resource constraints.              |
| **Search**       | Stack           | Find an element (linear traversal).                    | Rare, debugging purposes.                   |

---

### **Problems with Stacks and Queues**

1. **Limited Access**:
   - Only one end is accessible at a time (top for stacks, front for queues).
2. **Memory Overhead**:
   - Array implementations may waste memory if capacity is overallocated.
3. **Circular Handling**:
   - Circular queues require careful handling of front/rear pointers.
4. **Size Constraints**:
   - Fixed-size stacks and queues may overflow unless implemented dynamically.
5. **Efficiency**:
   - Not suited for random access or searching.

---

### **Real-World Applications**

#### **Stacks**:
1. **Recursive Function Calls**:
   - Track call stack for active and returning functions.
2. **Expression Evaluation**:
   - Evaluate postfix or prefix expressions.
3. **Undo Mechanism**:
   - Maintain history for reversing user actions.
4. **Syntax Parsing**:
   - Check balanced parentheses or validate syntax.
5. **Navigation**:
   - Backward/forward navigation in browsers.

#### **Queues**:
1. **Print Job Management**:
   - Handle tasks in a printing queue.
2. **Task Scheduling**:
   - Process job queues in operating systems.
3. **Customer Service**:
   - Manage customer waiting lines.
4. **Streaming Platforms**:
   - Buffer data in real-time streaming.
5. **Networking**:
   - Handle data packets in network protocols.
