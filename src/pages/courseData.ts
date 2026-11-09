export type Lesson = {
  id: string;
  title: string;
  duration: string;
  explanation: string;
  example: string;
  exampleExplanation: string;
  task: string;
};

export type Course = {
  id: string;
  title: string;
  language: string;
  description: string;
  level: string;
  lessons: Lesson[];
};

export const courseData: Course[] = [
  // =====================================================
  // PYTHON FUNDAMENTALS — 30 LESSONS
  // =====================================================

  {
    id: "python",
    title: "Python Fundamentals",
    language: "PYTHON",
    description:
      "Learn Python from the basics to practical programming through examples, real-world applications, and hands-on challenges.",
    level: "Beginner",
    lessons: [
      {
        id: "python-1",
        title: "Introduction to Python",
        duration: "10 min",
        explanation:
          "Python is a high-level programming language known for its readable syntax. It is used in web development, automation, data analysis, artificial intelligence, and many other fields.\n\nA Python program is a collection of instructions that the computer executes. These instructions normally run from top to bottom. The print() function displays information in the output area.\n\nPython is beginner-friendly because its syntax is simple and does not require complicated symbols for basic operations. You can start by writing small instructions and gradually combine them to build useful applications.",
        example:
          'print("Welcome to the science lab")\nprint("Experiment number:", 5)\nprint("Result:", "Successful")',
        exampleExplanation:
          '1. The first print() statement displays the message Welcome to the science lab.\n2. The second print() statement displays a label followed by the number 5.\n3. The third print() statement displays the result label and the word Successful.\n4. Commas inside print() separate multiple values with spaces by default.\n5. Each print() statement produces a new line.',
        task:
          'Write a Python program that prints the message "Hello, CodeMentor!".\nExpected output:\nHello, CodeMentor!',
      },
      {
        id: "python-2",
        title: "Variables and Data Types",
        duration: "15 min",
        explanation:
          "Variables are named references used to store information in a program. A variable can hold different kinds of values depending on the data type.\n\nPython commonly uses int for whole numbers, float for decimal values, str for text, and bool for True or False values. These types help Python understand how a value should be processed.\n\nVariable names should describe the information they contain. Python is case-sensitive, so total and Total are treated as two different variables. You can use type() to identify the type of a stored value.",
        example:
          'employee = "Rohan"\nworking_days = 22\nsalary = 18500.75\nis_active = True\n\nprint(employee)\nprint(working_days)\nprint(salary)\nprint(type(is_active).__name__)',
        exampleExplanation:
          '1. employee stores the text Rohan, so its data type is str.\n2. working_days stores 22, which is an integer.\n3. salary stores 18500.75, which is a floating-point number.\n4. is_active stores True, which is a Boolean value.\n5. The first three print() statements display the stored values.\n6. type(is_active) identifies the type of the Boolean variable.\n7. __name__ retrieves the type name, so the final statement prints bool.',
        task:
          'Create a variable named product with the value "Notebook" and a variable named price with the value 50. Print both values on separate lines.\nExpected output:\nNotebook\n50',
      },
      {
        id: "python-3",
        title: "Input and Output",
        duration: "15 min",
        explanation:
          "Input and output allow a program to communicate with its user. The input() function receives information, while print() displays information on the screen.\n\nThe input() function returns the entered value as a string. If you need to perform mathematical calculations, convert numeric input using int() or float().\n\nFor example, a travel application can ask for a destination and the number of passengers. It can then use the entered information to calculate or display booking details. Always remember that input() waits for the user or test system to provide data.",
        example:
          'destination = input("Enter destination: ")\npassengers = int(input("Number of passengers: "))\nprint("Travel destination:", destination)\nprint("Total passengers:", passengers)',
        exampleExplanation:
          '1. The first input() asks the user to enter a destination.\n2. The entered destination is stored in the destination variable as a string.\n3. The second input() receives the passenger count.\n4. int() converts the entered passenger count from a string into an integer.\n5. The third statement displays the selected destination.\n6. The final statement displays the number of passengers as an integer.',
        task:
          'Write a program that reads a product name and quantity, then prints them using the labels "Product:" and "Quantity:". For this example, use input values Notebook and 3.\nExpected output:\nProduct: Notebook\nQuantity: 3',
      },
      {
        id: "python-4",
        title: "Conditions",
        duration: "20 min",
        explanation:
          "Conditional statements allow programs to choose which instructions to execute. The if statement checks a condition, elif checks another condition when earlier conditions are false, and else handles all remaining cases.\n\nConditions are created using comparison operators such as ==, !=, >, <, >=, and <=. The result of a comparison is either True or False.\n\nIndentation is important in Python because it identifies the statements belonging to each conditional block. Conditions are useful in applications such as ticket pricing, attendance systems, and eligibility checks.",
        example:
          'battery = 18\n\nif battery >= 80:\n    print("Battery is full")\nelif battery >= 30:\n    print("Battery is sufficient")\nelse:\n    print("Battery is low")',
        exampleExplanation:
          '1. battery = 18 stores the battery percentage in a variable.\n2. The if statement checks whether the battery is at least 80 percent.\n3. Since 18 is less than 80, Python skips the first block.\n4. The elif statement checks whether the battery is at least 30 percent.\n5. This condition is also False because 18 is less than 30.\n6. Python executes the else block and displays Battery is low.',
        task:
          'Set number = 7. Use an if statement to print "Positive" if the number is greater than zero; otherwise print "Not positive".\nExpected output:\nPositive',
      },
      {
        id: "python-5",
        title: "Loops",
        duration: "20 min",
        explanation:
          "Loops allow a program to execute the same block of instructions multiple times. They reduce repeated code and are useful when working with collections, calculations, and repeated activities.\n\nA for loop is commonly used to process items in a sequence or a range. A while loop continues executing as long as its condition remains True.\n\nThe range() function generates a sequence of integers. It can accept a starting value, a stopping value, and an optional step value. The stopping value is not included in the generated sequence. Make sure a while loop eventually reaches a condition that becomes False.",
        example:
          'for month in range(2, 13, 2):\n    print("Month:", month)',
        exampleExplanation:
          '1. The for loop repeats its instructions for every value generated by range().\n2. range(2, 13, 2) starts at 2 and increases by 2 each time.\n3. The stopping value 13 is excluded.\n4. The generated values are 2, 4, 6, 8, 10, and 12.\n5. During each iteration, the current value is stored in month.\n6. print() displays the label Month followed by the current value.',
        task:
          "Write a for loop that prints the numbers from 1 through 10, with each number on a new line.\nExpected output:\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
      },
      {
        id: "python-6",
        title: "Operators",
        duration: "15 min",
        explanation:
          "Operators are symbols or keywords that perform operations on values and variables. Arithmetic operators perform mathematical calculations, comparison operators compare values, and logical operators combine conditions.\n\nImportant arithmetic operators include + for addition, - for subtraction, * for multiplication, / for division, // for floor division, % for remainder, and ** for exponentiation.\n\nLogical operators include and, or, and not. They are useful when a decision depends on more than one condition. Parentheses can make complex expressions easier to understand and help control the order of calculations.",
        example:
          "distance = 48\nhours = 6\nprint(distance + hours)\nprint(distance - hours)\nprint(distance * hours)\nprint(distance // hours)\nprint(distance % 5)",
        exampleExplanation:
          "1. distance stores the integer 48.\n2. hours stores the integer 6.\n3. distance + hours adds both values and displays 54.\n4. distance - hours subtracts 6 from 48 and displays 42.\n5. distance * hours multiplies the values and displays 288.\n6. distance // hours performs floor division and displays 8.\n7. distance % 5 calculates the remainder after division and displays 3.",
        task:
          "Set a = 17 and b = 5. Print their sum, product, integer division result, and remainder, each on a new line.\nExpected output:\n22\n85\n3\n2",
      },
      {
        id: "python-7",
        title: "Strings",
        duration: "20 min",
        explanation:
          "A string is a sequence of characters used to represent text. Strings can contain letters, numbers, spaces, and special characters. They are created using single, double, or triple quotation marks.\n\nPython provides several string operations. upper() converts text to uppercase, lower() converts it to lowercase, strip() removes surrounding whitespace, and replace() substitutes one piece of text with another.\n\nString indexing starts at zero. Slicing extracts a portion of a string using a starting and ending index. The ending index is excluded. Strings are immutable, which means their original characters cannot be modified directly.",
        example:
          'course = "data science"\nprint(course.capitalize())\nprint(course.upper())\nprint(course.count("a"))\nprint(course.startswith("data"))\nprint(course[5:12])',
        exampleExplanation:
          '1. course stores the text data science.\n2. capitalize() makes the first character uppercase and the remaining characters lowercase.\n3. upper() converts every character to uppercase.\n4. count("a") counts how many times the letter a appears.\n5. startswith("data") checks whether the string begins with data and returns True.\n6. course[5:12] extracts characters starting at index 5 and stopping before index 12.\n7. Each print() statement displays the result of one string operation.',
        task:
          'Create a variable containing the string "python" and print it in uppercase.\nExpected output:\nPYTHON',
      },
      {
        id: "python-8",
        title: "Lists",
        duration: "25 min",
        explanation:
          "A list is an ordered collection that can store multiple values in one variable. Lists can contain different data types and can be modified after they are created.\n\nYou can access list elements using indexes, where the first element has index zero. The append() method adds an item, insert() places an item at a particular position, and pop() removes an item.\n\nThe len() function returns the number of elements in a list. Lists are useful for storing records such as attendance entries, shopping items, and daily activities. A loop can process every element without manually accessing each position.",
        example:
          'scores = [72, 85, 91]\nscores.insert(1, 80)\nscores.pop()\nprint("Updated scores:", scores)\nprint("First score:", scores[0])\nprint("Number of scores:", len(scores))',
        exampleExplanation:
          '1. scores creates a list containing three integer values.\n2. insert(1, 80) adds 80 at index 1, shifting the existing elements to the right.\n3. pop() removes the final element from the updated list.\n4. The first print() statement displays the remaining list.\n5. scores[0] accesses the first element of the list.\n6. len(scores) returns the number of elements currently stored in the list.',
        task:
          `Create a list containing "Python", "C++", and "JavaScript". Append "Java" and print the final list.\nExpected output:\n['Python', 'C++', 'JavaScript', 'Java']`,
      },
      {
        id: "python-9",
        title: "Tuples and Sets",
        duration: "20 min",
        explanation:
          "Tuples and sets are collection types that store multiple values. A tuple is ordered and immutable, meaning its elements cannot be changed after creation. A set stores unique elements and automatically removes duplicates.\n\nTuples are useful for fixed information such as geographical coordinates or RGB color values. Sets are useful when you need to maintain unique entries, such as distinct registration numbers.\n\nTuple elements can be accessed using indexes. Sets do not support positional indexing. Use sorted() when you need to display set elements in a predictable order.",
        example:
          'rgb = (120, 200, 75)\nsubjects = {"Maths", "Physics", "Maths", "Chemistry"}\nprint("Green component:", rgb[1])\nprint("Subjects:", sorted(subjects))\nprint("Unique subject count:", len(subjects))',
        exampleExplanation:
          '1. rgb creates a tuple containing three color component values.\n2. subjects creates a set containing subject names.\n3. The duplicate Maths entry is stored only once because sets contain unique elements.\n4. rgb[1] retrieves the second tuple element, which is 200.\n5. sorted(subjects) returns the unique subject names in alphabetical order.\n6. len(subjects) returns the number of unique subjects.',
        task:
          "Create a set from [1, 2, 2, 3, 3, 4]. Print the unique values in sorted order.\nExpected output:\n[1, 2, 3, 4]",
      },
      {
        id: "python-10",
        title: "Dictionaries",
        duration: "25 min",
        explanation:
          "A dictionary is a collection that stores information as key-value pairs. Each key is used to retrieve its corresponding value. Dictionaries are mutable, so you can add, update, or remove entries after creation.\n\nA dictionary can represent information about a vehicle, employee, or order. For example, a vehicle record might contain its brand, model, year, and fuel type.\n\nUse square brackets to access a value when the key is known. The get() method is useful when a key might not exist because it can return a default value instead of raising a KeyError.",
        example:
          'vehicle = {\n    "brand": "Tata",\n    "model": "Nexon",\n    "year": 2024\n}\nvehicle["fuel"] = "Electric"\nprint(vehicle["brand"])\nprint(vehicle.get("fuel"))\nprint(vehicle.keys())',
        exampleExplanation:
          '1. vehicle creates a dictionary with brand, model, and year keys.\n2. Each key stores a corresponding value.\n3. vehicle["fuel"] adds a new key named fuel with the value Electric.\n4. vehicle["brand"] retrieves the brand value.\n5. get("fuel") retrieves the fuel value from the dictionary.\n6. keys() returns a view containing all dictionary keys.',
        task:
          'Create a dictionary with the keys "name" and "language", using "Alex" and "Python" as their values. Print the value stored under "language".\nExpected output:\nPython',
      },
      {
        id: "python-11",
        title: "Nested Collections",
        duration: "20 min",
        explanation:
          "Nested collections are data structures that contain other collections. A list can contain dictionaries, a dictionary can contain lists, and collections can be combined to represent more complex information.\n\nFor example, a library application can store several book records in a list. Each book can be represented by a dictionary containing its title, author, and availability.\n\nTo access nested information, combine indexes and keys in the correct order. First identify the outer collection element, then access the required value inside it. Clear variable names and consistent indentation make nested structures easier to understand.",
        example:
          'library = [\n    {"title": "The Alchemist", "copies": 4},\n    {"title": "Wings of Fire", "copies": 2},\n    {"title": "Atomic Habits", "copies": 5}\n]\nprint(library[1]["title"])\nprint(library[2]["copies"])\nprint(library[0]["copies"] + library[1]["copies"])',
        exampleExplanation:
          '1. library creates a list containing three dictionaries.\n2. Each dictionary represents a book and stores its title and number of copies.\n3. library[1] accesses the second dictionary in the list.\n4. library[1]["title"] retrieves the title Wings of Fire.\n5. library[2]["copies"] retrieves the number of copies of the third book.\n6. The final statement adds the copy counts from the first and second dictionaries.\n7. Combining indexes and dictionary keys allows you to access nested information.',
        task:
          'Create a list containing two dictionaries with a "name" key. Print the name stored in the first dictionary.\nExpected output:\nStudent A',
      },
      {
        id: "python-12",
        title: "Functions",
        duration: "25 min",
        explanation:
          "A function is a reusable block of code designed to perform a particular operation. Functions are created using the def keyword and executed when they are called.\n\nFunctions help divide a large program into smaller, understandable parts. For example, a billing application can have separate functions for calculating tax, applying discounts, and displaying the final bill.\n\nA function can contain parameters, perform operations, and return a result. Use meaningful function names so that the purpose of each function is clear. Reusing functions reduces repeated code and makes programs easier to maintain.",
        example:
          'def calculate_area():\n    length = 8\n    width = 5\n    area = length * width\n    print("Area:", area)\n\ncalculate_area()',
        exampleExplanation:
          '1. def calculate_area(): defines a function named calculate_area.\n2. The indented statements form the body of the function.\n3. length and width store the dimensions of a rectangle.\n4. Multiplying length by width calculates the rectangle area.\n5. print() displays the calculated area.\n6. calculate_area() calls the function and executes its instructions.',
        task:
          'Define a function named square that accepts a number and returns its square. Print the result of square(4).\nExpected output:\n16',
      },
      {
        id: "python-13",
        title: "Parameters and Return Values",
        duration: "25 min",
        explanation:
          "Parameters allow functions to receive information from the code that calls them. Arguments are the actual values supplied when a function is called.\n\nThe return statement sends a result back to the caller. This allows the returned value to be stored in a variable, displayed, or used in another calculation.\n\nFunctions can accept multiple parameters and return different kinds of values. A well-designed function should have a clear purpose and return a useful result when the calling code needs one.",
        example:
          'def calculate_total(price, quantity, delivery):\n    subtotal = price * quantity\n    return subtotal + delivery\n\nbill = calculate_total(250, 3, 40)\nprint("Final bill:", bill)',
        exampleExplanation:
          '1. calculate_total() defines a function with three parameters.\n2. price represents the cost of one item.\n3. quantity represents the number of items purchased.\n4. delivery represents the delivery charge.\n5. subtotal calculates price multiplied by quantity.\n6. return sends the subtotal plus delivery charge back to the caller.\n7. The function call stores the returned result in bill.\n8. print() displays the final bill.',
        task:
          'Create a function named multiply that accepts two numbers and returns their product. Print multiply(4, 6).\nExpected output:\n24',
      },
      {
        id: "python-14",
        title: "Scope and Lambda Functions",
        duration: "20 min",
        explanation:
          "Scope determines where a variable can be accessed in a program. A local variable is created inside a function and is normally available only within that function. A global variable is defined outside functions and can be accessed throughout the module.\n\nA lambda function is a small anonymous function written using the lambda keyword. It can accept multiple arguments but contains only one expression. The expression result is returned automatically.\n\nLambda functions are often used for short operations, especially when passing a function to another function such as sorted() or map(). Use a regular def function when the logic needs multiple statements or detailed documentation.",
        example:
          'tax_rate = 0.18\n\ndef add_tax(amount):\n    tax = amount * tax_rate\n    return amount + tax\n\nconvert_to_minutes = lambda hours: hours * 60\nprint(add_tax(500))\nprint(convert_to_minutes(2))',
        exampleExplanation:
          '1. tax_rate is a global variable because it is declared outside the function.\n2. add_tax() receives an amount parameter.\n3. The tax variable is local to add_tax() because it is created inside the function.\n4. The function calculates tax and returns the amount including tax.\n5. convert_to_minutes is assigned a lambda function.\n6. The lambda accepts hours and multiplies it by 60.\n7. The two print() statements display the results of the function calls.',
        task:
          'Create a lambda function named square that returns the square of its input. Print square(6).\nExpected output:\n36',
      },
      {
        id: "python-15",
        title: "Recursion",
        duration: "25 min",
        explanation:
          "Recursion occurs when a function calls itself to solve a smaller version of the same problem. It is useful for problems that can be divided into similar subproblems, such as tree traversal and mathematical sequences.\n\nEvery recursive function needs a base case. The base case stops further recursive calls. Without it, the function may continue calling itself until Python raises a RecursionError.\n\nA recursive solution usually has two parts: the base case and the recursive case. Each recursive call should move closer to the base case so that the computation eventually finishes.",
        example:
          'def sum_natural(n):\n    if n == 0:\n        return 0\n    return n + sum_natural(n - 1)\n\nprint(sum_natural(5))',
        exampleExplanation:
          '1. sum_natural() is a recursive function that calculates the sum of natural numbers up to n.\n2. The condition n == 0 is the base case.\n3. When n reaches zero, the function returns zero and stops making recursive calls.\n4. Otherwise, the function adds n to the result of sum_natural(n - 1).\n5. Each call reduces n by one, moving closer to the base case.\n6. sum_natural(5) calculates 5 + 4 + 3 + 2 + 1 + 0.\n7. The final result displayed is 15.',
        task:
          'Write a recursive function named factorial that returns the factorial of a non-negative integer. Print factorial(4).\nExpected output:\n24',
      },
      {
        id: "python-16",
        title: "Comprehensions",
        duration: "20 min",
        explanation:
          "Comprehensions provide a concise way to create collections from existing iterables. A list comprehension can generate a new list using an expression and a for loop in one statement.\n\nYou can also include an if condition to filter which elements are added. Similar syntax is available for set and dictionary comprehensions.\n\nComprehensions are useful when transforming or filtering data. They can make simple collection operations easier to read, but regular loops are often clearer when the operation contains several steps.",
        example:
          'temperatures = [18, 22, 25, 29, 31]\nfahrenheit = [round((c * 9 / 5) + 32) for c in temperatures]\nhot_days = [c for c in temperatures if c >= 25]\nprint("Fahrenheit:", fahrenheit)\nprint("Warm days:", hot_days)',
        exampleExplanation:
          '1. temperatures stores five temperature values in Celsius.\n2. The first list comprehension converts every Celsius value to Fahrenheit.\n3. round() rounds each converted value to the nearest whole number.\n4. The second list comprehension selects only temperatures greater than or equal to 25.\n5. The if condition filters out values below 25.\n6. The final statements display the converted temperatures and selected warm-day values.',
        task:
          'Use a list comprehension to create and print the squares of numbers from 1 through 5.\nExpected output:\n[1, 4, 9, 16, 25]',
      },
      {
        id: "python-17",
        title: "break, continue, and pass",
        duration: "20 min",
        explanation:
          "Python provides three statements that control how loops and code blocks behave. break immediately terminates the nearest enclosing loop. continue skips the remaining statements in the current iteration and moves to the next iteration. pass is a placeholder that performs no operation.\n\nThese statements are useful when processing collections. For example, break can stop a search after an item is found, while continue can skip records that do not meet a condition.\n\nUse these statements carefully so that the program flow remains easy to understand. A pass statement is often used when planning a function or class that will be implemented later.",
        example:
          'for order_id in range(101, 108):\n    if order_id == 104:\n        print("Order needs review")\n        continue\n    if order_id == 107:\n        break\n    print("Processing order:", order_id)',
        exampleExplanation:
          '1. The for loop generates order IDs from 101 through 107.\n2. When order_id is 104, the first condition becomes True.\n3. The program displays Order needs review.\n4. continue skips the remaining statements for that iteration and moves to the next order ID.\n5. For other values, the second condition checks whether the order ID is 107.\n6. When the value becomes 107, break terminates the loop.\n7. Other order IDs are displayed as they are processed.',
        task:
          'Print the numbers from 1 through 10, but skip the number 5 using continue.\nExpected output:\n1\n2\n3\n4\n6\n7\n8\n9\n10',
      },
      {
        id: "python-18",
        title: "Modules and Imports",
        duration: "20 min",
        explanation:
          "A module is a Python file containing reusable code such as functions, variables, and classes. Modules help organize large applications into smaller files and allow developers to reuse existing functionality.\n\nPython includes a standard library with modules for mathematics, dates, random values, file paths, and many other tasks. The import statement makes a module available in your program.\n\nYou can import an entire module, import selected functions, or use an alias. Using an alias can make long module names shorter. Choose the import style that keeps your code clear and avoids naming conflicts.",
        example:
          'import random\nimport calendar\n\nmonth_number = 9\nprint("Days in month:", calendar.monthrange(2026, month_number)[1])\nprint("Random dice value:", random.randint(1, 6))',
        exampleExplanation:
          '1. import random loads the random module for generating random values.\n2. import calendar loads calendar-related functions.\n3. month_number stores the month number September.\n4. calendar.monthrange() returns information about the weekday and number of days in the selected month.\n5. Index [1] retrieves the number of days.\n6. random.randint(1, 6) generates an integer from 1 through 6, including both endpoints.\n7. The print() statements display the results.',
        task:
          'Import the math module and print the square root of 144.\nExpected output:\n12.0',
      },
      {
        id: "python-19",
        title: "Exceptions",
        duration: "20 min",
        explanation:
          "An exception is an error detected while a program is running. Examples include dividing by zero, converting invalid text into a number, or accessing a missing file.\n\nPython uses try and except blocks to handle exceptions. Code that may cause an error is placed inside try. If an exception occurs, Python executes the matching except block instead of immediately stopping the program.\n\nYou can use else for instructions that should run when no exception occurs and finally for cleanup instructions that should run regardless of whether an exception occurred. Handle specific exception types whenever possible.",
        example:
          'try:\n    total = 250\n    items = 0\n    average = total / items\n    print("Average:", average)\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")\nfinally:\n    print("Calculation finished")',
        exampleExplanation:
          '1. The try block contains a division operation that may raise an exception.\n2. total stores 250 and items stores zero.\n3. Dividing total by items raises a ZeroDivisionError.\n4. Python skips the remaining statements in the try block.\n5. The except ZeroDivisionError block handles the specific error and displays a message.\n6. The finally block executes after exception handling.\n7. The final message is displayed whether the calculation succeeds or fails.',
        task:
          'Use try and except to convert the string "123" into an integer and print the result.\nExpected output:\n123',
      },
      {
        id: "python-20",
        title: "File Handling",
        duration: "25 min",
        explanation:
          "File handling allows programs to store information permanently and retrieve it later. Python provides the open() function to access files in different modes.\n\nThe common modes include r for reading, w for writing, a for appending, and x for creating a new file. Writing with w replaces existing file contents, while appending adds information to the end.\n\nThe with statement is recommended because it automatically closes a file after the block finishes. File operations can also raise exceptions, so programs should handle missing files and permission problems when necessary.",
        example:
          'with open("notes.txt", "w") as file:\n    file.write("Python practice session")\n\nwith open("notes.txt", "r") as file:\n    content = file.read()\n    print("Saved notes:", content)',
        exampleExplanation:
          '1. open("notes.txt", "w") opens a file in write mode.\n2. The with statement manages the file and closes it automatically when the block ends.\n3. file.write() stores the text Python practice session in the file.\n4. The second with statement opens the same file in read mode.\n5. file.read() retrieves the complete file content as a string.\n6. The final print() statement displays the retrieved text.',
        task:
          'Write "Hello Python" to a file named message.txt using a with statement. Then read the file and print its contents.\nExpected output:\nHello Python',
      },
      {
        id: "python-21",
        title: "Object-Oriented Programming",
        duration: "25 min",
        explanation:
          "Object-oriented programming is a programming approach that organizes code around classes and objects. A class defines the structure and behaviour, while an object is an instance created from that class.\n\nA class can contain attributes that store data and methods that define actions. For example, a vehicle class might contain a brand and speed, along with methods to accelerate or display its details.\n\nClasses help organize related information and functionality. They are especially useful in larger applications where multiple objects share the same structure but contain different data.",
        example:
          'class Laptop:\n    def __init__(self, brand, ram):\n        self.brand = brand\n        self.ram = ram\n\n    def display_specs(self):\n        print("Brand:", self.brand)\n        print("RAM:", self.ram, "GB")\n\ncomputer = Laptop("Lenovo", 16)\ncomputer.display_specs()',
        exampleExplanation:
          '1. class Laptop defines a class named Laptop.\n2. __init__() is the constructor that runs when a new object is created.\n3. self refers to the current object.\n4. brand and ram are attributes that store the laptop information.\n5. display_specs() is a method that displays the stored attributes.\n6. Laptop("Lenovo", 16) creates a Laptop object.\n7. computer.display_specs() calls the method using that object.',
        task:
          'Create a class named Dog with a name attribute and a method named bark that prints "Woof". Create an object and call its bark method.\nExpected output:\nWoof',
      },
      {
        id: "python-22",
        title: "Inheritance and Polymorphism",
        duration: "25 min",
        explanation:
          "Inheritance allows one class to reuse and extend the attributes and methods of another class. The original class is called the parent or base class, while the class that inherits from it is called the child or derived class.\n\nPolymorphism allows different classes to provide their own implementation of a method with the same name. A program can call that method without needing to know every detail of the object's class.\n\nInheritance reduces repeated code, while polymorphism makes applications easier to extend. These concepts are commonly used in simulations, graphical applications, and systems that work with different types of objects.",
        example:
          'class Employee:\n    def describe(self):\n        print("General employee")\n\nclass Manager(Employee):\n    def describe(self):\n        print("Manages a team")\n\nclass Designer(Employee):\n    def describe(self):\n        print("Creates designs")\n\nstaff = [Manager(), Designer()]\nfor person in staff:\n    person.describe()',
        exampleExplanation:
          '1. Employee defines a base class with a describe() method.\n2. Manager inherits from Employee and overrides describe().\n3. Designer also inherits from Employee and provides its own describe() method.\n4. staff stores one Manager object and one Designer object.\n5. The for loop visits both objects.\n6. person.describe() calls the method belonging to the current object.\n7. The correct implementation runs for each object. This demonstrates polymorphism.',
        task:
          'Create a base class Animal with a speak() method. Create a subclass Cat that overrides speak() to print "Meow", then call the method.\nExpected output:\nMeow',
      },
      {
        id: "python-23",
        title: "Encapsulation and Properties",
        duration: "25 min",
        explanation:
          "Encapsulation is the practice of keeping related data and methods together while controlling how an object's internal information is accessed or modified.\n\nPython uses naming conventions such as a leading underscore to indicate that an attribute is intended for internal use. Double underscores trigger name mangling, which makes accidental access from outside the class more difficult.\n\nProperties allow methods to be accessed like attributes. The @property decorator defines a getter, and a setter can validate values before storing them. This helps maintain valid object data while providing a convenient interface.",
        example:
          'class Temperature:\n    def __init__(self, celsius):\n        self._celsius = celsius\n\n    @property\n    def celsius(self):\n        return self._celsius\n\n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError("Temperature is below absolute zero")\n        self._celsius = value\n\nweather = Temperature(24)\nweather.celsius = 28\nprint(weather.celsius)',
        exampleExplanation:
          '1. Temperature defines a class for storing a temperature in Celsius.\n2. __init__() initializes the internal _celsius attribute.\n3. @property defines a getter named celsius.\n4. The getter returns the stored temperature.\n5. @celsius.setter defines how a new value should be assigned.\n6. The setter checks that the temperature is not below absolute zero.\n7. If the value is valid, it updates _celsius.\n8. The final print() statement accesses the property and displays 28.',
        task:
          'Create a class named Rectangle that stores width and height and provides an area property. Print the area of a rectangle with width 4 and height 3.\nExpected output:\n12',
      },
      {
        id: "python-24",
        title: "Iterators and Iterables",
        duration: "20 min",
        explanation:
          "An iterable is an object that can provide its elements one at a time, such as a list, tuple, string, or dictionary. An iterator is an object that remembers its current position while producing values.\n\nThe iter() function creates an iterator from an iterable. The next() function retrieves the next available value. When no values remain, Python raises StopIteration.\n\nA for loop handles iterator creation and completion automatically. Understanding iterators is useful when processing large collections or working with data that arrives gradually.",
        example:
          'cities = ["Delhi", "Pune", "Kochi"]\ncity_iterator = iter(cities)\nprint(next(city_iterator))\nprint(next(city_iterator))\nprint(next(city_iterator))',
        exampleExplanation:
          '1. cities creates a list containing three city names.\n2. iter(cities) creates an iterator from the list.\n3. The first next() call retrieves Delhi.\n4. The second next() call retrieves Pune.\n5. The third next() call retrieves Kochi.\n6. The iterator remembers its position after each next() call.\n7. Calling next() again after all elements are consumed would raise StopIteration.',
        task:
          'Create an iterator from the list [4, 5, 6] and print its first value using next().\nExpected output:\n4',
      },
      {
        id: "python-25",
        title: "Generators and yield",
        duration: "25 min",
        explanation:
          "A generator is a special kind of iterator that produces values one at a time. Generator functions use the yield keyword instead of returning all results at once.\n\nWhen a generator reaches yield, it provides a value and pauses its execution. Its local variables and current position are remembered, allowing it to continue from the same point when another value is requested.\n\nGenerators are memory-efficient when working with large sequences because they do not need to store every generated value in a list. They are useful for processing files, data streams, and sequences of calculated values.",
        example:
          'def even_numbers(limit):\n    current = 2\n    while current <= limit:\n        yield current\n        current += 2\n\nfor value in even_numbers(10):\n    print(value)',
        exampleExplanation:
          '1. even_numbers() defines a generator function with a limit parameter.\n2. current starts at 2.\n3. The while loop continues while current is not greater than the limit.\n4. yield current produces the current even number and pauses the generator.\n5. When the next value is requested, execution resumes after yield.\n6. current += 2 moves to the next even number.\n7. The for loop requests values until the generator has no more values to produce.',
        task:
          'Write a generator named count_up_to that yields integers from 1 through a supplied limit. Convert count_up_to(4) to a list and print it.\nExpected output:\n[1, 2, 3, 4]',
      },
      {
        id: "python-26",
        title: "Decorators",
        duration: "25 min",
        explanation:
          "A decorator is a function that takes another function and extends or modifies its behaviour without changing the original function's code.\n\nDecorators are commonly used for logging, timing, authentication checks, and validating function calls. Python uses the @ symbol to apply a decorator to a function.\n\nA decorator usually defines an inner wrapper function. The wrapper performs additional work before or after calling the original function. The functools.wraps decorator is often used to preserve the original function's name and documentation.",
        example:
          'from functools import wraps\n\ndef show_message(func):\n    @wraps(func)\n    def wrapper():\n        print("Preparing report")\n        func()\n        print("Report completed")\n    return wrapper\n\n@show_message\ndef create_report():\n    print("Generating monthly report")\n\ncreate_report()',
        exampleExplanation:
          '1. wraps is imported from functools to preserve function metadata.\n2. show_message() accepts another function as its parameter.\n3. wrapper() is an inner function that adds extra instructions.\n4. The first print() statement runs before the original function.\n5. func() calls the original function passed to the decorator.\n6. The final print() statement runs after the original function finishes.\n7. @show_message applies the decorator to create_report().\n8. Calling create_report() actually executes the wrapper function.',
        task:
          'Create a decorator named announce that prints "Start" before calling the decorated function. Decorate a function that prints "Working".\nExpected output:\nStart\nWorking',
      },
      {
        id: "python-27",
        title: "Useful Built-ins and Sorting",
        duration: "20 min",
        explanation:
          "Python provides built-in functions that make common programming tasks easier. Functions such as len(), sum(), min(), max(), abs(), round(), and sorted() are useful when working with values and collections.\n\nThe sorted() function creates a new sorted list without changing the original iterable. The sort() method, in contrast, sorts a list in place. Both can sort values in ascending or descending order.\n\nYou can provide a key function to control how elements are compared. For example, a list of words can be sorted by length rather than alphabetically. Understanding built-in functions helps you write shorter and clearer programs.",
        example:
          'prices = [249, 99, 450, 175, 320]\nprint("Total:", sum(prices))\nprint("Highest:", max(prices))\nprint("Lowest:", min(prices))\nprint("Sorted:", sorted(prices))\nprint("Descending:", sorted(prices, reverse=True))',
        exampleExplanation:
          '1. prices stores five integer values in a list.\n2. sum(prices) calculates the total of all values.\n3. max(prices) returns the largest value.\n4. min(prices) returns the smallest value.\n5. sorted(prices) creates a new list arranged in ascending order.\n6. reverse=True arranges the values in descending order.\n7. The original prices list remains unchanged because sorted() returns a new list.',
        task:
          'Use sorted() to print the list [8, 2, 5, 1] in ascending order.\nExpected output:\n[1, 2, 5, 8]',
      },
      {
        id: "python-28",
        title: "Type Hints and Dataclasses",
        duration: "25 min",
        explanation:
          "Type hints describe the expected types of variables, parameters, and return values. They improve readability and help editors and static analysis tools identify possible type-related mistakes.\n\nPython does not normally enforce type hints at runtime. They are guidance for developers and tools rather than automatic restrictions on every value.\n\nThe dataclasses module can reduce repetitive code when creating classes mainly used to store data. The @dataclass decorator automatically generates methods such as __init__() and __repr__() based on the declared fields.",
        example:
          'from dataclasses import dataclass\n\n@dataclass\nclass Course:\n    name: str\n    credits: int\n    completed: bool\n\nselected = Course("Database Systems", 4, True)\nprint(selected.name)\nprint(selected.credits)\nprint(selected.completed)',
        exampleExplanation:
          `1. dataclass is imported from the dataclasses module.\n2. @dataclass tells Python to generate common methods for the Course class.\n3. name is declared as a string field.\n4. credits is declared as an integer field.\n5. completed is declared as a Boolean field.\n6. Creating Course(...) initializes the object with the supplied values.\n7. The print() statements access and display the object's fields.`,
        task:
          'Write a function named double that accepts an integer parameter and has an integer return type annotation. Print double(5).\nExpected output:\n10',
      },
      {
        id: "python-29",
        title: "Testing and Debugging",
        duration: "25 min",
        explanation:
          "Testing checks whether a program behaves as expected. A test provides input, runs a part of the program, and compares the result with an expected value.\n\nAn assertion is a statement used to check whether a condition is True. If the condition is False, Python raises an AssertionError. Assertions are useful during development for checking assumptions and identifying mistakes.\n\nDebugging is the process of finding and fixing problems in a program. You can use print() statements, error messages, and a debugger to inspect variable values and follow program execution. Small tests make errors easier to locate.",
        example:
          'def calculate_discount(price, percentage):\n    return price - (price * percentage / 100)\n\nassert calculate_discount(200, 10) == 180\nassert calculate_discount(500, 20) == 400\nprint("Discount calculations verified")',
        exampleExplanation:
          '1. calculate_discount() accepts a price and a discount percentage.\n2. The function calculates the discount amount and subtracts it from the original price.\n3. The first assert checks that a 10 percent discount on 200 produces 180.\n4. The second assert checks that a 20 percent discount on 500 produces 400.\n5. If either assertion is False, Python raises an AssertionError.\n6. When both checks succeed, execution reaches the final print() statement.\n7. The confirmation message indicates that both tests passed.',
        task:
          'Write an add function and use an assert statement to verify that add(4, 6) returns 10. Print the confirmation message after the assertion succeeds.\nExpected output:\nAll checks passed',
      },
      {
        id: "python-30",
        title: "Mini Project: Quiz Application",
        duration: "30 min",
        explanation:
          "A quiz application combines several Python concepts to create an interactive program. It can store questions, receive answers, check whether they are correct, and maintain a score.\n\nA dictionary can represent each question and its correct answer. A loop can visit each question, while conditional statements determine whether the user's answer is correct. A score variable keeps track of the number of correct responses.\n\nBreaking a project into smaller steps makes it easier to build and test. Start by storing the questions, then implement answer checking, update the score, and finally display the result.",
        example:
          'questions = [\n    {"question": "Which planet is known as the Red Planet?", "answer": "Mars"},\n    {"question": "How many sides does a hexagon have?", "answer": "6"},\n    {"question": "What is the chemical symbol for water?", "answer": "H2O"}\n]\n\nscore = 0\nfor item in questions:\n    response = input(item["question"] + " ")\n    if response.strip().lower() == item["answer"].lower():\n        score += 1\n\nprint("Final score:", score, "/", len(questions))',
        exampleExplanation:
          `1. questions stores three dictionaries, each containing a question and its correct answer.\n2. score starts at zero because no questions have been answered yet.\n3. The for loop processes each question dictionary one at a time.\n4. input() displays the question and receives the user's response.\n5. strip() removes extra spaces from the response.\n6. lower() makes the comparison case-insensitive.\n7. If the response matches the correct answer, score increases by one.\n8. The final print() statement displays the score and the total number of questions.`,
        task:
          'Build a two-question quiz using a loop and a score variable. For a simple test, assume both answers are correct and print the final score as "Score: 2 / 2".\nExpected output:\nScore: 2 / 2',
      },
    ],
  },
  {
  id: "cpp",
  title: "C++ & DSA",
  language: "C++",
  description: "Learn C++ programming, object-oriented programming, STL, and essential data structures and algorithms.",
  level: "Beginner to Intermediate",
  lessons: [
    {
      id: "cpp-1",
      title: "Introduction to C++",
      duration: "10 min",
      explanation: "C++ is a general-purpose, compiled programming language used in application development, games, operating systems, and performance-critical software. A C++ program is written as source code and compiled before execution. The main() function is the starting point of a standard C++ program. Statements generally end with a semicolon, and curly braces define blocks of code. The iostream library provides tools for reading input and displaying output.",
      example: `#include <iostream>
using namespace std;

int main() {
    cout << "Starting C++ programming";
    return 0;
}`,
      exampleExplanation: "1. #include <iostream> includes the standard input/output library.\n2. using namespace std allows standard library names such as cout to be used without writing std::.\n3. int main() defines the main function, where program execution begins.\n4. cout sends the text to the output stream.\n5. The semicolon marks the end of the output statement.\n6. return 0 indicates successful program completion.",
      task: `Write a C++ program that prints "Hello, CodeMentor!".

Expected Output:
Hello, CodeMentor!`
    },
    {
      id: "cpp-2",
      title: "Variables and Data Types",
      duration: "15 min",
      explanation: "Variables are named storage locations used to hold values while a program runs. C++ provides several built-in data types. int stores whole numbers, double stores decimal numbers, char stores a single character, and bool stores true or false. The string type stores text and is available through the string header. Choosing an appropriate type helps the compiler understand the kind of data being stored.",
      example: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string department = "Computer Science";
    double percentage = 87.5;
    char grade = 'A';
    bool enrolled = true;

    cout << department << "\\n";
    cout << percentage << "\\n";
    cout << grade << "\\n";
    cout << enrolled;
    return 0;
}`,
      exampleExplanation: "1. The iostream and string headers provide output and string functionality.\n2. department stores a text value using string.\n3. percentage stores a decimal value using double.\n4. grade stores one character using char.\n5. enrolled stores a Boolean value.\n6. Each cout statement displays one variable.\n7. By default, a Boolean true value is displayed as 1 when using cout.",
      task: `Create a string variable name = "Alex" and an integer variable age = 20. Print each on a new line.

Expected Output:
Alex
20`
    },
    {
      id: "cpp-3",
      title: "Conditions",
      duration: "15 min",
      explanation: "Conditional statements allow a program to make decisions based on expressions. The if statement executes a block when its condition is true. else if checks another condition when the previous condition is false, while else handles the remaining case. Comparison operators such as ==, !=, >, and <= are commonly used to form conditions. Curly braces group the statements belonging to each branch.",
      example: `#include <iostream>
using namespace std;

int main() {
    int temperature = 32;

    if (temperature > 35) {
        cout << "Very hot";
    } else if (temperature >= 25) {
        cout << "Warm weather";
    } else {
        cout << "Cool weather";
    }

    return 0;
}`,
      exampleExplanation: "1. temperature stores the value 32.\n2. The first condition checks whether temperature is greater than 35.\n3. Since 32 is not greater than 35, that block is skipped.\n4. The else if condition checks whether temperature is at least 25.\n5. This condition is true, so Warm weather is printed.\n6. The final else block is skipped because a previous condition succeeded.",
      task: `Read an integer and print "Even" if it is divisible by 2, otherwise print "Odd". Use 8 as input.

Expected Output:
Even`
    },
    {
      id: "cpp-4",
      title: "Loops",
      duration: "15 min",
      explanation: "Loops execute a block of code repeatedly. A for loop is useful when the number of repetitions is known. A while loop repeats while a condition remains true, and a do-while loop executes its body at least once before checking its condition. Loops reduce repeated statements and are commonly used for calculations, processing collections, and generating patterns.",
      example: `#include <iostream>
using namespace std;

int main() {
    for (int hour = 9; hour <= 12; ++hour) {
        cout << hour << " ";
    }
    return 0;
}`,
      exampleExplanation: "1. The for loop initializes hour to 9.\n2. The condition hour <= 12 determines whether another iteration should run.\n3. cout displays the current hour followed by a space.\n4. ++hour increases the variable by one after each iteration.\n5. The loop displays 9, 10, 11, and 12.\n6. When hour becomes 13, the condition becomes false and the loop ends.",
      task: `Use a for loop to print numbers from 1 through 5, separated by spaces.

Expected Output:
1 2 3 4 5`
    },
    {
      id: "cpp-5",
      title: "Arrays",
      duration: "20 min",
      explanation: "An array stores multiple values of the same data type under one variable name. Its elements occupy consecutive positions in memory. Each element is accessed using an index, and indexing begins at zero. The array size is fixed after declaration for a built-in array. Arrays are useful for storing marks, measurements, and other collections of related values.",
      example: `#include <iostream>
using namespace std;

int main() {
    double rainfall[] = {12.5, 8.0, 16.2, 10.5};

    for (int i = 0; i < 4; ++i) {
        cout << rainfall[i] << " ";
    }

    return 0;
}`,
      exampleExplanation: "1. rainfall declares an array of double values.\n2. The initializer provides four decimal values.\n3. The for loop starts with index 0.\n4. The condition i < 4 keeps the index within the four-element array.\n5. rainfall[i] accesses the element at the current index.\n6. The loop displays all four values separated by spaces.",
      task: `Create an array containing 10, 20, and 30. Print its first element.

Expected Output:
10`
    },
    {
      id: "cpp-6",
      title: "Input and Output",
      duration: "15 min",
      explanation: "C++ uses cin to receive input and cout to display output. The extraction operator >> reads a value from the standard input stream and stores it in a variable. The insertion operator << sends information to the output stream. You can chain multiple values in one cout statement. Use getline() when you need to read a complete line containing spaces.",
      example: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string fullName;
    cout << "Enter your full name: ";
    getline(cin, fullName);
    cout << "Welcome, " << fullName;
    return 0;
}`,
      exampleExplanation: "1. The string header provides the string data type.\n2. fullName is declared to store a line of text.\n3. cout displays a prompt asking for a name.\n4. getline(cin, fullName) reads the complete input line, including spaces.\n5. The final cout statement combines a message with the entered name.\n6. getline() is useful when input contains more than one word.",
      task: `Read an integer from input and print the same integer. Use 25 as input.

Expected Output:
25`
    },
    {
      id: "cpp-7",
      title: "Functions",
      duration: "20 min",
      explanation: "A function is a named block of reusable code that performs a particular task. It can accept input through parameters and optionally return a value. A function definition specifies its return type, name, parameters, and body. Functions make programs easier to organize, test, and maintain. A function can be called multiple times from different parts of a program.",
      example: `#include <iostream>
using namespace std;

double calculateAverage(double total, int subjects) {
    return total / subjects;
}

int main() {
    cout << calculateAverage(450, 5);
    return 0;
}`,
      exampleExplanation: "1. calculateAverage is a function that returns a double value.\n2. It receives total and subjects as parameters.\n3. The return statement divides the total by the number of subjects.\n4. main() calls the function with 450 and 5.\n5. The function calculates 90 and returns it.\n6. cout displays the returned average.",
      task: `Create an add() function that accepts two integers. Call it with 4 and 6 and print the result.

Expected Output:
10`
    },
    {
      id: "cpp-8",
      title: "While Loops",
      duration: "15 min",
      explanation: "A while loop repeatedly executes its body while a condition evaluates to true. The condition is checked before each iteration, so the body may execute zero times if the condition is initially false. A variable used in the condition should normally be updated inside the loop to ensure that it eventually stops.",
      example: `#include <iostream>
using namespace std;

int main() {
    int countdown = 4;

    while (countdown > 0) {
        cout << countdown << " ";
        --countdown;
    }

    cout << "Go!";
    return 0;
}`,
      exampleExplanation: "1. countdown is initialized to 4.\n2. The while condition checks whether countdown is greater than zero.\n3. cout displays the current value.\n4. --countdown decreases the value by one.\n5. The loop repeats with 3, 2, and 1.\n6. When countdown becomes zero, the condition is false and the loop ends.\n7. The final cout statement displays Go!.",
      task: `Use a while loop to print numbers from 1 through 5.

Expected Output:
1 2 3 4 5`
    },
    {
      id: "cpp-9",
      title: "Function Parameters and Return Values",
      duration: "20 min",
      explanation: "Function parameters are variables that receive values from a function call. Arguments are the actual values supplied when calling the function. A return statement sends a result back to the calling code. Parameters can be passed by value, by reference, or by pointer depending on whether the function needs to modify or directly access the original data.",
      example: `#include <iostream>
using namespace std;

double convertKmToMiles(double km) {
    return km * 0.621371;
}

int main() {
    double distance = convertKmToMiles(10);
    cout << distance;
    return 0;
}`,
      exampleExplanation: "1. convertKmToMiles accepts a double parameter named km.\n2. The function multiplies the supplied distance by the conversion factor.\n3. return sends the calculated value back to the caller.\n4. main() calls the function with 10.\n5. The returned value is stored in distance.\n6. cout displays the converted distance.",
      task: `Create a multiply() function that accepts two integers. Call it with 4 and 6 and print the result.

Expected Output:
24`
    },
    {
      id: "cpp-10",
      title: "Strings",
      duration: "20 min",
      explanation: "The C++ string class represents a sequence of characters. It supports operations such as concatenation, comparison, indexing, searching, and extracting substrings. Include the string header to use std::string. The length() and size() methods return the number of characters. Strings can be combined using the + operator.",
      example: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string first = "Good";
    string second = "Morning";
    string greeting = first + " " + second;

    cout << greeting << "\\n";
    cout << greeting.substr(5, 7);
    return 0;
}`,
      exampleExplanation: "1. first and second store two separate strings.\n2. The + operator joins the strings with a space between them.\n3. greeting stores the combined text.\n4. The first cout statement displays the complete greeting.\n5. substr(5, 7) extracts seven characters beginning at index 5.\n6. The second cout statement displays the extracted portion.",
      task: `Create a string containing "Code" and print its length.

Expected Output:
4`
    },
    {
      id: "cpp-11",
      title: "Nested Loops",
      duration: "20 min",
      explanation: "A nested loop is a loop placed inside another loop. The outer loop controls one repetition level, while the inner loop performs repeated work for each outer iteration. Nested loops are useful for processing two-dimensional arrays, creating tables, and working with rows and columns. The total number of operations often depends on the product of the loop iteration counts.",
      example: `#include <iostream>
using namespace std;

int main() {
    for (int row = 1; row <= 3; ++row) {
        for (int col = 1; col <= 4; ++col) {
            cout << row * col << " ";
        }
        cout << "\\n";
    }
    return 0;
}`,
      exampleExplanation: "1. The outer loop controls three rows.\n2. For every row, the inner loop runs four times.\n3. row * col calculates a value using the current row and column numbers.\n4. The inner loop displays four values in each row.\n5. The newline statement moves the output to the next line after each row.\n6. The program produces a multiplication table with three rows and four columns.",
      task: `Print a right triangle of stars containing three rows.

Expected Output:
*
**
***`
    },
    {
      id: "cpp-12",
      title: "break and continue",
      duration: "15 min",
      explanation: "The break and continue statements change the normal flow of loops. break immediately exits the nearest enclosing loop. continue skips the remaining statements in the current iteration and begins the next iteration. These statements are useful when searching for a value, skipping unwanted records, or stopping a loop when a required condition is met.",
      example: `#include <iostream>
using namespace std;

int main() {
    for (int value = 1; value <= 10; ++value) {
        if (value == 8) {
            break;
        }
        if (value % 3 == 0) {
            continue;
        }
        cout << value << " ";
    }
    return 0;
}`,
      exampleExplanation: "1. The for loop visits values from 1 through 10.\n2. The first if statement checks whether the value is 8.\n3. If it reaches 8, break terminates the loop.\n4. The second if statement checks whether the value is divisible by 3.\n5. continue skips printing values divisible by 3.\n6. Other values are displayed with spaces.\n7. The loop stops before printing 8.",
      task: `Print numbers from 1 to 5, skipping 3.

Expected Output:
1 2 4 5`
    },
    {
      id: "cpp-13",
      title: "References",
      duration: "20 min",
      explanation: "A reference is another name for an existing variable. It must be initialized when declared and cannot later be redirected to refer to a different variable. A non-const reference can be used to modify the original value. References are often used in function parameters to avoid copying large objects or to allow a function to update the caller's variable.",
      example: `#include <iostream>
using namespace std;

int main() {
    double price = 250.50;
    double &priceAlias = price;

    priceAlias *= 1.1;
    cout << price;
    return 0;
}`,
      exampleExplanation: "1. price stores the initial decimal value.\n2. priceAlias is declared as a reference to price.\n3. Both names refer to the same variable.\n4. Multiplying priceAlias by 1.1 changes the original price.\n5. cout accesses the updated value through the original variable name.\n6. This demonstrates that a reference is an alias rather than a separate copy.",
      task: `Create an integer with value 10. Create a reference to it, change the value through the reference to 25, and print the original variable.

Expected Output:
25`
    },
    {
      id: "cpp-14",
      title: "Function Overloading",
      duration: "20 min",
      explanation: "Function overloading allows multiple functions to use the same name when their parameter lists differ. The difference may involve the number, types, or order of parameters. The compiler selects the matching function based on the arguments supplied in the call. Return type alone cannot distinguish overloaded functions.",
      example: `#include <iostream>
#include <string>
using namespace std;

void display(string text) {
    cout << "Text: " << text << "\\n";
}

void display(int number) {
    cout << "Number: " << number << "\\n";
}

int main() {
    display("C++");
    display(2026);
    return 0;
}`,
      exampleExplanation: "1. The first display function accepts a string parameter.\n2. The second display function accepts an integer parameter.\n3. Both functions share the name display but have different parameter types.\n4. display(\"C++\") selects the string version.\n5. display(2026) selects the integer version.\n6. The compiler determines which overload to execute from the supplied argument type.",
      task: `Overload multiply() for two integers and two double values. Call it with (3, 4) and (2.5, 4.0).

Expected Output:
12
10`
    },
    {
      id: "cpp-15",
      title: "Arrays and Aggregation",
      duration: "20 min",
      explanation: "Aggregation means combining multiple values into a summary, such as a total, average, minimum, or maximum. Arrays can be traversed using a traditional indexed loop or a range-based for loop. A running total is initialized before the loop and updated for every element. An average can be calculated by dividing the total by the number of elements.",
      example: `#include <iostream>
using namespace std;

int main() {
    int expenses[] = {120, 80, 150, 50};
    int total = 0;

    for (int amount : expenses) {
        total += amount;
    }

    double average = static_cast<double>(total) / 4;
    cout << "Total: " << total << "\\n";
    cout << "Average: " << average;
    return 0;
}`,
      exampleExplanation: "1. expenses stores four integer amounts.\n2. total is initialized to zero before processing the array.\n3. The range-based for loop visits each amount.\n4. total += amount adds the current value to the running total.\n5. static_cast<double> converts the total to double before division.\n6. The average is calculated by dividing the total by four.\n7. The two cout statements display the total and average.",
      task: `Create an array containing 1, 2, 3, 4, and 5. Calculate and print the sum.

Expected Output:
15`
    },
    {
      id: "cpp-16",
      title: "Multidimensional Arrays",
      duration: "20 min",
      explanation: "A multidimensional array stores data in multiple dimensions. A two-dimensional array is commonly used to represent a matrix or table with rows and columns. Each element is accessed using two indexes: the row index and the column index. Nested loops are commonly used to visit every element.",
      example: `#include <iostream>
using namespace std;

int main() {
    int seats[3][2] = {
        {1, 0},
        {1, 1},
        {0, 1}
    };

    for (int row = 0; row < 3; ++row) {
        for (int col = 0; col < 2; ++col) {
            cout << seats[row][col] << " ";
        }
        cout << "\\n";
    }
    return 0;
}`,
      exampleExplanation: "1. seats declares a two-dimensional integer array with three rows and two columns.\n2. The initializer assigns values to each position.\n3. The outer loop selects each row.\n4. The inner loop selects each column within the current row.\n5. seats[row][col] accesses the element at the selected position.\n6. The newline statement separates the rows in the displayed output.",
      task: `Create a 2x2 matrix containing 1, 2, 3, and 4. Print the sum of its elements.

Expected Output:
10`
    },
    {
      id: "cpp-17",
      title: "Vectors",
      duration: "20 min",
      explanation: "A vector is a dynamic sequence container from the C++ Standard Library. Unlike a built-in array, a vector can grow or shrink while the program runs. Include the vector header to use it. Common operations include push_back() to add an element, pop_back() to remove the last element, size() to get the element count, and at() to access an element with bounds checking.",
      example: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<string> tasks = {"Read", "Practice"};
    tasks.push_back("Review");

    cout << "Task count: " << tasks.size() << "\\n";
    cout << "First task: " << tasks.at(0);
    return 0;
}`,
      exampleExplanation: "1. The vector header provides the vector container.\n2. tasks creates a vector of strings with two initial elements.\n3. push_back(\"Review\") adds another element at the end.\n4. size() returns the current number of elements.\n5. at(0) accesses the first element using index zero.\n6. The output displays the updated count and the first task.",
      task: `Create a vector containing 10, 20, and 30. Append 40 and print every element separated by spaces.

Expected Output:
10 20 30 40`
    },
    {
      id: "cpp-18",
      title: "Reference Variables",
      duration: "20 min",
      explanation: "A reference variable is an alias for an existing variable. It does not create a separate storage location for another value. Once initialized, a reference continues to refer to the same object. References are especially useful when passing arguments to functions because they can avoid copying and can allow a function to modify the original object.",
      example: `#include <iostream>
using namespace std;

void increase(double &amount) {
    amount += 12.5;
}

int main() {
    double account = 100.0;
    increase(account);
    cout << account;
    return 0;
}`,
      exampleExplanation: "1. increase() accepts a double reference parameter.\n2. The reference parameter refers directly to the variable supplied by the caller.\n3. amount += 12.5 updates that original variable.\n4. account is initialized to 100.0.\n5. increase(account) passes account by reference.\n6. cout displays the updated value of account.",
      task: `Create an integer with value 5. Create a reference to it, change it to 15 through the reference, and print the original variable.

Expected Output:
15`
    },
    {
      id: "cpp-19",
      title: "Pointers",
      duration: "20 min",
      explanation: "A pointer is a variable that stores the memory address of another object. The address-of operator & obtains an object's address, while the dereference operator * accesses the value stored at that address. Pointers can be reassigned to point to different objects. A null pointer represents that a pointer currently does not refer to an object.",
      example: `#include <iostream>
using namespace std;

int main() {
    int first = 15;
    int second = 35;

    int *current = &first;
    cout << *current << "\\n";

    current = &second;
    cout << *current;
    return 0;
}`,
      exampleExplanation: "1. first and second are two separate integer variables.\n2. current is declared as a pointer to an integer.\n3. &first obtains the address of first and stores it in current.\n4. *current dereferences the pointer to read the value of first.\n5. The pointer is then reassigned to the address of second.\n6. The final dereference reads the value of second.",
      task: `Create an integer with value 42, use a pointer to access it, and print the value.

Expected Output:
42`
    },
    {
      id: "cpp-20",
      title: "Smart Pointers",
      duration: "25 min",
      explanation: "Smart pointers are standard library objects that manage dynamically allocated resources automatically. They help prevent memory leaks by releasing resources when ownership ends. unique_ptr provides exclusive ownership, shared_ptr allows shared ownership, and weak_ptr observes an object managed by shared_ptr without increasing its ownership count. The memory header provides these smart pointer types.",
      example: `#include <iostream>
#include <memory>
using namespace std;

int main() {
    auto value = make_shared<double>(42.75);
    cout << *value << "\\n";
    cout << value.use_count();
    return 0;
}`,
      exampleExplanation: "1. The memory header provides smart pointer utilities.\n2. make_shared<double>(42.75) creates a shared object containing a double.\n3. auto allows the compiler to infer the shared_ptr type.\n4. *value accesses the managed value.\n5. use_count() reports how many shared_ptr instances currently own the object.\n6. Since only one shared_ptr owns it, the ownership count is one.",
      task: `Create a unique_ptr containing the integer 100 and print the stored value.

Expected Output:
100`
    },
    {
      id: "cpp-21",
      title: "Classes and Objects",
      duration: "20 min",
      explanation: "A class is a user-defined type that groups data members and member functions. An object is an instance of that class. Classes help represent real-world concepts by keeping related data and operations together. Access specifiers such as public and private control which members can be accessed from outside the class.",
      example: `#include <iostream>
#include <string>
using namespace std;

class Course {
public:
    string subject;
    int duration;

    void display() {
        cout << subject << " - " << duration << " weeks";
    }
};

int main() {
    Course course;
    course.subject = "Algorithms";
    course.duration = 8;
    course.display();
    return 0;
}`,
      exampleExplanation: "1. class Course declares a new user-defined type.\n2. subject and duration are public data members.\n3. display() is a member function that prints the object's information.\n4. Course course creates an object of the Course class.\n5. The dot operator accesses the object's public members.\n6. course.display() calls the member function for that object.",
      task: `Create a Book class with a pages member. Create an object with 200 pages and print the value.

Expected Output:
200`
    },
    {
      id: "cpp-22",
      title: "Constructors",
      duration: "20 min",
      explanation: "A constructor is a special member function that runs automatically when an object is created. It has the same name as its class and does not have a return type. Constructors initialize an object's data members. A parameterized constructor accepts values, while a default constructor can initialize an object without supplied arguments.",
      example: `#include <iostream>
#include <string>
using namespace std;

class Employee {
    string department;
    int experience;

public:
    Employee() {
        department = "Engineering";
        experience = 2;
    }

    void show() const {
        cout << department << " " << experience;
    }
};

int main() {
    Employee employee;
    employee.show();
    return 0;
}`,
      exampleExplanation: "1. Employee declares a class with two private data members.\n2. Employee() is a default constructor because it accepts no arguments.\n3. The constructor initializes department and experience.\n4. show() displays the stored information.\n5. Employee employee creates an object, automatically calling the constructor.\n6. employee.show() displays the initialized values.",
      task: `Create a Rectangle class with length 4 and width 5. Print its area.

Expected Output:
20`
    },
    {
      id: "cpp-23",
      title: "Encapsulation",
      duration: "20 min",
      explanation: "Encapsulation combines data and related functions inside a class while controlling access to the internal state. Private members cannot be accessed directly from outside the class. Public methods provide controlled ways to read or update private data. This helps protect an object from invalid changes and makes its implementation easier to maintain.",
      example: `#include <iostream>
using namespace std;

class Thermostat {
private:
    int setting;

public:
    Thermostat() : setting(22) {}

    void setSetting(int value) {
        if (value >= 16 && value <= 30) {
            setting = value;
        }
    }

    int getSetting() const {
        return setting;
    }
};

int main() {
    Thermostat room;
    room.setSetting(25);
    cout << room.getSetting();
    return 0;
}`,
      exampleExplanation: "1. Thermostat defines a class with a private setting member.\n2. The constructor initializes setting to 22.\n3. setSetting() is a public method that accepts a new value.\n4. The condition checks whether the value is within the allowed range.\n5. A valid value updates the private setting member.\n6. getSetting() returns the stored value without modifying it.\n7. The program displays the updated setting.",
      task: `Create a BankAccount class with a private balance of 500 and a public getter. Print the balance.

Expected Output:
500`
    },
    {
      id: "cpp-24",
      title: "Initializer Lists",
      duration: "20 min",
      explanation: "A constructor initializer list initializes data members before the constructor body executes. It is written after the constructor parameter list, following a colon. Initializer lists are particularly important for const members, reference members, and members that do not have default constructors. They also provide direct initialization for ordinary members.",
      example: `#include <iostream>
#include <string>
using namespace std;

class Product {
    const int code;
    string category;

public:
    Product(int c, string type)
        : code(c), category(type) {}

    void display() const {
        cout << code << " " << category;
    }
};

int main() {
    Product item(405, "Electronics");
    item.display();
    return 0;
}`,
      exampleExplanation: "1. Product declares a class with a const integer and a string member.\n2. The constructor receives a product code and category.\n3. The colon introduces the initializer list.\n4. code(c) initializes the const member directly.\n5. category(type) initializes the string member.\n6. display() prints both initialized members.",
      task: `Create a Student class and initialize age to 20 using a constructor initializer list. Print the age.

Expected Output:
20`
    },
    {
      id: "cpp-25",
      title: "Inheritance",
      duration: "25 min",
      explanation: "Inheritance allows a derived class to reuse and extend the accessible members of a base class. Public inheritance represents an is-a relationship. A derived class can add new members or provide different implementations of inherited functions. Inheritance helps reduce repeated code when several classes share common behaviour.",
      example: `#include <iostream>
using namespace std;

class Employee {
public:
    void clockIn() {
        cout << "Attendance recorded";
    }
};

class Developer : public Employee {
public:
    void writeCode() {
        cout << "\\nWriting software";
    }
};

int main() {
    Developer person;
    person.clockIn();
    person.writeCode();
    return 0;
}`,
      exampleExplanation: "1. Employee is the base class and contains the clockIn() method.\n2. Developer publicly inherits from Employee.\n3. Developer adds its own writeCode() method.\n4. Creating Developer person creates an object of the derived class.\n5. person.clockIn() calls the inherited base-class method.\n6. person.writeCode() calls the method defined in Developer.",
      task: `Create a base Vehicle class with a start() method and a derived Car class. Print "Vehicle started".

Expected Output:
Vehicle started`
    },
        {
      id: "cpp-26",
      title: "Virtual Functions",
      duration: "25 min",
      explanation: "A virtual function enables runtime polymorphism in C++. When a derived class overrides a virtual function, a call through a base-class pointer or reference can execute the derived implementation. The override keyword helps the compiler verify that a function correctly overrides a base-class virtual function. Base classes intended for polymorphic use commonly have virtual destructors.",
      example: `#include <iostream>
using namespace std;

class Payment {
public:
    virtual void process() {
        cout << "Processing payment";
    }

    virtual ~Payment() = default;
};

class CardPayment : public Payment {
public:
    void process() override {
        cout << "Processing card payment";
    }
};

int main() {
    CardPayment card;
    Payment& payment = card;
    payment.process();
    return 0;
}`,
      exampleExplanation: "1. Payment declares a virtual process() method.\n2. The virtual destructor supports safe destruction through a base-class pointer.\n3. CardPayment inherits from Payment.\n4. CardPayment overrides process() with its own implementation.\n5. card creates an object of the derived class.\n6. payment is a base-class reference referring to that object.\n7. payment.process() calls the derived implementation at runtime.",
      task: `Create a base Shape class with a virtual draw() method and a derived Circle class that overrides it. Call draw() through a base-class pointer.

Expected Output:
Circle`
    },
    {
      id: "cpp-27",
      title: "Abstract Classes",
      duration: "25 min",
      explanation: "An abstract class is a class that contains at least one pure virtual function. A pure virtual function is declared using = 0. Abstract classes cannot be instantiated directly. Derived classes must implement the required pure virtual functions to become concrete classes. Abstract classes are useful for defining a common interface that several related classes must follow.",
      example: `#include <iostream>
using namespace std;

class Notification {
public:
    virtual void send() = 0;
    virtual ~Notification() = default;
};

class EmailNotification : public Notification {
public:
    void send() override {
        cout << "Email notification sent";
    }
};

int main() {
    EmailNotification message;
    message.send();
    return 0;
}`,
      exampleExplanation: "1. Notification declares a pure virtual send() function.\n2. The = 0 syntax makes Notification an abstract class.\n3. The virtual destructor supports safe polymorphic destruction.\n4. EmailNotification inherits from Notification.\n5. It implements the required send() method using override.\n6. An EmailNotification object can be created because it implements the pure virtual function.\n7. Calling send() displays the notification message.",
      task: `Create an abstract Appliance class with a pure virtual power() method. Implement it in a Fan class and print "Fan powered".

Expected Output:
Fan powered`
    },
    {
      id: "cpp-28",
      title: "Operator Overloading",
      duration: "25 min",
      explanation: "Operator overloading allows a class to define how operators behave when used with its objects. For example, a class can define how two objects are added or compared. An overloaded operator is implemented using a special member function or a non-member function. Operator overloading should make operations intuitive and consistent with the meaning of the type.",
      example: `#include <iostream>
using namespace std;

class Distance {
public:
    int meters;

    Distance(int m) : meters(m) {}

    bool operator<(const Distance& other) const {
        return meters < other.meters;
    }
};

int main() {
    Distance shortPath(120);
    Distance longPath(300);

    cout << (shortPath < longPath);
    return 0;
}`,
      exampleExplanation: "1. Distance defines a class containing a meters member.\n2. The constructor initializes the distance value.\n3. operator< overloads the less-than operator for Distance objects.\n4. The other parameter is passed as a const reference.\n5. The function compares the meters values and returns a Boolean result.\n6. shortPath and longPath create two Distance objects.\n7. The comparison is true, so cout displays 1.",
      task: `Overload the + operator for a Number class. Add objects containing 2 and 3 and print the result.

Expected Output:
5`
    },
    {
      id: "cpp-29",
      title: "Static Members",
      duration: "20 min",
      explanation: "A static data member belongs to the class itself rather than to an individual object. All objects of that class share the same static member. A static member function can be called using the class name and can directly access static members. Static data members are useful for shared counters, common configuration values, and information that applies to the entire class.",
      example: `#include <iostream>
using namespace std;

class Visitor {
public:
    static int totalVisits;

    Visitor() {
        ++totalVisits;
    }

    static int getTotal() {
        return totalVisits;
    }
};

int Visitor::totalVisits = 0;

int main() {
    Visitor first;
    Visitor second;
    Visitor third;
    Visitor fourth;

    cout << Visitor::getTotal();
    return 0;
}`,
      exampleExplanation: "1. totalVisits is declared as a static data member.\n2. The definition outside the class initializes it to zero.\n3. Every Visitor constructor call increments the shared counter.\n4. Four objects are created in main().\n5. All four objects update the same static variable.\n6. getTotal() is a static member function.\n7. Visitor::getTotal() calls the function using the class name and displays the shared count.",
      task: `Create a class with a static counter that increments when an object is constructed. Create three objects and print the counter.

Expected Output:
3`
    },
    {
      id: "cpp-30",
      title: "Function Templates",
      duration: "25 min",
      explanation: "Function templates allow one function definition to work with different data types. A template parameter represents a type that the compiler determines when the function is used. This avoids writing separate versions of the same algorithm for integers, floating-point numbers, and other compatible types. Templates are an important part of generic programming in C++.",
      example: `#include <iostream>
using namespace std;

template <typename T>
void showValue(T value) {
    cout << "Value: " << value << "\\n";
}

int main() {
    showValue(42);
    showValue(3.14);
    showValue('Z');
    return 0;
}`,
      exampleExplanation: "1. template <typename T> declares a function template with a type parameter named T.\n2. showValue() accepts a parameter of type T.\n3. The function displays the supplied value.\n4. showValue(42) causes the compiler to use an integer version.\n5. showValue(3.14) uses a floating-point version.\n6. showValue('Z') uses a character version.\n7. The compiler generates suitable function versions from the template.",
      task: `Write a function template minimum() that returns the smaller of two values. Call it with 3 and 7.

Expected Output:
3`
    },
    {
      id: "cpp-31",
      title: "Exception Handling",
      duration: "20 min",
      explanation: "Exception handling provides a structured way to respond to errors that occur while a program runs. The try block contains code that may fail. The throw statement signals an exception, and a matching catch block handles it. C++ provides standard exception classes for common error situations. Handling exceptions allows a program to respond appropriately instead of terminating unexpectedly.",
      example: `#include <iostream>
#include <stdexcept>
using namespace std;

int main() {
    try {
        int age = -4;

        if (age < 0) {
            throw invalid_argument("Age cannot be negative");
        }

        cout << age;
    } catch (const invalid_argument& error) {
        cout << error.what();
    }

    return 0;
}`,
      exampleExplanation: "1. stdexcept provides standard exception types such as invalid_argument.\n2. The try block contains the code that may throw an exception.\n3. age is assigned a negative value.\n4. The if condition detects the invalid value.\n5. throw creates and raises an invalid_argument exception.\n6. Execution transfers to the matching catch block.\n7. error.what() retrieves the exception message.\n8. The message is displayed using cout.",
      task: `Throw and catch a runtime_error with the message "Invalid operation". Print the exception message.

Expected Output:
Invalid operation`
    },
    {
      id: "cpp-32",
      title: "Sorting with STL",
      duration: "20 min",
      explanation: "The Standard Template Library provides reusable algorithms and containers. The sort() algorithm arranges elements in a specified range. It is available through the algorithm header and commonly uses iterators to identify the beginning and end of a range. By default, sort() arranges values in ascending order. It can also accept a comparator for custom ordering.",
      example: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> marks = {68, 92, 75, 81, 59};

    sort(marks.begin(), marks.end());

    for (int mark : marks) {
        cout << mark << " ";
    }

    return 0;
}`,
      exampleExplanation: "1. The algorithm header provides sort().\n2. marks is a vector containing five integers.\n3. begin() returns an iterator to the first element.\n4. end() returns an iterator just past the final element.\n5. sort() arranges the selected range in ascending order.\n6. The range-based for loop visits each sorted element.\n7. cout displays the marks in ascending order.",
      task: `Sort the array {4, 1, 3, 2} in ascending order and print its elements separated by spaces.

Expected Output:
1 2 3 4`
    },
    {
      id: "cpp-33",
      title: "Maps",
      duration: "20 min",
      explanation: "A map is an associative container that stores key-value pairs. Each key is unique, and elements are automatically arranged according to their keys. A map can be used to associate names with information, products with prices, or identifiers with records. The map header provides std::map. Square brackets can insert or access values, while find() can search for an existing key.",
      example: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> inventory;

    inventory["Keyboard"] = 12;
    inventory["Mouse"] = 18;
    inventory["Monitor"] = 6;

    for (const auto& item : inventory) {
        cout << item.first << ": " << item.second << "\\n";
    }

    return 0;
}`,
      exampleExplanation: "1. The map header provides the map container.\n2. inventory maps string keys to integer values.\n3. Each assignment inserts a product name and its quantity.\n4. The range-based for loop visits each key-value pair.\n5. item.first accesses the key.\n6. item.second accesses the corresponding value.\n7. The map stores unique keys and maintains key-based ordering.",
      task: `Create a map that stores Alex with a score of 90. Print Alex's score.

Expected Output:
90`
    },
    {
      id: "cpp-34",
      title: "Stacks",
      duration: "20 min",
      explanation: "A stack is a linear data structure that follows the Last In, First Out (LIFO) principle. The most recently inserted element is removed first. The standard stack container provides push() to add an element, top() to inspect the top element, and pop() to remove it. Stacks are used in undo operations, expression evaluation, and function-call management.",
      example: `#include <iostream>
#include <stack>
using namespace std;

int main() {
    stack<int> browserTabs;

    browserTabs.push(101);
    browserTabs.push(205);
    browserTabs.push(309);

    cout << browserTabs.top() << "\\n";

    browserTabs.pop();
    cout << browserTabs.top();

    return 0;
}`,
      exampleExplanation: "1. The stack header provides the standard stack container.\n2. browserTabs creates a stack of integers.\n3. Three values are inserted using push().\n4. top() returns the most recently inserted value without removing it.\n5. pop() removes the current top element.\n6. A second top() call displays the new top value.\n7. The example demonstrates the LIFO order.",
      task: `Push 10 and then 20 onto a stack. Print the top element.

Expected Output:
20`
    },
    {
      id: "cpp-35",
      title: "Pairs",
      duration: "15 min",
      explanation: "The pair utility stores exactly two values together. The two values can have different data types. The first value is accessed using first, and the second is accessed using second. Pairs are useful when returning two related values from a function or storing a simple key-value combination. Include the utility header to use std::pair.",
      example: `#include <iostream>
#include <string>
#include <utility>
using namespace std;

int main() {
    pair<string, int> event = {"Workshop", 2026};

    cout << event.first << "\\n";
    cout << event.second;

    return 0;
}`,
      exampleExplanation: "1. The utility header provides std::pair.\n2. pair<string, int> declares a pair with a string as its first type and an integer as its second type.\n3. event stores the text Workshop and the number 2026.\n4. event.first accesses the first value.\n5. event.second accesses the second value.\n6. The newline places the second value on a separate line.",
      task: `Create a pair containing the string "Notebook" and the integer 50. Print each value on a new line.

Expected Output:
Notebook
50`
    },
    {
      id: "cpp-36",
      title: "Counting with Arrays",
      duration: "20 min",
      explanation: "Counting with arrays means traversing the elements and increasing a counter whenever an element satisfies a condition. The counter should be initialized before the loop. An if statement checks each element, and the increment operator updates the count when a match is found. This technique is useful for counting values in a range, identifying categories, or calculating frequencies.",
      example: `#include <iostream>
using namespace std;

int main() {
    int marks[] = {45, 72, 88, 39, 91, 64};
    int passed = 0;

    for (int mark : marks) {
        if (mark >= 50) {
            ++passed;
        }
    }

    cout << "Passed: " << passed;
    return 0;
}`,
      exampleExplanation: "1. marks stores six integer values.\n2. passed starts at zero.\n3. The range-based for loop checks every mark.\n4. The if statement checks whether the current mark is at least 50.\n5. ++passed increases the counter when the condition is true.\n6. After all elements have been checked, the counter contains the number of passing marks.\n7. cout displays the final count.",
      task: `Count the even values in the array {1, 2, 3, 4, 5, 6} and print the count.

Expected Output:
3`
    },
    {
      id: "cpp-37",
      title: "File Handling",
      duration: "25 min",
      explanation: "C++ file handling allows programs to store information in files and retrieve it later. The fstream library provides ifstream for reading, ofstream for writing, and fstream for both operations. A file should be checked after opening to confirm that the operation succeeded. Closing a file completes the operation and releases its associated resources.",
      example: `#include <fstream>
#include <iostream>
using namespace std;

int main() {
    ofstream report("report.txt");

    if (!report) {
        cout << "Unable to open file";
        return 1;
    }

    report << "Monthly report generated";
    report.close();

    cout << "Report saved";
    return 0;
}`,
      exampleExplanation: "1. The fstream header provides file stream classes.\n2. ofstream creates or opens report.txt for writing.\n3. The if condition checks whether the file was opened successfully.\n4. If opening fails, an error message is displayed and the program returns 1.\n5. report writes text into the file.\n6. close() closes the output stream.\n7. The success message is displayed after the file is written.",
      task: `Write "Hello File" to a file named message.txt. Print "File written" after writing successfully.

Expected Output:
File written`
    },
    {
      id: "cpp-38",
      title: "Range-Based For Loops",
      duration: "15 min",
      explanation: "A range-based for loop iterates over each element in an array or container without requiring a manually managed index. It makes collection traversal simpler and reduces indexing mistakes. Use a reference when you need to modify the original elements or avoid copying larger objects. Use a const reference when you only need to read the elements.",
      example: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<double> distances = {2.5, 4.0, 6.5};

    for (const double& distance : distances) {
        cout << distance * 1000 << " ";
    }

    return 0;
}`,
      exampleExplanation: "1. distances is a vector containing three decimal values.\n2. The range-based for loop visits each element automatically.\n3. const double& distance refers to the current element without copying it.\n4. const prevents modification through the reference.\n5. Multiplying each distance by 1000 converts the values into meters.\n6. cout displays each converted value followed by a space.",
      task: `Use a range-based for loop to print the vector elements 2, 4, and 6 separated by spaces.

