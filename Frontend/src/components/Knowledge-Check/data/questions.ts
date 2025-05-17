export const questions = {
    easy: [
        {
            question: "What is the index of the first element in an array?",
            options: ["0", "1", "-1", "Depends on the array"],
            correct: 0,
            explanation: "In most programming languages, the index of the first element in an array is 0."
        },
        {
            question: "What is the time complexity of accessing an element in an array by its index?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correct: 0,
            explanation: "Accessing an element in an array by its index is a constant-time operation, O(1)."
        },
        {
            question: "Which of the following is a disadvantage of arrays?",
            options: ["Fast access by index", "Fixed size", "Stores elements of the same type", "Efficient memory usage"],
            correct: 1,
            explanation: "Arrays have a fixed size, which means they cannot dynamically grow or shrink."
        },
        {
            question: "What is the default value of an uninitialized element in a numeric array in most programming languages?",
            options: ["0", "1", "null", "undefined"],
            correct: 0,
            explanation: "In most programming languages, uninitialized elements in a numeric array default to 0."
        },
        {
            question: "What is the time complexity of inserting an element at the end of a dynamic array (assuming no resizing is needed)?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correct: 0,
            explanation: "Inserting an element at the end of a dynamic array is O(1) if no resizing is required."
        },
        {
            question: "What is the time complexity of searching for an element in an unsorted array?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correct: 2,
            explanation: "Searching for an element in an unsorted array requires checking each element, which is O(n)."
        },
        {
            question: "What is the maximum number of elements an array can hold?",
            options: ["100", "1000", "Depends on the programming language and system memory", "Unlimited"],
            correct: 2,
            explanation: "The maximum number of elements an array can hold depends on the programming language and the available system memory."
        },
        {
            question: "What is the result of accessing an out-of-bounds index in an array?",
            options: ["Returns null", "Returns undefined", "Throws an error", "Returns the last element"],
            correct: 2,
            explanation: "Accessing an out-of-bounds index typically results in an error or exception in most programming languages."
        },
        {
            question: "Which of the following is true about multidimensional arrays?",
            options: ["They are arrays of arrays", "They can only have two dimensions", "They are faster than single-dimensional arrays", "They cannot store primitive data types"],
            correct: 0,
            explanation: "Multidimensional arrays are essentially arrays of arrays, allowing for more complex data structures."
        },
        {
            question: "What is the time complexity of deleting an element from the middle of an array?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correct: 2,
            explanation: "Deleting an element from the middle of an array requires shifting all subsequent elements, which is O(n)."
        }
    ],
    medium: [
        {
            question: "What is the time complexity of resizing a dynamic array?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correct: 2,
            explanation: "Resizing a dynamic array involves copying all elements to a new array, which is O(n)."
        },
        {
            question: "What is the space complexity of storing an array of size n?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correct: 2,
            explanation: "The space complexity of an array is O(n), as it requires memory proportional to the number of elements."
        },
        {
            question: "Which of the following is a common operation performed on arrays?",
            options: ["Sorting", "Hashing", "Graph traversal", "Tree balancing"],
            correct: 0,
            explanation: "Sorting is a common operation performed on arrays to arrange elements in a specific order."
        },
        {
            question: "What is the time complexity of finding the maximum element in an unsorted array?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correct: 2,
            explanation: "Finding the maximum element in an unsorted array requires checking each element, which is O(n)."
        },
        {
            question: "What is the result of concatenating two arrays of sizes m and n?",
            options: ["An array of size m + n", "An array of size m * n", "An array of size max(m, n)", "An error"],
            correct: 0,
            explanation: "Concatenating two arrays results in a new array of size m + n, containing all elements from both arrays."
        },
        {
            question: "What is the time complexity of reversing an array?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correct: 2,
            explanation: "Reversing an array requires swapping elements, which takes O(n) time."
        },
        {
            question: "What is the advantage of using a dynamic array over a static array?",
            options: ["Faster access time", "Fixed size", "Ability to resize", "Lower memory usage"],
            correct: 2,
            explanation: "Dynamic arrays can resize themselves, unlike static arrays, which have a fixed size."
        },
        {
            question: "What is the time complexity of inserting an element at the beginning of an array?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correct: 2,
            explanation: "Inserting an element at the beginning of an array requires shifting all elements, which is O(n)."
        },
        {
            question: "What is the time complexity of binary search on a sorted array?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correct: 1,
            explanation: "Binary search on a sorted array has a time complexity of O(log n)."
        },
        {
            question: "What is the time complexity of merging two sorted arrays into a single sorted array?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correct: 2,
            explanation: "Merging two sorted arrays into a single sorted array takes O(n) time, where n is the total number of elements."
        }
    ],
    hard: [
        {
            question: "What is the time complexity of finding the median of an unsorted array using the Quickselect algorithm?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correct: 2,
            explanation: "The Quickselect algorithm finds the median in O(n) time on average."
        },
        {
            question: "What is the time complexity of rotating an array by k positions?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correct: 2,
            explanation: "Rotating an array by k positions requires shifting elements, which takes O(n) time."
        },
        {
            question: "What is the time complexity of finding all pairs of elements in an array that sum to a specific value?",
            options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
            correct: 3,
            explanation: "Finding all pairs of elements that sum to a specific value typically requires checking all possible pairs, which is O(n²)."
        },
        {
            question: "What is the time complexity of finding the longest increasing subsequence in an array?",
            options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
            correct: 3,
            explanation: "Finding the longest increasing subsequence in an array has a time complexity of O(n²) using dynamic programming."
        },
        {
            question: "What is the time complexity of finding the kth smallest element in an unsorted array using sorting?",
            options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
            correct: 2,
            explanation: "Sorting the array and then finding the kth smallest element takes O(n log n) time."
        },
        {
            question: "What is the time complexity of finding duplicates in an unsorted array using a hash set?",
            options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
            correct: 1,
            explanation: "Using a hash set to find duplicates in an unsorted array takes O(n) time."
        },
        {
            question: "What is the time complexity of finding the maximum subarray sum using Kadane's algorithm?",
            options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
            correct: 1,
            explanation: "Kadane's algorithm finds the maximum subarray sum in O(n) time."
        },
        {
            question: "What is the time complexity of finding the intersection of two sorted arrays?",
            options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
            correct: 1,
            explanation: "Finding the intersection of two sorted arrays takes O(n) time using a two-pointer approach."
        },
        {
            question: "What is the time complexity of finding the majority element in an array using Boyer-Moore Voting Algorithm?",
            options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
            correct: 1,
            explanation: "The Boyer-Moore Voting Algorithm finds the majority element in O(n) time."
        },
        {
            question: "What is the time complexity of finding the smallest missing positive integer in an unsorted array?",
            options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
            correct: 1,
            explanation: "Finding the smallest missing positive integer in an unsorted array can be done in O(n) time using a hash-based approach."
        }
    ]
  };
  
  // Function to fetch quiz data from the API
  const fetchQuizData = async (videoId: string) => {
    try {
      const response = await fetch('http://localhost:3000/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch quiz data');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      return null;
    }
  };
  
  // Function to get questions based on video ID or fallback
  export const getQuestions = async () => {
    const videoId = localStorage.getItem('currentVideoId');
    
    if (videoId) {
      const quizData = await fetchQuizData(videoId);
      if (quizData) {
        return quizData;
      }
    }
    
    return questions;
  };