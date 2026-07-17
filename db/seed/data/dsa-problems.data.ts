export type ProblemSeed = {
  title: string;
  platform: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  pattern: string;
  companyTags: string[];
};

const LC = (slug: string) => `https://leetcode.com/problems/${slug}/`;

export const DSA_PROBLEMS: ProblemSeed[] = [
  // Arrays (7)
  { title: "Two Sum", platform: "LeetCode", url: LC("two-sum"), difficulty: "Easy", topic: "Arrays", pattern: "Two Pointers", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Salesforce", "Oracle", "Adobe", "LinkedIn", "Uber", "Bloomberg", "Atlassian", "Walmart Labs"] },
  { title: "Best Time to Buy and Sell Stock", platform: "LeetCode", url: LC("best-time-to-buy-and-sell-stock"), difficulty: "Easy", topic: "Arrays", pattern: "Two Pointers", companyTags: ["Amazon", "Google", "Apple", "Salesforce", "Oracle", "Adobe", "LinkedIn", "Uber", "Bloomberg", "Atlassian", "Walmart Labs"] },
  { title: "Product of Array Except Self", platform: "LeetCode", url: LC("product-of-array-except-self"), difficulty: "Medium", topic: "Arrays", pattern: "Prefix Sum", companyTags: ["Amazon", "Google", "Apple", "Salesforce", "Oracle", "Adobe", "LinkedIn", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Maximum Subarray", platform: "LeetCode", url: LC("maximum-subarray"), difficulty: "Medium", topic: "Arrays", pattern: "Dynamic Programming", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Salesforce", "Oracle", "LinkedIn", "Uber", "Bloomberg", "Atlassian", "Walmart Labs"] },
  { title: "Container With Most Water", platform: "LeetCode", url: LC("container-with-most-water"), difficulty: "Medium", topic: "Arrays", pattern: "Two Pointers", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Salesforce", "Oracle", "Adobe", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "3Sum", platform: "LeetCode", url: LC("3sum"), difficulty: "Medium", topic: "Arrays", pattern: "Two Pointers", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Salesforce", "Oracle", "Adobe", "Bloomberg", "Walmart Labs"] },
  { title: "Trapping Rain Water", platform: "LeetCode", url: LC("trapping-rain-water"), difficulty: "Hard", topic: "Arrays", pattern: "Two Pointers", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Salesforce", "Oracle", "Adobe", "Uber", "Bloomberg", "Walmart Labs"] },

  // Strings (7)
  { title: "Valid Anagram", platform: "LeetCode", url: LC("valid-anagram"), difficulty: "Easy", topic: "Strings", pattern: "Sliding Window", companyTags: ["Amazon", "Google", "Apple", "Netflix", "Oracle", "Uber", "Bloomberg"] },
  { title: "Longest Substring Without Repeating Characters", platform: "LeetCode", url: LC("longest-substring-without-repeating-characters"), difficulty: "Medium", topic: "Strings", pattern: "Sliding Window", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Netflix", "Salesforce", "Oracle", "Adobe", "LinkedIn", "Uber", "Bloomberg", "Atlassian", "Walmart Labs"] },
  { title: "Longest Palindromic Substring", platform: "LeetCode", url: LC("longest-palindromic-substring"), difficulty: "Medium", topic: "Strings", pattern: "Two Pointers", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Salesforce", "Oracle", "Adobe", "LinkedIn", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Group Anagrams", platform: "LeetCode", url: LC("group-anagrams"), difficulty: "Medium", topic: "Strings", pattern: "Sliding Window", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Salesforce", "Oracle", "Adobe", "Uber", "Bloomberg", "Atlassian", "Walmart Labs"] },
  { title: "Valid Parentheses", platform: "LeetCode", url: LC("valid-parentheses"), difficulty: "Easy", topic: "Strings", pattern: "Monotonic Stack", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Salesforce", "Oracle", "Adobe", "LinkedIn", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Minimum Window Substring", platform: "LeetCode", url: LC("minimum-window-substring"), difficulty: "Hard", topic: "Strings", pattern: "Sliding Window", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Salesforce", "Oracle", "Adobe", "LinkedIn", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "String to Integer (atoi)", platform: "LeetCode", url: LC("string-to-integer-atoi"), difficulty: "Medium", topic: "Strings", pattern: "Two Pointers", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Netflix", "Adobe", "Uber", "Bloomberg"] },

  // Linked Lists (6)
  { title: "Reverse Linked List", platform: "LeetCode", url: LC("reverse-linked-list"), difficulty: "Easy", topic: "Linked Lists", pattern: "Two Pointers", companyTags: ["Amazon", "Google", "Apple", "Oracle", "Adobe", "Uber", "Bloomberg"] },
  { title: "Linked List Cycle", platform: "LeetCode", url: LC("linked-list-cycle"), difficulty: "Easy", topic: "Linked Lists", pattern: "Fast & Slow Pointers", companyTags: ["Amazon", "Google", "Oracle", "Bloomberg", "Walmart Labs"] },
  { title: "Merge Two Sorted Lists", platform: "LeetCode", url: LC("merge-two-sorted-lists"), difficulty: "Easy", topic: "Linked Lists", pattern: "Two Pointers", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Salesforce", "Oracle", "LinkedIn", "Bloomberg"] },
  { title: "Remove Nth Node From End of List", platform: "LeetCode", url: LC("remove-nth-node-from-end-of-list"), difficulty: "Medium", topic: "Linked Lists", pattern: "Fast & Slow Pointers", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Oracle", "Bloomberg", "Walmart Labs"] },
  { title: "Reorder List", platform: "LeetCode", url: LC("reorder-list"), difficulty: "Medium", topic: "Linked Lists", pattern: "Fast & Slow Pointers", companyTags: ["Amazon", "Google", "Apple", "LinkedIn", "Bloomberg"] },
  { title: "Copy List with Random Pointer", platform: "LeetCode", url: LC("copy-list-with-random-pointer"), difficulty: "Medium", topic: "Linked Lists", pattern: "Two Pointers", companyTags: ["Amazon", "Google", "Apple", "Oracle", "Uber", "Bloomberg", "Walmart Labs"] },

  // Trees (8)
  { title: "Maximum Depth of Binary Tree", platform: "LeetCode", url: LC("maximum-depth-of-binary-tree"), difficulty: "Easy", topic: "Trees", pattern: "DFS", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Oracle", "LinkedIn", "Uber", "Bloomberg"] },
  { title: "Same Tree", platform: "LeetCode", url: LC("same-tree"), difficulty: "Easy", topic: "Trees", pattern: "DFS", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "LinkedIn", "Bloomberg"] },
  { title: "Invert Binary Tree", platform: "LeetCode", url: LC("invert-binary-tree"), difficulty: "Easy", topic: "Trees", pattern: "DFS", companyTags: ["Amazon", "Google", "Oracle", "Bloomberg"] },
  { title: "Binary Tree Level Order Traversal", platform: "LeetCode", url: LC("binary-tree-level-order-traversal"), difficulty: "Medium", topic: "Trees", pattern: "BFS", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Oracle", "Adobe", "LinkedIn", "Bloomberg"] },
  { title: "Validate Binary Search Tree", platform: "LeetCode", url: LC("validate-binary-search-tree"), difficulty: "Medium", topic: "Trees", pattern: "In-order Traversal", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Salesforce", "Oracle", "LinkedIn", "Bloomberg"] },
  { title: "Kth Smallest Element in a BST", platform: "LeetCode", url: LC("kth-smallest-element-in-a-bst"), difficulty: "Medium", topic: "Trees", pattern: "In-order Traversal", companyTags: ["Amazon", "Google", "Oracle", "Uber", "Bloomberg"] },
  { title: "Lowest Common Ancestor of a BST", platform: "LeetCode", url: LC("lowest-common-ancestor-of-a-binary-search-tree"), difficulty: "Medium", topic: "Trees", pattern: "DFS", companyTags: ["Amazon", "Google", "Apple", "LinkedIn", "Bloomberg"] },
  { title: "Serialize and Deserialize Binary Tree", platform: "LeetCode", url: LC("serialize-and-deserialize-binary-tree"), difficulty: "Hard", topic: "Trees", pattern: "BFS", companyTags: ["Amazon", "Google", "Apple", "Oracle", "LinkedIn", "Uber", "Bloomberg", "Atlassian"] },

  // Graphs (7)
  { title: "Number of Islands", platform: "LeetCode", url: LC("number-of-islands"), difficulty: "Medium", topic: "Graphs", pattern: "DFS", companyTags: ["Amazon", "Google", "Apple", "Salesforce", "Oracle", "Adobe", "LinkedIn", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Clone Graph", platform: "LeetCode", url: LC("clone-graph"), difficulty: "Medium", topic: "Graphs", pattern: "DFS", companyTags: ["Amazon", "Google", "Apple", "Oracle", "Uber", "Bloomberg"] },
  { title: "Course Schedule", platform: "LeetCode", url: LC("course-schedule"), difficulty: "Medium", topic: "Graphs", pattern: "DFS", companyTags: ["Amazon", "Google", "Apple", "Salesforce", "Oracle", "Adobe", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Pacific Atlantic Water Flow", platform: "LeetCode", url: LC("pacific-atlantic-water-flow"), difficulty: "Medium", topic: "Graphs", pattern: "DFS", companyTags: ["Amazon", "Google", "Adobe", "Bloomberg"] },
  { title: "Number of Connected Components in an Undirected Graph", platform: "LeetCode", url: LC("number-of-connected-components-in-an-undirected-graph"), difficulty: "Medium", topic: "Graphs", pattern: "Union Find", companyTags: ["Amazon", "Google", "LinkedIn"] },
  { title: "Graph Valid Tree", platform: "LeetCode", url: LC("graph-valid-tree"), difficulty: "Medium", topic: "Graphs", pattern: "Union Find", companyTags: ["Amazon", "Google", "LinkedIn", "Uber"] },
  { title: "Word Ladder", platform: "LeetCode", url: LC("word-ladder"), difficulty: "Hard", topic: "Graphs", pattern: "BFS", companyTags: ["Amazon", "Google", "Apple", "Salesforce", "Oracle", "Adobe", "LinkedIn", "Uber", "Bloomberg"] },

  // Heaps (6)
  { title: "Kth Largest Element in an Array", platform: "LeetCode", url: LC("kth-largest-element-in-an-array"), difficulty: "Medium", topic: "Heaps", pattern: "Top-K / Heap", companyTags: ["Amazon", "Google", "Apple", "Salesforce", "Oracle", "Adobe", "LinkedIn", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Top K Frequent Elements", platform: "LeetCode", url: LC("top-k-frequent-elements"), difficulty: "Medium", topic: "Heaps", pattern: "Top-K / Heap", companyTags: ["Amazon", "Google", "Apple", "Netflix", "Salesforce", "Oracle", "Adobe", "Uber", "Bloomberg", "Atlassian", "Walmart Labs"] },
  { title: "Find Median from Data Stream", platform: "LeetCode", url: LC("find-median-from-data-stream"), difficulty: "Hard", topic: "Heaps", pattern: "Top-K / Heap", companyTags: ["Amazon", "Google", "Apple", "Salesforce", "Oracle", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Merge K Sorted Lists", platform: "LeetCode", url: LC("merge-k-sorted-lists"), difficulty: "Hard", topic: "Heaps", pattern: "Top-K / Heap", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Salesforce", "Oracle", "LinkedIn", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Task Scheduler", platform: "LeetCode", url: LC("task-scheduler"), difficulty: "Medium", topic: "Heaps", pattern: "Greedy", companyTags: ["Amazon", "Google", "Apple", "Oracle", "Uber", "Bloomberg"] },
  { title: "K Closest Points to Origin", platform: "LeetCode", url: LC("k-closest-points-to-origin"), difficulty: "Medium", topic: "Heaps", pattern: "Top-K / Heap", companyTags: ["Amazon", "Google", "Apple", "Salesforce", "Oracle", "Bloomberg"] },

  // Binary Search (6)
  { title: "Binary Search", platform: "LeetCode", url: LC("binary-search"), difficulty: "Easy", topic: "Binary Search", pattern: "Binary Search", companyTags: ["Amazon", "Google", "Oracle", "Bloomberg"] },
  { title: "Search in Rotated Sorted Array", platform: "LeetCode", url: LC("search-in-rotated-sorted-array"), difficulty: "Medium", topic: "Binary Search", pattern: "Binary Search", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Salesforce", "Oracle", "Adobe", "LinkedIn", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Find Minimum in Rotated Sorted Array", platform: "LeetCode", url: LC("find-minimum-in-rotated-sorted-array"), difficulty: "Medium", topic: "Binary Search", pattern: "Binary Search", companyTags: ["Amazon", "Google", "Apple", "Oracle", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Koko Eating Bananas", platform: "LeetCode", url: LC("koko-eating-bananas"), difficulty: "Medium", topic: "Binary Search", pattern: "Binary Search", companyTags: ["Amazon", "Google", "Apple", "Netflix", "Salesforce", "Oracle", "Adobe", "Uber", "Bloomberg", "Atlassian"] },
  { title: "Median of Two Sorted Arrays", platform: "LeetCode", url: LC("median-of-two-sorted-arrays"), difficulty: "Hard", topic: "Binary Search", pattern: "Binary Search", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Salesforce", "Oracle", "Adobe", "LinkedIn", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Search a 2D Matrix", platform: "LeetCode", url: LC("search-a-2d-matrix"), difficulty: "Medium", topic: "Binary Search", pattern: "Binary Search", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Oracle", "Adobe", "Uber", "Bloomberg", "Walmart Labs"] },

  // Dynamic Programming (10)
  { title: "Climbing Stairs", platform: "LeetCode", url: LC("climbing-stairs"), difficulty: "Easy", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Oracle", "Adobe", "Uber", "Bloomberg"] },
  { title: "House Robber", platform: "LeetCode", url: LC("house-robber"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon", "Google", "Apple", "Oracle", "Adobe", "LinkedIn", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "House Robber II", platform: "LeetCode", url: LC("house-robber-ii"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon", "Google", "Apple", "Salesforce", "LinkedIn", "Uber", "Bloomberg"] },
  { title: "Longest Increasing Subsequence", platform: "LeetCode", url: LC("longest-increasing-subsequence"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon", "Google", "Salesforce", "Oracle", "Uber", "Bloomberg", "Atlassian", "Walmart Labs"] },
  { title: "Coin Change", platform: "LeetCode", url: LC("coin-change"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon", "Google", "Apple", "Salesforce", "Oracle", "Adobe", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Word Break", platform: "LeetCode", url: LC("word-break"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon", "Google", "Apple", "Netflix", "Salesforce", "Oracle", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Combination Sum IV", platform: "LeetCode", url: LC("combination-sum-iv"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon", "Google", "Bloomberg"] },
  { title: "Decode Ways", platform: "LeetCode", url: LC("decode-ways"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Oracle", "Adobe", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Unique Paths", platform: "LeetCode", url: LC("unique-paths"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Bloomberg"] },
  { title: "Longest Common Subsequence", platform: "LeetCode", url: LC("longest-common-subsequence"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon", "Google", "Apple", "Salesforce", "Bloomberg", "Walmart Labs"] },

  // Greedy (6)
  { title: "Jump Game", platform: "LeetCode", url: LC("jump-game"), difficulty: "Medium", topic: "Greedy", pattern: "Greedy", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Oracle", "Adobe", "Bloomberg", "Walmart Labs"] },
  { title: "Jump Game II", platform: "LeetCode", url: LC("jump-game-ii"), difficulty: "Medium", topic: "Greedy", pattern: "Greedy", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Oracle", "Adobe", "Bloomberg", "Atlassian"] },
  { title: "Gas Station", platform: "LeetCode", url: LC("gas-station"), difficulty: "Medium", topic: "Greedy", pattern: "Greedy", companyTags: ["Amazon", "Google", "Apple", "Salesforce", "Oracle", "Adobe", "Bloomberg"] },
  { title: "Partition Labels", platform: "LeetCode", url: LC("partition-labels"), difficulty: "Medium", topic: "Greedy", pattern: "Greedy", companyTags: ["Amazon", "Google", "Bloomberg"] },
  { title: "Hand of Straights", platform: "LeetCode", url: LC("hand-of-straights"), difficulty: "Medium", topic: "Greedy", pattern: "Greedy", companyTags: ["Amazon", "Google", "Bloomberg"] },
  { title: "Candy", platform: "LeetCode", url: LC("candy"), difficulty: "Hard", topic: "Greedy", pattern: "Greedy", companyTags: ["Amazon", "Google", "Salesforce", "Oracle", "Uber", "Bloomberg", "Walmart Labs"] },

  // Intervals (6)
  { title: "Merge Intervals", platform: "LeetCode", url: LC("merge-intervals"), difficulty: "Medium", topic: "Intervals", pattern: "Greedy", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Netflix", "Salesforce", "Oracle", "Adobe", "LinkedIn", "Uber", "Bloomberg", "Atlassian", "Walmart Labs"] },
  { title: "Insert Interval", platform: "LeetCode", url: LC("insert-interval"), difficulty: "Medium", topic: "Intervals", pattern: "Greedy", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Oracle", "LinkedIn", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Non-overlapping Intervals", platform: "LeetCode", url: LC("non-overlapping-intervals"), difficulty: "Medium", topic: "Intervals", pattern: "Greedy", companyTags: ["Amazon", "Google", "Apple", "Oracle", "Bloomberg"] },
  { title: "Meeting Rooms", platform: "LeetCode", url: LC("meeting-rooms"), difficulty: "Easy", topic: "Intervals", pattern: "Greedy", companyTags: ["Amazon", "Google", "Apple", "Oracle", "Uber", "Bloomberg"] },
  { title: "Meeting Rooms II", platform: "LeetCode", url: LC("meeting-rooms-ii"), difficulty: "Medium", topic: "Intervals", pattern: "Top-K / Heap", companyTags: ["Amazon", "Google", "Apple", "Netflix", "Salesforce", "Oracle", "Adobe", "Uber", "Bloomberg", "Atlassian", "Walmart Labs"] },
  { title: "Minimum Interval to Include Each Query", platform: "LeetCode", url: LC("minimum-interval-to-include-each-query"), difficulty: "Hard", topic: "Intervals", pattern: "Top-K / Heap", companyTags: ["Amazon", "Google", "Bloomberg"] },

  // Backtracking (6)
  { title: "Subsets", platform: "LeetCode", url: LC("subsets"), difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Oracle", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Combination Sum", platform: "LeetCode", url: LC("combination-sum"), difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Salesforce", "Oracle", "LinkedIn", "Uber", "Bloomberg", "Walmart Labs"] },
  { title: "Permutations", platform: "LeetCode", url: LC("permutations"), difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Oracle", "LinkedIn", "Uber", "Bloomberg"] },
  { title: "Word Search", platform: "LeetCode", url: LC("word-search"), difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Netflix", "Salesforce", "Oracle", "Uber", "Bloomberg", "Atlassian", "Walmart Labs"] },
  { title: "Palindrome Partitioning", platform: "LeetCode", url: LC("palindrome-partitioning"), difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking", companyTags: ["Amazon", "Google", "Bloomberg"] },
  { title: "N-Queens", platform: "LeetCode", url: LC("n-queens"), difficulty: "Hard", topic: "Backtracking", pattern: "Backtracking", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Oracle", "Adobe", "Bloomberg"] },

  // Added from real per-company LeetCode frequency data (github.com/liquidslr/leetcode-company-wise-problems) —
  // problems not previously in this list that rank in at least 2 companies' top-20 most-frequently-asked lists.
  { title: "LRU Cache", platform: "LeetCode", url: LC("lru-cache"), difficulty: "Medium", topic: "Design", pattern: "Design", companyTags: ["Amazon", "Apple", "Netflix", "Salesforce", "Oracle", "Adobe", "Uber", "Walmart Labs"] },
  { title: "Add Two Numbers", platform: "LeetCode", url: LC("add-two-numbers"), difficulty: "Medium", topic: "Linked Lists", pattern: "Two Pointers", companyTags: ["Amazon", "Google", "Meta", "Microsoft", "Adobe", "Bloomberg"] },
  { title: "Longest Common Prefix", platform: "LeetCode", url: LC("longest-common-prefix"), difficulty: "Easy", topic: "Strings", pattern: "Two Pointers", companyTags: ["Amazon", "Google", "Meta", "Apple", "Bloomberg"] },
  { title: "Merge Sorted Array", platform: "LeetCode", url: LC("merge-sorted-array"), difficulty: "Easy", topic: "Arrays", pattern: "Two Pointers", companyTags: ["Google", "Meta", "Microsoft", "Bloomberg"] },
  { title: "Majority Element", platform: "LeetCode", url: LC("majority-element"), difficulty: "Easy", topic: "Arrays", pattern: "Greedy", companyTags: ["Google", "Adobe", "Bloomberg"] },
  { title: "Insert Delete GetRandom O(1)", platform: "LeetCode", url: LC("insert-delete-getrandom-o1"), difficulty: "Medium", topic: "Design", pattern: "Design", companyTags: ["LinkedIn", "Uber", "Bloomberg"] },
  { title: "Roman to Integer", platform: "LeetCode", url: LC("roman-to-integer"), difficulty: "Easy", topic: "Strings", pattern: "Greedy", companyTags: ["Google", "Microsoft"] },
  { title: "Pow(x, n)", platform: "LeetCode", url: LC("powx-n"), difficulty: "Medium", topic: "Binary Search", pattern: "Binary Search", companyTags: ["Meta", "LinkedIn"] },
  { title: "Find First and Last Position of Element in Sorted Array", platform: "LeetCode", url: LC("find-first-and-last-position-of-element-in-sorted-array"), difficulty: "Medium", topic: "Binary Search", pattern: "Binary Search", companyTags: ["Meta", "LinkedIn"] },
  { title: "Spiral Matrix", platform: "LeetCode", url: LC("spiral-matrix"), difficulty: "Medium", topic: "Arrays", pattern: "Two Pointers", companyTags: ["Microsoft", "Oracle"] },
  { title: "Rotate Image", platform: "LeetCode", url: LC("rotate-image"), difficulty: "Medium", topic: "Arrays", pattern: "Two Pointers", companyTags: ["Microsoft", "Apple"] },
  { title: "Design Hit Counter", platform: "LeetCode", url: LC("design-hit-counter"), difficulty: "Medium", topic: "Design", pattern: "Design", companyTags: ["Apple", "Uber"] },
  { title: "Course Schedule II", platform: "LeetCode", url: LC("course-schedule-ii"), difficulty: "Medium", topic: "Graphs", pattern: "DFS", companyTags: ["Apple", "Netflix"] },
  { title: "LFU Cache", platform: "LeetCode", url: LC("lfu-cache"), difficulty: "Hard", topic: "Design", pattern: "Design", companyTags: ["Salesforce", "Oracle"] },
  { title: "Divide Intervals Into Minimum Number of Groups", platform: "LeetCode", url: LC("divide-intervals-into-minimum-number-of-groups"), difficulty: "Medium", topic: "Intervals", pattern: "Greedy", companyTags: ["Adobe", "Walmart Labs"] },
  { title: "All O`one Data Structure", platform: "LeetCode", url: LC("all-oone-data-structure"), difficulty: "Hard", topic: "Design", pattern: "Design", companyTags: ["LinkedIn", "Atlassian"] },
  { title: "Evaluate Division", platform: "LeetCode", url: LC("evaluate-division"), difficulty: "Medium", topic: "Graphs", pattern: "DFS", companyTags: ["Uber", "Stripe"] },
  { title: "Invalid Transactions", platform: "LeetCode", url: LC("invalid-transactions"), difficulty: "Medium", topic: "Arrays", pattern: "Greedy", companyTags: ["Bloomberg", "Stripe"] },
];