Expected Output:
2 4 6`
    },
    {
      id: "cpp-39",
      title: "Moving Smart Pointers",
      duration: "25 min",
      explanation: "A unique_ptr represents exclusive ownership of a dynamically managed resource. It cannot be copied because copying would create multiple owners of a resource intended to have one owner. Ownership can be transferred using std::move. After the transfer, the original unique_ptr becomes empty and the destination pointer owns the resource.",
      example: `#include <iostream>
#include <memory>
#include <utility>
using namespace std;

int main() {
    auto original = make_unique<string>("CodeMentor");
    auto transferred = move(original);

    if (!original) {
        cout << "Ownership transferred\\n";
    }

    cout << *transferred;
    return 0;
}`,
      exampleExplanation: "1. The memory header provides unique_ptr and make_unique.\n2. original owns a dynamically managed string.\n3. move(original) transfers ownership to transferred.\n4. After the move, original is empty.\n5. The if condition checks whether original contains no resource.\n6. Dereferencing transferred accesses the managed string.\n7. The destination pointer remains responsible for releasing the resource.",
      task: `Create a unique_ptr containing 25, move ownership to a second unique_ptr, and print the value using the second pointer.

Expected Output:
25`
    },
    {
      id: "cpp-40",
      title: "Loop Indexes",
      duration: "15 min",
      explanation: "An index represents the position of an element in an array or container. C++ array indexes start at zero, and the last valid index is one less than the number of elements. A loop index can move forward or backward depending on the task. Always ensure that the index remains within the valid range to avoid accessing invalid memory.",
      example: `#include <iostream>
