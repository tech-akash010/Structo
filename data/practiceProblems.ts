import type { PracticeProblem } from '../types';

export const ALL_PRACTICE_PROBLEMS: PracticeProblem[] = [
  // --- Linear Data Structures ---
  // Arrays & Strings
  {
    id: 'arrays-two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Linear Data Structures',
    subCategory: 'Arrays & Strings',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.

You can return the answer in any order.

**Example 1:**
- **Input:** nums = [2,7,11,15], target = 9
- **Output:** [0,1]
- **Explanation:** Because nums[0] + nums[1] == 9, we return [0, 1].

**Example 2:**
- **Input:** nums = [3,2,4], target = 6
- **Output:** [1,2]

**Constraints:**
- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- Only one valid answer exists.
`
  },
  {
    id: 'arrays-max-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    category: 'Linear Data Structures',
    subCategory: 'Arrays & Strings',
    description: `Given an integer array \`nums\`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

A **subarray** is a contiguous part of an array.

**Example 1:**
- **Input:** nums = [-2,1,-3,4,-1,2,1,-5,4]
- **Output:** 6
- **Explanation:** [4,-1,2,1] has the largest sum = 6.

**Example 2:**
- **Input:** nums = [5,4,-1,7,8]
- **Output:** 23

**Constraints:**
- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\`
`
  },
  // Linked Lists
  {
    id: 'll-reverse',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    category: 'Linear Data Structures',
    subCategory: 'Linked Lists',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the *reversed list's head*.

**Example 1:**
- **Input:** head = [1,2,3,4,5]
- **Output:** [5,4,3,2,1]

**Constraints:**
- The number of nodes in the list is the range [0, 5000].
- \`-5000 <= Node.val <= 5000\`
`
  },
  {
    id: 'll-cycle',
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    category: 'Linear Data Structures',
    subCategory: 'Linked Lists',
    description: `Given \`head\`, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the \`next\` pointer. Internally, \`pos\` is used to denote the index of the node that tail's \`next\` pointer is connected to. **Note that \`pos\` is not passed as a parameter.**

Return \`true\` if there is a cycle in the linked list. Otherwise, return \`false\`.

**Example 1:**
- **Input:** head = [3,2,0,-4], pos = 1
- **Output:** true
- **Explanation:** There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).
`
  },
  // Stacks
  {
    id: 'stacks-valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Linear Data Structures',
    subCategory: 'Stacks',
    description: `Given a string \`s\` containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

**Example 1:**
- **Input:** s = "()"
- **Output:** true

**Example 2:**
- **Input:** s = "()[]{}"
- **Output:** true

**Example 3:**
- **Input:** s = "(]"
- **Output:** false

**Constraints:**
- \`1 <= s.length <= 10^4\`
- \`s\` consists of parentheses only \`()[]{}\`.
`
  },
  // Queues
   {
    id: 'queues-implement-stack-using-queues',
    title: 'Implement Stack using Queues',
    difficulty: 'Easy',
    category: 'Linear Data Structures',
    subCategory: 'Queues',
    description: `Implement a last-in, first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (\`push\`, \`top\`, \`pop\`, and \`empty\`).

Implement the \`MyStack\` class:
- \`void push(int x)\` Pushes element x to the top of the stack.
- \`int pop()\` Removes the element on the top of the stack and returns it.
- \`int top()\` Returns the element on the top of the stack.
- \`boolean empty()\` Returns true if the stack is empty, false otherwise.

**Notes:**
- You must use **only** standard operations of a queue, which means only \`push to back\`, \`peek/pop from front\`, \`size\`, and \`is empty\` operations are valid.
- Depending on your language, the queue may not be supported natively. You may simulate a queue using a list or deque (double-ended queue), as long as you use only a queue's standard operations.
`
  },
  
  // --- Non-Linear Data Structures ---
  // Trees
  {
    id: 'trees-invert-binary-tree',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    category: 'Non-Linear Data Structures',
    subCategory: 'Trees',
    description: `Given the \`root\` of a binary tree, invert the tree, and return its root.

**Example 1:**
- **Input:** root = [4,2,7,1,3,6,9]
- **Output:** [4,7,2,9,6,3,1]

**Constraints:**
- The number of nodes in the tree is in the range [0, 100].
- \`-100 <= Node.val <= 100\`
`
  },
  {
    id: 'trees-max-depth',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    category: 'Non-Linear Data Structures',
    subCategory: 'Trees',
    description: `Given the \`root\` of a binary tree, return its maximum depth.

A binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.

**Example 1:**
- **Input:** root = [3,9,20,null,null,15,7]
- **Output:** 3

**Constraints:**
- The number of nodes in the tree is in the range [0, 10^4].
- \`-100 <= Node.val <= 100\`
`
  },
   {
    id: 'trees-level-order-traversal',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    category: 'Non-Linear Data Structures',
    subCategory: 'Trees',
    description: `Given the \`root\` of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).

**Example 1:**
- **Input:** root = [3,9,20,null,null,15,7]
- **Output:** [[3],[9,20],[15,7]]

**Constraints:**
- The number of nodes in the tree is in the range [0, 2000].
- \`-1000 <= Node.val <= 1000\`
`
  },
  // Graphs
  {
    id: 'graphs-number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    category: 'Non-Linear Data Structures',
    subCategory: 'Graphs',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

**Example 1:**
- **Input:** grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
- **Output:** 1

**Example 2:**
- **Input:** grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
- **Output:** 3

**Constraints:**
- \`m == grid.length\`
- \`n == grid[i].length\`
- \`1 <= m, n <= 300\`
- \`grid[i][j]\` is \`'0'\` or \`'1'\`.
`
  },
  // Hashing
   {
    id: 'hashing-contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    category: 'Non-Linear Data Structures',
    subCategory: 'Hashing',
    description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.

**Example 1:**
- **Input:** nums = [1,2,3,1]
- **Output:** true

**Example 2:**
- **Input:** nums = [1,2,3,4]
- **Output:** false

**Constraints:**
- \`1 <= nums.length <= 10^5\`
- \`-10^9 <= nums[i] <= 10^9\`
`
  },
  // --- Algorithms ---
  // Sorting
  {
    id: 'sorting-merge-sorted-array',
    title: 'Merge Sorted Array',
    difficulty: 'Easy',
    category: 'Algorithms',
    subCategory: 'Sorting Algorithms',
    description: `You are given two integer arrays \`nums1\` and \`nums2\`, sorted in **non-decreasing order**, and two integers \`m\` and \`n\`, representing the number of elements in \`nums1\` and \`nums2\` respectively.

**Merge** \`nums1\` and \`nums2\` into a single array sorted in **non-decreasing order**.

The final sorted array should not be returned by the function, but instead be stored inside the array \`nums1\`. To accommodate this, \`nums1\` has a length of \`m + n\`, where the first \`m\` elements denote the elements that should be merged, and the last \`n\` elements are set to \`0\` and should be ignored. \`nums2\` has a length of \`n\`.

**Example 1:**
- **Input:** nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
- **Output:** [1,2,2,3,5,6]
- **Explanation:** The arrays we are merging are [1,2,3] and [2,5,6]. The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.
`
  },
  // Searching
  {
    id: 'searching-binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    category: 'Algorithms',
    subCategory: 'Searching Algorithms',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.

**Example 1:**
- **Input:** nums = [-1,0,3,5,9,12], target = 9
- **Output:** 4
- **Explanation:** 9 exists in nums and its index is 4

**Example 2:**
- **Input:** nums = [-1,0,3,5,9,12], target = 2
- **Output:** -1
- **Explanation:** 2 does not exist in nums so return -1

**Constraints:**
- \`1 <= nums.length <= 10^4\`
- \`-10^4 < nums[i], target < 10^4\`
- All the integers in \`nums\` are **unique**.
- \`nums\` is sorted in ascending order.
`
  },
  // Recursion & Backtracking
  {
    id: 'recursion-subsets',
    title: 'Subsets',
    difficulty: 'Medium',
    category: 'Algorithms',
    subCategory: 'Recursion & Backtracking',
    description: `Given an integer array \`nums\` of **unique** elements, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Return the solution in any order.

**Example 1:**
- **Input:** nums = [1,2,3]
- **Output:** [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]

**Constraints:**
- \`1 <= nums.length <= 10\`
- \`-10 <= nums[i] <= 10\`
- All the numbers of \`nums\` are **unique**.
`
  },
  // Dynamic Programming
  {
    id: 'dp-climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    category: 'Algorithms',
    subCategory: 'Dynamic Programming',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?

**Example 1:**
- **Input:** n = 2
- **Output:** 2
- **Explanation:** There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps

**Example 2:**
- **Input:** n = 3
- **Output:** 3
- **Explanation:** There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step

**Constraints:**
- \`1 <= n <= 45\`
`
  },
  {
    id: 'dp-coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    category: 'Algorithms',
    subCategory: 'Dynamic Programming',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.

**Example 1:**
- **Input:** coins = [1,2,5], amount = 11
- **Output:** 3
- **Explanation:** 11 = 5 + 5 + 1

**Example 2:**
- **Input:** coins = [2], amount = 3
- **Output:** -1

**Constraints:**
- \`1 <= coins.length <= 12\`
- \`1 <= coins[i] <= 2^31 - 1\`
- \`0 <= amount <= 10^4\`
`
  },
  // --- Challenge Problems ---
  // Easy
  {
    id: 'challenge-valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    category: 'Challenge Problems',
    subCategory: 'Challenge Easy',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

**Example 1:**
- **Input:** s = "anagram", t = "nagaram"
- **Output:** true

**Example 2:**
- **Input:** s = "rat", t = "car"
- **Output:** false

**Constraints:**
- \`1 <= s.length, t.length <= 5 * 10^4\`
- \`s\` and \`t\` consist of lowercase English letters.`
  },
  {
    id: 'challenge-is-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    category: 'Challenge Problems',
    subCategory: 'Challenge Easy',
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.

**Example 1:**
- **Input:** s = "A man, a plan, a canal: Panama"
- **Output:** true
- **Explanation:** "amanaplanacanalpanama" is a palindrome.

**Example 2:**
- **Input:** s = "race a car"
- **Output:** false
- **Explanation:** "raceacar" is not a palindrome.

**Constraints:**
- \`1 <= s.length <= 2 * 10^5\`
- \`s\` consists only of printable ASCII characters.`
  },
  {
    id: 'challenge-buy-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Challenge Problems',
    subCategory: 'Challenge Easy',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`ith\` day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.

**Example 1:**
- **Input:** prices = [7,1,5,3,6,4]
- **Output:** 5
- **Explanation:** Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.

**Example 2:**
- **Input:** prices = [7,6,4,3,1]
- **Output:** 0
- **Explanation:** In this case, no transactions are done and the max profit is 0.

**Constraints:**
- \`1 <= prices.length <= 10^5\`
- \`0 <= prices[i] <= 10^4\``
  },
  {
    id: 'challenge-majority-element',
    title: 'Majority Element',
    difficulty: 'Easy',
    category: 'Challenge Problems',
    subCategory: 'Challenge Easy',
    description: `Given an array \`nums\` of size \`n\`, return the majority element.

The majority element is the element that appears more than \`⌊n / 2⌋\` times. You may assume that the majority element always exists in the array.

**Example 1:**
- **Input:** nums = [3,2,3]
- **Output:** 3

**Example 2:**
- **Input:** nums = [2,2,1,1,1,2,2]
- **Output:** 2

**Constraints:**
- \`n == nums.length\`
- \`1 <= n <= 5 * 10^4\`
- \`-10^9 <= nums[i] <= 10^9\``
  },
  {
    id: 'challenge-roman-to-integer',
    title: 'Roman to Integer',
    difficulty: 'Easy',
    category: 'Challenge Problems',
    subCategory: 'Challenge Easy',
    description: `Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.
- I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000

Given a roman numeral, convert it to an integer.

**Example 1:**
- **Input:** s = "III"
- **Output:** 3

**Example 2:**
- **Input:** s = "LVIII"
- **Output:** 58
- **Explanation:** L = 50, V= 5, III = 3.

**Example 3:**
- **Input:** s = "MCMXCIV"
- **Output:** 1994
- **Explanation:** M = 1000, CM = 900, XC = 90 and IV = 4.

**Constraints:**
- \`1 <= s.length <= 15\`
- \`s\` contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').
- It is guaranteed that s is a valid roman numeral in the range [1, 3999].`
  },
  {
    id: 'challenge-single-number',
    title: 'Single Number',
    difficulty: 'Easy',
    category: 'Challenge Problems',
    subCategory: 'Challenge Easy',
    description: `Given a **non-empty** array of integers \`nums\`, every element appears *twice* except for one. Find that single one.

You must implement a solution with a linear runtime complexity and use only constant extra space.

**Example 1:**
- **Input:** nums = [2,2,1]
- **Output:** 1

**Example 2:**
- **Input:** nums = [4,1,2,1,2]
- **Output:** 4

**Constraints:**
- \`1 <= nums.length <= 3 * 10^4\`
- \`-3 * 10^4 <= nums[i] <= 3 * 10^4\`
- Each element in the array appears twice except for one element which appears only once.`
  },
  {
    id: 'challenge-fizzbuzz',
    title: 'Fizz Buzz',
    difficulty: 'Easy',
    category: 'Challenge Problems',
    subCategory: 'Challenge Easy',
    description: `Given an integer \`n\`, return a string array \`answer\` (1-indexed) where:
- \`answer[i] == "FizzBuzz"\` if \`i\` is divisible by 3 and 5.
- \`answer[i] == "Fizz"\` if \`i\` is divisible by 3.
- \`answer[i] == "Buzz"\` if \`i\` is divisible by 5.
- \`answer[i] == i\` (as a string) if none of the above conditions are true.

**Example 1:**
- **Input:** n = 3
- **Output:** ["1","2","Fizz"]

**Example 2:**
- **Input:** n = 5
- **Output:** ["1","2","Fizz","4","Buzz"]

**Constraints:**
- \`1 <= n <= 10^4\``
  },
  // Medium
  {
    id: 'challenge-product-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    category: 'Challenge Problems',
    subCategory: 'Challenge Medium',
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

The product of any prefix or suffix of \`nums\` is **guaranteed** to fit in a **32-bit** integer.

You must write an algorithm that runs in \`O(n)\` time and without using the division operation.

**Example 1:**
- **Input:** nums = [1,2,3,4]
- **Output:** [24,12,8,6]

**Example 2:**
- **Input:** nums = [-1,1,0,-3,3]
- **Output:** [0,0,9,0,0]

**Constraints:**
- \`2 <= nums.length <= 10^5\`
- \`-30 <= nums[i] <= 30\`
- The product of any prefix or suffix of \`nums\` is **guaranteed** to fit in a **32-bit** integer.`
  },
  {
    id: 'challenge-group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    category: 'Challenge Problems',
    subCategory: 'Challenge Medium',
    description: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in **any order**.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

**Example 1:**
- **Input:** strs = ["eat","tea","tan","ate","nat","bat"]
- **Output:** [["bat"],["nat","tan"],["ate","eat","tea"]]

**Constraints:**
- \`1 <= strs.length <= 10^4\`
- \`0 <= strs[i].length <= 100\`
- \`strs[i]\` consists of lowercase English letters.`
  },
  {
    id: 'challenge-top-k-frequent',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    category: 'Challenge Problems',
    subCategory: 'Challenge Medium',
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in **any order**.

**Example 1:**
- **Input:** nums = [1,1,1,2,2,3], k = 2
- **Output:** [1,2]

**Example 2:**
- **Input:** nums = [1], k = 1
- **Output:** [1]

**Constraints:**
- \`1 <= nums.length <= 10^5\`
- \`k\` is in the range [1, the number of unique elements in the array].
- It is **guaranteed** that the answer is unique.`
  },
  {
    id: 'challenge-longest-consecutive',
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    category: 'Challenge Problems',
    subCategory: 'Challenge Medium',
    description: `Given an unsorted array of integers \`nums\`, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in \`O(n)\` time.

**Example 1:**
- **Input:** nums = [100,4,200,1,3,2]
- **Output:** 4
- **Explanation:** The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.

**Example 2:**
- **Input:** nums = [0,3,7,2,5,8,4,6,0,1]
- **Output:** 9

**Constraints:**
- \`0 <= nums.length <= 10^5\`
- \`-10^9 <= nums[i] <= 10^9\``
  },
  {
    id: 'challenge-3sum',
    title: '3Sum',
    difficulty: 'Medium',
    category: 'Challenge Problems',
    subCategory: 'Challenge Medium',
    description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.

**Example 1:**
- **Input:** nums = [-1,0,1,2,-1,-4]
- **Output:** [[-1,-1,2],[-1,0,1]]

**Constraints:**
- \`0 <= nums.length <= 3000\`
- \`-10^5 <= nums[i] <= 10^5\``
  },
  {
    id: 'challenge-container-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    category: 'Challenge Problems',
    subCategory: 'Challenge Medium',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`ith\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

**Example 1:**
- **Input:** height = [1,8,6,2,5,4,8,3,7]
- **Output:** 49

**Constraints:**
- \`n == height.length\`
- \`2 <= n <= 10^5\`
- \`0 <= height[i] <= 10^4\``
  },
  {
    id: 'challenge-validate-bst',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    category: 'Challenge Problems',
    subCategory: 'Challenge Medium',
    description: `Given the \`root\` of a binary tree, determine if it is a valid binary search tree (BST).

A **valid BST** is defined as follows:
- The left subtree of a node contains only nodes with keys **less than** the node's key.
- The right subtree of a node contains only nodes with keys **greater than** the node's key.
- Both the left and right subtrees must also be binary search trees.

**Example 1:**
- **Input:** root = [2,1,3]
- **Output:** true

**Example 2:**
- **Input:** root = [5,1,4,null,null,3,6]
- **Output:** false

**Constraints:**
- The number of nodes in the tree is in the range [1, 10^4].
- \`-2^31 <= Node.val <= 2^31 - 1\``
  },
  // Hard
  {
    id: 'challenge-longest-valid-parentheses',
    title: 'Longest Valid Parentheses',
    difficulty: 'Hard',
    category: 'Challenge Problems',
    subCategory: 'Challenge Hard',
    description: `Given a string containing just the characters \`'('\` and \`')'\`, find the length of the longest valid (well-formed) parentheses substring.

**Example 1:**
- **Input:** s = "(()"
- **Output:** 2
- **Explanation:** The longest valid parentheses substring is "()".

**Example 2:**
- **Input:** s = ")()())"
- **Output:** 4
- **Explanation:** The longest valid parentheses substring is "()()".

**Example 3:**
- **Input:** s = ""
- **Output:** 0

**Constraints:**
- \`0 <= s.length <= 3 * 10^4\`
- \`s[i]\` is \`'('\` or \`')'\`.`
  },
  {
    id: 'challenge-trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    category: 'Challenge Problems',
    subCategory: 'Challenge Hard',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

**Example 1:**
- **Input:** height = [0,1,0,2,1,0,1,3,2,1,2,1]
- **Output:** 6

**Constraints:**
- \`n == height.length\`
- \`1 <= n <= 2 * 10^4\`
- \`0 <= height[i] <= 10^5\``
  },
  {
    id: 'challenge-median-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    category: 'Challenge Problems',
    subCategory: 'Challenge Hard',
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays.

The overall run time complexity should be \`O(log (m+n))\`.

**Example 1:**
- **Input:** nums1 = [1,3], nums2 = [2]
- **Output:** 2.00000

**Example 2:**
- **Input:** nums1 = [1,2], nums2 = [3,4]
- **Output:** 2.50000

**Constraints:**
- \`nums1.length == m\`
- \`nums2.length == n\`
- \`0 <= m <= 1000\`
- \`0 <= n <= 1000\`
- \`1 <= m + n <= 2000\`
- \`-10^6 <= nums1[i], nums2[i] <= 10^6\``
  },
  {
    id: 'challenge-merge-k-lists',
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    category: 'Challenge Problems',
    subCategory: 'Challenge Hard',
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

**Example 1:**
- **Input:** lists = [[1,4,5],[1,3,4],[2,6]]
- **Output:** [1,1,2,3,4,4,5,6]

**Constraints:**
- \`k == lists.length\`
- \`0 <= k <= 10^4\`
- \`0 <= lists[i].length <= 500\`
- \`-10^4 <= lists[i][j] <= 10^4\`
- \`lists[i]\` is sorted in ascending order.`
  },
  {
    id: 'challenge-word-break-ii',
    title: 'Word Break II',
    difficulty: 'Hard',
    category: 'Challenge Problems',
    subCategory: 'Challenge Hard',
    description: `Given a string \`s\` and a dictionary of strings \`wordDict\`, add spaces in \`s\` to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in any order.

**Example 1:**
- **Input:** s = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]
- **Output:** ["cats and dog", "cat sand dog"]

**Constraints:**
- \`1 <= s.length <= 20\`
- \`1 <= wordDict.length <= 1000\`
- \`1 <= wordDict[i].length <= 10\`
- \`s\` and \`wordDict[i]\` consist of only lowercase English letters.`
  },
  {
    id: 'challenge-largest-rectangle-histogram',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    category: 'Challenge Problems',
    subCategory: 'Challenge Hard',
    description: `Given an array of integers \`heights\` representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.

**Example 1:**
- **Input:** heights = [2,1,5,6,2,3]
- **Output:** 10
- **Explanation:** The largest rectangle is shown in the red area, which has an area = 10 units.

**Constraints:**
- \`1 <= heights.length <= 10^5\`
- \`0 <= heights[i] <= 10^4\``
  },
  {
    id: 'challenge-sliding-window-max',
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    category: 'Challenge Problems',
    subCategory: 'Challenge Hard',
    description: `You are given an array of integers \`nums\`, there is a sliding window of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.

**Example 1:**
- **Input:** nums = [1,3,-1,-3,5,3,6,7], k = 3
- **Output:** [3,3,5,5,6,7]

**Constraints:**
- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\`
- \`1 <= k <= nums.length\``
  },
];
