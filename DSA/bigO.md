# Big O Notation

## Big O's

### Time Complexity Categories
- **O(1) Constant** - No loops.
- **O(log N) Logarithmic** - Usually applies to searching algorithms if the data is sorted (e.g., Binary Search).
- **O(n) Linear** - Applies to `for` loops or `while` loops iterating through `n` items.
- **O(n log(n)) Log Linear** - Usually applies to sorting operations.
- **O(n²) Quadratic** - Every element in a collection needs to be compared to every other element (e.g., two nested loops).
- **O(2ⁿ) Exponential** - Recursive algorithms solving a problem of size `N`.
- **O(n!) Factorial** - Adding a loop for every element.

### Notes
- Iterating through half a collection is still **O(n)**.
- Two separate collections have complexity **O(a * b)**.

---

## Big O Chart

| Big O    | Name         | Description                              |
| -------- | ------------ | ---------------------------------------- |
| 1        | Constant     | Single statement or one line of code     |
| log(n)   | Logarithmic  | Divide and conquer (e.g., Binary Search) |
| n        | Linear       | Single loop                              |
| n*log(n) | Linearithmic | Effective sorting algorithms             |
| n²       | Quadratic    | Double loop                              |
| n³       | Cubic        | Triple loop                              |
| 2ⁿ       | Exponential  | Complex full search                      |

---

## What Can Cause Time in a Function?
1. Operations (`+`, `-`, `*`, `/`)
2. Comparisons (`<`, `>`, `===`)
3. Looping (`for`, `while`)
4. External function calls (`function()`)
5. Sorting algorithms

---

## Sorting Algorithms

| Algorithm      | Space Complexity | Time Complexity (Best) | Time Complexity (Worst) |
| -------------- | ---------------- | ---------------------- | ----------------------- |
| Insertion Sort | O(1)             | O(n)                   | O(n²)                   |
| Selection Sort | O(1)             | O(n²)                  | O(n²)                   |
| Bubble Sort    | O(1)             | O(n)                   | O(n²)                   |
| Merge Sort     | O(n)             | O(n log n)             | O(n log n)              |
| Quick Sort     | O(log n)         | O(n log n)             | O(n²)                   |
| Heap Sort      | O(1)             | O(n log n)             | O(n log n)              |

---

## Common Data Structure Operations

| Data Structure     | Access | Search | Insertion | Deletion | Space Complexity |
| ------------------ | ------ | ------ | --------- | -------- | ---------------- |
| Array              | O(1)   | O(n)   | O(n)      | O(n)     | O(n)             |
| Stack              | O(n)   | O(n)   | O(1)      | O(1)     | O(n)             |
| Queue              | O(n)   | O(n)   | O(1)      | O(1)     | O(n)             |
| Singly-Linked List | O(n)   | O(n)   | O(1)      | O(1)     | O(n)             |
| Doubly-Linked List | O(n)   | O(n)   | O(1)      | O(1)     | O(n)             |
| Hash Table         | N/A    | O(n)   | O(n)      | O(n)     | O(n)             |

---

## Rule Book for Big O

### Rule 1: Always Worst Case
Focus on the worst-case scenario.

### Rule 2: Remove Constants
Ignore constant factors in complexity.

### Rule 3: Different Inputs
- Use separate variables for different inputs: **O(a + b)**.
- Nested loops over two inputs: **O(a * b)**.
  - Use `+` for sequential steps.
  - Use `*` for nested steps.

### Rule 4: Drop Non-Dominant Terms
Focus on the term with the highest growth rate.

---

## What Causes Space Complexity?
1. Variables
2. Data Structures
3. Function Calls
4. Memory Allocations
