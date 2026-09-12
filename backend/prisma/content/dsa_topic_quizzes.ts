/**
 * Data Structures & Algorithms in Java — per-topic quizzes. Keyed by the EXACT
 * topic titles in dsa.ts (topic-lock flow). 4 questions per topic, 4 options,
 * 1 correct. Distinct from the chapter-quiz texts in dsa.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'Why Data Structures & Algorithms Matter': [
    { text: 'An algorithm is best defined as…', options: ['a programming language', 'a step-by-step procedure to solve a problem', 'a type of database', 'a computer part'], correctAnswer: 'a step-by-step procedure to solve a problem' },
    { text: 'The FIRST step in the recommended problem-solving method is…', options: ['optimize immediately', 'understand the input/output, then brute-force a correct answer', 'write tests', 'pick a data structure at random'], correctAnswer: 'understand the input/output, then brute-force a correct answer' },
    { text: 'Companies test DSA because it reveals…', options: ['how well you memorized libraries', 'how you reason under constraints', 'your typing speed', 'how many languages you know'], correctAnswer: 'how you reason under constraints' },
    { text: 'The preferred answer order in an interview is…', options: ['code first, explain later', 'restate → brute force → optimize → code → test', 'optimize → brute force', 'test → code → restate'], correctAnswer: 'restate → brute force → optimize → code → test' },
  ],
  'Big-O — Time & Space Complexity': [
    { text: 'Simplify 3n + 7 to Big-O form:', options: ['O(3n)', 'O(n)', 'O(3)', 'O(n²)'], correctAnswer: 'O(n)' },
    { text: 'Nested loops over the same array are typically…', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], correctAnswer: 'O(n²)' },
    { text: 'A loop that halves n each iteration runs in…', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(2ⁿ)'], correctAnswer: 'O(log n)' },
    { text: 'Space complexity measures…', options: ['the input size only', 'extra memory the algorithm needs beyond input', 'wall-clock time', 'the number of variables in the code'], correctAnswer: 'extra memory the algorithm needs beyond input' },
  ],
  'Arrays & the Two-Pointer Technique': [
    { text: 'The two-pointer pair-sum technique requires the array to be…', options: ['small', 'sorted', 'non-negative', 'unique'], correctAnswer: 'sorted' },
    { text: 'When the pair sum is too large, you move…', options: ['the low pointer up', 'the high pointer down', 'both pointers', 'nowhere'], correctAnswer: 'the high pointer down' },
    { text: 'Direct array indexing by position is…', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 'O(1)' },
    { text: 'The fast-slow pointer pair is commonly used to…', options: ['sort an array', 'detect cycles or find the middle', 'compute hash codes', 'read files'], correctAnswer: 'detect cycles or find the middle' },
  ],
  'Strings & Common Patterns': [
    { text: 'The efficient way to build a string in a loop is…', options: ['String += in every iteration', 'StringBuilder', 'a char array rebuilt each time', 'concatenation in reverse'], correctAnswer: 'StringBuilder' },
    { text: 'To compare a string\'s letters from both ends you…', options: ['sort first', 'run two pointers inward', 'reverse then compare halves', 'use a hash set'], correctAnswer: 'run two pointers inward' },
    { text: 'An int[26] frequency array works for…', options: ['any unicode text', 'lowercase-letter problems (fixed alphabet)', 'only digits', 'sorted arrays'], correctAnswer: 'lowercase-letter problems (fixed alphabet)' },
    { text: '`s.charAt(i)` in Java has complexity…', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 'O(1)' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Recursion Deep Dive': [
    { text: 'The part of a recursive function that stops the calls is the…', options: ['recursive case', 'base case', 'loop counter', 'return type'], correctAnswer: 'base case' },
    { text: '`f(n) = n * f(n-1)` with base `f(0)=1` computes…', options: ['the sum of 1..n', 'factorial', 'powers of two', 'fibonacci'], correctAnswer: 'factorial' },
    { text: 'Tree height `1 + max(height(left), height(right))` is solved by thinking about…', options: ['what each call RETURNS', 'print statements', 'global variables', 'iteration count'], correctAnswer: 'what each call RETURNS' },
    { text: 'Very deep recursion in Java risks…', options: ['faster runtime', 'StackOverflowError', 'disk full', 'null pointers'], correctAnswer: 'StackOverflowError' },
  ],
  'Backtracking Basics': [
    { text: 'The three beats of backtracking are…', options: ['choose, explore, unchoose', 'push, pop, peek', 'read, write, close', 'sort, search, merge'], correctAnswer: 'choose, explore, unchoose' },
    { text: 'Generating all subsets of n elements produces how many results?', options: ['n', '2ⁿ', 'n²', 'n log n'], correctAnswer: '2ⁿ' },
    { text: 'After recursing on a choice, you must…', options: ['leave the choice in place', 'undo the choice before the next branch', 'sort the choices', 'double the choice'], correctAnswer: 'undo the choice before the next branch' },
    { text: 'Pruning in backtracking…', options: ['cuts branches that cannot lead to a solution', 'slows everything down', 'removes the base case', 'is only for sorting'], correctAnswer: 'cuts branches that cannot lead to a solution' },
  ],
  'HashMaps & Frequency Counting': [
    { text: 'The idiom `map.put(k, map.getOrDefault(k, 0) + 1)` is used for…', options: ['counting occurrences', 'sorting keys', 'removing duplicates from a list', 'binary search'], correctAnswer: 'counting occurrences' },
    { text: 'Two-sum becomes O(n) by storing…', options: ['the complement → index while scanning', 'the whole array twice', 'only the largest element', 'the sum'], correctAnswer: 'the complement → index while scanning' },
    { text: 'HashMap keys should be…', options: ['mutable objects', 'immutable like String/Integer (stable hashCode)', 'arrays always', 'null every time'], correctAnswer: 'immutable like String/Integer (stable hashCode)' },
    { text: 'Iteration order of a HashMap is…', options: ['sorted', 'unspecified — use LinkedHashMap/TreeMap when order matters', 'always insertion order', 'reverse insertion'], correctAnswer: 'unspecified — use LinkedHashMap/TreeMap when order matters' },
  ],
  'Sets for Uniqueness Problems': [
    { text: 'Counting distinct elements of a list is simply…', options: ['a for loop with a counter', 'new HashSet<>(list).size()', 'sorting then reversing', 'a stack'], correctAnswer: 'new HashSet<>(list).size()' },
    { text: '`set.add(x)` returns false when…', options: ['x is a number', 'x is already present', 'the set is full', 'x is negative'], correctAnswer: 'x is already present' },
    { text: 'A TreeSet differs from a HashSet by…', options: ['allowing duplicates', 'keeping elements sorted', 'allowing nulls always', 'being faster for add'], correctAnswer: 'keeping elements sorted' },
    { text: 'If you also need counts per element, the right structure is…', options: ['a Set', 'a HashMap (counts)', 'an array', 'a stack'], correctAnswer: 'a HashMap (counts)' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Linked Lists': [
    { text: 'Inserting after a known node in a linked list is…', options: ['O(n) always', 'O(1) — just fix the neighbor pointers', 'O(n²)', 'impossible'], correctAnswer: 'O(1) — just fix the neighbor pointers' },
    { text: 'Reversing a linked list requires tracking…', options: ['only the head', 'prev, current and next pointers', 'a stack', 'the length'], correctAnswer: 'prev, current and next pointers' },
    { text: 'Floyd\'s cycle detection uses…', options: ['two pointers moving at different speeds', 'a hash of the whole list', 'sorting', 'two stacks'], correctAnswer: 'two pointers moving at different speeds' },
    { text: 'A dummy-head node helps by…', options: ['removing the special case of inserting at the front', 'making the list faster', 'doubling the values', 'freeing memory'], correctAnswer: 'removing the special case of inserting at the front' },
  ],
  'Stacks & Their Applications': [
    { text: 'The stack discipline is…', options: ['FIFO', 'LIFO — last in, first out', 'random', 'sorted'], correctAnswer: 'LIFO — last in, first out' },
    { text: 'Matching parentheses uses a stack to…', options: ['count characters', 'push opens, pop on close and verify pairs', 'sort the brackets', 'store indices only'], correctAnswer: 'push opens, pop on close and verify pairs' },
    { text: 'The monotonic stack turns "next greater element" from…', options: ['O(n²) to O(n)', 'O(n) to O(log n)', 'O(1) to O(n)', 'O(n) to O(n²)'], correctAnswer: 'O(n²) to O(n)' },
    { text: 'The recommended Java stack implementation is…', options: ['Stack class', 'ArrayDeque (push/pop/peek)', 'LinkedList only', 'an int[]'], correctAnswer: 'ArrayDeque (push/pop/peek)' },
  ],
  'Queues & Deques': [
    { text: 'A queue processes elements…', options: ['last in, first out', 'first in, first out', 'by random access', 'by value only'], correctAnswer: 'first in, first out' },
    { text: 'Breadth-first search uses a…', options: ['stack', 'queue', 'heap', 'set'], correctAnswer: 'queue' },
    { text: 'BFS visits a graph…', options: ['deep first', 'level by level — which gives shortest paths unweighted', 'randomly', 'only leaves'], correctAnswer: 'level by level — which gives shortest paths unweighted' },
    { text: 'A deque allows…', options: ['add/remove at both ends', 'only two elements', 'sorted access', 'no removals'], correctAnswer: 'add/remove at both ends' },
  ],
  'Sliding Window Technique': [
    { text: 'The sliding-window pattern targets…', options: ['any sorting problem', 'contiguous subarray/substring problems', 'graph cycles', 'file reads'], correctAnswer: 'contiguous subarray/substring problems' },
    { text: 'The two pointers in sliding window are…', options: ['left and right, growing and shrinking the window', 'fast and slow for cycles', 'head and tail of a list', 'top and bottom of a stack'], correctAnswer: 'left and right, growing and shrinking the window' },
    { text: 'In "longest substring without repeats", you shrink when…', options: ['the window is valid', 'a character repeats inside the window', 'right reaches the end', 'the string is short'], correctAnswer: 'a character repeats inside the window' },
    { text: 'Sliding window brings worst case to…', options: ['O(n²)', 'O(n) — each char is added and removed once', 'O(log n)', 'O(n log n)'], correctAnswer: 'O(n) — each char is added and removed once' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Searching — Binary Search': [
    { text: '`lo = mid + 1` and `hi = mid - 1` after checking mid avoids…', options: ['integer overflow only', 'infinite loops from no progress', 'memory leaks', 'stack overflows'], correctAnswer: 'infinite loops from no progress' },
    { text: 'Binary search on 1,000,000 sorted items needs about how many comparisons?', options: ['1,000,000', '20 (log₂ 10⁶ ≈ 20)', '100', '1000'], correctAnswer: '20 (log₂ 10⁶ ≈ 20)' },
    { text: '`mid = lo + (hi - lo) / 2` is safer than `(lo + hi) / 2` because…', options: ['it is faster', 'it avoids integer overflow on large ranges', 'it rounds differently', 'it requires longs'], correctAnswer: 'it avoids integer overflow on large ranges' },
    { text: 'Binary search can also find…', options: ['the first/last position satisfying a condition', 'only exact matches', 'sorted output', 'graph paths'], correctAnswer: 'the first/last position satisfying a condition' },
  ],
  'Sorting — Insertion, Merge & Quick': [
    { text: 'Insertion sort is a good choice for…', options: ['huge random data', 'tiny or nearly-sorted arrays', 'always', 'never'], correctAnswer: 'tiny or nearly-sorted arrays' },
    { text: 'Merge sort\'s guaranteed time and extra space are…', options: ['O(n²), O(1)', 'O(n log n), O(n)', 'O(n log n), O(1)', 'O(n), O(n)'], correctAnswer: 'O(n log n), O(n)' },
    { text: 'Quick sort degrades to O(n²) worst case when…', options: ['pivot choice is bad (e.g. already-sorted input)', 'the array is empty', 'memory is low', 'it is recursive'], correctAnswer: 'pivot choice is bad (e.g. already-sorted input)' },
    { text: 'In production Java you usually…', options: ['reimplement quicksort by hand', 'use the tuned Arrays.sort', 'write your own sort always', 'avoid sorting'], correctAnswer: 'use the tuned Arrays.sort' },
  ],
  'Binary Trees & Traversals': [
    { text: 'Pre-order traversal visits nodes in the order…', options: ['node, left, right', 'left, node, right', 'left, right, node', 'right, left, node'], correctAnswer: 'node, left, right' },
    { text: 'The traversal that yields sorted order for a BST is…', options: ['pre-order', 'in-order', 'post-order', 'level-order'], correctAnswer: 'in-order' },
    { text: 'Level-order traversal is implemented with…', options: ['a stack', 'a queue', 'a hash map', 'recursion only'], correctAnswer: 'a queue' },
    { text: 'The recursive shape of most tree problems is…', options: ['solve left, solve right, combine with current', 'always a loop', 'a global counter', 'sorting the nodes'], correctAnswer: 'solve left, solve right, combine with current' },
  ],
  'Binary Search Trees & Heaps': [
    { text: 'In a BST, the left subtree of a node contains…', options: ['values greater than the node', 'values smaller than the node', 'any values', 'only nulls'], correctAnswer: 'values smaller than the node' },
    { text: 'A degenerate BST (inserting sorted data) degrades operations to…', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 'O(n)' },
    { text: 'Extract-max from a heap costs…', options: ['O(log n)', 'O(n)', 'O(1)', 'O(n²)'], correctAnswer: 'O(log n)' },
    { text: 'The top-K-of-n pattern keeps a PriorityQueue of size…', options: ['n', 'k', '2n', '1'], correctAnswer: 'k' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Graphs — Representation & Traversal': [
    { text: 'An adjacency list represents a graph using…', options: ['a map of node → list of neighbors', 'a single array', 'a sorted list', 'a matrix only'], correctAnswer: 'a map of node → list of neighbors' },
    { text: 'The space complexity of an adjacency list is…', options: ['O(V²)', 'O(V + E)', 'O(1)', 'O(E²)'], correctAnswer: 'O(V + E)' },
    { text: 'A visited set is mandatory in graph traversal because…', options: ['graphs can have cycles', 'it sorts nodes', 'it makes DFS faster', 'it replaces the queue'], correctAnswer: 'graphs can have cycles' },
    { text: 'Counting islands/connected components is done by…', options: ['sorting all cells', 'running DFS/BFS from every unvisited node/cell', 'one binary search', 'a single pass with a stack'], correctAnswer: 'running DFS/BFS from every unvisited node/cell' },
  ],
  'Shortest Path & Cycle Detection': [
    { text: 'For weighted graphs with non-negative edges, the standard algorithm is…', options: ['BFS', 'Dijkstra', 'Bellman-Ford always', 'merge sort'], correctAnswer: 'Dijkstra' },
    { text: 'Dijkstra\'s expansion rule is…', options: ['always expand the closest unvisited node', 'expand in input order', 'expand randomly', 'expand the largest'], correctAnswer: 'always expand the closest unvisited node' },
    { text: 'A back edge in directed DFS indicates…', options: ['a disconnected node', 'a cycle', 'the end of the graph', 'an unweighted edge'], correctAnswer: 'a cycle' },
    { text: 'Dijkstra with a min-heap runs in…', options: ['O(V+E)', 'O((V+E) log V)', 'O(V²)', 'O(log V)'], correctAnswer: 'O((V+E) log V)' },
  ],
  'Dynamic Programming — The Memoization Pattern': [
    { text: 'DP applies to problems with…', options: ['overlapping subproblems', 'no subproblems', 'only strings', 'only sorting'], correctAnswer: 'overlapping subproblems' },
    { text: 'Memoization is…', options: ['recursion with a cache of results', 'a sorting technique', 'a tree traversal', 'a heap operation'], correctAnswer: 'recursion with a cache of results' },
    { text: 'The naive recursive fib(n) recomputes subproblems in…', options: ['O(n)', 'exponential time', 'O(log n)', 'O(n log n)'], correctAnswer: 'exponential time' },
    { text: 'The three parts of a DP solution are…', options: ['state, recurrence, base cases', 'stack, queue, heap', 'input, output, print', 'class, method, main'], correctAnswer: 'state, recurrence, base cases' },
  ],
  'Interview Strategy & Problem Patterns': [
    { text: 'Prefix sums make range-sum queries…', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], correctAnswer: 'O(1)' },
    { text: 'The pattern for "top K elements" is…', options: ['a heap of size k', 'nested loops', 'binary search', 'a linked list'], correctAnswer: 'a heap of size k' },
    { text: 'Edge cases to test include…', options: ['empty input, single element, already sorted, all equal', 'only the happy path', 'only large inputs', 'no cases'], correctAnswer: 'empty input, single element, already sorted, all equal' },
    { text: 'When asked a problem, the first thing to clarify is…', options: ['the input size, which drives acceptable complexity', 'your salary', 'the programming language', 'whether you can Google'], correctAnswer: 'the input size, which drives acceptable complexity' },
  ],
};