using namespace std;

int main() {
    int values[] = {11, 22, 33, 44, 55};

    for (int i = 4; i >= 0; --i) {
        cout << values[i] << " ";
    }

    return 0;
}`,
      exampleExplanation: "1. values declares an array containing five integers.\n2. The loop begins at index 4, the final valid index.\n3. The condition i >= 0 keeps the index within the array.\n4. values[i] accesses the element at the current position.\n5. --i moves the index backward after each iteration.\n6. The array elements are displayed in reverse order.",
      task: `Use a loop to print the indexes from 0 through 4, separated by spaces.

Expected Output:
0 1 2 3 4`
    },
    {
      id: "cpp-41",
      title: "Linear Search",
      duration: "20 min",
      explanation: "Linear search checks elements one by one until the required value is found or the collection ends. It works with both sorted and unsorted data. The algorithm starts from the first element and compares each element with the target. If the target is found, its position can be returned. If it is not found, a special value such as -1 can indicate failure. Linear search has O(n) time complexity.",
      example: `#include <iostream>
using namespace std;

int main() {
    int values[] = {18, 25, 31, 42, 57, 63};
    int target = 42;
    int position = -1;

    for (int i = 0; i < 6; ++i) {
        if (values[i] == target) {
            position = i;
            break;
        }
    }

    cout << "Position: " << position;
    return 0;
}`,
      exampleExplanation: "1. values contains six integers.\n2. target stores the value that must be located.\n3. position begins at -1 to indicate that the target has not been found.\n4. The for loop examines each element from left to right.\n5. The if statement compares the current element with target.\n6. When a match is found, its index is stored in position.\n7. break stops the search because no further comparisons are needed.\n8. The final statement displays the found position.",
      task: `Use linear search to find 9 in the array {4, 7, 9, 12}. Print its zero-based index.

