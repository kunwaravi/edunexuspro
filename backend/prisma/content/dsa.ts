/**
 * Data Structures & Algorithms in Java — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in dsa_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module. Code examples in Java.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · Foundations & Complexity ────────────────────────────────────────
  {
    week: 1,
    title: 'Foundations & Complexity',
    description: 'Why DSA matters, how to measure algorithms with Big-O, and the array/string patterns that recur in interviews.',
    topics: [
      {
        title: 'Why Data Structures & Algorithms Matter',
        text: 'An algorithm is a step-by-step procedure to solve a problem; a data structure is how you organize data to make those steps fast. The same problem can be solved in many ways with wildly different costs — searching a phone book by reading every page vs. opening to the middle is the difference between O(n) and O(log n).\n\nCompanies test DSA because it reveals how you reason under constraints, not because you will re-implement a hash map at work. It builds the muscle to choose the right structure: do I need fast lookup (HashMap), order (List), uniqueness (Set)?\n\nApproach every problem methodically: understand the input and output, brute-force a correct answer first, then optimize. A working slow solution beats a broken fast one.',
        code: '// Brute-force sum of an array — O(n)\nint sum(int[] a) {\n  int total = 0;\n  for (int x : a) total += x;\n  return total;\n}',
        note: 'Interview answer structure: restate → brute force → optimize → code → test. Skipping the brute force wastes the interviewer\'s signal.',
      },
      {
        title: 'Big-O — Time & Space Complexity',
        text: 'Big-O describes how an algorithm\'s work grows with input size n. Drop constants and lower-order terms: 3n + 7 → O(n). Common classes: O(1) constant (array index), O(log n) logarithmic (binary search, balanced tree), O(n) linear (single loop), O(n log n) linearithmic (merge sort), O(n²) quadratic (nested loops), O(2ⁿ) exponential (subset enumeration).\n\nTime complexity counts operations; space complexity counts extra memory. A function that copies the array uses O(n) space; one that works in place uses O(1).\n\nNested loops usually mean n² — but not always: two independent loops are O(n+m), and a loop that halves n each time is O(log n).',
        code: 'int[] nums = {3, 1, 4, 1, 5};\nnums[nums.length - 1];   // O(1) — direct index\n\n// Binary search — O(log n): halves the range each step\nwhile (lo <= hi) { int mid = lo + (hi - lo) / 2; /* compare, narrow */ }',
        note: 'Big-O is about growth, not speed: O(n) with a tiny constant beats O(log n) with a huge one for small inputs. Measure when it matters.',
      },
      {
        title: 'Arrays & the Two-Pointer Technique',
        text: 'Arrays give O(1) access by index but fixed size. Many problems that seem to need nested loops collapse to O(n) with two pointers. Classic uses: find a pair that sums to target in a sorted array (one pointer low, one high); move both toward each other based on the sum.\n\nAnother pattern: the fast-slow pointer detects cycles or finds the middle. And in-place reversal or partition uses one pointer writing while another reads.\n\nThe sorted-array pair-sum is the canonical two-pointer: since moving low up increases the sum and moving high down decreases it, one pass covers every candidate pair.',
        code: '// Sorted array, find two numbers summing to target — O(n)\nboolean hasPair(int[] a, int target) {\n  int lo = 0, hi = a.length - 1;\n  while (lo < hi) {\n    int sum = a[lo] + a[hi];\n    if (sum == target) return true;\n    if (sum < target) lo++; else hi--;\n  }\n  return false;\n}',
        note: 'If the brute force is nested loops over two indices, ask: can one index move from the left and one from the right? That is two pointers.',
      },
      {
        title: 'Strings & Common Patterns',
        text: 'Strings are character arrays in disguise: `s.charAt(i)` is O(1), but building strings with `+` in a loop is O(n²) because each append copies. Use StringBuilder. Converting `String` to `char[]` (`s.toCharArray()`) is the fast path for in-place swaps.\n\nCommon string problems: palindromes (two pointers from both ends), anagrams (frequency count in an int[26] or HashMap), and substring problems (sliding window).\n\nFrequency counting with a fixed alphabet is elegant: an `int[26]` for lowercase letters is O(1) space and O(n) time, and comparing two frequency arrays checks anagram-ness directly.',
        code: '// Is palindrome? — two pointers from ends, O(n)\nboolean isPalindrome(String s) {\n  int lo = 0, hi = s.length() - 1;\n  while (lo < hi) {\n    if (s.charAt(lo) != s.charAt(hi)) return false;\n    lo++; hi--;\n  }\n  return true;\n}\n\n// Character frequency in O(n)\nint[] freq = new int[26];\nfor (char c : s.toCharArray()) freq[c - \'a\']++;',
        note: 'Use `toCharArray()` + StringBuilder. Java String methods that look like mutation (`replace`, `toUpperCase`) return NEW strings.',
      },
    ],
    quizzes: [
      { text: 'A single loop over an array of n elements is…', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 'O(n)' },
      { text: 'Binary search on a sorted array runs in…', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 'O(log n)' },
      { text: 'The two-pointer pair-sum trick on a sorted array achieves…', options: ['O(n²)', 'O(n)', 'O(log n)', 'O(1)'], correctAnswer: 'O(n)' },
      { text: 'Building a String with + inside a loop is…', options: ['O(n)', 'O(n²) — each append copies', 'O(log n)', 'free'], correctAnswer: 'O(n²) — each append copies' },
    ],
  },

  // ── W2 · Recursion & Hashing ─────────────────────────────────────────────
  {
    week: 2,
    title: 'Recursion & Hashing',
    description: 'Thinking recursively, backtracking, and the hash-based structures that make lookups instant.',
    topics: [
      {
        title: 'Recursion Deep Dive',
        text: 'Recursion solves a problem by solving a smaller copy of itself. Every recursive function has a base case (stop) and a recursive case (recurse). Factorial: `f(n) = n * f(n-1)`, base `f(0)=1`. The call stack grows with depth — deep recursion risks StackOverflowError, so recursive tree/graph code is natural, while linear recursion can often be written as a loop.\n\nThink in terms of what a call RETURNS, not what it prints. For a tree height: "1 + max(height(left), height(right))". Once the base case is right, the recursion usually falls out.\n\nTrace small inputs on paper until the pattern clicks; then the bigger cases are mechanical.',
        code: 'int factorial(int n) {\n  if (n <= 1) return 1;      // base case\n  return n * factorial(n - 1); // recursive case\n}\n\n// Tree height — the classic recursive "return value" problem\nint height(Node root) {\n  if (root == null) return 0;\n  return 1 + Math.max(height(root.left), height(root.right));\n}',
        note: 'When you cannot see the recursion, find the smaller version of the same problem inside the problem — that IS the recursive case.',
      },
      {
        title: 'Backtracking Basics',
        text: 'Backtracking is recursion that tries every option and undoes each choice before trying the next. It explores a decision tree and prunes branches that cannot lead to a solution. Classic problems: generating all subsets/permutations, N-Queens, Sudoku.\n\nStructure: choose → explore → unchoose. Add a candidate, recurse, then remove it so the next branch starts clean. A visited/pruning check avoids exponential blow-up on impossible branches.\n\nSubsets is the minimal example: for each element, decide include or not — 2ⁿ leaves. Permutations are n! leaves; pruning and swap-based tricks keep the code short.',
        code: '// All subsets of a list — classic backtracking\nvoid subsets(int[] nums, int start, List<Integer> cur, List<List<Integer>> out) {\n  out.add(new ArrayList<>(cur));\n  for (int i = start; i < nums.length; i++) {\n    cur.add(nums[i]);        // choose\n    subsets(nums, i + 1, cur, out);\n    cur.remove(cur.size() - 1); // unchoose\n  }\n}',
        note: 'Backtracking\'s three beats — choose, explore, unchoose — are the same in every problem. Copy the skeleton, change the choices.',
      },
      {
        title: 'HashMaps & Frequency Counting',
        text: 'A HashMap gives average O(1) insert and lookup by key. That is the single biggest DSA tool: whenever a problem says "find the thing that appears twice", "two numbers that sum", or "count occurrences", a map is usually the answer.\n\nFrequency counting: iterate, `map.put(k, map.getOrDefault(k, 0) + 1)`. Two-sum: store `complement → index` while scanning, so the check is O(1) per element instead of nested loops.\n\nKeys must be immutable (String, Integer) or their hash may change. Iteration order is unspecified in HashMap; use LinkedHashMap/TreeMap when order matters.',
        code: '// Two-sum: one pass with a map, O(n)\nint[] twoSum(int[] nums, int target) {\n  Map<Integer, Integer> seen = new HashMap<>();\n  for (int i = 0; i < nums.length; i++) {\n    int comp = target - nums[i];\n    if (seen.containsKey(comp)) return new int[]{seen.get(comp), i};\n    seen.put(nums[i], i);\n  }\n  return null;\n}',
        note: 'See a nested loop? Ask what "index or count" you could memorize on the first pass — a HashMap turns O(n²) into O(n).',
      },
      {
        title: 'Sets for Uniqueness Problems',
        text: 'A Set stores unique elements with O(1) average operations — the perfect tool for "remove duplicates", "check if seen before", and "intersection/union". Java\'s HashSet is backed by a HashMap; TreeSet keeps elements sorted (O(log n)).\n\nDistinct count is literally `new HashSet<>(list).size()`. Detecting a cycle in a sequence: add each element to a set; if an add fails, it was seen before.\n\nChoose the structure by need: uniqueness check → HashSet; sorted unique → TreeSet; insert-order → LinkedHashSet. If you also need counts, a HashMap beats a Set.',
        code: 'int distinctCount(int[] a) {\n  return new HashSet<Integer>() {{ for (int x : a) add(x); }}.size();\n}\n\n// Every element added returns true only the FIRST time\nboolean isDuplicate(int[] a) {\n  Set<Integer> seen = new HashSet<>();\n  for (int x : a) if (!seen.add(x)) return true;\n  return false;\n}',
        note: 'HashSet.add returns false when the value already exists — a one-line duplicate detector without an extra contains() call.',
      },
    ],
    quizzes: [
      { text: 'The base case of recursion…', options: ['slows recursion', 'stops the recursion', 'increases depth', 'is optional'], correctAnswer: 'stops the recursion' },
      { text: 'Backtracking explores a decision tree by…', options: ['looping forever', 'choosing, exploring, then unchoosing each option', 'sorting first', 'using only arrays'], correctAnswer: 'choosing, exploring, then unchoosing each option' },
      { text: 'Average-case lookup time in a HashMap is…', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], correctAnswer: 'O(1)' },
      { text: '`set.add(x)` returns false when…', options: ['x is null', 'x already exists in the set', 'the set is full', 'x is a string'], correctAnswer: 'x already exists in the set' },
    ],
  },

  // ── W3 · Linear Structures ───────────────────────────────────────────────
  {
    week: 3,
    title: 'Linear Structures & Sliding Window',
    description: 'Linked lists, stacks, queues and the sliding-window technique for subarray problems.',
    topics: [
      {
        title: 'Linked Lists',
        text: 'A linked list is a chain of nodes, each holding a value and a pointer to the next. It allows O(1) insertion/deletion at a known position — no shifting like an array — but O(n) random access, because you must walk from the head.\n\nThe three pointer tricks dominate interview problems: reverse (prev/curr/next), detect a cycle (slow/fast — two runners; if they meet, there is a cycle), and find the middle (slow advances one, fast advances two).\n\nInsertion/deletion always means fixing the neighbor pointers BEFORE moving on; a temp variable prevents losing the next node. Dummy-head nodes remove the special case of inserting at the front.',
        code: 'Node reverse(Node head) {\n  Node prev = null;\n  while (head != null) {\n    Node next = head.next;  // save before overwriting\n    head.next = prev;\n    prev = head;\n    head = next;\n  }\n  return prev;\n}\n\n// Cycle detection — Floyd\'s slow/fast pointer\nboolean hasCycle(Node head) {\n  Node slow = head, fast = head;\n  while (fast != null && fast.next != null) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow == fast) return true;\n  }\n  return false;\n}',
        note: 'Draw the boxes-and-arrows picture for linked lists. The picture always shows you which pointer to fix first.',
      },
      {
        title: 'Stacks & Their Applications',
        text: 'A stack is last-in, first-out (LIFO). Push adds to the top, pop removes from the top, peek looks. Java\'s ArrayDeque is the preferred stack (`push`/`pop`/`peek`).\n\nStacks power the "nested" problems: matching parentheses (push opens, pop on close, check pairs), undo/redo, function call stacks, and the monotonic stack pattern for next-greater-element.\n\nValid parentheses is the canonical example: push opening brackets; on a closing bracket, pop and verify it matches; at the end the stack must be empty. The monotonic stack (keep elements in sorted order) turns "next greater element to the right" from O(n²) into O(n).',
        code: 'boolean isValid(String s) {\n  Deque<Character> st = new ArrayDeque<>();\n  for (char c : s.toCharArray()) {\n    if (c == \'(\' || c == \'{\' || c == \'[\') { st.push(c); }\n    else {\n      if (st.isEmpty()) return false;\n      char top = st.pop();\n      if (!matches(top, c)) return false;\n    }\n  }\n  return st.isEmpty();\n}',
        note: 'LIFO matches nesting: think of recursion, parentheses and undo — every one is a stack wearing a different hat.',
      },
      {
        title: 'Queues & Deques',
        text: 'A queue is first-in, first-out (FIFO) — like a line at a counter. Offer adds to the tail, poll removes from the head, peek looks. Queues run breadth-first search (BFS) and handle "processing in arrival order".\n\nA deque (double-ended queue) adds and removes at BOTH ends — the workhorse of sliding-window maximum problems. ArrayDeque implements both Queue and Deque interfaces.\n\nBFS on a graph/tree uses a queue: start with the root, poll, enqueue its children; this visits nodes level by level, which is why BFS gives shortest paths in unweighted graphs.',
        code: '// BFS visits level by level using a queue\nvoid bfs(Node root) {\n  Deque<Node> q = new ArrayDeque<>();\n  q.offer(root);\n  while (!q.isEmpty()) {\n    Node cur = q.poll();\n    System.out.println(cur.val);\n    if (cur.left != null) q.offer(cur.left);\n    if (cur.right != null) q.offer(cur.right);\n  }\n}',
        note: 'FIFO for queues, LIFO for stacks. If the order of processing matters at all, the queue/stack choice decides the traversal.',
      },
      {
        title: 'Sliding Window Technique',
        text: 'Sliding window handles "contiguous subarray/substring satisfying a condition" in O(n) instead of O(n²). Keep two pointers, `left` and `right`; grow `right` to extend the window, shrink `left` to satisfy the constraint. The window always stays valid, so every valid window is considered once.\n\nClassic problems: longest substring without repeating characters (a Set/Map tracks in-window chars; shrink when a repeat appears), maximum sum of a fixed-size window (maintain running sum), and minimum-size subarray whose sum ≥ target.\n\nThe invariant is the key: you know WHEN the window is invalid, and you only shrink while it is invalid.',
        code: '// Longest substring without repeating characters — O(n)\nint longestUnique(String s) {\n  Set<Character> seen = new HashSet<>();\n  int left = 0, best = 0;\n  for (int right = 0; right < s.length(); right++) {\n    char c = s.charAt(right);\n    while (seen.contains(c)) seen.remove(s.charAt(left++));\n    seen.add(c);\n    best = Math.max(best, right - left + 1);\n  }\n  return best;\n}',
        note: '"Contiguous substring + condition" is the trigger phrase for sliding window. Grow right, shrink left while invalid.',
      },
    ],
    quizzes: [
      { text: 'Linked-list random access by index is…', options: ['O(1)', 'O(log n)', 'O(n) — must walk from the head', 'O(n²)'], correctAnswer: 'O(n) — must walk from the head' },
      { text: 'A stack operates…', options: ['FIFO', 'LIFO', 'random access', 'sorted always'], correctAnswer: 'LIFO' },
      { text: 'Which traversal uses a queue?', options: ['DFS', 'BFS', 'binary search', 'merge sort'], correctAnswer: 'BFS' },
      { text: 'Sliding window improves subarray problems from…', options: ['O(1) to O(n)', 'O(n²) to O(n)', 'O(n) to O(log n)', 'O(n³) to O(n²)'], correctAnswer: 'O(n²) to O(n)' },
    ],
  },

  // ── W4 · Sorting, Searching & Trees ──────────────────────────────────────
  {
    week: 4,
    title: 'Sorting, Searching & Trees',
    description: 'Binary search, the sort algorithms that matter, and trees — traversals, BSTs and heaps.',
    topics: [
      {
        title: 'Searching — Binary Search',
        text: 'Binary search finds a value in a sorted array in O(log n): compare the middle, and halve the search range. The invariant `lo <= hi` with `mid = lo + (hi - lo) / 2` avoids integer overflow.\n\nBinary search generalizes beyond "find a value" to "find the first/last position satisfying a condition" — the binary-search-on-answer pattern works for "smallest X such that feasible(X)".\n\nThe off-by-one trap: when moving `lo = mid` instead of `mid + 1`, ensure progress or the loop may never terminate. `lo = mid + 1` and `hi = mid - 1` when checking `mid` directly is the safe version.',
        code: 'int binarySearch(int[] a, int target) {\n  int lo = 0, hi = a.length - 1;\n  while (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (a[mid] == target) return mid;\n    if (a[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}',
        note: 'Sorted array + "find something" → binary search. The real skill is recognizing the monotonic predicate that lets you binary-search an answer.',
      },
      {
        title: 'Sorting — Insertion, Merge & Quick',
        text: 'Sorting is the most-tested family. Insertion sort: O(n²) but fast on nearly-sorted data and stable; great for tiny arrays. Merge sort: O(n log n) guaranteed, stable, uses O(n) extra space — the divide-and-conquer exemplar. Quick sort: average O(n log n), in-place, but O(n²) worst case on already-sorted input without good pivot choice.\n\nBuilt-in `Arrays.sort` uses a tuned dual-pivot quicksort for primitives and a stable merge-based sort for objects — almost always the right call in production. Learn the sorts to understand the ideas; use the library in code.\n\nThe divide-and-conquer shape — split, solve halves, combine — reappears in trees, merges and binary search.',
        code: '// Merge: the "combine" step of merge sort — O(n)\nvoid merge(int[] a, int lo, int mid, int hi) {\n  int[] tmp = Arrays.copyOfRange(a, lo, hi + 1);\n  int i = 0, j = mid - lo + 1, k = lo;\n  while (i <= mid - lo && j < tmp.length) {\n    a[k++] = tmp[i] <= tmp[j] ? tmp[i++] : tmp[j++];\n  }\n  while (i <= mid - lo) a[k++] = tmp[i++];\n  while (j < tmp.length) a[k++] = tmp[j++];\n}',
        note: 'Merge sort\'s O(n log n) is the theoretical floor for comparison sorts; quicksort\'s in-place speed is why it wins in practice.',
      },
      {
        title: 'Binary Trees & Traversals',
        text: 'A binary tree has nodes with up to two children. Traversals: in-order (left, node, right — for a BST this is sorted order), pre-order (node, left, right — used to serialize), post-order (left, right, node — used to delete). Level-order (BFS) uses a queue.\n\nMany tree problems are one recursive idea: "compute something for left, for right, combine with current". Height, max path sum, lowest common ancestor all follow this shape.\n\nDepth-first (stack/recursion) goes deep; breadth-first (queue) goes wide. Iterative DFS with an explicit stack is identical in behavior to recursion minus the call-stack depth limit.',
        code: 'void inorder(Node root) {\n  if (root == null) return;\n  inorder(root.left);\n  System.out.println(root.val);\n  inorder(root.right);\n}\n\nint height(Node root) {\n  if (root == null) return 0;\n  return 1 + Math.max(height(root.left), height(root.right));\n}',
        note: 'In a BST, in-order traversal produces sorted output for free — that property is half the reason BSTs exist.',
      },
      {
        title: 'Binary Search Trees & Heaps',
        text: 'A BST keeps ordering: left subtree < node < right subtree. Search, insert and delete are O(log n) when the tree is balanced — but degenerate (inserting sorted data) collapses them to O(n). That is why self-balancing trees (AVL, Red-Black) and library TreeMap matter.\n\nA heap is a complete binary tree with the heap property: a max-heap has the largest element at the root. Insert and extract-max are O(log n). Java\'s `PriorityQueue` is a min-heap by default — the tool for "top K" problems and Dijkstra.\n\nHeaps find the top-K of n elements in O(n log k) instead of O(n log n): keep only k elements, always evict the extreme.',
        code: '// Top K largest with a min-heap — O(n log k)\nList<Integer> topK(int[] a, int k) {\n  PriorityQueue<Integer> pq = new PriorityQueue<>(); // min-heap\n  for (int x : a) {\n    pq.offer(x);\n    if (pq.size() > k) pq.poll();   // drop the smallest when full\n  }\n  return new ArrayList<>(pq);\n}',
        note: '"Top K" in an interview is a heap problem until proven otherwise. A PriorityQueue of size k is the standard answer.',
      },
    ],
    quizzes: [
      { text: 'Binary search requires the input to be…', options: ['small', 'sorted', 'unique', 'a tree'], correctAnswer: 'sorted' },
      { text: 'The guaranteed time of merge sort is…', options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { text: 'For a BST, in-order traversal produces…', options: ['random order', 'sorted order', 'reversed order', 'a heap'], correctAnswer: 'sorted order' },
      { text: 'Java\'s PriorityQueue with no comparator is…', options: ['a max-heap', 'a min-heap', 'a queue always', 'a stack'], correctAnswer: 'a min-heap' },
    ],
  },

  // ── W5 · Graphs & Advanced Topics ────────────────────────────────────────
  {
    week: 5,
    title: 'Graphs & Advanced Topics',
    description: 'Graph representation and traversal, shortest paths, dynamic programming, and interview strategy.',
    topics: [
      {
        title: 'Graphs — Representation & Traversal',
        text: 'A graph is nodes (vertices) connected by edges, directed or undirected, weighted or unweighted. Two representations: an adjacency list (Map<Integer, List<Integer>>) — space O(V+E), fast iteration — or an adjacency matrix — O(V²) space but O(1) edge checks.\n\nDFS explores deep first, using recursion or an explicit stack; BFS explores wide using a queue and finds shortest paths in unweighted graphs. Both visit each node once (O(V+E)).\n\nA visited set/map is mandatory — graphs can have cycles, and revisiting nodes causes infinite loops. Islands/connected-components problems are just "run DFS/BFS from every unvisited cell".',
        code: '// DFS over an adjacency list, marking visited\nvoid dfs(Map<Integer, List<Integer>> g, int u, Set<Integer> vis) {\n  if (!vis.add(u)) return;\n  for (int v : g.getOrDefault(u, List.of())) dfs(g, v, vis);\n}\n\n// Count connected components\nint components(Map<Integer, List<Integer>> g, int n) {\n  Set<Integer> vis = new HashSet<>();\n  int count = 0;\n  for (int u = 0; u < n; u++) if (vis.add(u)) { dfs(g, u, vis); count++; }\n  return count;\n}',
        note: 'When you can phrase a problem as "things connected to things", draw it as a graph and traverse it — islands, friends, prerequisites are all graphs.',
      },
      {
        title: 'Shortest Path & Cycle Detection',
        text: 'BFS finds shortest paths in unweighted graphs by levels. Weighted graphs need smarter algorithms: Dijkstra (greedy, works for non-negative weights) uses a priority queue; Bellman-Ford handles negative weights; Floyd-Warshall finds all-pairs.\n\nDijkstra: start at the source, always expand the closest unvisited node, relax its neighbors. With a min-heap it runs O((V+E) log V). The `dist` array holds the best-known distance to each node.\n\nCycle detection: in a directed graph, a DFS with a "in current path" state (gray) finds back edges; in an undirected graph, a parent pointer suffices. Cycle detection powers topological sorting and deadlock detection.',
        code: '// Dijkstra with a priority queue — non-negative weights\nint[] dijkstra(Map<Integer, List<int[]>> g, int src, int n) {\n  int[] dist = new int[n];\n  Arrays.fill(dist, Integer.MAX_VALUE);\n  dist[src] = 0;\n  PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n  pq.offer(new int[]{0, src});\n  while (!pq.isEmpty()) {\n    int[] top = pq.poll();\n    int d = top[0], u = top[1];\n    if (d > dist[u]) continue;   // stale entry\n    for (int[] e : g.getOrDefault(u, List.of())) {\n      int v = e[0], w = e[1];\n      if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; pq.offer(new int[]{dist[v], v}); }\n    }\n  }\n  return dist;\n}',
        note: 'Know the triggers: unweighted shortest path → BFS; weighted non-negative → Dijkstra; negative weights → Bellman-Ford.',
      },
      {
        title: 'Dynamic Programming — The Memoization Pattern',
        text: 'Dynamic programming solves problems with overlapping subproblems by storing answers instead of recomputing. Two styles: memoization (top-down recursion + a cache) and tabulation (bottom-up iteration over a table).\n\nThe Fibonacci sequence is the doorway: `fib(n) = fib(n-1) + fib(n-2)` naively recomputes exponentially; a `memo` array makes it O(n).\n\nTo spot DP: "how many ways", "maximum/minimum value", "can we reach" with choices at each step and overlapping subproblems. Define the state (what does a cell mean?), the recurrence (how does a cell depend on earlier cells?), and the base cases.',
        code: 'int fib(int n, int[] memo) {\n  if (n <= 1) return n;\n  if (memo[n] != 0) return memo[n];\n  return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);\n}\n\n// Tabulated coins — ways to make amount\nint coinWays(int[] coins, int amount) {\n  int[] dp = new int[amount + 1];\n  dp[0] = 1;\n  for (int c : coins) for (int a = c; a <= amount; a++) dp[a] += dp[a - c];\n  return dp[amount];\n}',
        note: 'DP is recursion minus the redundant work: same recursive formula, plus a cache. Master memoization first; tabulation follows.',
      },
      {
        title: 'Interview Strategy & Problem Patterns',
        text: 'Patterns recur across interview problems: two pointers (pairs in sorted arrays), sliding window (contiguous substrings), fast-slow (cycles/middle), prefix sums (range sums), monotonic stack (next greater), heap (top K), backtracking (subsets/permutations), BFS/DFS (graphs), and DP (overlapping subproblems).\n\nProblem-solving protocol: clarify the input size (drives acceptable complexity), give a brute force, then name the pattern, then optimize. Explain as you code and test with edge cases: empty input, single element, already sorted, all equal, negative numbers.\n\nPractice with spaced repetition: solve, wait, re-solve without looking. The pattern library is small — after ~50 well-chosen problems you will recognize most interview questions on sight.',
        code: '// Prefix sums make range-sum queries O(1)\nint rangeSum(int[] prefix, int l, int r) {\n  return prefix[r + 1] - prefix[l];\n}\n// prefix[i+1] = prefix[i] + a[i] built once in O(n)',
        note: 'Interviewers care about your thinking process more than the final bug-free code — speak the pattern name and your complexity early.',
      },
    ],
    quizzes: [
      { text: 'BFS finds shortest paths in…', options: ['weighted graphs only', 'unweighted graphs (level by level)', 'trees only', 'cyclic graphs never'], correctAnswer: 'unweighted graphs (level by level)' },
      { text: 'Dijkstra requires…', options: ['negative weights', 'non-negative weights', 'a directed graph only', 'a tree'], correctAnswer: 'non-negative weights' },
      { text: 'Memoization is…', options: ['recursion without a cache', 'recursion plus a cache to avoid recomputation', 'a loop always', 'a sorting method'], correctAnswer: 'recursion plus a cache to avoid recomputation' },
      { text: 'Range-sum queries become O(1) with…', options: ['a hash map', 'prefix sums', 'a stack', 'binary search'], correctAnswer: 'prefix sums' },
    ],
  },
];
