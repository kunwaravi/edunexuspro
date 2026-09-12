/**
 * Java course — per-topic quizzes. Keyed by the EXACT topic titles used in
 * java.ts (topic-lock flow). 4 questions per topic, 4 options, 1 correct.
 * Question texts are distinct from the chapter-quiz texts in java.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'What Java Is & Why It Is Everywhere': [
    { text: 'The "write once, run anywhere" promise is delivered by…', options: ['the compiler generating machine code', 'the JVM running the same bytecode everywhere', 'a different compiler per OS', 'Java source being interpreted by the browser'], correctAnswer: 'the JVM running the same bytecode everywhere' },
    { text: 'Which of these is a primitive type in Java?', options: ['String', 'int', 'ArrayList', 'Object'], correctAnswer: 'int' },
    { text: 'Java memory is managed automatically by…', options: ['malloc and free', 'the garbage collector', 'the programmer', 'the operating system'], correctAnswer: 'the garbage collector' },
    { text: 'Java is a compiled language. Compilation produces…', options: ['machine code', 'bytecode run by the JVM', 'a script', 'a database'], correctAnswer: 'bytecode run by the JVM' },
  ],
  'Setting Up the JDK & Running Your First Program': [
    { text: 'The tool that compiles .java files is…', options: ['java', 'javac', 'jvm', 'gcc'], correctAnswer: 'javac' },
    { text: 'A file named Hello.java must contain a class named…', options: ['hello', 'Hello', 'Main', 'anything'], correctAnswer: 'Hello' },
    { text: 'After `javac Hello.java`, how do you run the program?', options: ['java Hello', 'java Hello.class', 'run Hello.java', 'javac Hello'], correctAnswer: 'java Hello' },
    { text: 'The entry point the JVM calls is…', options: ['private void start()', 'public static void main(String[] args)', 'public static void main()', 'int init()'], correctAnswer: 'public static void main(String[] args)' },
  ],
  'Variables, Data Types & Operators': [
    { text: 'Which is a correct variable declaration?', options: ['int 2x = 5;', 'int totalMarks = 85;', 'totalMarks int = 85;', 'int = 85;'], correctAnswer: 'int totalMarks = 85;' },
    { text: 'What is the value of `7 % 3`?', options: ['2', '1', '3', '0'], correctAnswer: '1' },
    { text: '`double avg = 7 / 2;` stores…', options: ['3.5', '3.0 (integer division truncates)', '3.5 only with double cast', 'an error'], correctAnswer: '3.0 (integer division truncates)' },
    { text: 'A `final` variable in Java…', options: ['can be reassigned once', 'cannot change after assignment', 'is automatically static', 'stores only doubles'], correctAnswer: 'cannot change after assignment' },
  ],
  'Console Input, Output & String Basics': [
    { text: 'Which class reads console input in Java?', options: ['System.in', 'Scanner', 'ConsoleRead', 'Input'], correctAnswer: 'Scanner' },
    { text: '`sc.next()` reads…', options: ['a whole line', 'one word', 'a double only', 'nothing'], correctAnswer: 'one word' },
    { text: 'To compare two Strings for equal content you should use…', options: ['==', '.equals()', 'equals==', '!='], correctAnswer: '.equals()' },
    { text: '`System.out.print(x)` differs from `println(x)` because…', options: ['print is slower', 'print does not advance to a new line', 'print works only for ints', 'there is no difference'], correctAnswer: 'print does not advance to a new line' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Conditionals: if/else & switch': [
    { text: 'Which operator means logical AND?', options: ['&&', '||', '&', '!'], correctAnswer: '&&' },
    { text: '`marks >= 40 ? "Pass" : "Fail"` — a student with 50 gets…', options: ['Pass', 'Fail', 'an error', 'null'], correctAnswer: 'Pass' },
    { text: 'The arrow form of switch (`->`) is safer because…', options: ['it is faster', 'you cannot accidentally fall through to the next case', 'it supports strings only', 'it skips conditions'], correctAnswer: 'you cannot accidentally fall through to the next case' },
    { text: 'Short-circuit evaluation means `a && b`…', options: ['evaluates b even when a is false', 'skips b when a is already false', 'always evaluates both', 'fails on null'], correctAnswer: 'skips b when a is already false' },
  ],
  'Loops: for, while & do-while': [
    { text: '`for (int i = 0; i < 5; i++)` runs the body how many times?', options: ['4', '5', '6', 'infinite'], correctAnswer: '5' },
    { text: '`break` inside a loop…', options: ['skips one iteration', 'exits the loop immediately', 'restarts the loop', 'throws an error'], correctAnswer: 'exits the loop immediately' },
    { text: 'A while loop that never changes its condition will…', options: ['compile error', 'run forever (infinite loop)', 'run once', 'skip the body'], correctAnswer: 'run forever (infinite loop)' },
    { text: 'When the number of iterations is unknown (e.g. keep reading until quit), the natural loop is…', options: ['a for loop with fixed count', 'a while loop with a condition', 'a do-while only', 'recursion always'], correctAnswer: 'a while loop with a condition' },
  ],
  'Methods & Parameters': [
    { text: 'A method that returns nothing declares return type…', options: ['null', 'void', 'empty', 'none'], correctAnswer: 'void' },
    { text: '`static int max(int a, int b)` — how many parameters?', options: ['0', '1', '2', '3'], correctAnswer: '2' },
    { text: 'Primitives are passed…', options: ['by reference', 'by value (a copy)', 'by address', 'by pointer'], correctAnswer: 'by value (a copy)' },
    { text: 'Two methods named add with different parameter lists are called…', options: ['overridden', 'overloaded', 'copied', 'abstract'], correctAnswer: 'overloaded' },
  ],
  'Arrays & ArrayLists': [
    { text: '`int[] nums = {10, 20, 30};` — what is nums.length?', options: ['2', '3', '30', '0'], correctAnswer: '3' },
    { text: 'The first element of an array is at index…', options: ['1', '0', 'length', '-1'], correctAnswer: '0' },
    { text: 'Which structure grows and shrinks automatically?', options: ['array', 'ArrayList', 'int[]', 'String[]'], correctAnswer: 'ArrayList' },
    { text: 'Adding a primitive int to an ArrayList boxes it into…', options: ['long', 'Integer', 'Double', 'String'], correctAnswer: 'Integer' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Classes & Objects': [
    { text: 'A class is a blueprint; a concrete instance created from it is…', options: ['a method', 'an object', 'a package', 'a loop'], correctAnswer: 'an object' },
    { text: 'Which keyword creates an object?', options: ['new', 'make', 'object', 'create'], correctAnswer: 'new' },
    { text: 'Two objects built from the same class…', options: ['share all fields', 'each have their own field copies', 'must have equal fields', 'cannot coexist'], correctAnswer: 'each have their own field copies' },
    { text: 'Classes are conventionally named in…', options: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'], correctAnswer: 'PascalCase' },
  ],
  'Constructors, Fields & Access Modifiers': [
    { text: 'A constructor is…', options: ['a method named like the class that runs on `new`', 'a static helper', 'a void method', 'an interface'], correctAnswer: 'a method named like the class that runs on `new`' },
    { text: '`private` fields mean…', options: ['any class can read them', 'only the same class can access them', 'subclasses only', 'no one can ever use the object'], correctAnswer: 'only the same class can access them' },
    { text: 'Encapsulation is best described as…', options: ['hiding fields and exposing behavior through methods', 'making everything public', 'using only static fields', 'deleting getters'], correctAnswer: 'hiding fields and exposing behavior through methods' },
    { text: 'Validating marks in setMarks() benefits…', options: ['only this one call', 'every future caller of setMarks', 'the compiler', 'no one'], correctAnswer: 'every future caller of setMarks' },
  ],
  'Inheritance & Method Overriding': [
    { text: '`class Manager extends Employee` means Manager…', options: ['is unrelated to Employee', 'inherits Employee fields and methods', 'copies Employee to a file', 'deletes Employee'], correctAnswer: 'inherits Employee fields and methods' },
    { text: 'The `@Override` annotation…', options: ['changes method visibility', 'verifies at compile time that you are overriding', 'makes the method static', 'deletes the parent method'], correctAnswer: 'verifies at compile time that you are overriding' },
    { text: '`super(name)` inside a subclass constructor calls…', options: ['the same class constructor', 'the parent class constructor', 'the main method', 'the garbage collector'], correctAnswer: 'the parent class constructor' },
    { text: 'Polymorphism means…', options: ['the same method name behaves per actual object type', 'methods cannot be overridden', 'only one class per file', 'all methods are static'], correctAnswer: 'the same method name behaves per actual object type' },
  ],
  'Interfaces & Polymorphism': [
    { text: '`interface Payable { double pay(); }` requires implementers to…', options: ['write a real pay() method', 'inherit a class', 'be abstract', 'do nothing'], correctAnswer: 'write a real pay() method' },
    { text: 'A method that accepts `Payable p` will work with…', options: ['only Employee', 'any class that implements Payable', 'only primitives', 'only the interface file'], correctAnswer: 'any class that implements Payable' },
    { text: 'Interfaces say…', options: ['HOW to implement everything', 'WHAT a class must provide', 'which file to open', 'how memory is allocated'], correctAnswer: 'WHAT a class must provide' },
    { text: 'A class can implement…', options: ['only one interface', 'multiple interfaces', 'zero interfaces always', 'only abstract classes'], correctAnswer: 'multiple interfaces' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Collections: List, Set & Map': [
    { text: 'Which is the correct declaration of a Map from names to marks?', options: ['Map<String, Integer>', 'Map<Integer, String>', 'List<String, Integer>', 'Set<Integer, String>'], correctAnswer: 'Map<String, Integer>' },
    { text: 'A Set guarantees…', options: ['indexed access', 'unique elements', 'sorted always', 'duplicates allowed'], correctAnswer: 'unique elements' },
    { text: '`marks.get("Aisha")` on a HashMap returns…', options: ['the whole map', 'the value for the key Aisha', 'the key', 'the size'], correctAnswer: 'the value for the key Aisha' },
    { text: 'The fastest general-purpose Map implementation is…', options: ['TreeMap', 'HashMap', 'LinkedList', 'ArrayList'], correctAnswer: 'HashMap' },
  ],
  'Generics & Lambda Basics': [
    { text: '`List<String>` guarantees at compile time that…', options: ['the list is fast', 'only Strings can be added', 'the list is sorted', 'the list is immutable'], correctAnswer: 'only Strings can be added' },
    { text: 'A lambda `(a, b) -> a + b` is…', options: ['a class', 'a compact anonymous function', 'a loop', 'a package'], correctAnswer: 'a compact anonymous function' },
    { text: '`class Box<T>` declares…', options: ['a fixed int', 'a generic class usable with any type', 'a static field', 'an exception'], correctAnswer: 'a generic class usable with any type' },
    { text: 'The diamond `<>` in `new ArrayList<>()` tells Java to…', options: ['use Object', 'infer the type from context', 'make it empty only', 'disable generics'], correctAnswer: 'infer the type from context' },
  ],
  'Exception Handling': [
    { text: 'The block that always runs (even after an exception) is…', options: ['try', 'catch', 'finally', 'throw'], correctAnswer: 'finally' },
    { text: '`throw new IllegalArgumentException(...)` does what?', options: ['declares a method may throw', 'raises an exception right now', 'catches an exception', 'closes the program'], correctAnswer: 'raises an exception right now' },
    { text: 'Catching the very general `Exception` type is discouraged because…', options: ['it is slow', 'it swallows unrelated bugs', 'it cannot compile', 'it is deprecated'], correctAnswer: 'it swallows unrelated bugs' },
    { text: 'An empty catch block is bad because…', options: ['it throws errors', 'it hides the problem with no trace', 'it is fast', 'it runs twice'], correctAnswer: 'it hides the problem with no trace' },
  ],
  'File I/O': [
    { text: 'The modern java.nio.file API lets you read a whole file into a List<String> with…', options: ['Files.readAllLines(path)', 'new File().lines()', 'scan.read()', 'Files.print(path)'], correctAnswer: 'Files.readAllLines(path)' },
    { text: 'File operations can fail (missing file, permissions), so they throw…', options: ['RuntimeException', 'IOException', 'Error', 'Exception never'], correctAnswer: 'IOException' },
    { text: '`BufferedReader` is preferred for reading text because…', options: ['it is required by law', 'it reads line-by-line efficiently', 'it handles binary', 'it is the only reader'], correctAnswer: 'it reads line-by-line efficiently' },
    { text: 'Which wrapper closes the resource automatically on success or failure?', options: ['try-with-resources `try (BufferedReader br = ...)`', 'a plain try', 'a while loop', 'static final'], correctAnswer: 'try-with-resources `try (BufferedReader br = ...)`' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Packages & Project Structure': [
    { text: 'The package declaration must be…', options: ['the last line', 'the first line of the file', 'after imports', 'optional always'], correctAnswer: 'the first line of the file' },
    { text: '`import java.util.*;` brings in…', options: ['everything from java.util', 'only ArrayList', 'nothing', 'the JVM'], correctAnswer: 'everything from java.util' },
    { text: 'The java.lang package is…', options: ['never available', 'imported automatically', 'external only', 'deprecated'], correctAnswer: 'imported automatically' },
    { text: 'A package named `com.example.school` corresponds to folder…', options: ['school/com/example', 'com/example/school', 'com.example.school', 'src/example'], correctAnswer: 'com/example/school' },
  ],
  'Debugging & Testing Basics': [
    { text: 'A stack trace tells you…', options: ['the value of every variable', 'the exact lines involved in the exception', 'the file size', 'the future'], correctAnswer: 'the exact lines involved in the exception' },
    { text: 'In JUnit 5, a test method is marked with…', options: ['@Test', '@Override', '@Public', '@Run'], correctAnswer: '@Test' },
    { text: '`assertEquals(9, max(4, 9))` fails when…', options: ['max(4,9) returns 9', 'max(4,9) returns anything other than 9', 'the test runs', 'assertEquals is imported'], correctAnswer: 'max(4,9) returns anything other than 9' },
    { text: 'A good test should be…', options: ['random every run', 'small, deterministic and focused on one behavior', 'long and complex', 'connected to the internet'], correctAnswer: 'small, deterministic and focused on one behavior' },
  ],
  'Mini Project — Student Grade Manager': [
    { text: 'In the capstone, the model class holding a student\'s name and marks is…', options: ['Main', 'Student', 'Scanner', 'Report'], correctAnswer: 'Student' },
    { text: 'The GradeBook class is responsible for…', options: ['printing the menu', 'holding students and computing averages/reports', 'reading keyboard input', 'compiling'], correctAnswer: 'holding students and computing averages/reports' },
    { text: 'The build-it capstone advice is…', options: ['write everything then fix', 'get a small working piece, then extend step by step', 'skip the loop', 'copy from the internet'], correctAnswer: 'get a small working piece, then extend step by step' },
    { text: 'If students is empty, GradeBook.average() should return…', options: ['throw always', '0 (guarded)', 'null', 'negative infinity'], correctAnswer: '0 (guarded)' },
  ],
  'Next Steps — Concurrency & the Java Ecosystem': [
    { text: 'ExecutorService, volatile and synchronized are tools for…', options: ['file I/O', 'concurrency and threads', 'string formatting', 'packaging'], correctAnswer: 'concurrency and threads' },
    { text: 'A common build tool in the Java ecosystem is…', options: ['npm', 'Maven', 'pip', 'cargo'], correctAnswer: 'Maven' },
    { text: 'Streams allow expressions like…', options: ['list.stream().filter(...).map(...)', 'list.forEachIF', 'stream.concat()', 'Stream.echo()'], correctAnswer: 'list.stream().filter(...).map(...)' },
    { text: 'Changing from one Java framework to another mostly changes…', options: ['the core language', 'vocabulary and tools, not core grammar', 'the JVM', 'the hardware'], correctAnswer: 'vocabulary and tools, not core grammar' },
  ],
};