Expected Output:
2`
    },
    {
      id: "cpp-42",
      title: "Binary Search",
      duration: "25 min",
      explanation: "Binary search is an efficient searching algorithm that works on sorted data. It compares the target with the middle element and eliminates half of the remaining search range after each comparison. The process continues until the target is found or the range becomes empty. Binary search has O(log n) time complexity, making it more efficient than linear search for large sorted collections.",
      example: `#include <iostream>
using namespace std;

int main() {
    int data[] = {4, 8, 12, 16, 20, 24, 28};
    int target = 20;

    int low = 0;
    int high = 6;
    int result = -1;

    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (data[mid] == target) {
            result = mid;
            break;
        } else if (data[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    cout << result;
    return 0;
}`,
      exampleExplanation: "1. data is a sorted array, which is required for binary search.\n2. target stores the value to locate.\n3. low and high represent the current search boundaries.\n4. mid calculates the middle index without adding low and high directly.\n5. If the middle element matches the target, its index is stored.\n6. If the middle value is smaller, low moves to the right half.\n7. Otherwise, high moves to the left half.\n8. The loop ends when the target is found or the search range becomes empty.",
      task: `Use binary search to find 8 in the sorted array {2, 4, 6, 8, 10}. Print its zero-based index.

Expected Output:
3`
    },
    {
      id: "cpp-43",
      title: "Bubble Sort",
      duration: "25 min",
      explanation: "Bubble sort is a comparison-based sorting algorithm. It repeatedly compares neighboring elements and swaps them when they are in the wrong order. After each pass, one of the largest remaining values reaches its correct position near the end. The algorithm is easy to understand but has O(n²) average and worst-case time complexity, so it is not suitable for very large datasets.",
      example: `#include <iostream>
#include <utility>
using namespace std;

int main() {
    int values[] = {9, 4, 7, 2, 6};
    int n = 5;

    for (int pass = 0; pass < n - 1; ++pass) {
        for (int j = 0; j < n - pass - 1; ++j) {
            if (values[j] > values[j + 1]) {
                swap(values[j], values[j + 1]);
            }
        }
    }

    for (int value : values) {
        cout << value << " ";
    }

    return 0;
}`,
      exampleExplanation: "1. values contains five unsorted integers.\n2. The outer loop controls the sorting passes.\n3. The inner loop compares neighboring elements.\n4. If the left element is larger, swap() exchanges the two values.\n5. Each pass moves a larger value toward the end of the unsorted section.\n6. The inner loop becomes shorter after every completed pass.\n7. The final loop displays the sorted array.",
      task: `Sort the array {5, 1, 4, 2} in ascending order using bubble sort. Print the result separated by spaces.

Expected Output:
1 2 4 5`
    },
    {
      id: "cpp-44",
      title: "Descending Sort",
      duration: "20 min",
      explanation: "Sorting can arrange values in ascending or descending order. The STL sort() algorithm accepts a comparator that defines the required ordering. The greater() comparator places larger values before smaller values. Custom comparators can also be used to sort complex objects according to a selected member or rule.",
      example: `#include <algorithm>
#include <functional>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> temperatures = {18, 31, 24, 12, 27};

    sort(
        temperatures.begin(),
        temperatures.end(),
        greater<int>()
    );

    for (int temperature : temperatures) {
        cout << temperature << " ";
    }

    return 0;
}`,
      exampleExplanation: "1. temperatures stores five integer values in a vector.\n2. sort() receives the beginning and ending iterators of the vector.\n3. greater<int>() provides a descending comparison rule.\n4. The algorithm arranges larger values before smaller values.\n5. The range-based for loop visits the sorted values.\n6. The output displays the temperatures in descending order.",
      task: `Sort the array {2, 5, 1, 4} in descending order and print its elements separated by spaces.

Expected Output:
5 4 2 1`
    },
    {
      id: "cpp-45",
      title: "Recursion",
      duration: "25 min",
      explanation: "Recursion is a technique in which a function calls itself to solve a smaller version of a problem. Every recursive function needs a base case that stops the recursive calls. The recursive case must make progress toward that base case. Recursion is commonly used for mathematical problems, tree traversal, and divide-and-conquer algorithms. Each call uses additional function-call stack space.",
      example: `#include <iostream>
using namespace std;

int powerOfTwo(int n) {
    if (n == 0) {
        return 1;
    }

    return 2 * powerOfTwo(n - 1);
}

int main() {
    cout << powerOfTwo(5);
    return 0;
}`,
      exampleExplanation: "1. powerOfTwo() is a recursive function.\n2. The base case checks whether n is zero.\n3. When n is zero, the function returns 1 and stops recursion.\n4. Otherwise, it multiplies 2 by the result of powerOfTwo(n - 1).\n5. Each recursive call reduces n by one.\n6. The calls eventually reach the base case.\n7. The returned values combine to calculate the required power of two.",
      task: `Write a recursive function that calculates the sum of integers from 1 through 5.

Expected Output:
15`
    },
    {
      id: "cpp-46",
      title: "Linked Lists",
      duration: "25 min",
      explanation: "A linked list is a linear data structure made up of nodes. Each node stores data and a pointer to another node. In a singly linked list, each node points to the next node, and the final node points to nullptr. Unlike arrays, linked-list nodes do not need to occupy consecutive memory locations. Linked lists support flexible insertion and deletion operations.",
      example: `#include <iostream>
using namespace std;

struct Node {
    string name;
    Node* next;

    Node(string value) : name(value), next(nullptr) {}
};

int main() {
    Node first("Asha");
    Node second("Kiran");

    first.next = &second;

    Node* current = &first;

    while (current != nullptr) {
        cout << current->name << " ";
        current = current->next;
    }

    return 0;
}`,
      exampleExplanation: "1. Node defines a structure containing a string and a pointer to the next node.\n2. The constructor initializes the name and sets next to nullptr.\n3. first and second create two separate nodes.\n4. first.next connects the first node to the second.\n5. current points to the first node to begin traversal.\n6. The while loop continues while current is not nullptr.\n7. current->name accesses the current node's data.\n8. current = current->next moves to the next node.",
      task: `Create a linked list with nodes containing 10 and 20. Traverse the list and print the values separated by spaces.

Expected Output:
10 20`
    },
    {
      id: "cpp-47",
      title: "Binary Trees",
      duration: "25 min",
      explanation: "A binary tree is a hierarchical data structure in which each node can have at most two children. These children are commonly called the left child and right child. The first node is the root. Nodes without children are called leaf nodes. Binary trees are used in searching, sorting, expression evaluation, and hierarchical data representation.",
      example: `#include <iostream>
using namespace std;

struct TreeNode {
    char value;
    TreeNode* left;
    TreeNode* right;

    TreeNode(char v)
        : value(v), left(nullptr), right(nullptr) {}
};

int main() {
    TreeNode root('A');
    TreeNode leftChild('B');
    TreeNode rightChild('C');

    root.left = &leftChild;
    root.right = &rightChild;

    cout << root.value << " ";
    cout << root.left->value << " ";
    cout << root.right->value;

    return 0;
}`,
      exampleExplanation: "1. TreeNode defines a node containing a character and two child pointers.\n2. The constructor initializes the value and sets both pointers to nullptr.\n3. root creates the top node of the tree.\n4. leftChild and rightChild create two additional nodes.\n5. root.left connects the left child to the root.\n6. root.right connects the right child to the root.\n7. The dot and arrow operators access members through objects and pointers.",
      task: `Create a binary tree with root 1 and children 2 and 3. Print the root, left child, and right child values separated by spaces.

Expected Output:
1 2 3`
    },
    {
      id: "cpp-48",
      title: "Breadth-First Search",
      duration: "30 min",
      explanation: "Breadth-first search (BFS) is a graph traversal algorithm that explores vertices level by level. It uses a queue to process discovered vertices in first-in, first-out order. A visited array or collection prevents the algorithm from processing the same vertex repeatedly. BFS is useful for finding the shortest path in an unweighted graph and exploring connected components.",
      example: `#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    vector<vector<int>> graph = {
        {1, 2},
        {0, 3},
        {0, 3},
        {1, 2}
    };

    vector<bool> visited(4, false);
    queue<int> pending;

    pending.push(2);
    visited[2] = true;

    while (!pending.empty()) {
        int current = pending.front();
        pending.pop();

        cout << current << " ";

        for (int neighbour : graph[current]) {
            if (!visited[neighbour]) {
                visited[neighbour] = true;
                pending.push(neighbour);
            }
        }
    }

    return 0;
}`,
      exampleExplanation: "1. graph stores the adjacency list of a four-vertex graph.\n2. visited records whether each vertex has already been discovered.\n3. pending is a queue used to process vertices in BFS order.\n4. The traversal starts from vertex 2.\n5. The starting vertex is marked visited and inserted into the queue.\n6. The while loop processes vertices until the queue is empty.\n7. Each unvisited neighbour is marked visited and added to the queue.\n8. The traversal visits vertices level by level.",
      task: `Perform breadth-first search starting at vertex 0 on a graph that produces the traversal order 0, 1, 2, 3. Print the vertices separated by spaces.

