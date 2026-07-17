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
  { title: "Two Sum", platform: "LeetCode", url: LC("two-sum"), difficulty: "Easy", topic: "Arrays", pattern: "Two Pointers", companyTags: ["Google", "Amazon", "Meta", "Salesforce", "Oracle", "Walmart Labs"] },
  { title: "Best Time to Buy and Sell Stock", platform: "LeetCode", url: LC("best-time-to-buy-and-sell-stock"), difficulty: "Easy", topic: "Arrays", pattern: "Two Pointers", companyTags: ["Amazon", "Microsoft", "Walmart Labs"] },
  { title: "Product of Array Except Self", platform: "LeetCode", url: LC("product-of-array-except-self"), difficulty: "Medium", topic: "Arrays", pattern: "Prefix Sum", companyTags: ["Amazon", "Meta", "Apple", "Walmart Labs"] },
  { title: "Maximum Subarray", platform: "LeetCode", url: LC("maximum-subarray"), difficulty: "Medium", topic: "Arrays", pattern: "Dynamic Programming", companyTags: ["Microsoft", "LinkedIn"] },
  { title: "Container With Most Water", platform: "LeetCode", url: LC("container-with-most-water"), difficulty: "Medium", topic: "Arrays", pattern: "Two Pointers", companyTags: ["Google", "Bloomberg"] },
  { title: "3Sum", platform: "LeetCode", url: LC("3sum"), difficulty: "Medium", topic: "Arrays", pattern: "Two Pointers", companyTags: ["Amazon", "Meta", "Adobe"] },
  { title: "Trapping Rain Water", platform: "LeetCode", url: LC("trapping-rain-water"), difficulty: "Hard", topic: "Arrays", pattern: "Two Pointers", companyTags: ["Google", "Amazon"] },

  // Strings (7)
  { title: "Valid Anagram", platform: "LeetCode", url: LC("valid-anagram"), difficulty: "Easy", topic: "Strings", pattern: "Sliding Window", companyTags: ["Amazon", "Salesforce"] },
  { title: "Longest Substring Without Repeating Characters", platform: "LeetCode", url: LC("longest-substring-without-repeating-characters"), difficulty: "Medium", topic: "Strings", pattern: "Sliding Window", companyTags: ["Amazon", "Meta", "Bloomberg", "Salesforce"] },
  { title: "Longest Palindromic Substring", platform: "LeetCode", url: LC("longest-palindromic-substring"), difficulty: "Medium", topic: "Strings", pattern: "Two Pointers", companyTags: ["Microsoft", "Amazon"] },
  { title: "Group Anagrams", platform: "LeetCode", url: LC("group-anagrams"), difficulty: "Medium", topic: "Strings", pattern: "Sliding Window", companyTags: ["Amazon", "Uber", "Salesforce", "Atlassian"] },
  { title: "Valid Parentheses", platform: "LeetCode", url: LC("valid-parentheses"), difficulty: "Easy", topic: "Strings", pattern: "Monotonic Stack", companyTags: ["Google", "Amazon", "Microsoft", "Salesforce", "Oracle", "Stripe"] },
  { title: "Minimum Window Substring", platform: "LeetCode", url: LC("minimum-window-substring"), difficulty: "Hard", topic: "Strings", pattern: "Sliding Window", companyTags: ["Meta", "Google"] },
  { title: "String to Integer (atoi)", platform: "LeetCode", url: LC("string-to-integer-atoi"), difficulty: "Medium", topic: "Strings", pattern: "Two Pointers", companyTags: ["Amazon", "Microsoft", "Stripe"] },

  // Linked Lists (6)
  { title: "Reverse Linked List", platform: "LeetCode", url: LC("reverse-linked-list"), difficulty: "Easy", topic: "Linked Lists", pattern: "Two Pointers", companyTags: ["Amazon", "Microsoft", "Apple", "Salesforce", "Oracle"] },
  { title: "Linked List Cycle", platform: "LeetCode", url: LC("linked-list-cycle"), difficulty: "Easy", topic: "Linked Lists", pattern: "Fast & Slow Pointers", companyTags: ["Amazon", "Bloomberg"] },
  { title: "Merge Two Sorted Lists", platform: "LeetCode", url: LC("merge-two-sorted-lists"), difficulty: "Easy", topic: "Linked Lists", pattern: "Two Pointers", companyTags: ["Amazon", "Microsoft", "LinkedIn", "Salesforce", "Oracle"] },
  { title: "Remove Nth Node From End of List", platform: "LeetCode", url: LC("remove-nth-node-from-end-of-list"), difficulty: "Medium", topic: "Linked Lists", pattern: "Fast & Slow Pointers", companyTags: ["Google", "Amazon"] },
  { title: "Reorder List", platform: "LeetCode", url: LC("reorder-list"), difficulty: "Medium", topic: "Linked Lists", pattern: "Fast & Slow Pointers", companyTags: ["Meta", "Amazon"] },
  { title: "Copy List with Random Pointer", platform: "LeetCode", url: LC("copy-list-with-random-pointer"), difficulty: "Medium", topic: "Linked Lists", pattern: "Two Pointers", companyTags: ["Amazon", "Microsoft"] },

  // Trees (8)
  { title: "Maximum Depth of Binary Tree", platform: "LeetCode", url: LC("maximum-depth-of-binary-tree"), difficulty: "Easy", topic: "Trees", pattern: "DFS", companyTags: ["Amazon", "Google", "Salesforce", "Oracle"] },
  { title: "Same Tree", platform: "LeetCode", url: LC("same-tree"), difficulty: "Easy", topic: "Trees", pattern: "DFS", companyTags: ["Amazon", "Bloomberg"] },
  { title: "Invert Binary Tree", platform: "LeetCode", url: LC("invert-binary-tree"), difficulty: "Easy", topic: "Trees", pattern: "DFS", companyTags: ["Google", "Amazon"] },
  { title: "Binary Tree Level Order Traversal", platform: "LeetCode", url: LC("binary-tree-level-order-traversal"), difficulty: "Medium", topic: "Trees", pattern: "BFS", companyTags: ["Amazon", "Microsoft", "Meta", "Salesforce"] },
  { title: "Validate Binary Search Tree", platform: "LeetCode", url: LC("validate-binary-search-tree"), difficulty: "Medium", topic: "Trees", pattern: "In-order Traversal", companyTags: ["Amazon", "Microsoft"] },
  { title: "Kth Smallest Element in a BST", platform: "LeetCode", url: LC("kth-smallest-element-in-a-bst"), difficulty: "Medium", topic: "Trees", pattern: "In-order Traversal", companyTags: ["Amazon", "Google"] },
  { title: "Lowest Common Ancestor of a BST", platform: "LeetCode", url: LC("lowest-common-ancestor-of-a-binary-search-tree"), difficulty: "Medium", topic: "Trees", pattern: "DFS", companyTags: ["Amazon", "Meta", "LinkedIn"] },
  { title: "Serialize and Deserialize Binary Tree", platform: "LeetCode", url: LC("serialize-and-deserialize-binary-tree"), difficulty: "Hard", topic: "Trees", pattern: "BFS", companyTags: ["Google", "Meta", "Microsoft", "Netflix"] },

  // Graphs (7)
  { title: "Number of Islands", platform: "LeetCode", url: LC("number-of-islands"), difficulty: "Medium", topic: "Graphs", pattern: "DFS", companyTags: ["Amazon", "Google", "Microsoft", "Salesforce", "Atlassian", "Netflix"] },
  { title: "Clone Graph", platform: "LeetCode", url: LC("clone-graph"), difficulty: "Medium", topic: "Graphs", pattern: "DFS", companyTags: ["Amazon", "Meta", "Salesforce"] },
  { title: "Course Schedule", platform: "LeetCode", url: LC("course-schedule"), difficulty: "Medium", topic: "Graphs", pattern: "DFS", companyTags: ["Amazon", "Google", "Bloomberg", "Salesforce", "Atlassian", "Netflix"] },
  { title: "Pacific Atlantic Water Flow", platform: "LeetCode", url: LC("pacific-atlantic-water-flow"), difficulty: "Medium", topic: "Graphs", pattern: "DFS", companyTags: ["Google", "Amazon"] },
  { title: "Number of Connected Components in an Undirected Graph", platform: "LeetCode", url: LC("number-of-connected-components-in-an-undirected-graph"), difficulty: "Medium", topic: "Graphs", pattern: "Union Find", companyTags: ["Amazon", "Google"] },
  { title: "Graph Valid Tree", platform: "LeetCode", url: LC("graph-valid-tree"), difficulty: "Medium", topic: "Graphs", pattern: "Union Find", companyTags: ["Google", "Meta"] },
  { title: "Word Ladder", platform: "LeetCode", url: LC("word-ladder"), difficulty: "Hard", topic: "Graphs", pattern: "BFS", companyTags: ["Amazon", "Meta", "LinkedIn", "Netflix"] },

  // Heaps (6)
  { title: "Kth Largest Element in an Array", platform: "LeetCode", url: LC("kth-largest-element-in-an-array"), difficulty: "Medium", topic: "Heaps", pattern: "Top-K / Heap", companyTags: ["Amazon", "Microsoft", "Salesforce", "Walmart Labs"] },
  { title: "Top K Frequent Elements", platform: "LeetCode", url: LC("top-k-frequent-elements"), difficulty: "Medium", topic: "Heaps", pattern: "Top-K / Heap", companyTags: ["Amazon", "Meta", "Salesforce", "Netflix"] },
  { title: "Find Median from Data Stream", platform: "LeetCode", url: LC("find-median-from-data-stream"), difficulty: "Hard", topic: "Heaps", pattern: "Top-K / Heap", companyTags: ["Google", "Amazon", "Netflix"] },
  { title: "Merge K Sorted Lists", platform: "LeetCode", url: LC("merge-k-sorted-lists"), difficulty: "Hard", topic: "Heaps", pattern: "Top-K / Heap", companyTags: ["Amazon", "Google", "Meta", "Netflix"] },
  { title: "Task Scheduler", platform: "LeetCode", url: LC("task-scheduler"), difficulty: "Medium", topic: "Heaps", pattern: "Greedy", companyTags: ["Amazon", "Meta", "Netflix"] },
  { title: "K Closest Points to Origin", platform: "LeetCode", url: LC("k-closest-points-to-origin"), difficulty: "Medium", topic: "Heaps", pattern: "Top-K / Heap", companyTags: ["Amazon", "Microsoft"] },

  // Binary Search (6)
  { title: "Binary Search", platform: "LeetCode", url: LC("binary-search"), difficulty: "Easy", topic: "Binary Search", pattern: "Binary Search", companyTags: ["Google", "Amazon", "Oracle"] },
  { title: "Search in Rotated Sorted Array", platform: "LeetCode", url: LC("search-in-rotated-sorted-array"), difficulty: "Medium", topic: "Binary Search", pattern: "Binary Search", companyTags: ["Amazon", "Microsoft", "Meta", "Salesforce"] },
  { title: "Find Minimum in Rotated Sorted Array", platform: "LeetCode", url: LC("find-minimum-in-rotated-sorted-array"), difficulty: "Medium", topic: "Binary Search", pattern: "Binary Search", companyTags: ["Amazon", "Microsoft"] },
  { title: "Koko Eating Bananas", platform: "LeetCode", url: LC("koko-eating-bananas"), difficulty: "Medium", topic: "Binary Search", pattern: "Binary Search", companyTags: ["Google", "Amazon"] },
  { title: "Median of Two Sorted Arrays", platform: "LeetCode", url: LC("median-of-two-sorted-arrays"), difficulty: "Hard", topic: "Binary Search", pattern: "Binary Search", companyTags: ["Google", "Microsoft", "Apple"] },
  { title: "Search a 2D Matrix", platform: "LeetCode", url: LC("search-a-2d-matrix"), difficulty: "Medium", topic: "Binary Search", pattern: "Binary Search", companyTags: ["Amazon", "Bloomberg"] },

  // Dynamic Programming (10)
  { title: "Climbing Stairs", platform: "LeetCode", url: LC("climbing-stairs"), difficulty: "Easy", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon", "Adobe"] },
  { title: "House Robber", platform: "LeetCode", url: LC("house-robber"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon", "Google", "LinkedIn"] },
  { title: "House Robber II", platform: "LeetCode", url: LC("house-robber-ii"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon"] },
  { title: "Longest Increasing Subsequence", platform: "LeetCode", url: LC("longest-increasing-subsequence"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Microsoft", "Google", "Netflix"] },
  { title: "Coin Change", platform: "LeetCode", url: LC("coin-change"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon", "Google", "Uber"] },
  { title: "Word Break", platform: "LeetCode", url: LC("word-break"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon", "Meta", "Bloomberg", "Salesforce", "Atlassian"] },
  { title: "Combination Sum IV", platform: "LeetCode", url: LC("combination-sum-iv"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon"] },
  { title: "Decode Ways", platform: "LeetCode", url: LC("decode-ways"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Meta", "Amazon"] },
  { title: "Unique Paths", platform: "LeetCode", url: LC("unique-paths"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon", "Google"] },
  { title: "Longest Common Subsequence", platform: "LeetCode", url: LC("longest-common-subsequence"), difficulty: "Medium", topic: "Dynamic Programming", pattern: "Dynamic Programming", companyTags: ["Amazon", "Microsoft", "Walmart Labs"] },

  // Greedy (6)
  { title: "Jump Game", platform: "LeetCode", url: LC("jump-game"), difficulty: "Medium", topic: "Greedy", pattern: "Greedy", companyTags: ["Amazon", "Microsoft"] },
  { title: "Jump Game II", platform: "LeetCode", url: LC("jump-game-ii"), difficulty: "Medium", topic: "Greedy", pattern: "Greedy", companyTags: ["Amazon"] },
  { title: "Gas Station", platform: "LeetCode", url: LC("gas-station"), difficulty: "Medium", topic: "Greedy", pattern: "Greedy", companyTags: ["Meta", "Amazon"] },
  { title: "Partition Labels", platform: "LeetCode", url: LC("partition-labels"), difficulty: "Medium", topic: "Greedy", pattern: "Greedy", companyTags: ["Amazon"] },
  { title: "Hand of Straights", platform: "LeetCode", url: LC("hand-of-straights"), difficulty: "Medium", topic: "Greedy", pattern: "Greedy", companyTags: ["Amazon", "Google"] },
  { title: "Candy", platform: "LeetCode", url: LC("candy"), difficulty: "Hard", topic: "Greedy", pattern: "Greedy", companyTags: ["Google", "Meta"] },

  // Intervals (6)
  { title: "Merge Intervals", platform: "LeetCode", url: LC("merge-intervals"), difficulty: "Medium", topic: "Intervals", pattern: "Greedy", companyTags: ["Amazon", "Google", "Meta", "Salesforce", "Atlassian", "Stripe"] },
  { title: "Insert Interval", platform: "LeetCode", url: LC("insert-interval"), difficulty: "Medium", topic: "Intervals", pattern: "Greedy", companyTags: ["Google", "Amazon", "Stripe"] },
  { title: "Non-overlapping Intervals", platform: "LeetCode", url: LC("non-overlapping-intervals"), difficulty: "Medium", topic: "Intervals", pattern: "Greedy", companyTags: ["Amazon", "Microsoft"] },
  { title: "Meeting Rooms", platform: "LeetCode", url: LC("meeting-rooms"), difficulty: "Easy", topic: "Intervals", pattern: "Greedy", companyTags: ["Meta", "Amazon", "Salesforce"] },
  { title: "Meeting Rooms II", platform: "LeetCode", url: LC("meeting-rooms-ii"), difficulty: "Medium", topic: "Intervals", pattern: "Top-K / Heap", companyTags: ["Meta", "Amazon", "Google", "Salesforce", "Stripe"] },
  { title: "Minimum Interval to Include Each Query", platform: "LeetCode", url: LC("minimum-interval-to-include-each-query"), difficulty: "Hard", topic: "Intervals", pattern: "Top-K / Heap", companyTags: ["Google"] },

  // Backtracking (6)
  { title: "Subsets", platform: "LeetCode", url: LC("subsets"), difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking", companyTags: ["Amazon", "Meta", "Salesforce"] },
  { title: "Combination Sum", platform: "LeetCode", url: LC("combination-sum"), difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking", companyTags: ["Amazon", "Uber"] },
  { title: "Permutations", platform: "LeetCode", url: LC("permutations"), difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking", companyTags: ["Amazon", "Microsoft", "Salesforce"] },
  { title: "Word Search", platform: "LeetCode", url: LC("word-search"), difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking", companyTags: ["Amazon", "Microsoft", "Bloomberg"] },
  { title: "Palindrome Partitioning", platform: "LeetCode", url: LC("palindrome-partitioning"), difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking", companyTags: ["Amazon", "Google"] },
  { title: "N-Queens", platform: "LeetCode", url: LC("n-queens"), difficulty: "Hard", topic: "Backtracking", pattern: "Backtracking", companyTags: ["Microsoft", "Amazon"] },
];
