/**
 * Java Programming from Scratch — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in java_topic_quizzes.ts (keyed by
 * EXACT topic title), plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · Java Foundations ────────────────────────────────────────────────
  {
    week: 1,
    title: 'Java Foundations — Getting Started',
    description: 'What Java is, how to set up the JDK, and your first variables, operators and programs.',
    topics: [
      {
        title: 'What Java Is & Why It Is Everywhere',
        text: 'Java is a compiled, object-oriented programming language designed to "write once, run anywhere". Your source code (.java) is compiled by the javac compiler into platform-independent bytecode (.class). That bytecode runs on a Java Virtual Machine (JVM), which is installed per operating system — so the same .class file runs on Windows, Linux and Mac unchanged.\n\nThat portability made Java the backbone of Android apps, enterprise banking systems, and millions of backend servers. It is strongly typed: every variable declares its type, and the compiler catches most mistakes before the program runs. It also manages memory automatically with a garbage collector, so you do not free memory by hand.\n\nFor this course you only need the JDK and any text editor. Everything we build compiles to the same .class/bytecode model, whether it is a tiny console program or a large system.',
        code: '// Hello.java — compiled to Hello.class, run by the JVM\npublic class Hello {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}',
        note: 'Write Once, Run Anywhere is the reason Java powers both Android and most enterprise backends — the JVM is the portable part.',
      },
      {
        title: 'Setting Up the JDK & Running Your First Program',
        text: 'The JDK (Java Development Kit) bundles javac (the compiler), java (the runtime) and the standard library. Install a current LTS JDK (Java 17 or 21), then check it with `java -version` and `javac -version`.\n\nA Java source file must have the same name as its public class — `Hello.java` must contain `public class Hello`. Compile with `javac Hello.java`; this creates `Hello.class`. Run with `java Hello` (no .class extension). The `main` method — `public static void main(String[] args)` — is the entry point the JVM calls.\n\nA common beginner mistake is running `java Hello.class` or forgetting the public class name matches the file name. Both produce clear error messages — read them, fix, recompile.',
        code: '$ javac Hello.java          # compiles Hello.java -> Hello.class\n$ java Hello                # runs the compiled class\nHello, Java!',
        note: 'In a real job you will build with Maven or Gradle, but javac/java by hand is exactly how you learn what the tools actually do.',
      },
      {
        title: 'Variables, Data Types & Operators',
        text: 'Java is strongly typed. Primitive types hold raw values: `int` (whole numbers), `double` (decimals), `boolean` (true/false), `char` (single character), `long`, `float`, `byte`, `short`. Reference types (String, arrays, objects) hold a reference to an object in memory.\n\nDeclare a variable with a type and name: `int marks = 85;`. You can then reassign it. Operators follow maths conventions: `+ - * / %` (modulo gives the remainder), with `++` and `--` for increment/decrement. Integer division truncates: `7 / 2` is 3, not 3.5 — to get 3.5 use `7.0 / 2`.\n\nName variables in camelCase (`totalMarks`, not `total_marks`). A `final` variable is a constant and cannot change after assignment.',
        code: 'int marks = 85;\nmarks = marks + 5;              // 90\ndouble avg = 90.0 / 4.0;        // 22.5\nboolean passed = marks >= 40;    // true\nchar grade = \'A\';\nfinal double PI = 3.14159;      // cannot reassign',
        note: 'Type mismatches are the #1 beginner compiler error — the compiler telling you a type is wrong is a gift, not an obstacle.',
      },
      {
        title: 'Console Input, Output & String Basics',
        text: 'The console is your first UI. `System.out.println(x)` prints x and moves to a new line; `System.out.print(x)` stays on the same line. Use the `Scanner` class to read input: create `Scanner sc = new Scanner(System.in)`, then `sc.nextInt()` for an int, `sc.nextDouble()` for a double, `sc.next()` for one word and `sc.nextLine()` for a whole line.\n\nStrings have useful methods: `length()`, `toUpperCase()`, `equals()` (never `==` for content!), and `substring(begin, end)`. String concatenation with `+` works, but for building text in a loop prefer `StringBuilder`.\n\nRemember to close the Scanner with `sc.close()` when you are done reading.',
        code: 'import java.util.Scanner;\n\nScanner sc = new Scanner(System.in);\nSystem.out.print("Enter your name: ");\nString name = sc.nextLine();\nSystem.out.println("Hi, " + name.toUpperCase());\nsc.close();',
        note: 'Compare strings with .equals(), not ==. The == operator compares references; two equal Strings can be different objects.',
      },
    ],
    quizzes: [
      { text: 'What does the JVM do in the "write once, run anywhere" model?', options: ['Compiles source to machine code', 'Runs compiled bytecode on any platform', 'Creates the .java file', 'Writes the operating system'], correctAnswer: 'Runs compiled bytecode on any platform' },
      { text: 'javac turns a .java file into…', options: ['an executable .exe', 'platform-independent .class bytecode', 'a .txt file', 'a database'], correctAnswer: 'platform-independent .class bytecode' },
      { text: 'Which statement about Java variables is TRUE?', options: ['Java is dynamically typed — types are optional', 'Java is strongly typed — every variable declares its type', 'Variables cannot be reassigned', 'There is only one data type'], correctAnswer: 'Java is strongly typed — every variable declares its type' },
      { text: 'What is the output of `System.out.println(7 / 2);`?', options: ['3.5', '3', '2', '4'], correctAnswer: '3' },
    ],
  },

  // ── W2 · Control Flow & Methods ──────────────────────────────────────────
  {
    week: 2,
    title: 'Control Flow & Methods',
    description: 'Conditionals, loops, methods with parameters, and working with arrays and lists.',
    topics: [
      {
        title: 'Conditionals: if/else & switch',
        text: 'Programs make decisions. `if (condition) { ... } else { ... }` runs one branch. A condition is any boolean expression — `marks >= 40`, `name.equals("admin")`. Use `else if` for chains. The ternary operator `cond ? a : b` is a compact if/else that produces a value.\n\n`switch` is cleaner than a long if-chain when you are comparing one value against several constants. Classic switch compares with `==` semantics; the arrow form (`->`) is safer because you cannot accidentally fall through.\n\nBoolean logic combines conditions with `&&` (AND), `||` (OR) and `!` (NOT). Short-circuiting means `a && b` skips evaluating b when a is already false.',
        code: 'int marks = 73;\nString result;\nif (marks >= 75)      result = "Distinction";\nelse if (marks >= 60) result = "First Class";\nelse if (marks >= 40) result = "Pass";\nelse                  result = "Fail";\n\nswitch (result) {\n    case "Fail" -> System.out.println("Try again");\n    default   -> System.out.println("Well done");\n}',
        note: 'Order matters in an else-if chain: put the strictest condition first, or a later branch can swallow earlier cases.',
      },
      {
        title: 'Loops: for, while & do-while',
        text: 'A `for` loop is best when you know the count: `for (int i = 0; i < n; i++)`. It runs the initializer once, checks the condition before each round, and runs the update after each round. A `while` loop checks the condition before the body — it may run zero times. A `do-while` checks after the body, so it always runs at least once.\n\n`break` exits the loop immediately; `continue` skips to the next iteration. The enhanced `for` (for-each) is for iterating collections without an index: `for (String s : list)`.\n\nBeware infinite loops — if your condition never becomes false, the program hangs. Incrementing the counter inside the body of a while loop is the classic fix.',
        code: 'for (int i = 1; i <= 5; i++) {\n    System.out.print(i + " ");      // 1 2 3 4 5\n}\n\nint n = 0;\nwhile (n < 3) { n++; }             // runs 3 times\n\nint x = 10;\ndo { x--; } while (x > 7);          // always runs at least once',
        note: 'Prefer for-each for reading collections, index for-loops when the position matters, and while when the number of rounds is unknown.',
      },
      {
        title: 'Methods & Parameters',
        text: 'A method packages logic under a name and can be reused. Signature: `returnType name(parameters)`. A method returning nothing uses `void`. Data flows in through parameters and out through `return`.\n\nMethods are called by value — a copy of the primitive goes in, so changing a parameter inside does not change the caller\'s variable. (For objects, the reference is copied, so mutating the object inside IS visible outside.)\n\nOverloading lets several methods share a name if their parameter lists differ — `add(int,int)` and `add(double,double)` are two methods. Keep methods small and single-purpose; a method that does one thing is testable and readable.',
        code: 'static int max(int a, int b) {\n    return a > b ? a : b;\n}\n\nstatic void greet(String name) {\n    System.out.println("Hello, " + name);\n}\n\npublic static void main(String[] args) {\n    greet("Aisha");\n    System.out.println(max(4, 9));   // 9\n}',
        note: 'Return EARLY: check invalid inputs at the top of a method and return — it removes deep nesting and edge-case bugs.',
      },
      {
        title: 'Arrays & ArrayLists',
        text: 'An array is a fixed-size container of one type: `int[] nums = new int[5];` or `int[] nums = {1,2,3};`. Indexes start at 0 and `length` gives the size. Arrays cannot grow — that is where ArrayList comes in.\n\n`ArrayList<String> list = new ArrayList<>();` grows automatically. Key methods: `add`, `get(i)`, `set(i,v)`, `remove(i)`, `size()`, `contains`. It stores objects, so primitives are boxed (`int` becomes `Integer`) — automatic.\n\nAccessing `nums[nums.length]` throws ArrayIndexOutOfBoundsException — indexes run 0..length-1. The for-each loop removes that whole class of bug when you only need to read.',
        code: 'int[] nums = {10, 20, 30};\nSystem.out.println(nums.length);   // 3\n\nArrayList<String> names = new ArrayList<>();\nnames.add("Aisha");\nnames.add("Ravi");\nnames.add(1, "Meera");\nSystem.out.println(names.size()); // 3\nfor (String n : names) {\n    System.out.println(n);\n}',
        note: 'Lists are the day-to-day workhorse — prefer ArrayList over raw arrays unless the size is truly fixed (like a color table).',
      },
    ],
    quizzes: [
      { text: 'Which condition is correct for checking a score is at least 40?', options: ['marks > 40', 'marks >= 40', 'marks = 40', '40 <= marks < 100'], correctAnswer: 'marks >= 40' },
      { text: 'With `int i = 0;` the for-each style `for (String s : list)` is best used when…', options: ['you need the index', 'you only need to read each element', 'the list is empty only', 'you are sorting in place'], correctAnswer: 'you only need to read each element' },
      { text: 'A do-while loop guarantees that the body runs…', options: ['zero or more times', 'exactly once', 'at least once', 'never'], correctAnswer: 'at least once' },
      { text: '`nums[nums.length]` on a 5-element array causes…', options: ['NullPointerException', 'ArrayIndexOutOfBoundsException', 'a silent wrong value', 'a compile error only'], correctAnswer: 'ArrayIndexOutOfBoundsException' },
    ],
  },

  // ── W3 · Object-Oriented Java ────────────────────────────────────────────
  {
    week: 3,
    title: 'Object-Oriented Java',
    description: 'Classes and objects, constructors and encapsulation, inheritance and interfaces.',
    topics: [
      {
        title: 'Classes & Objects',
        text: 'A class is a blueprint; an object is a concrete instance built from it. The class declares fields (state) and methods (behavior). You create an instance with `new`: `Student s = new Student();`.\n\nEach object holds its own copy of the fields. `s.name` and `s2.name` are independent values even though both came from the same blueprint. This mirrors the real world: the concept "Student" (class) vs the specific Aisha and Ravi (objects).\n\nGood classes follow single responsibility — a class should describe one concept. Naming matters: classes in PascalCase (`Student`, `BankAccount`), fields and methods in camelCase.',
        code: 'class Student {\n    String name;\n    int marks;\n\n    void printReport() {\n        System.out.println(name + ": " + marks);\n    }\n}\n\nStudent s1 = new Student();\ns1.name = "Aisha";\ns1.marks = 85;\ns1.printReport();',
        note: 'The keyword `new` does three things: allocates memory, runs the constructor, and returns the reference to your variable.',
      },
      {
        title: 'Constructors, Fields & Access Modifiers',
        text: 'A constructor is a special method, named like the class, that runs when you create an object — perfect for setting initial state. `Student(String n, int m) { name = n; marks = m; }`. `this` refers to the current object, which disambiguates `this.name = name`.\n\nAccess modifiers control visibility. `private` means only the same class can touch the field; `public` means anyone. `protected` allows subclasses and same-package classes. Encapsulation hides the fields (private) and exposes behavior through getters/setters or, better, through methods that keep the object valid — `setMarks(int m)` can reject negative marks.\n\nRule of thumb: fields private, methods public unless there is a reason not to. This keeps internal representation free to change.',
        code: 'class Student {\n    private String name;\n    private int marks;\n\n    public Student(String name, int marks) {\n        this.name = name;\n        setMarks(marks);          // reuse validation\n    }\n\n    public void setMarks(int marks) {\n        if (marks < 0 || marks > 100) throw new IllegalArgumentException();\n        this.marks = marks;\n    }\n\n    public String getName() { return name; }\n}',
        note: 'Validate in setters/constructors, not only at the call site — then every future caller is protected too.',
      },
      {
        title: 'Inheritance & Method Overriding',
        text: 'Inheritance lets one class build on another: `class Manager extends Employee` inherits all of Employee\'s fields and methods, then adds or changes behavior. `super` calls the parent constructor (`super(name)`) or a parent method (`super.work()`).\n\nMethod overriding means a subclass redefines a parent method with the same signature — the object\'s actual type decides which version runs (dynamic dispatch). The `@Override` annotation is a compile-time check that you really are overriding.\n\nA parent reference can hold a child object: `Employee e = new Manager("Ravi");` — then `e.work()` calls Manager\'s version. This is polymorphism in action.',
        code: 'class Employee {\n    protected String name;\n    Employee(String name) { this.name = name; }\n    void work() { System.out.println(name + " works"); }\n}\n\nclass Manager extends Employee {\n    Manager(String name) { super(name); }\n    @Override\n    void work() { System.out.println(name + " manages a team"); }\n}\n\nEmployee e = new Manager("Ravi");\ne.work();   // "Ravi manages a team"',
        note: 'Prefer composition (an object that has another object) over inheritance when classes are only "similar" rather than truly "is-a".',
      },
      {
        title: 'Interfaces & Polymorphism',
        text: 'An interface is a contract: a list of method signatures that implementing classes must provide. `interface Payable { double pay(); }` — any class with `implements Payable` must write a real `pay()`. Interfaces say WHAT, classes decide HOW.\n\nThis gives polymorphism without inheritance: one method can accept `Payable p` and work with any implementation — an Employee, a Freelancer, a Vendor — as long as it is Payable. That decouples code: callers depend on the contract, not the concrete class.\n\nAn interface can have default methods (a real body) and constants. A class implements multiple interfaces, which sidesteps Java\'s single-inheritance limit.',
        code: 'interface Payable {\n    double pay();\n}\n\nclass Freelancer implements Payable {\n    double rate; int days;\n    public double pay() { return rate * days; }\n}\n\nclass Vendor implements Payable {\n    double amount;\n    public double pay() { return amount; }\n}\n\nvoid process(Payable p) { System.out.println("Paying " + p.pay()); }',
        note: 'Depend on interfaces, not concrete classes — that one habit makes your code testable, swappable and far easier to maintain.',
      },
    ],
    quizzes: [
      { text: 'The `new` keyword in Java…', options: ['deletes an object', 'allocates memory and calls the constructor', 'compiles the class', 'imports a package'], correctAnswer: 'allocates memory and calls the constructor' },
      { text: '`this.name = name;` inside a constructor is used to…', options: ['create a new object', 'disambiguate the field from the parameter', 'call the parent constructor', 'end the constructor'], correctAnswer: 'disambiguate the field from the parameter' },
      { text: 'In `class Manager extends Employee`, if Manager overrides `work()`, then `Employee e = new Manager(...); e.work();` calls…', options: ['Employee.work()', 'Manager.work()', 'a compile error', 'the constructor'], correctAnswer: 'Manager.work()' },
      { text: 'An interface is best described as…', options: ['a complete implementation', 'a contract of method signatures implementers must provide', 'a class that cannot be instantiated', 'a type of array'], correctAnswer: 'a contract of method signatures implementers must provide' },
    ],
  },

  // ── W4 · Collections, Exceptions & Files ─────────────────────────────────
  {
    week: 4,
    title: 'Collections, Exceptions & Files',
    description: 'The Collections framework, generics and lambdas, exceptions, and reading/writing files.',
    topics: [
      {
        title: 'Collections: List, Set & Map',
        text: 'The Collections framework provides ready-made containers. `List` is an ordered, indexed sequence — ArrayList is the workhorse; LinkedList is better for heavy insertions at the front. `Set` holds unique elements — HashSet (fast, unordered) or TreeSet (sorted). `Map` maps keys to values — `Map<String, Integer>` for name→marks; HashMap for speed, TreeMap when order matters.\n\nIterate with for-each: for a Map use `map.keySet()`, `map.values()` or `map.forEach((k, v) -> ...)`. Choosing the right collection for the job — "do I need uniqueness? ordering? key lookup?" — is the whole game.\n\nBe careful with null keys/values and with mutating a collection while iterating (use an iterator\'s remove).',
        code: 'List<String> list = new ArrayList<>(List.of("a", "b", "a"));\nSet<String> set = new HashSet<>(list);        // {a, b}\nMap<String, Integer> marks = new HashMap<>();\nmarks.put("Aisha", 85);\nmarks.put("Ravi", 72);\nSystem.out.println(marks.get("Aisha"));       // 85\nmarks.forEach((name, m) -> System.out.println(name + " -> " + m));',
        note: 'Interview favorite: when to use Map vs List vs Set. If you look things up by key, Map. If uniqueness matters, Set. Otherwise List.',
      },
      {
        title: 'Generics & Lambda Basics',
        text: 'Generics make a type parameterized: `List<String>` is a list that can only hold Strings, checked at compile time. The diamond `<>` lets Java infer the type. Generic methods and classes (`class Box<T>`) let you write logic once for many types.\n\nLambdas are compact anonymous functions: `(a, b) -> a + b`. They shine with functional interfaces — interfaces with one abstract method like `Comparator`, `Runnable`, `Function`. `list.sort((a, b) -> a.length() - b.length())` sorts by length without writing a whole class.\n\nMethod references (`String::length`) are an even shorter lambda when a method already exists.',
        code: 'class Box<T> {\n    private T value;\n    void set(T v) { this.value = v; }\n    T get() { return value; }\n}\n\nBox<Integer> box = new Box<>();\nbox.set(42);\n\nList<String> names = new ArrayList<>(List.of("Ravi", "Aisha"));\nnames.sort((a, b) -> a.length() - b.length());   // lambda Comparator\nSystem.out.println(names);                        // [Ravi, Aisha]',
        note: 'Raw types (`List` without <>) defeat the type safety generics give you — always use the diamond. Let lambdas stay one-liners; anything longer is a real method.',
      },
      {
        title: 'Exception Handling',
        text: 'Exceptions are Java\'s way of reporting and handling errors instead of crashing. A `try` block wraps risky code; a `catch` handles a specific exception type; `finally` always runs (cleanup). `throw` raises your own exception; `throws` declares that a method may let one escape.\n\nChecked exceptions (like `IOException`) must be handled or declared; unchecked (RuntimeException subclasses like NullPointerException, IllegalArgumentException) do not force you. Catch specific types before general ones — catching `Exception` swallows everything and hides bugs.\n\nBest practice: catch what you can actually handle, log or rethrow what you cannot. Never leave an empty catch block.',
        code: 'import java.io.*;\n\ntry (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {\n    String line = br.readLine();\n    if (line == null) throw new IllegalArgumentException("File is empty");\n    System.out.println(line);\n} catch (FileNotFoundException e) {\n    System.out.println("File not found: " + e.getMessage());\n} catch (IOException e) {\n    e.printStackTrace();\n}',
        note: 'The try-with-resources form (`try (...) { }`) closes the resource automatically — cleaner than finally and impossible to forget.',
      },
      {
        title: 'File I/O',
        text: 'Reading and writing text files is essential for real programs. Use `BufferedReader` for fast line-by-line reading and `FileReader` for the source. For writing, `BufferedWriter` + `FileWriter` (or `Files.writeString`) is simplest. The Scanner we met earlier can also read files: `new Scanner(new File("data.txt"))`.\n\nPaths: use `Path` and `Files` from java.nio for modern, concise I/O — `Files.readAllLines(path)`, `Files.writeString(path, content)`. This handles encoding and gives clean exceptions.\n\nAlways close your resources (try-with-resources does it for you) and handle `IOException` — files can be missing, locked or unreadable.',
        code: 'import java.nio.file.*;\nimport java.util.*;\n\nPath p = Paths.get("marks.txt");\nList<String> lines = Files.readAllLines(p);\nint total = 0;\nfor (String line : lines) total += Integer.parseInt(line.trim());\nSystem.out.println("Sum: " + total);\n\nFiles.writeString(Paths.get("out.txt"), "Average: " + (total / (double) lines.size()));',
        note: 'Modern java.nio.file.Files is the default choice — concise, safe, and it handles most of the encoding pitfalls of the old API.',
      },
    ],
    quizzes: [
      { text: 'Which collection should you use to store unique names with fast membership checks?', options: ['ArrayList', 'HashSet', 'HashMap keys', 'Array'], correctAnswer: 'HashSet' },
      { text: '`List<String>` (with generics) gives you…', options: ['runtime-only type checks', 'compile-time type safety that the list holds only Strings', 'faster execution always', 'no memory overhead'], correctAnswer: 'compile-time type safety that the list holds only Strings' },
      { text: 'A checked exception such as IOException must…', options: ['be handled or declared', 'always crash the program', 'never be caught', 'be ignored'], correctAnswer: 'be handled or declared' },
      { text: 'try-with-resources `try (BufferedReader br = ...) { }` mainly guarantees…', options: ['faster reads', 'the resource is closed automatically', 'no exceptions', 'bigger buffers'], correctAnswer: 'the resource is closed automatically' },
    ],
  },

  // ── W5 · Putting It Together ─────────────────────────────────────────────
  {
    week: 5,
    title: 'Putting It Together — Project & Next Steps',
    description: 'Project structure, debugging and testing, a real mini project, and where Java goes next.',
    topics: [
      {
        title: 'Packages & Project Structure',
        text: 'Packages organize classes into namespaces and folders. A class in `com.example.school` lives at `com/example/school/`. Declare it with `package com.example.school;` as the first line of the file. The domain-reversed naming (`com.yourcompany.project`) avoids collisions between libraries.\n\nTypical small-project layout: `src/` holds source, `out/` or `build/` holds compiled classes, `lib/` holds jars. To compile with packages, run javac from the root: `javac src/com/example/.../*.java -d out`.\n\nImports bring classes in: `import com.example.school.Student;` or `import java.util.*;`. java.lang is imported automatically. Real projects build with Maven/Gradle, which manage dependencies and this layout for you.',
        code: 'package com.example.school;\n\nimport java.util.ArrayList;\nimport java.util.List;\n\npublic class School {\n    List<Student> students = new ArrayList<>();\n    void enroll(Student s) { students.add(s); }\n}',
        note: 'Package = folder, class = file. Once that clicks, navigating and building any Java codebase stops being mysterious.',
      },
      {
        title: 'Debugging & Testing Basics',
        text: 'Three tools find most bugs. **Print debugging**: sprinkle `System.out.println("value=" + x)` to see state. **The debugger**: set breakpoints and step through code watching variables — the IntelliJ/VS Code debugger is worth learning properly. **Exceptions**: the stack trace tells you the exact line that failed; read top-to-bottom.\n\nTesting with JUnit 5: write `@Test void testMax() { assertEquals(9, max(4, 9)); }` and run. Tests should be small, deterministic and focused on one behavior — a red test names the bug precisely.\n\nDivide and conquer: if a method misbehaves, test it in isolation with known inputs before hunting through the calling code.',
        code: 'import org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\n\nclass MaxTest {\n    @Test\n    void returnsLarger() {\n        assertEquals(9, max(4, 9));\n        assertEquals(9, max(9, 4));\n    }\n\n    int max(int a, int b) { return a > b ? a : b; }\n}',
        note: 'A test that documents expected behavior is also documentation. When a bug is found, write the failing test first — then fix — so it never regresses.',
      },
      {
        title: 'Mini Project — Student Grade Manager',
        text: 'Combine everything: a console program that reads student names and marks, stores them, and prints a report with grade, average and toppers. This is the course capstone.\n\nPlan before code: (1) a `Student` class with name, marks and a computed grade; (2) a `GradeBook` that holds a List<Student>, can add and average; (3) a `Main` that loops reading input with Scanner until the user is done, then prints the report.\n\nBuild it step by step: get one student entering correctly, then the list, then the report. Each step stays testable. This same shape — model, service, entry point — scales to a real application.',
        code: 'class GradeBook {\n    private final List<Student> students = new ArrayList<>();\n    void add(Student s) { students.add(s); }\n    double average() {\n        int total = 0;\n        for (Student s : students) total += s.marks;\n        return students.isEmpty() ? 0 : total / (double) students.size();\n    }\n    void printReport() {\n        for (Student s : students) System.out.println(s.name + " -> " + s.grade());\n        System.out.println("Average: " + average());\n    }\n}',
        note: 'Capstone rule: a small working program you understand beats a large broken one. Ship the loop, then polish the report.',
      },
      {
        title: 'Next Steps — Concurrency & the Java Ecosystem',
        text: 'You now know enough Java to read real codebases. The most useful next topics: **threads and concurrency** (ExecutorService, volatile, synchronized), **streams** (`list.stream().filter(...).map(...)`), and the **build toolchain** (Maven/Gradle).\n\nJava\'s ecosystem is enormous: Spring Boot for backends, Android with Kotlin/Java, and massive enterprise tooling. The core you learned — types, OOP, collections, exceptions — is identical everywhere, so changing frameworks is changing vocabulary, not grammar.\n\nPractice path: pick one small tool you use daily (a note organizer, a file renamer, a mark converter) and build it in Java with proper packages, tests and a README. That single project teaches more than a hundred video lessons.',
        code: '// Glimpse of streams — filter and sum in one expression\nList<Integer> nums = List.of(5, 2, 8, 3);\nint evenSum = nums.stream().filter(n -> n % 2 == 0).mapToInt(n -> n).sum();\nSystem.out.println(evenSum);   // 10',
        note: 'Master one small project end-to-end, then the ecosystem (Spring, Android) stops feeling overwhelming.',
      },
    ],
    quizzes: [
      { text: 'A class declared `package com.example.school;` lives in which folder?', options: ['com/example/school/', 'school/com/example/', 'src/root/', 'com.example.school.jar'], correctAnswer: 'com/example/school/' },
      { text: 'The fastest way to find the exact line where an exception happened is…', options: ['reading the whole file', 'reading the stack trace', 'restarting the JVM', 'deleting the class'], correctAnswer: 'reading the stack trace' },
      { text: 'In the Grade Manager capstone, the component that holds the List<Student> and computes the average is…', options: ['the Main class', 'the GradeBook class', 'the Scanner', 'the compiler'], correctAnswer: 'the GradeBook class' },
      { text: 'Which is the most valuable next topic after this course for real Java work?', options: ['Streams, concurrency and a build tool like Maven', 'printing more hello messages', 'renaming variables', 'using more comments'], correctAnswer: 'Streams, concurrency and a build tool like Maven' },
    ],
  },
];