Expected Output:
0 1 2 3`
    },
    {
      id: "cpp-49",
      title: "Structures",
      duration: "20 min",
      explanation: "A structure, declared using struct, is a user-defined type that groups related variables under one name. Structures are useful for representing records such as students, employees, products, and coordinates. In C++, structure members are public by default. A structure can also contain member functions and constructors.",
      example: `#include <iostream>
#include <string>
using namespace std;

struct LibraryBook {
    string title;
    string author;
    int publicationYear;
};

int main() {
    LibraryBook book = {
        "The Hobbit",
        "J.R.R. Tolkien",
        1937
    };

    cout << book.title << "\\n";
    cout << book.author << "\\n";
    cout << book.publicationYear;

    return 0;
}`,
      exampleExplanation: "1. LibraryBook declares a structure for storing book details.\n2. title and author are string members.\n3. publicationYear is an integer member.\n4. The book variable creates a LibraryBook object.\n5. The initializer assigns values to the members in declaration order.\n6. The dot operator accesses each member.\n7. The output displays the title, author, and publication year on separate lines.",
      task: `Create a Student structure with name "A" and mark 90. Print the name and mark on separate lines.

Expected Output:
A
90`
    },
    {
      id: "cpp-50",
      title: "Sorting and Searching Mini Project",
      duration: "30 min",
      explanation: "Sorting and searching are fundamental operations in data processing. Sorting arranges values into an ordered sequence, while searching locates a particular value. A common workflow is to sort a collection first and then use binary search to find a target. This combination is useful when repeated searches must be performed on the same dataset. Always ensure that the data is sorted before using binary search.",
      example: `#include <algorithm>
