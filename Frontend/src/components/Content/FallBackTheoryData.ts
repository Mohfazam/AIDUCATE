import type { TheoryContent } from './theory';

export const fallbackTheoryData: TheoryContent = {
  title: "Introduction to Arrays and Data Structures",
  duration: "01:30:00",
  sections: [
    {
      time: "00:00",
      content: "Understanding Arrays: The Foundation of Data Structures",
      theory: {
        details: "Arrays are fundamental data structures that store elements in contiguous memory locations. They provide constant-time access to elements using indices and form the basis for many complex data structures. This section covers array creation, indexing, and basic operations in various programming languages.",
        badge: "📚 Array Fundamentals",
        points: 30,
        tips: [
          "Always validate array indices before access to prevent out-of-bounds errors",
          "Consider using array methods like map, filter, and reduce for cleaner code",
          "Remember that array indices start at 0 in most programming languages"
        ]
      }
    },
    {
      time: "15:00",
      content: "Array Operations and Time Complexity",
      theory: {
        details: "Understanding the time complexity of array operations is crucial for writing efficient code. This section explores common operations like insertion, deletion, and searching, along with their Big O notation analysis. We'll also discuss how array size affects performance.",
        badge: "⚡ Performance Master",
        points: 35,
        tips: [
          "Use push() for adding elements to the end (O(1)) instead of unshift() for the beginning (O(n))",
          "Binary search requires a sorted array but provides O(log n) search time",
          "Consider the trade-offs between array operations when choosing algorithms"
        ]
      }
    },
    {
      time: "30:00",
      content: "Multi-dimensional Arrays and Matrix Operations",
      theory: {
        details: "Multi-dimensional arrays are essential for representing grids, matrices, and complex data structures. This section covers creating and manipulating 2D arrays, common matrix operations, and practical applications in game development and image processing.",
        badge: "🎮 Matrix Expert",
        points: 40,
        tips: [
          "Use nested loops efficiently when working with 2D arrays",
          "Consider using flat arrays with calculated indices for better performance",
          "Remember that matrix operations often have O(n²) or O(n³) complexity"
        ]
      }
    },
    {
      time: "45:00",
      content: "Dynamic Arrays and Array Lists",
      theory: {
        details: "Dynamic arrays overcome the limitations of fixed-size arrays by automatically resizing when needed. This section explains how dynamic arrays work under the hood, including growth strategies and performance implications.",
        badge: "🚀 Dynamic Arrays Pro",
        points: 35,
        tips: [
          "Understand the amortized time complexity of dynamic array operations",
          "Pre-allocate array size when the final size is known",
          "Consider using linked lists when frequent insertions/deletions are needed"
        ]
      }
    },
    {
      time: "1:00:00",
      content: "Array Algorithms and Problem Solving",
      theory: {
        details: "This section focuses on common array algorithms and problem-solving techniques. Topics include sorting algorithms, searching techniques, and popular array manipulation problems often encountered in technical interviews.",
        badge: "🧩 Algorithm Master",
        points: 45,
        tips: [
          "Master the two-pointer technique for array problems",
          "Learn to recognize patterns in array manipulation questions",
          "Practice implementing sorting algorithms from scratch"
        ]
      }
    },
    {
      time: "1:15:00",
      content: "Memory Management and Best Practices",
      theory: {
        details: "Understanding memory management is crucial when working with arrays. This section covers memory allocation, garbage collection, and best practices for efficient array usage in different programming environments.",
        badge: "💾 Memory Expert",
        points: 30,
        tips: [
          "Release array references when no longer needed to aid garbage collection",
          "Use appropriate array methods to avoid memory leaks",
          "Consider using TypedArrays for better memory efficiency with numeric data"
        ]
      }
    }
  ],
  keyTopics: [
    "Array Basics",
    "Time Complexity",
    "Matrix Operations",
    "Dynamic Arrays",
    "Sorting Algorithms",
    "Searching Techniques",
    "Memory Management",
    "Problem Solving",
    "Data Structures",
    "Algorithm Analysis"
  ]
};