#include <iostream>
using namespace std;

int main() {
    int scores[] = {72, 45, 91, 63, 84, 58};
    int size = 6;

    sort(scores, scores + size);

    int target = 84;
    int* result = lower_bound(scores, scores + size, target);

    if (result != scores + size && *result == target) {
        cout << "Score located";
    } else {
        cout << "Score unavailable";
    }

    return 0;
}`,
      exampleExplanation: "1. scores stores six unsorted integer values.\n2. size stores the number of array elements.\n3. sort() arranges the values in ascending order.\n4. target stores the value that must be searched for.\n5. lower_bound() finds the first position whose value is not less than target.\n6. The if condition checks that the returned pointer is within the array and points to the target.\n7. If the target exists, the program displays Score located.\n8. Otherwise, it displays Score unavailable.",
      task: `Sort the array {4, 1, 3, 2}, use binary search to find 3, and print "Found." if the value exists.

Expected Output:
Found.`
    }
  ]
},
{
  id: "web",
  title: "Complete Web Development",
  language: "HTML, CSS & JavaScript",
  description:
    "Learn to build real websites from scratch, starting with HTML structure, styling with CSS, responsive layouts, and interactive JavaScript projects.",
  level: "Beginner to Intermediate",
  lessons: [
    {
      id: "web-1",
      title: "Introduction to Web Development",
      duration: "15 min",
      explanation:
        "Web development is the process of creating websites and web applications. HTML creates the structure, CSS controls the appearance, and JavaScript adds interaction. For example, a learning platform uses HTML for lesson sections, CSS for its dashboard design, and JavaScript for interactive controls.",
      example: `<!-- HTML structure -->
<h1>Learning Portal</h1>
<p>Explore programming courses.</p>`,
      exampleExplanation: `1. The HTML comment describes the purpose of the code.
2. <h1> creates the main heading.
3. <p> creates a paragraph.
4. HTML defines the structure and content of a webpage.
5. CSS and JavaScript can be added to improve its appearance and behaviour.`,
      task: `Create a simple webpage with the heading "My First Website" and the paragraph "Welcome to my website!".
Expected output:
My First Website
Welcome to my website!`,
    },
    {
      id: "web-2",
      title: "Understanding HTML",
      duration: "15 min",
      explanation:
        "HTML stands for HyperText Markup Language. It uses elements and tags to organize webpage content. Browsers interpret HTML to display headings, paragraphs, images, links, and other content.",
      example: `<h2>Course Information</h2>
<p>Learn programming step by step.</p>`,
      exampleExplanation: `1. <h2> creates a second-level heading.
2. The heading contains the text Course Information.
3. <p> creates a paragraph.
4. The paragraph contains descriptive content.
5. Opening and closing tags define most HTML elements.`,
      task: `Write HTML containing the heading "Technology News" and the paragraph "Discover the latest technology updates.".
Expected output:
Technology News
Discover the latest technology updates.`,
    },
    {
      id: "web-3",
      title: "HTML Document Structure",
      duration: "20 min",
      explanation:
        "A standard HTML document uses doctype, html, head, and body elements. The head contains document information, while the body contains visible content. A correct document structure helps browsers interpret the webpage consistently.",
      example: `<!DOCTYPE html>
<html>
<head>
  <title>Library Portal</title>
</head>
<body>
  <h1>Welcome to the Library</h1>
  <p>Browse available books.</p>
</body>
</html>`,
      exampleExplanation: `1. <!DOCTYPE html> declares a modern HTML document.
2. <html> contains the complete document.
3. <head> contains metadata and document information.
4. <title> sets the browser tab title.
5. <body> contains visible webpage content.
6. The heading and paragraph are displayed inside the body.`,
      task: `Create a complete HTML document with the page title "Student Portal" and a visible heading "Student Portal".
Expected output:
Student Portal`,
    },
    {
      id: "web-4",
      title: "HTML Headings",
      duration: "15 min",
      explanation:
        "HTML provides six heading levels, from h1 to h6. They organize content into a hierarchy. Use h1 for the main topic and lower-level headings for related sections and subsections.",
      example: `<h1>Computer Science</h1>
<h2>Programming Languages</h2>
<h3>Learning C++</h3>`,
      exampleExplanation: `1. <h1> creates the main heading.
2. <h2> creates a second-level heading.
3. <h3> creates a third-level heading.
4. HTML provides six heading levels.
5. Heading levels should reflect the structure of the content.`,
      task: `Create three headings: "Programming" as h1, "Web Development" as h2, and "HTML Basics" as h3.
Expected output:
Programming
Web Development
HTML Basics`,
    },
    {
      id: "web-5",
      title: "HTML Paragraphs and Line Breaks",
      duration: "15 min",
      explanation:
        "The p element creates a paragraph, while br inserts a line break. Paragraphs organize related text into readable blocks. A line break is useful when separate lines belong to the same paragraph.",
      example: `<p>Welcome to the course.</p>
<p>Practice a little every day.</p>
<p>Monday<br>Tuesday</p>`,
      exampleExplanation: `1. The first p element creates a paragraph.
2. The second p element creates another paragraph.
3. The third p element groups two lines.
4. The br element moves the following text to a new line.
5. br is a void element and does not require a closing tag.`,
      task: `Create two paragraphs containing "Learn HTML" and "Build your first webpage.", followed by a paragraph with "Line one" and "Line two" on separate lines.
Expected output:
Learn HTML
Build your first webpage.
Line one
Line two`,
    },
    {
      id: "web-6",
      title: "Text Formatting",
      duration: "20 min",
      explanation:
        "HTML provides elements for communicating meaning and emphasis. strong indicates importance, em adds emphasis, mark highlights text, and del represents deleted content. These semantic elements help users understand the purpose of formatted text.",
      example: `<strong>Account security</strong>
<em>Check your details</em>
<mark>New announcement</mark>
<del>Old schedule</del>`,
      exampleExplanation: `1. strong indicates strongly important content.
2. em adds emphasis to text.
3. mark highlights a portion of text.
4. del represents content that has been deleted.
5. These elements provide meaning as well as visual formatting.`,
      task: `Use strong, em, mark, and del to format the phrases "Important notice", "Read carefully", "Special offer", and "₹999" respectively.
Expected output:
Important notice
Read carefully
Special offer
₹999`,
    },
    {
      id: "web-7",
      title: "HTML Links",
      duration: "20 min",
      explanation:
        "The a element creates hyperlinks between webpages and resources. The href attribute specifies the destination. Links can connect pages within the same website or direct visitors to external websites.",
      example: `<a href="https://developer.mozilla.org">Read Web Documentation</a>`,
      exampleExplanation: `1. The a element creates a hyperlink.
2. href specifies the destination URL.
3. The text between the tags becomes the clickable link.
4. Clicking the link navigates to the specified destination.
5. A link can point to another page or an external resource.`,
      task: `Create a hyperlink with the visible text "Visit Example" and the destination "https://example.com".
Expected output:
Visit Example`,
    },
    {
      id: "web-8",
      title: "Adding Images",
      duration: "20 min",
      explanation:
        "The img element embeds an image in a webpage. The src attribute identifies the image file, while alt provides alternative text. Descriptive alternative text improves accessibility and helps users when an image cannot load.",
      example: `<img src="campus.jpg" alt="College campus building">`,
      exampleExplanation: `1. img embeds an image.
2. src specifies the image file location.
3. alt provides a text description.
4. Screen readers can use alternative text to describe the image.
5. The referenced image file must be available for it to display.`,
      task: `Create an image element with the source "product.jpg" and alternative text "Blue backpack".
Expected output:
An image element with alt text: Blue backpack`,
    },
    {
      id: "web-9",
      title: "HTML Lists",
      duration: "20 min",
      explanation:
        "HTML provides unordered and ordered lists. The ul element creates a bulleted list, while ol creates a numbered list. Each item is represented using li. Lists are useful for navigation menus, instructions, and feature descriptions.",
      example: `<ul>
  <li>Python</li>
  <li>C++</li>
  <li>Java</li>
</ul>
<ol>
  <li>Register</li>
  <li>Sign in</li>
</ol>`,
      exampleExplanation: `1. ul creates an unordered list.
2. Each li represents one list item.
3. The unordered list displays programming languages.
4. ol creates an ordered list.
5. The browser automatically numbers the ordered list items.`,
      task: `Create an unordered list containing "HTML" and "CSS", followed by an ordered list containing "Choose product" and "Checkout".
Expected output:
HTML
CSS
1. Choose product
2. Checkout`,
    },
    {
      id: "web-10",
      title: "HTML Tables",
      duration: "20 min",
      explanation:
        "Tables organize structured information into rows and columns. The table element creates the table, tr creates rows, th creates header cells, and td creates data cells. Tables are useful for displaying schedules, results, and comparisons.",
      example: `<table>
  <tr>
    <th>Day</th>
    <th>Subject</th>
  </tr>
  <tr>
    <td>Monday</td>
    <td>Mathematics</td>
  </tr>
</table>`,
      exampleExplanation: `1. table creates the table structure.
2. tr creates a row.
3. th creates a header cell.
4. The first row contains the column headings.
5. td creates ordinary data cells.
6. The second row contains the actual information.`,
      task: `Create a table with the headers "Subject" and "Marks", and one row containing "Maths" and "90".
Expected output:
Subject | Marks
Maths | 90`,
    },
    {
      id: "web-11",
      title: "HTML Forms",
      duration: "20 min",
      explanation:
        "Forms collect information from visitors. They are used for registration, login, feedback, and search pages. Form controls include labels, input fields, buttons, checkboxes, and selection lists.",
      example: `<form>
  <label for="city">City</label>
  <input id="city" name="city" type="text">
  <button type="submit">Continue</button>
</form>`,
      exampleExplanation: `1. form groups related form controls.
2. label provides a description for the input.
3. The label's for value matches the input's id.
4. type="text" creates a text field.
5. name identifies the field when form data is submitted.
6. The submit button allows the user to submit the form.`,
      task: `Create a form with a label "Username", a text input, and a submit button labelled "Submit".
Expected output:
Username
Text input
Submit`,
    },
    {
      id: "web-12",
      title: "Input Types and Validation",
      duration: "20 min",
      explanation:
        "HTML input elements support different types, including text, email, password, number, and date. Validation attributes such as required, min, max, and minlength help browsers check input before submission.",
      example: `<input type="text" required minlength="3">
<input type="date">
<input type="number" min="10" max="50">`,
      exampleExplanation: `1. type="text" creates a text input.
2. required makes the field mandatory.
3. minlength="3" requires at least three characters.
4. type="date" provides a date input control.
5. type="number" creates a numeric field.
6. min and max specify the permitted numeric range.`,
      task: `Create a required email input, a required password input, and a number input that accepts values from 1 to 100.
Expected output:
Required email input
Required password input
Number input: 1 to 100`,
    },
    {
      id: "web-13",
      title: "Semantic HTML",
      duration: "20 min",
      explanation:
        "Semantic elements describe the purpose of webpage content. Elements such as header, nav, main, section, article, and footer make the page easier for browsers, assistive technologies, and developers to understand.",
      example: `<header>Course Dashboard</header>
<nav>Dashboard | Lessons</nav>
<main>
  <section>
    <h2>Available Courses</h2>
  </section>
</main>
<footer>Help Centre</footer>`,
      exampleExplanation: `1. header contains introductory content.
2. nav represents navigation links.
3. main contains the primary page content.
4. section groups related information.
5. footer contains closing or supporting information.
6. Semantic elements communicate the role of each page section.`,
      task: `Build a webpage structure using header, nav, main, article, and footer. Include the text "My Website", "Home | Courses", "Latest updates", and "Contact us" in the corresponding elements.
Expected output:
My Website
Home | Courses
Latest updates
Contact us`,
    },
    {
      id: "web-14",
      title: "HTML Audio and Video",
      duration: "20 min",
      explanation:
        "HTML supports embedded media through audio and video elements. The controls attribute displays built-in playback controls. The src attribute identifies the media file that the browser should load.",
      example: `<audio controls src="podcast.mp3"></audio>
<video controls width="480" src="demo.mp4"></video>`,
      exampleExplanation: `1. audio embeds an audio player.
2. controls displays playback controls.
3. src identifies the audio file.
4. video embeds a video player.
5. width sets the video display width.
6. Video controls allow users to play, pause, and navigate the media.`,
      task: `Create an audio player for "lesson.mp3" and a video player for "lesson.mp4", both with controls.
Expected output:
Audio player with controls
Video player with controls`,
    },
    {
      id: "web-15",
      title: "HTML Project: Profile Page",
      duration: "30 min",
      explanation:
        "A profile page combines headings, paragraphs, images, links, and lists to introduce a person. This structure is useful for student profiles, professional introductions, and personal portfolios.",
      example: `<main>
  <h1>About the Developer</h1>
  <p>Interested in building useful applications.</p>
  <h2>Interests</h2>
  <ul>
    <li>Technology</li>
    <li>Design</li>
  </ul>
</main>`,
      exampleExplanation: `1. main groups the primary page content.
2. h1 creates the profile's main heading.
3. p displays an introduction.
4. h2 creates a subsection heading.
5. ul creates an unordered list.
6. Each li represents one interest.`,
      task: `Create a profile page with the heading "Student Profile", a paragraph "I am learning web development.", a subheading "Skills", and a list containing HTML and CSS.
Expected output:
Student Profile
I am learning web development.
Skills
HTML
CSS`,
    },
    {
      id: "web-16",
      title: "Introduction to CSS",
      duration: "15 min",
      explanation:
        "CSS stands for Cascading Style Sheets. It controls the appearance of HTML elements, including colours, spacing, typography, and layout. CSS can be written inline, inside a style element, or in an external stylesheet.",
      example: `<style>
h2 {
  color: purple;
  text-align: center;
}
</style>
<h2>Course Dashboard</h2>`,
      exampleExplanation: `1. style contains CSS rules.
2. h2 selects second-level headings.
3. color changes the heading text colour.
4. text-align centers the text.
5. The browser applies these styles to matching h2 elements.`,
      task: `Write CSS that makes the h1 heading "Welcome" blue.
Expected output:
Welcome (displayed in blue)`,
    },
    {
      id: "web-17",
      title: "CSS Selectors",
      duration: "20 min",
      explanation:
        "CSS selectors identify which HTML elements receive styles. Element selectors target tags, class selectors target reusable groups, and ID selectors target a particular element. Attribute selectors can also target elements based on their attributes.",
      example: `<style>
h2 { color: navy; }
.notice { background-color: yellow; }
#footer { text-align: center; }
</style>`,
      exampleExplanation: `1. h2 selects all second-level headings.
2. color sets the selected heading text colour.
3. .notice selects elements with class="notice".
4. background-color sets their background.
5. #footer selects the element with id="footer".
6. text-align centers the selected element's content.`,
      task: `Write CSS that makes elements with class "card" green, the element with ID "title" blue, and all paragraphs 16px in size.
Expected output:
.card: green
#title: blue
p: 16px`,
    },
    {
      id: "web-18",
      title: "Colors and Backgrounds",
      duration: "20 min",
      explanation:
        "CSS supports named colours, hexadecimal values, RGB, and other colour formats. Background properties can style entire pages or individual components. Consistent colours help create a clear visual hierarchy.",
      example: `<style>
body {
  background-color: #e8f4ff;
}
h2 {
  color: rgb(30, 60, 120);
}
</style>`,
      exampleExplanation: `1. body selects the document body.
2. background-color sets the page background.
3. The hexadecimal value represents a light blue colour.
4. h2 selects second-level headings.
5. rgb() specifies a colour using red, green, and blue values.`,
      task: `Set the page background to #f0f0f0 and the h1 text color to #222222.
Expected output:
Background: #f0f0f0
Heading color: #222222`,
    },
    {
      id: "web-19",
      title: "CSS Fonts and Text",
      duration: "20 min",
      explanation:
        "CSS provides typography properties such as font-family, font-size, font-weight, line-height, and text-align. These properties control how text looks and how comfortably users can read it.",
      example: `<style>
h2 {
  font-family: Georgia, serif;
  font-size: 24px;
  font-weight: 700;
}
p {
  line-height: 1.6;
}
</style>`,
      exampleExplanation: `1. h2 selects second-level headings.
2. font-family selects Georgia with a serif fallback.
3. font-size sets the heading size.
4. font-weight controls the thickness of the text.
5. p selects paragraph elements.
6. line-height controls the spacing between lines.`,
      task: `Style paragraphs with Arial or a sans-serif fallback, a font size of 18px, and a line height of 1.5.
Expected output:
Font: Arial, sans-serif
Font size: 18px
Line height: 1.5`,
    },
    {
      id: "web-20",
      title: "CSS Box Model",
      duration: "20 min",
      explanation:
        "The CSS box model describes how an element's content, padding, border, and margin determine its size and spacing. Understanding these layers helps create layouts with consistent spacing.",
      example: `<style>
.profile {
  width: 280px;
  padding: 15px;
  border: 2px solid gray;
  margin: 18px;
}
</style>`,
      exampleExplanation: `1. .profile selects elements with the profile class.
2. width sets the content width.
3. padding adds space inside the border.
4. border draws an outline around the element.
5. margin adds space outside the border.
6. Together, these properties determine the element's box dimensions and spacing.`,
      task: `Create a .card rule with 20px padding, a 1px solid black border, 10px margin, and border-box sizing.
Expected output:
Padding: 20px
Border: 1px solid black
Margin: 10px
Box sizing: border-box`,
    },
    {
      id: "web-21",
      title: "CSS Width, Height and Units",
      duration: "20 min",
      explanation:
        "CSS uses units such as px, %, rem, em, vh, and vw. Pixels are useful for precise dimensions, while relative units help layouts adapt to their containers and screens.",
      example: `<style>
.sidebar {
  width: 18rem;
  min-height: 50vh;
  padding: 2rem;
}
</style>`,
      exampleExplanation: `1. .sidebar selects elements with the sidebar class.
2. width: 18rem sets its width relative to the root font size.
3. min-height: 50vh makes it at least half the viewport height.
4. padding adds internal spacing.
5. Relative units help layouts adapt to different screen sizes.`,
      task: `Style a .panel element with width 80%, minimum height 200px, and padding 1rem.
Expected output:
Width: 80%
Minimum height: 200px
Padding: 1rem`,
    },
    {
      id: "web-22",
      title: "CSS Display Property",
      duration: "20 min",
      explanation:
        "The display property controls how elements participate in layout. Block elements normally occupy a new line, inline elements flow with text, inline-block elements allow dimensions while remaining inline, and none hides an element.",
      example: `<style>
.menu-item { display: inline-block; }
.description { display: block; }
.optional { display: none; }
</style>`,
      exampleExplanation: `1. .menu-item selects menu item elements.
2. inline-block allows elements to appear inline while supporting dimensions.
3. .description uses block layout.
4. Block elements normally begin on a new line.
5. .optional uses display: none.
6. Elements with display: none do not appear or occupy layout space.`,
      task: `Write CSS rules that set .block to block, .inline to inline, and .hidden to none.
Expected output:
.block: block
.inline: inline
.hidden: none`,
    },
    {
      id: "web-23",
      title: "CSS Positioning",
      duration: "20 min",
      explanation:
        "CSS positioning controls where elements appear. Static is the normal position, relative offsets an element from its normal location, absolute positions it relative to a containing block, fixed attaches it to the viewport, and sticky combines normal and scroll-based positioning.",
      example: `<style>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
}
.tooltip {
  position: relative;
  top: 6px;
}
</style>`,
      exampleExplanation: `1. .sidebar selects the sidebar.
2. position: fixed attaches it to the viewport.
3. left and top set its position offsets.
4. .tooltip selects the tooltip element.
5. position: relative keeps its normal layout space.
6. top: 6px shifts it downward from its normal position.`,
      task: `Make .navbar sticky at the top and position .badge absolutely 10px from the top and right.
Expected output:
Navbar: sticky, top 0
Badge: absolute, top 10px, right 10px`,
    },
    {
      id: "web-24",
      title: "Flexbox Layout",
      duration: "25 min",
      explanation:
        "Flexbox is a one-dimensional layout system for arranging items in a row or column. It provides control over alignment, spacing, direction, and wrapping. It is commonly used for navigation bars and groups of cards.",
      example: `<style>
.toolbar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 12px;
}
</style>`,
      exampleExplanation: `1. .toolbar selects the toolbar container.
2. display: flex enables Flexbox.
3. flex-direction: column arranges items vertically.
4. justify-content centers items along the main axis.
5. align-items aligns items along the cross axis.
6. gap adds spacing between flex items.`,
      task: `Create a flex container that spaces items apart, aligns them vertically in the center, and adds a 16px gap.
Expected output:
Display: flex
Justify content: space-between
Align items: center
Gap: 16px`,
    },
    {
      id: "web-25",
      title: "CSS Grid Layout",
      duration: "25 min",
      explanation:
        "CSS Grid is a two-dimensional layout system that organizes elements into rows and columns. It is useful for dashboards, galleries, and page layouts where both horizontal and vertical alignment matter.",
      example: `<style>
.gallery {
  display: grid;
  grid-template-columns: 150px 150px;
  grid-auto-rows: 120px;
  gap: 14px;
}
</style>`,
      exampleExplanation: `1. .gallery selects the grid container.
2. display: grid enables CSS Grid.
3. grid-template-columns creates two columns of 150 pixels each.
4. grid-auto-rows sets the height of automatically created rows.
5. gap adds space between grid items.
6. Grid provides control over both rows and columns.`,
      task: `Create a grid with three equal-width columns and a 20px gap between items.
Expected output:
Display: grid
Columns: repeat(3, 1fr)
Gap: 20px`,
    },
        {
      id: "web-26",
      title: "Borders, Shadows and Rounded Corners",
      duration: "20 min",
      explanation:
        "CSS borders outline elements, border-radius rounds their corners, and box-shadow adds depth. These properties help distinguish cards, panels, and buttons from their surroundings.",
      example: `<style>
.avatar {
  width: 90px;
  height: 90px;
  border: 3px solid #64748b;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
</style>`,
      exampleExplanation: `1. .avatar selects the avatar element.
2. width and height define its dimensions.
3. border adds an outline.
4. border-radius: 50% creates a circular shape when the dimensions are equal.
5. box-shadow adds a shadow.
6. rgba() defines a colour with transparency.`,
      task: `Style a .card with a 1px solid #dddddd border, 12px rounded corners, and a subtle 0 4px 8px shadow using black at 10% opacity.
Expected output:
Border: 1px solid #dddddd
Border radius: 12px
Box shadow: 0 4px 8px rgba(0, 0, 0, 0.1)`,
    },
    {
      id: "web-27",
      title: "CSS Pseudo-Classes",
      duration: "20 min",
      explanation:
        "Pseudo-classes select elements based on a particular state. Examples include hover, focus, active, first-child, and checked. They help interfaces respond visually to user interaction.",
      example: `<style>
input:focus {
  outline: 2px solid teal;
}
li:first-child {
  font-weight: bold;
}
a:visited {
  color: purple;
}
</style>`,
      exampleExplanation: `1. input:focus selects an input while it has keyboard or pointer focus.
2. outline adds a visible focus indicator.
3. li:first-child selects the first list item among its siblings.
4. font-weight makes the selected item bold.
5. a:visited selects links the browser recognises as visited.
6. Pseudo-classes apply styles based on state or position.`,
      task: `Create a blue button with white text that changes its background to dark blue when hovered.
Expected output:
Normal background: blue
Text color: white
Hover background: darkblue`,
    },
    {
      id: "web-28",
      title: "CSS Transitions and Animations",
      duration: "25 min",
      explanation:
        "CSS transitions animate changes between property values, while keyframe animations define a sequence of visual states. Transitions are useful for hover effects, and animations can create repeated or timed visual effects.",
      example: `<style>
.card {
  transition: transform 0.4s ease;
}
.card:hover {
  transform: translateY(-5px);
}
@keyframes slideIn {
  from { transform: translateX(-20px); }
  to { transform: translateX(0); }
}
</style>`,
      exampleExplanation: `1. .card selects the card element.
2. transition defines how transform changes over time.
3. The hover rule moves the card upward.
4. @keyframes defines an animation sequence named slideIn.
5. from specifies the starting transform.
6. to specifies the final transform.`,
      task: `Add a 0.3-second ease transition to a button's background color and define a fadeIn animation from opacity 0 to opacity 1.
Expected output:
Transition: background-color 0.3s ease
Animation: opacity 0 to opacity 1`,
    },
    {
      id: "web-29",
      title: "Responsive Web Design",
      duration: "25 min",
      explanation:
        "Responsive web design makes websites adapt to phones, tablets, and desktops. Flexible widths, responsive images, and media queries help content fit different screen sizes without horizontal overflow.",
      example: `<style>
.layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}
@media (max-width: 700px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>`,
      exampleExplanation: `1. .layout selects the main layout container.
2. display: grid enables CSS Grid.
3. The default layout uses two columns.
4. @media applies styles when the viewport is 700px wide or narrower.
5. The smaller-screen rule changes the layout to one column.
6. Media queries help a page adapt to different devices.`,
      task: `Create a .container with 90% width by default and 100% width when the viewport is 600px or narrower.
Expected output:
Default width: 90%
At 600px or below: 100%`,
    },
    {
      id: "web-30",
      title: "CSS Variables",
      duration: "20 min",
      explanation:
        "CSS custom properties store reusable values. They are often used for colours, spacing, and typography in a design system. Defining a value once makes it easier to maintain a consistent website theme.",
      example: `:root {
  --accent-color: #7c3aed;
  --page-spacing: 24px;
}
section {
  padding: var(--page-spacing);
  border-color: var(--accent-color);
}`,
      exampleExplanation: `1. :root selects the document's root element.
2. --accent-color defines a reusable custom property.
3. --page-spacing stores a spacing value.
4. var() retrieves a custom property's value.
5. The section uses both variables.
6. Updating a variable changes every rule that uses it.`,
      task: `Define a CSS variable named --primary-color with value #2563eb and use it as the button background color.
Expected output:
--primary-color: #2563eb
Button background: #2563eb`,
    },
    {
      id: "web-31",
      title: "Introduction to JavaScript",
      duration: "15 min",
      explanation:
        "JavaScript makes webpages interactive. It can respond to user actions, calculate values, validate forms, update content, and communicate with servers. JavaScript runs in browsers and can also be used for server-side development.",
      example: `console.log("Welcome to coding");
console.log("Your lesson has started");`,
      exampleExplanation: `1. console.log() writes information to the developer console.
2. Text inside quotation marks is a string.
3. Each statement displays one message.
4. Multiple console.log calls produce multiple output lines.
5. JavaScript can use console output to help developers understand program behaviour.`,
      task: `Write JavaScript that prints "Hello, JavaScript!" to the console.
Expected output:
Hello, JavaScript!`,
    },
    {
      id: "web-32",
      title: "JavaScript Variables",
      duration: "20 min",
      explanation:
        "Variables store values that a program can use later. const prevents reassignment of a binding, while let allows reassignment. Choose the declaration based on whether the variable needs a new value.",
      example: `const courseName = "Python";
let completedLessons = 4;

completedLessons = 5;

console.log(courseName);
console.log(completedLessons);`,
      exampleExplanation: `1. const declares a binding that cannot be reassigned.
2. courseName stores a string.
3. let declares a variable that can be reassigned.
4. completedLessons initially stores 4.
5. The assignment changes its value to 5.
6. console.log displays both values.`,
      task: `Create a const variable named product containing "Notebook" and a let variable named quantity containing 2. Print both values.
Expected output:
Notebook
2`,
    },
    {
      id: "web-33",
      title: "JavaScript Data Types",
      duration: "20 min",
      explanation:
        "JavaScript supports primitive types such as string, number, boolean, undefined, bigint, and symbol. Objects are used to represent more complex data. Understanding data types helps prevent mistakes when comparing values and processing user input.",
      example: `const city = "Davangere";
const temperature = 28.5;
const isRaining = false;

console.log(typeof city);
console.log(typeof temperature);
console.log(typeof isRaining);`,
      exampleExplanation: `1. city stores a string.
2. temperature stores a number.
3. isRaining stores a Boolean value.
4. typeof returns the type of a value.
5. The three console.log statements display the detected types.`,
      task: `Print the types of the string "Hello", the number 42, and the boolean true using typeof.
Expected output:
string
number
boolean`,
    },
    {
      id: "web-34",
      title: "JavaScript Operators",
      duration: "20 min",
      explanation:
        "Operators perform calculations, comparisons, and logical operations. Arithmetic operators include +, -, *, and /. Comparison operators return Boolean values, while logical operators combine conditions.",
      example: `const distance = 12;
const speed = 3;

console.log(distance / speed);
console.log(distance === 12);
console.log(speed > 5);`,
      exampleExplanation: `1. distance stores 12.
2. speed stores 3.
3. The division operator calculates distance divided by speed.
4. The strict equality operator checks whether distance equals 12.
5. The greater-than operator checks whether speed is greater than 5.
6. Comparison expressions produce true or false.`,
      task: `Set price to 100 and quantity to 3. Print their product, then check whether price is greater than 50.
Expected output:
300
true`,
    },
    {
      id: "web-35",
      title: "Conditional Statements",
      duration: "20 min",
      explanation:
        "Conditional statements allow JavaScript to choose which instructions to execute. if checks a condition, else if checks another possibility, and else handles the remaining case. Conditions commonly use comparison and logical operators.",
      example: `const hour = 14;

if (hour < 12) {
  console.log("Morning");
} else if (hour < 18) {
  console.log("Afternoon");
} else {
  console.log("Evening");
}`,
      exampleExplanation: `1. hour stores the value 14.
2. The first condition checks whether hour is less than 12.
3. Since the condition is false, the else if condition is checked.
4. hour < 18 evaluates to true.
5. The program prints Afternoon.
6. The final else block is skipped.`,
      task: `Write an if-else statement that prints "Pass" when score is at least 50 and "Try again" otherwise. Use score = 75.
Expected output:
Pass`,
    },
    {
      id: "web-36",
      title: "JavaScript Loops",
      duration: "20 min",
      explanation:
        "Loops repeat instructions while a condition is satisfied. JavaScript provides for, while, and do...while loops. Loops are useful for processing lists, repeating calculations, and generating content from collections.",
      example: `for (let month = 1; month <= 4; month++) {
  console.log("Month " + month);
}`,
      exampleExplanation: `1. let month = 1 initializes the loop counter.
2. month <= 4 determines whether the loop continues.
3. console.log displays the current month.
4. month++ increases the counter after each iteration.
5. The loop executes four times.
6. When month becomes 5, the condition becomes false.`,
      task: `Use a for loop to print the integers from 1 through 5, one per line.
Expected output:
1
2
3
4
5`,
    },
    {
      id: "web-37",
      title: "JavaScript Functions",
      duration: "20 min",
      explanation:
        "Functions group reusable instructions into named blocks. They can receive parameters, perform operations, and return results. Functions help divide larger programs into smaller and easier-to-maintain sections.",
      example: `function calculateArea(length, width) {
  return length * width;
}

const area = calculateArea(8, 5);
console.log(area);`,
      exampleExplanation: `1. function declares a reusable function.
2. calculateArea is the function name.
3. length and width are parameters.
4. return sends the multiplication result back to the caller.
5. calculateArea(8, 5) calls the function with two arguments.
6. The returned result is stored in area.`,
      task: `Write an add function that returns the sum of two numbers. Call it with 4 and 6 and print the result.
Expected output:
10`,
    },
    {
      id: "web-38",
      title: "Arrays",
      duration: "20 min",
      explanation:
        "Arrays store ordered collections of values. An array can contain strings, numbers, objects, or other values. Array indexes begin at zero, and the length property returns the number of elements.",
      example: `const weekdays = ["Monday", "Tuesday", "Wednesday"];

console.log(weekdays[1]);
console.log(weekdays.length);`,
      exampleExplanation: `1. weekdays creates an array of strings.
2. Each value has an index beginning at zero.
3. weekdays[1] accesses the second element.
4. The length property returns the number of elements.
5. console.log displays the selected value and the array length.`,
      task: `Create an array containing "HTML", "CSS", and "JavaScript". Print the first element and the array length.
Expected output:
HTML
3`,
    },
    {
      id: "web-39",
      title: "Array Methods",
      duration: "25 min",
      explanation:
        "JavaScript arrays provide methods for adding, removing, transforming, and searching elements. push() adds an element at the end, pop() removes the final element, map() transforms values, filter() selects matching values, and includes() checks whether a value exists.",
      example: `const cities = ["Delhi", "Pune"];

cities.push("Mysuru");
cities.pop();

console.log(cities.join(" - "));
console.log(cities.includes("Delhi"));`,
      exampleExplanation: `1. cities begins with two string elements.
2. push() adds another city to the end.
3. pop() removes the final element.
4. join() combines the remaining elements into one string.
5. includes() checks whether the array contains a particular value.
6. The final statements display the array and the search result.`,
      task: `Start with the array [1, 2, 3], add 4 using push, print the values separated by commas, and check whether the array includes 3.
Expected output:
1, 2, 3, 4
true`,
    },
    {
      id: "web-40",
      title: "JavaScript Objects",
      duration: "25 min",
      explanation:
        "Objects group related information using key-value pairs. Each key is called a property. Properties can store strings, numbers, Boolean values, arrays, functions, and other objects. Dot notation and bracket notation are used to access properties.",
      example: `const student = {
  name: "Riya",
  semester: 3,
  active: true
};

console.log(student.name);
console.log(student.semester);`,
      exampleExplanation: `1. student is an object.
2. name, semester, and active are its properties.
3. Each property stores a value.
4. Dot notation accesses an object's property.
5. student.name retrieves the name.
6. student.semester retrieves the semester number.`,
      task: `Create a product object with name "Notebook" and price 50. Print its name and price.
Expected output:
Notebook
50`,
    },
    {
      id: "web-41",
      title: "DOM Introduction",
      duration: "25 min",
      explanation:
        "The Document Object Model represents an HTML page as a tree of objects. JavaScript can use the DOM to select elements, read their content, change styles, and update the webpage dynamically.",
      example: `// HTML: <h2 id="courseName">Web Development</h2>
const heading = document.getElementById("courseName");
console.log(heading.textContent);`,
      exampleExplanation: `1. The HTML comment shows an example heading.
2. getElementById() selects the element with the specified ID.
3. The selected element is stored in heading.
4. textContent reads the text inside the element.
5. console.log displays the selected text.
6. The element must exist when the JavaScript executes.`,
      task: `Use document.getElementById("title") to select an element and print its textContent. Assume the HTML heading contains "Welcome".
Expected output:
Welcome`,
    },
    {
      id: "web-42",
      title: "DOM Events",
      duration: "25 min",
      explanation:
        "Events represent actions that happen in a webpage, such as clicks, keyboard input, pointer movement, and form submissions. addEventListener() registers a function that runs when a specified event occurs.",
      example: `// HTML: <button id="saveBtn">Save</button>
document.getElementById("saveBtn").addEventListener("click", () => {
  console.log("Changes saved");
});`,
      exampleExplanation: `1. The HTML comment shows a button with an ID.
2. getElementById() selects that button.
3. addEventListener() registers an event handler.
4. The first argument specifies the click event.
5. The arrow function runs when the button is clicked.
6. console.log displays the message after the click.`,
      task: `Add a click event listener to the element with ID "btn" that prints "Button clicked" when activated.
Expected output:
Button clicked (when the button is clicked)`,
    },
    {
      id: "web-43",
      title: "Changing HTML with JavaScript",
      duration: "25 min",
      explanation:
        "JavaScript can change webpage content after it loads. DOM properties such as textContent and innerHTML allow developers to update elements. textContent is appropriate when inserting plain text, while innerHTML interprets HTML markup.",
      example: `// HTML: <p id="notice">System status</p>
const notice = document.getElementById("notice");
notice.textContent = "All systems operational";`,
      exampleExplanation: `1. The HTML comment shows a paragraph element.
2. getElementById() selects the paragraph.
3. The selected element is stored in notice.
4. textContent accesses the element's text.
5. Assigning a new string replaces the previous text.
6. The browser displays the updated message.`,
      task: `Change the textContent of the element with ID "status" to "Saved successfully".
Expected output:
Saved successfully`,
    },
    {
      id: "web-44",
      title: "Form Handling with JavaScript",
      duration: "25 min",
      explanation:
        "JavaScript can listen for form submissions, read user input, and validate information before processing it. preventDefault() prevents the browser's default submission behaviour. Important data should also be validated on the server.",
      example: `// HTML: <form id="feedbackForm"><button>Send</button></form>
document.getElementById("feedbackForm").addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Feedback received");
});`,
      exampleExplanation: `1. The HTML comment shows a form element.
2. getElementById() selects the form.
3. addEventListener() registers a submit handler.
4. The event parameter provides information about the submission.
5. preventDefault() prevents the normal page reload.
6. The message is displayed when the form is submitted.`,
      task: `Add a submit event listener to the form with ID "myForm", prevent the default page reload, and print "Form submitted".
Expected output:
Form submitted (when the form is submitted)`,
    },
    {
      id: "web-45",
      title: "JSON and JavaScript",
      duration: "25 min",
      explanation:
        "JSON stands for JavaScript Object Notation. It is a text format commonly used to exchange structured information between applications and servers. JSON.parse() converts JSON text into a JavaScript value, while JSON.stringify() converts a JavaScript value into JSON text.",
      example: `const jsonText = '{"course":"Python","lessons":30}';

const course = JSON.parse(jsonText);

console.log(course.course);
console.log(course.lessons);`,
      exampleExplanation: `1. jsonText stores JSON-formatted text.
2. JSON.parse() converts the text into a JavaScript object.
3. The parsed object contains course and lessons properties.
4. Dot notation accesses the course property.
5. The lessons property contains a numeric value.
6. console.log displays both properties.`,
      task: `Parse the JSON string containing name "Notebook" and price 50, then print the name and price.
Expected output:
Notebook
50`,
    },
    {
      id: "web-46",
      title: "Fetch API and HTTP Requests",
      duration: "30 min",
      explanation:
        "The Fetch API allows JavaScript to communicate with servers using HTTP requests. It is commonly used to retrieve data from APIs. Fetch returns a Promise, and the response can be converted into JSON before the application uses it.",
      example: `fetch("/api/courses")
  .then(response => {
    if (!response.ok) {
      throw new Error("Unable to load courses");
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error(error.message));`,
      exampleExplanation: `1. fetch() sends a request to the specified endpoint.
2. The first then() receives the server response.
3. response.ok checks whether the response indicates success.
4. An unsuccessful response causes an error to be thrown.
5. response.json() parses the response body.
6. The next then() receives the parsed data.
7. catch() handles errors in the request or processing chain.`,
      task: `Write a fetch request to "/api/message" that checks response.ok, parses the response as JSON, and prints data.message. Handle request errors with catch.
Expected output:
The message returned by /api/message`,
    },
    {
      id: "web-47",
      title: "Promises and Async/Await",
      duration: "25 min",
      explanation:
        "A Promise represents the eventual result of an asynchronous operation. It can be pending, fulfilled, or rejected. async and await provide a readable way to work with Promises and are commonly used when loading information from APIs.",
      example: `function loadCourse() {
  return new Promise(resolve => {
    resolve("Course information ready");
  });
}

async function displayCourse() {
  const result = await loadCourse();
  console.log(result);
}

displayCourse();`,
      exampleExplanation: `1. loadCourse() creates and returns a Promise.
2. The Promise receives a resolve function.
3. resolve() fulfils the Promise with a string.
4. async declares an asynchronous function.
5. await waits for the Promise to settle.
6. The resolved value is stored in result.
7. console.log displays the result.`,
      task: `Create an async function that awaits Promise.resolve("Data loaded") and prints the resolved value.
Expected output:
Data loaded`,
    },
    {
      id: "web-48",
      title: "Browser Storage",
      duration: "25 min",
      explanation:
        "Web browsers provide storage options for information that a website needs to keep between page visits. localStorage stores string values persistently, while sessionStorage generally lasts for the current tab session. Avoid storing passwords or sensitive authentication secrets in browser storage.",
      example: `localStorage.setItem("language", "English");

const savedLanguage = localStorage.getItem("language");

console.log(savedLanguage);`,
      exampleExplanation: `1. setItem() stores a value using a key.
2. The key is language.
3. The stored value is English.
4. getItem() retrieves a value using its key.
5. The retrieved value is stored in savedLanguage.
6. console.log displays the retrieved value.
7. Do not store passwords or sensitive authentication secrets in localStorage.`,
      task: `Store the value "dark" under the key "theme" in localStorage and print the retrieved value.
Expected output:
dark`,
    },
    {
      id: "web-49",
      title: "Project: Interactive To-Do List",
      duration: "35 min",
      explanation:
        "An interactive to-do list combines HTML, CSS, and JavaScript. HTML provides the input and list structure, CSS controls the appearance, and JavaScript handles adding, displaying, and removing tasks. This project introduces the structure of a small productivity application.",
      example: `const reminders = [];

function addReminder(text) {
  reminders.push(text);
}

addReminder("Read documentation");
addReminder("Review notes");

for (const reminder of reminders) {
  console.log(reminder);
}`,
      exampleExplanation: `1. reminders creates an empty array.
2. addReminder() defines a reusable function.
3. The function accepts a text parameter.
4. push() adds the new reminder to the array.
5. The function is called twice with different values.
6. The for...of loop visits every reminder.
7. console.log displays each reminder on a separate line.`,
      task: `Create an array and an addTask function. Add "Learn HTML" and "Practice CSS", then print each task on a separate line.
Expected output:
Learn HTML
Practice CSS`,
    },
    {
      id: "web-50",
      title: "Final Project: Responsive Portfolio",
      duration: "45 min",
      explanation:
        "A responsive portfolio combines semantic HTML, CSS layouts, and JavaScript interactions. It can contain an introduction, skills, projects, and contact information. A portfolio is a useful way to demonstrate programming knowledge and completed projects.",
      example: `const skills = ["HTML", "CSS", "JavaScript"];

console.log("Developer Portfolio");
console.log("Skills:");

skills.forEach(skill => {
  console.log(skill);
});`,
      exampleExplanation: `1. skills stores an array of programming skills.
2. The first console.log displays the portfolio heading.
3. The second console.log displays a section label.
4. forEach() executes a callback for every array element.
5. Each callback receives the current skill.
6. console.log displays each skill on a separate line.`,
      task: `Create a projects array containing "Portfolio", "To-Do List", and "Weather App". Print the heading "My Portfolio", then "Projects:", followed by each project on a new line.
Expected output:
My Portfolio
Projects:
Portfolio
To-Do List
Weather App`,
    },
  ],
},
];