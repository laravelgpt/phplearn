export interface Topic {
    name: string;
    description: string;
    code: string;
}

export interface DayPlan {
    day: number;
    title: string;
    topics: Topic[];
}

const allTopics: Topic[] = [
    // This is the flat list from the previous version, kept here to be reassigned.
    {
        name: "1. Hello World",
        description: "The classic first program using `echo`.",
        code: `<?php\n\necho "Hello, Modern PHP World!";\n\n?>`
    },
    {
        name: "2. Variables",
        description: "Storing data in variables.",
        code: `<?php\n\n$name = "Alice";\n$age = 30;\n\necho "Name: $name, Age: $age";\n\n?>`
    },
    {
        name: "3. String Interpolation",
        description: "Embedding variables directly in double-quoted strings.",
        code: `<?php\n\n$framework = "React";\n$language = "PHP";\n\necho "This app uses $language on the backend and $framework on the frontend.";\n\n?>`
    },
    {
        name: "4. Constants",
        description: "Defining values that do not change.",
        code: `<?php\n\nconst SITE_NAME = "PHP Learning Editor";\necho "Welcome to " . SITE_NAME;\n\n?>`
    },
    {
        name: "5. Data Types",
        description: "A look at PHP's main scalar and compound data types.",
        code: `<?php\n\n$string = "text";\n$integer = 100;\n$float = 19.99;\n$bool = true;\n$array = [1, 'two'];\n$null = null;\n\nvar_dump($string, $integer, $float, $bool, $array, $null);\n\n?>`
    },
    {
        name: "6. Arithmetic Operators",
        description: "Performing mathematical calculations.",
        code: `<?php\n\n$a = 10;\n$b = 3;\n\necho "Addition: " . ($a + $b) . "<br>";\necho "Subtraction: " . ($a - $b) . "<br>";\necho "Multiplication: " . ($a * $b) . "<br>";\necho "Division: " . ($a / $b) . "<br>";\necho "Modulus: " . ($a % $b) . "<br>";\necho "Exponentiation: " . ($a ** $b);\n\n?>`
    },
    {
        name: "7. Comparison Operators",
        description: "Comparing values (including strict vs. loose).",
        code: `<?php\n\nvar_dump(5 == "5");  // bool(true) - loose comparison\nvar_dump(5 === "5"); // bool(false) - strict comparison\nvar_dump(10 > 5);\nvar_dump(7 <=> 7); // Spaceship operator: 0\nvar_dump(7 <=> 8); // Spaceship operator: -1\n\n?>`
    },
    {
        name: "8. New `str_contains` function (PHP 8.0+)",
        description: "An easier way to check if a string contains a substring.",
        code: `<?php\n\n$haystack = "the quick brown fox";\n\nif (str_contains($haystack, "brown")) {\n    echo "Substring found!";\n}\n\n?>`
    },
    {
        name: "9. New `str_starts_with` & `str_ends_with` (PHP 8.0+)",
        description: "Check if a string begins or ends with a specific substring.",
        code: `<?php\n\n$filename = "document.pdf";\n\nif (str_starts_with($filename, "doc")) {\n    echo "Filename starts with 'doc'.<br>";\n}\n\nif (str_ends_with($filename, ".pdf")) {\n    echo "It's a PDF file.";\n}\n\n?>`
    },
    {
        name: "10. If-Elseif-Else",
        description: "Executing code based on different conditions.",
        code: `<?php\n\n$hour = date('H');\n\nif ($hour < 12) {\n    echo "Good morning!";\n} elseif ($hour < 18) {\n    echo "Good afternoon!";\n} else {\n    echo "Good evening!";\n}\n\n?>`
    },
    {
        name: "11. Ternary Operator",
        description: "A compact shorthand for a simple if-else statement.",
        code: `<?php\n\n$is_logged_in = false;\n$message = $is_logged_in ? 'Welcome back!' : 'Please log in.';\necho $message;\n\n?>`
    },
    {
        name: "12. Null Coalescing Operator (??)",
        description: "Provide a default value for null variables.",
        code: `<?php\n\n$username = $_GET['user'] ?? 'guest';\necho "Welcome, " . htmlspecialchars($username);\n\n?>`
    },
    {
        name: "13. `switch` Statement",
        description: "An alternative to a long if-elseif-else chain.",
        code: `<?php\n\n$day = "Wednesday";\n\nswitch ($day) {\n    case "Monday":\n        echo "Start of the week.";\n        break;\n    case "Friday":\n        echo "Ready for the weekend!";\n        break;\n    default:\n        echo "Just another day.";\n}\n\n?>`
    },
    {
        name: "14. `match` Expression (PHP 8.0+)",
        description: "A modern, type-safe, and expression-based alternative to `switch`.",
        code: `<?php\n\n$http_status = 200;\n\n$message = match ($http_status) {\n    200, 304 => 'Success',\n    404 => 'Not Found',\n    500 => 'Server Error',\n    default => 'Unknown status',\n};\n\necho $message;\n\n?>`
    },
    {
        name: "15. `for` Loop",
        description: "Looping a specific number of times.",
        code: `<?php\n\nfor ($i = 1; $i <= 5; $i++) {\n    echo "Loop iteration: $i <br>";\n}\n\n?>`
    },
    {
        name: "16. `while` Loop",
        description: "Looping as long as a condition is true.",
        code: `<?php\n\n$count = 1;\nwhile ($count <= 5) {\n    echo "While loop count: $count <br>";\n    $count++;\n}\n\n?>`
    },
    {
        name: "17. `foreach` Loop",
        description: "The standard way to iterate over an array.",
        code: `<?php\n\n$colors = ['Red', 'Green', 'Blue'];\n\nforeach ($colors as $color) {\n    echo "$color <br>";\n}\n\n?>`
    },
    {
        name: "18. `foreach` with Key and Value",
        description: "Accessing both the key and value in an associative array.",
        code: `<?php\n\n$user = [\n    'name' => 'John Doe',\n    'email' => 'john.doe@example.com',\n    'role' => 'Admin'\n];\n\nforeach ($user as $key => $value) {\n    echo ucfirst($key) . ": $value <br>";\n}\n\n?>`
    },
    {
        name: "19. Basic Function",
        description: "Defining and calling a simple function.",
        code: `<?php\n\nfunction greet() {\n    echo "Hello from a function!";\n}\n\ngreet();\n\n?>`
    },
    {
        name: "20. Function with Parameters",
        description: "Passing data into a function.",
        code: `<?php\n\nfunction greet_user($name) {\n    echo "Hello, $name!";\n}\n\ngreet_user("Bob");\n\n?>`
    },
    {
        name: "21. Function with Return Value",
        description: "Getting data back from a function.",
        code: `<?php\n\nfunction add($num1, $num2) {\n    return $num1 + $num2;\n}\n\n$sum = add(10, 20);\necho "The sum is $sum.";\n\n?>`
    },
    {
        name: "22. Typed Parameters & Return Types",
        description: "Enforcing data types for function inputs and outputs.",
        code: `<?php\n\ndeclare(strict_types=1);\n\nfunction calculate_total(float $price, int $quantity): float {\n    return $price * $quantity;\n}\n\n$total = calculate_total(9.99, 3);\necho "Total cost: $$total";\n\n?>`
    },
    {
        name: "23. Arrow Functions (PHP 7.4+)",
        description: "A concise syntax for simple anonymous functions.",
        code: `<?php\n\n$numbers = [1, 2, 3, 4];\n$doubled = array_map(fn($n) => $n * 2, $numbers);\n\nprint_r($doubled);\n\n?>`
    },
    {
        name: "24. Named Arguments (PHP 8.0+)",
        description: "Passing arguments by name, making code more readable.",
        code: `<?php\n\nfunction set_cookie(string $name, string $value, int $expire = 0) {\n    echo "Setting cookie '$name' which expires in $expire seconds.";\n}\n\n// Call using named arguments, skipping the optional one\nset_cookie(name: 'user_id', value: '123');\n\n// Or specify all, in any order\nset_cookie(expire: 3600, value: 'abc', name: 'session_token');\n\n?>`
    },
    {
        name: "25. Variadic Functions (Splat Operator)",
        description: "Creating functions that accept a variable number of arguments.",
        code: `<?php\n\nfunction sum(...$numbers): float {\n    return array_sum($numbers);\n}\n\necho sum(1, 2, 3) . "<br>";\necho sum(10, 20, 30, 40);\n\n?>`
    },
    {
        name: "26. Spread Operator in Arguments",
        description: "Unpacking an array into function arguments.",
        code: `<?php\n\nfunction multiply($a, $b, $c) {\n    return $a * $b * $c;\n}\n\n$values = [2, 3, 5];\necho multiply(...$values);\n\n?>`
    },
    {
        name: "27. Indexed Arrays",
        description: "Creating a simple list of items.",
        code: `<?php\n\n$fruits = ['Apple', 'Banana', 'Cherry'];\necho $fruits[1]; // Outputs: Banana\n\n?>`
    },
    {
        name: "28. Associative Arrays",
        description: "Creating an array with named keys.",
        code: `<?php\n\n$user = [\n    'name' => 'Jane Doe',\n    'email' => 'jane@example.com',\n];\n\necho $user['name'];\n\n?>`
    },
    {
        name: "29. Multidimensional Arrays",
        description: "Arrays containing other arrays.",
        code: `<?php\n\n$users = [\n    ['name' => 'John', 'role' => 'Admin'],\n    ['name' => 'Jane', 'role' => 'Editor'],\n];\n\necho $users[1]['name']; // Outputs: Jane\n\n?>`
    },
    {
        name: "30. `array_map`",
        description: "Apply a callback to the elements of an array.",
        code: `<?php\n\n$numbers = [1, 2, 3, 4, 5];\n$squares = array_map(fn($n) => $n * $n, $numbers);\n\nprint_r($squares);\n\n?>`
    },
    {
        name: "31. `array_filter`",
        description: "Filter elements of an array using a callback function.",
        code: `<?php\n\n$numbers = [1, 2, 3, 4, 5, 6];\n$evens = array_filter($numbers, fn($n) => $n % 2 === 0);\n\nprint_r($evens);\n\n?>`
    },
    {
        name: "32. `array_reduce`",
        description: "Iteratively reduce the array to a single value.",
        code: `<?php\n\n$numbers = [1, 2, 3, 4, 5];\n$sum = array_reduce($numbers, fn($carry, $item) => $carry + $item, 0);\n\necho "Sum: $sum";\n\n?>`
    },
    {
        name: "33. Array Destructuring",
        description: "Unpacking array values into variables.",
        code: `<?php\n\n$person = ['John', 'Doe', 34];\n[$firstName, $lastName, $age] = $person;\n\necho "Name: $firstName $lastName";\n\n?>`
    },
    {
        name: "34. Array Destructuring with Keys",
        description: "Unpacking associative array values.",
        code: `<?php\n\n$config = ['host' => 'localhost', 'user' => 'root', 'pass' => 'secret'];\n['host' => $db_host, 'user' => $db_user] = $config;\n\necho "Connecting to $db_host as $db_user";\n\n?>`
    },
    {
        name: "35. `array_is_list` (PHP 8.1+)",
        description: "Check if an array has sequential, zero-based integer keys.",
        code: `<?php\n\nvar_dump(array_is_list([])); // true\nvar_dump(array_is_list(['a', 'b', 'c'])); // true\nvar_dump(array_is_list([0 => 'a', 1 => 'b'])); // true\n\nvar_dump(array_is_list([1 => 'a'])); // false, not 0-indexed\nvar_dump(array_is_list(['a' => 1])); // false, associative\n\n?>`
    },
    {
        name: "36. Basic Class and Object",
        description: "The fundamental building blocks of OOP.",
        code: `<?php\n\nclass Car {\n    public $color = 'red';\n    public $brand = 'Toyota';\n\n    public function startEngine() {\n        return "Engine started!";\n    }\n}\n\n$myCar = new Car();\necho "My car is a $myCar->color $myCar->brand. ";\necho $myCar->startEngine();\n\n?>`
    },
    {
        name: "37. Constructor Method",
        description: "Initializing object properties upon creation.",
        code: `<?php\n\nclass User {\n    public $username;\n\n    public function __construct($name) {\n        $this->username = $name;\n        echo "User '$this->username' created.";\n    }\n}\n\n$user1 = new User('Alex');\n\n?>`
    },
    {
        name: "38. Constructor Property Promotion (PHP 8.0+)",
        description: "A concise way to declare and initialize properties.",
        code: `<?php\n\nclass Product {\n    public function __construct(\n        public string $name,\n        public float $price,\n        public int $stock = 0\n    ) {}\n}\n\n$product = new Product(name: 'Laptop', price: 1200.00);\necho "Product: {$product->name}, Price: \${$product->price}";\n\n?>`
    },
    {
        name: "39. `readonly` Properties (PHP 8.1+)",
        description: "Create properties that cannot be changed after initialization.",
        code: `<?php\n\nclass Transaction {\n    public function __construct(\n        public readonly string $transactionId,\n        public float $amount\n    ) {}\n}\n\n$tx = new Transaction(transactionId: 'txn_123', amount: 99.99);\n$tx->amount = 101.50; // OK\n// $tx->transactionId = 'txn_456'; // Fatal error\n\necho "Transaction ID: {$tx->transactionId}";\n\n?>`
    },
    {
        name: "40. `readonly` Classes (PHP 8.2+)",
        description: "A shorthand to make every property in a class readonly.",
        code: `<?php\n\nreadonly class ValueObject {\n    public string $data;\n\n    public function __construct(string $data) {\n        $this->data = $data;\n    }\n}\n\n$vo = new ValueObject("Initial Data");\n// $vo->data = "New Data"; // Fatal error\n\necho $vo->data;\n\n?>`
    },
    {
        name: "41. Visibility (public, private, protected)",
        description: "Controlling access to properties and methods.",
        code: `<?php\n\nclass BankAccount {\n    public string $owner;\n    private float $balance;\n\n    public function __construct(string $owner, float $initialDeposit) {\n        $this->owner = $owner;\n        $this->balance = $initialDeposit;\n    }\n\n    public function getBalance(): float {\n        return $this->balance;\n    }\n}\n\n$account = new BankAccount('Bob', 1000);\necho "Owner: {$account->owner}<br>";\necho "Balance: \${$account->getBalance()}";\n// echo $account->balance; // Fatal error\n\n?>`
    },
    {
        name: "42. Inheritance",
        description: "Creating a new class (child) from an existing class (parent).",
        code: `<?php\n\nclass Animal {\n    public function __construct(public string $name) {}\n    public function eat() { return "{$this->name} is eating."; }\n}\n\nclass Cat extends Animal {\n    public function meow() { return "Meow!"; }\n}\n\n$cat = new Cat('Whiskers');\necho $cat->eat() . " " . $cat->meow();\n\n?>`
    },
    {
        name: "43. Overriding Methods",
        description: "Redefining a parent method in a child class.",
        code: `<?php\n\nclass Shape {\n    public function getArea(): float { return 0.0; }\n}\n\nclass Square extends Shape {\n    public function __construct(public float $side) {}\n\n    public function getArea(): float {\n        return $this->side * $this->side;\n    }\n}\n\n$square = new Square(5);\necho "Area: " . $square->getArea();\n\n?>`
    },
    {
        name: "44. `#[Override]` Attribute (PHP 8.3+)",
        description: "Ensures a method correctly overrides a parent's method.",
        code: `<?php\n\nclass ParentClass {\n    public function doSomething(): void {}\n}\n\nclass ChildClass extends ParentClass {\n    #[Override]\n    public function doSomething(): void {\n        echo "Overridden!";\n    }\n\n    // #[Override] // This would cause an error\n    // public function doesSomething(): void {}\n}\n\n(new ChildClass())->doSomething();\n\n?>`
    },
    {
        name: "45. Abstract Classes and Methods",
        description: "A class that cannot be instantiated, used as a base for other classes.",
        code: `<?php\n\nabstract class Vehicle {\n    abstract public function getNumberOfWheels(): int;\n\n    public function start() {\n        return "Vehicle started.";\n    }\n}\n\nclass Motorcycle extends Vehicle {\n    public function getNumberOfWheels(): int {\n        return 2;\n    }\n}\n\n$bike = new Motorcycle();\necho $bike->start() . " It has " . $bike->getNumberOfWheels() . " wheels.";\n\n?>`
    },
    {
        name: "46. Interfaces",
        description: "A contract defining methods a class must implement.",
        code: `<?php\n\ninterface Loggable {\n    public function getLogMessage(): string;\n}\n\nclass WebEvent implements Loggable {\n    public function __construct(public string $event) {}\n\n    public function getLogMessage(): string {\n        return "Event: {$this->event} at " . date('H:i:s');\n    }\n}\n\n$event = new WebEvent('User Login');\necho $event->getLogMessage();\n\n?>`
    },
    {
        name: "47. Traits",
        description: "Reusing a set of methods in multiple independent classes.",
        code: `<?php\n\ntrait Timestampable {\n    public function getTimestamp(): string {\n        return date('Y-m-d H:i:s');\n    }\n}\n\nclass Post { use Timestampable; }\nclass Comment { use Timestampable; }\n\n$post = new Post();\necho "Post created at: " . $post->getTimestamp();\n\n?>`
    },
    {
        name: "48. Static Methods and Properties",
        description: "Methods/properties that belong to a class, not an instance.",
        code: `<?php\n\nclass MathUtility {\n    public static float $pi = 3.14;\n\n    public static function add(int ...$nums): int {\n        return array_sum($nums);\n    }\n}\n\necho "Pi is " . MathUtility::$pi . "<br>";\necho "Sum is " . MathUtility::add(10, 20, 30);\n\n?>`
    },
    {
        name: "49. Namespaces",
        description: "Organizing code and preventing naming collisions.",
        code: `<?php\n\nnamespace App\\Services;\n\nclass Logger {\n    public function log($message) { echo "LOG: $message"; }\n}\n\n// To use it:\n// $logger = new \\App\\Services\\Logger();\n// $logger->log("Something happened.");\n\n// This will just demonstrate the class exists.\necho "Logger class defined in namespace App\\\\Services";\n\n?>`
    },
    {
        name: "50. Pure Enums (PHP 8.1+)",
        description: "Defining a type with a fixed set of possible cases.",
        code: `<?php\n\nenum Status {\n    case DRAFT;\n    case PUBLISHED;\n    case ARCHIVED;\n}\n\nfunction setStatus(Status $status) {\n    if ($status === Status::PUBLISHED) {\n        echo "Post is now live!";\n    }\n}\n\nsetStatus(Status::PUBLISHED);\n\n?>`
    },
    {
        name: "51. Backed Enums (PHP 8.1+)",
        description: "Enums where each case is backed by a string or int value.",
        code: `<?php\n\nenum UserRole: string {\n    case GUEST = 'guest';\n    case EDITOR = 'editor';\n    case ADMIN = 'admin';\n}\n\n$role = UserRole::ADMIN;\necho "Role value: " . $role->value; // 'admin'\n\n// You can get a case from a value\n$editorRole = UserRole::from('editor');\necho "<br>Role name: " . $editorRole->name; // 'EDITOR'\n\n?>`
    },
    {
        name: "52. `__toString()` Magic Method",
        description: "Defines how an object behaves when treated as a string.",
        code: `<?php\n\nclass Money {\n    public function __construct(private float $amount, private string $currency) {}\n\n    public function __toString(): string {\n        return number_format($this->amount, 2) . ' ' . $this->currency;\n    }\n}\n\n$price = new Money(49.99, 'USD');\necho "The price is $price.";\n\n?>`
    },
    {
        name: "53. Union Types (PHP 8.0+)",
        description: "Specifying that a value can be one of multiple types.",
        code: `<?php\n\ndeclare(strict_types=1);\n\nclass Number {\n    public int|float $value;\n\n    public function __construct(int|float $num) {\n        $this->value = $num;\n    }\n}\n\n$n1 = new Number(100);     // int\n$n2 = new Number(99.9);   // float\n\nvar_dump($n1->value, $n2->value);\n\n?>`
    },
    {
        name: "54. `mixed` Type (PHP 8.0+)",
        description: "Indicates a value can be of any type.",
        code: `<?php\n\nfunction debug_value(mixed $value): void {\n    echo "Type: " . gettype($value) . ", Value: ";\n    print_r($value);\n}\n\ndebug_value("a string");\necho "<br>";\ndebug_value([1, 2]);\n\n?>`
    },
    {
        name: "55. `never` Return Type (PHP 8.1+)",
        description: "For a function that always throws or exits.",
        code: `<?php\n\nfunction throw_error(string $message): never {\n    throw new Exception($message);\n}\n\ntry {\n    throw_error("Something went wrong");\n} catch (Exception $e) {\n    echo "Caught exception: " . $e->getMessage();\n}\n\n?>`
    },
    {
        name: "56. Intersection Types (PHP 8.1+)",
        description: "A value must satisfy multiple interface constraints.",
        code: `<?php\n\ninterface Countable {\n    public function count(): int;\n}\n\ninterface JsonSerializable {\n    public function jsonSerialize(): mixed;\n}\n\nfunction process_data(Countable&JsonSerializable $data) {\n    echo "Item count: " . $data->count();\n    echo "<br>JSON: " . json_encode($data);\n}\n\n// Create a class that implements both interfaces\nclass DataCollection implements Countable, JsonSerializable {\n    public function count(): int { return 3; }\n    public function jsonSerialize(): mixed { return ['a', 'b', 'c']; }\n}\n\nprocess_data(new DataCollection());\n\n?>`
    },
    {
        name: "57. DNF Types (PHP 8.2+)",
        description: "Allows combining union and intersection types.",
        code: `<?php\n\ninterface A {}\ninterface B {}\nclass C {}\n\nfunction process((A&B)|C $input): void {\n    echo "Input of type " . get_class($input) . " processed.";\n}\n\nprocess(new C());\n// process(new class implements A, B {}); // also valid\n\n?>`
    },
    {
        name: "58. `true` Type (PHP 8.2+)",
        description: "For functions that are guaranteed to return the boolean `true`.",
        code: `<?php\n\n// For example, in a mock object for testing\nclass MockValidator {\n    public function isValid(mixed $data): true {\n        // In a real scenario, this might throw if not valid\n        return true;\n    }\n}\n\n$validator = new MockValidator();\nvar_dump($validator->isValid('test'));\n\n?>`
    },
    {
        name: "59. Typed Class Constants (PHP 8.3+)",
        description: "Specify types for class, interface, enum, and trait constants.",
        code: `<?php\n\ninterface Config {\n    const string DEFAULT_THEME = 'dark';\n    const int SESSION_LIFETIME = 3600;\n}\n\necho "Theme: " . Config::DEFAULT_THEME;\n\n?>`
    },
    {
        name: "60. `$_GET` and `htmlspecialchars`",
        description: "Securely getting data from the URL query string.",
        code: `<?php\n\n// Try accessing with ?name=<script>alert('XSS')</script>\n$name = $_GET['name'] ?? 'Guest';\n\necho "<h1>Welcome, " . htmlspecialchars($name) . "!</h1>";\n\n?>`
    },
    {
        name: "61. `$_POST` Form Handling",
        description: "Handling data submitted from an HTML form.",
        code: `<?php\n\n$feedback = '';\nif ($_SERVER["REQUEST_METHOD"] === "POST") {\n    $email = htmlspecialchars($_POST['email'] ?? '');\n    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {\n        $feedback = "Thank you, $email!";\n    } else {\n        $feedback = "Invalid email provided.";\n    }\n}\n\n?>\n<form method="post" action="">\n    <label for="email">Email:</label>\n    <input type="text" id="email" name="email">\n    <button type="submit">Subscribe</button>\n</form>\n<p><?= $feedback ?></p>`
    },
    {
        name: "62. Session Handling",
        description: "Storing user data across multiple page views.",
        code: `<?php\n\n// Note: Sessions require server-side configuration to work.\n// This is a conceptual demonstration.\n\n// session_start();\n\n$_SESSION['views'] = ($_SESSION['views'] ?? 0) + 1;\n\necho "Page views: " . $_SESSION['views'];\n\n// To clear:\n// session_destroy();\n\n?>`
    },
    {
        name: "63. Cookie Handling",
        description: "Storing small amounts of data on the user's browser.",
        code: `<?php\n\n// Note: Cookies require server-side configuration.\n// This is a conceptual demonstration.\n\n$theme = $_COOKIE['theme'] ?? 'light';\n\nif (isset($_GET['toggle_theme'])) {\n    $theme = ($theme === 'light') ? 'dark' : 'light';\n    // setcookie('theme', $theme);\n}\n\necho "Current theme is: " . htmlspecialchars($theme);\n\n?>\n\n<a href="?toggle_theme=1">Toggle Theme</a>`
    },
    {
        name: "64. File Uploads (`$_FILES`)",
        description: "Handling files uploaded through a form.",
        code: `<?php\n\n// This is a conceptual example. Real file uploads require\n// careful validation of size, type, and content.\nif (!empty($_FILES)) {\n    $file = $_FILES['user_avatar'];\n    echo "File Name: " . htmlspecialchars($file['name']) . "<br>";\n    echo "File Size: " . $file['size'] . " bytes<br>";\n    echo "File Type: " . htmlspecialchars($file['type']) . "<br>";\n    // move_uploaded_file($file['tmp_name'], 'uploads/' . $file['name']);\n}\n\n?>\n<form method="post" enctype="multipart/form-data">\n    <input type="file" name="user_avatar">\n    <button type="submit">Upload</button>\n</form>`
    },
    {
        name: "65. JSON Encoding",
        description: "Converting a PHP array into a JSON string.",
        code: `<?php\n\n$data = [\n    'id' => 123,\n    'name' => 'API Response',\n    'items' => ['a', 'b', 'c']\n];\n\nheader('Content-Type: application/json');\necho json_encode($data, JSON_PRETTY_PRINT);\n\n?>`
    },
    {
        name: "66. JSON Decoding",
        description: "Converting a JSON string into a PHP object or array.",
        code: `<?php\n\n$json_string = '{"id":456,"user":"test","active":true}';\n\n// Decode to an object (default)\n$obj = json_decode($json_string);\necho "User (object): " . $obj->user . "<br>";\n\n// Decode to an associative array\n$arr = json_decode($json_string, true);\necho "User (array): " . $arr['user'];\n\n?>`
    },
    {
        name: "67. `json_validate` (PHP 8.3+)",
        description: "Efficiently check if a string is valid JSON without decoding it.",
        code: `<?php\n\n$valid = '{"key": "value"}';\n$invalid = '{"key": "value",}';\n\nvar_dump(json_validate($valid));   // true\nvar_dump(json_validate($invalid)); // false\n\n?>`
    },
    {
        name: "68. `try...catch` Block",
        description: "Handling potential errors gracefully.",
        code: `<?php\n\ntry {\n    $result = 10 / 0;\n} catch (DivisionByZeroError $e) {\n    echo "Caught a DivisionByZeroError: " . $e->getMessage();\n}\n\necho "<br>Execution continues.";\n\n?>`
    },
    {
        name: "69. `try...catch...finally`",
        description: "Using a `finally` block for cleanup code.",
        code: `<?php\n\ntry {\n    echo "Trying to do something.<br>";\n    throw new Exception("Something failed.");\n} catch (Exception $e) {\n    echo "Caught exception: " . $e->getMessage() . "<br>";\n} finally {\n    echo "This finally block always runs.";\n}\n\n?>`
    },
    {
        name: "70. Custom Exceptions",
        description: "Creating your own exception types for better error handling.",
        code: `<?php\n\nclass NetworkException extends Exception {}\n\nfunction fetchData($url) {\n    if (empty($url)) {\n        throw new NetworkException("URL cannot be empty.");\n    }\n    // ... fetching logic\n    return "Data from $url";\n}\n\ntry {\n    fetchData("");\n} catch (NetworkException $e) {\n    echo "Network Error: " . $e->getMessage();\n}\n\n?>`
    },
    {
        name: "71. `throw` as an Expression (PHP 8.0+)",
        description: "Use `throw` in places like arrow functions or ternary operators.",
        code: `<?php\n\nfunction get_user_by_id(int $id) {\n    // A real function would query a database\n    return $id > 0 ? ['id' => $id, 'name' => 'User ' . $id] : throw new InvalidArgumentException("ID must be positive");\n}\n\ntry {\n    get_user_by_id(-5);\n} catch (InvalidArgumentException $e) {\n    echo $e->getMessage();\n}\n\n?>`
    },
    {
        name: "72. PDO: Connecting to a Database",
        description: "Establishing a connection to a database (e.g., SQLite).",
        code: `<?php\n\n// This uses an in-memory SQLite database for demonstration.\n$dsn = 'sqlite::memory:';\n\ntry {\n    $pdo = new PDO($dsn);\n    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n    echo "Successfully connected to in-memory SQLite database!";\n} catch (PDOException $e) {\n    echo "Connection failed: " . $e->getMessage();\n}\n\n?>`
    },
    {
        name: "73. PDO: Querying with `SELECT`",
        description: "Fetching data from a database.",
        code: `<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec("CREATE TABLE users (id INTEGER, name TEXT)");\n$pdo->exec("INSERT INTO users (id, name) VALUES (1, 'Alice'), (2, 'Bob')");\n\n$stmt = $pdo->query("SELECT * FROM users");\n\nwhile ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {\n    echo "ID: {$row['id']}, Name: {$row['name']}<br>";\n}\n\n?>`
    },
    {
        name: "74. PDO: Prepared Statements (`INSERT`)",
        description: "Securely inserting data to prevent SQL injection.",
        code: `<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec("CREATE TABLE products (name TEXT, price REAL)");\n\n$stmt = $pdo->prepare("INSERT INTO products (name, price) VALUES (?, ?)");\n\n$products = [\n    ['Laptop', 1299.99],\n    ['Mouse', 25.50]\n];\n\nforeach ($products as $product) {\n    $stmt->execute($product);\n}\n\necho "2 products inserted.";\n\n?>`
    },
    {
        name: "75. PDO: Prepared Statements (Named Placeholders)",
        description: "Using named placeholders for better readability.",
        code: `<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec("CREATE TABLE settings (key TEXT, value TEXT)");\n\n$stmt = $pdo->prepare("INSERT INTO settings (key, value) VALUES (:key, :value)");\n\n$stmt->execute([':key' => 'theme', ':value' => 'dark']);\n$stmt->execute(['key' => 'language', 'value' => 'en']);\n\necho "Settings saved.";\n\n?>`
    },
    {
        name: "76. PDO: Fetching a Single Record",
        description: "Retrieving one row from a query.",
        code: `<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec("CREATE TABLE users (id INTEGER, name TEXT)");\n$pdo->exec("INSERT INTO users (id, name) VALUES (1, 'Alice'), (2, 'Bob')");\n\n$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");\n$stmt->execute([1]);\n$user = $stmt->fetch(PDO::FETCH_ASSOC);\n\nprint_r($user);\n\n?>`
    },
    {
        name: "77. PDO: Getting the Row Count",
        description: "Counting the number of rows affected by a query.",
        code: `<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec("CREATE TABLE temp (data TEXT)");\n$stmt = $pdo->prepare("INSERT INTO temp (data) VALUES (?)");\n\n$stmt->execute(['one']);\n$stmt->execute(['two']);\n\necho "Rows affected: " . $stmt->rowCount();\n\n?>`
    },
    {
        name: "78. PDO: Transactions",
        description: "Grouping multiple queries into a single, atomic operation.",
        code: `<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec("CREATE TABLE accounts (name TEXT, balance REAL)");\n$pdo->exec("INSERT INTO accounts VALUES ('Alice', 100), ('Bob', 50)");\n\ntry {\n    $pdo->beginTransaction();\n    \n    $pdo->exec("UPDATE accounts SET balance = balance - 20 WHERE name = 'Alice'");\n    $pdo->exec("UPDATE accounts SET balance = balance + 20 WHERE name = 'Bob'");\n\n    $pdo->commit();\n    echo "Transaction successful!";\n} catch (Exception $e) {\n    $pdo->rollBack();\n    echo "Transaction failed: " . $e->getMessage();\n}\n\n?>`
    },
    {
        name: "79. Reading Files (`file_get_contents`)",
        description: "The simplest way to read an entire file into a string.",
        code: `<?php\n\n// This is conceptual as we don't have a real filesystem.\n// file_put_contents("test.txt", "Hello from a file!");\n// $content = file_get_contents("test.txt");\n// echo $content;\n\necho "Simulating reading 'Hello from a file!' from a file.";\n\n?>`
    },
    {
        name: "80. Writing Files (`file_put_contents`)",
        description: "The simplest way to write a string to a file.",
        code: `<?php\n\n// This is conceptual.\n// $result = file_put_contents("log.txt", "User logged in at " . date('Y-m-d H:i:s') . "\\n", FILE_APPEND);\n// if ($result) {\n//    echo "Log updated.";\n// }\n\necho "Simulating writing a log entry to a file.";\n\n?>`
    },
    {
        name: "81. Password Hashing & Verification",
        description: "The modern, secure way to handle user passwords.",
        code: `<?php\n\n$password = 'password123';\n\n// Hashing the password\n$hash = password_hash($password, PASSWORD_ARGON2ID);\necho "Hashed password: " . $hash . "<br>";\n\n// Verifying the password\nif (password_verify('password123', $hash)) {\n    echo "Password is correct!";\n} else {\n    echo "Incorrect password.";\n}\n\n?>`
    },
    {
        name: "82. Filter Variables (`filter_var`)",
        description: "Validate and sanitize data from user input.",
        code: `<?php\n\n$email = "test@example.com";\nif (filter_var($email, FILTER_VALIDATE_EMAIL)) {\n    echo "$email is a valid email address.<br>";\n}\n\n$number = "123";\n$int_val = filter_var($number, FILTER_VALIDATE_INT);\nvar_dump($int_val);\n\n?>`
    },
    {
        name: "83. Nullsafe Operator (PHP 8.0+)",
        description: "Safely call methods on potentially null objects.",
        code: `<?php\n\nclass Session {\n    public function getUser(): ?User { return null; }\n}\nclass User {\n    public function getUsername(): string { return "Admin"; }\n}\n\n$session = new Session();\n$username = $session->getUser()?->getUsername() ?? 'Guest';\n\necho "Current user: $username";\n\n?>`
    },
    {
        name: "84. Attributes (PHP 8.0+)",
        description: "Adding structured metadata to classes, methods, etc.",
        code: `<?php\n\n#[Attribute(Attribute::TARGET_METHOD)]\nclass Route {\n    public function __construct(public string $path) {}\n}\n\nclass MyController {\n    #[Route('/api/users')]\n    public function getUsers() {}\n}\n\n// Introspection logic would read this attribute\n$reflection = new ReflectionMethod('MyController', 'getUsers');\n$attributes = $reflection->getAttributes(Route::class);\n\necho "Route Path: " . $attributes[0]->newInstance()->path;\n\n?>`
    },
    {
        name: "85. `WeakMap` (PHP 8.0+)",
        description: "A map that doesn't prevent objects from being garbage collected.",
        code: `<?php\n\n// Useful for caching data associated with an object\n$cache = new WeakMap();\n$obj = new stdClass();\n\n$cache[$obj] = "Some cached data";\n\nvar_dump($cache[$obj]);\n\n// If $obj is unset and no other references exist,\n// the entry will be removed from the WeakMap.\n\n?>`
    },
    {
        name: "86. First-class Callable Syntax (PHP 8.1+)",
        description: "A clean way to create a closure from any callable.",
        code: `<?php\n\nclass Greeter {\n    public function greet(string $name): string {\n        return "Hello, $name";\n    }\n}\n\n$greeter = new Greeter();\n$callable = $greeter->greet(...);\n\necho $callable('World');\n\n$doubler = static fn(int $i): int => $i * 2;\n$callable2 = $doubler(...);\necho '<br>' . $callable2(10); // 20\n\n?>`
    },
    {
        name: "87. Fibers (PHP 8.1+)",
        description: "A primitive for building lightweight cooperative concurrency.",
        code: `<?php\n\n$fiber = new Fiber(function (): void {\n    echo "Fiber started.<br>";\n    $value = Fiber::suspend('paused');\n    echo "Fiber resumed with value: $value.<br>";\n});\n\n$fromSuspend = $fiber->start();\necho "Fiber suspended with value: $fromSuspend.<br>";\n$fiber->resume('resumed');\n\n?>`
    },
    {
        name: "88. `Randomizer` Extension (PHP 8.2+)",
        description: "A modern, object-oriented API for generating random numbers.",
        code: `<?php\n\n$randomizer = new \\Random\\Randomizer();\n\necho "Random Integer: " . $randomizer->getInt(1, 100) . "<br>";\n\n$fruits = ['apple', 'banana', 'orange', 'grape'];\n$randomKey = $randomizer->pickArrayKeys($fruits, 1)[0];\necho "Random Fruit: " . $fruits[$randomKey] . "<br>";\n\necho "Shuffled String: " . $randomizer->shuffleBytes('abcdef');\n\n?>`
    },
    {
        name: "89. Generators and `yield`",
        description: "A memory-efficient way to create iterators.",
        code: `<?php\n\nfunction number_range($start, $end) {\n    for ($i = $start; $i <= $end; $i++) {\n        yield $i;\n    }\n}\n\nforeach (number_range(1, 5) as $number) {\n    echo "$number ";\n}\n\n?>`
    },
    {
        name: "90. Date and Time (`DateTime` object)",
        description: "The modern, object-oriented way to work with dates.",
        code: `<?php\n\n$now = new DateTime();\necho "Now: " . $now->format('Y-m-d H:i:s') . "<br>";\n\n$tomorrow = new DateTime('tomorrow');\necho "Tomorrow: " . $tomorrow->format('Y-m-d') . "<br>";\n\n$interval = new DateInterval('P2W'); // 2 week period\n$now->add($interval);\necho "Two weeks from now: " . $now->format('Y-m-d');\n\n?>`
    },
    {
        name: "91. `DatePeriod`",
        description: "Iterating over a recurring set of dates and times.",
        code: `<?php\n\n$start = new DateTime('2024-01-01');\n$interval = new DateInterval('P1M'); // 1 month interval\n$end = new DateTime('2024-05-01');\n\n$period = new DatePeriod($start, $interval, $end);\n\nforeach ($period as $date) {\n    echo $date->format('Y-m') . "<br>";\n}\n\n?>`
    },
    {
        name: "92. `DateTimeImmutable`",
        description: "An immutable version of `DateTime` that prevents accidental changes.",
        code: `<?php\n\n$date = new DateTimeImmutable('2024-07-04');\n$newDate = $date->modify('+1 day');\n\necho "Original Date: " . $date->format('Y-m-d') . "<br>";\necho "New Date: " . $newDate->format('Y-m-d');\n\n?>`
    },
    {
        name: "93. `final` Classes and Methods",
        description: "Preventing a class from being extended or a method from being overridden.",
        code: `<?php\n\nfinal class UtilityClass {\n    public static function doWork() {}\n}\n\n// class AnotherUtility extends UtilityClass {} // Fatal error\n\nclass Base {\n    final public function importantMethod() {}\n}\n\nclass Child extends Base {\n    // public function importantMethod() {} // Fatal error\n}\n\necho "Final classes and methods cannot be inherited/overridden.";\n\n?>`
    },
    {
        name: "94. Object Cloning",
        description: "Creating a copy of an object.",
        code: `<?php\n\nclass MyObject {\n    public $property = 1;\n}\n\n$obj1 = new MyObject();\n$obj2 = clone $obj1;\n\n$obj2->property = 2;\n\necho "Object 1: " . $obj1->property . "<br>"; // 1\necho "Object 2: " . $obj2->property; // 2\n\n?>`
    },
    {
        name: "95. `__clone()` Magic Method",
        description: "Customizing the cloning process (e.g., for deep copies).",
        code: `<?php\n\nclass Profile {\n    public function __construct(public string $name) {}\n}\n\nclass User {\n    public Profile $profile;\n    public function __construct(string $name) {\n        $this->profile = new Profile($name);\n    }\n\n    public function __clone() {\n        // Create a new copy of the inner object\n        $this->profile = clone $this->profile;\n    }\n}\n\n$user1 = new User('Alice');\n$user2 = clone $user1;\n\n$user2->profile->name = 'Alicia';\n\necho $user1->profile->name; // Alice\n\n?>`
    },
    {
        name: "96. `__invoke()` Magic Method",
        description: "Allows an object to be called as if it were a function.",
        code: `<?php\n\nclass Adder {\n    public function __invoke($a, $b) {\n        return $a + $b;\n    }\n}\n\n$add = new Adder();\necho $add(5, 10); // 15\n\n?>`
    },
    {
        name: "97. `__get` and `__set` Magic Methods",
        description: "Handling access to inaccessible or non-existent properties.",
        code: `<?php\n\nclass DynamicProps {\n    private $data = [];\n\n    public function __set($name, $value) {\n        $this->data[$name] = $value;\n    }\n\n    public function __get($name) {\n        return $this->data[$name] ?? null;\n    }\n}\n\n$obj = new DynamicProps();\n$obj->name = "Test";\necho $obj->name; // Test\n\n?>`
    },
    {
        name: "98. `instanceof` Operator",
        description: "Checking if an object is an instance of a specific class or interface.",
        code: `<?php\n\ninterface MyInterface {}\nclass MyClass implements MyInterface {}\nclass AnotherClass {}\n\n$obj = new MyClass();\n\nvar_dump($obj instanceof MyClass); // true\nvar_dump($obj instanceof MyInterface); // true\nvar_dump($obj instanceof AnotherClass); // false\n\n?>`
    },
    {
        name: "99. Short-circuiting Logical Operators",
        description: "Understanding how `&&` and `||` evaluate expressions.",
        code: `<?php\n\nfunction is_true() {\n    echo "is_true called<br>";\n    return true;\n}\n\nfunction is_false() {\n    echo "is_false called<br>";\n    return false;\n}\n\necho "Testing ||:<br>";\n// is_false() is never called\nif (is_true() || is_false()) {}\n\necho "<br>Testing &&:<br>";\n// is_true() is never called\nif (is_false() && is_true()) {}\n\n?>`
    },
    {
        name: "100. `require` vs `include`",
        description: "Including other PHP files and the difference between them.",
        code: `<?php\n\n// To demonstrate, imagine a file 'header.php' with: \n// <?php echo "<h1>My Site</h1>"; ?>\n\n// include 'header.php'; // Continues if file not found (warning)\n// require 'header.php'; // Stops if file not found (fatal error)\n\n// include_once and require_once prevent including the same file multiple times.\n\necho "Simulating inclusion of another PHP file.";\n\n?>`
    },
];

export const phpTopicsByDay: DayPlan[] = [
    { day: 1, title: "The Absolute Basics", topics: allTopics.slice(0, 4) },
    { day: 2, title: "Core Data Types", topics: allTopics.slice(4, 7) },
    { day: 3, title: "Working with Strings", topics: allTopics.slice(7, 9) },
    { day: 4, title: "Conditional Logic", topics: allTopics.slice(9, 12) },
    { day: 5, title: "Advanced Conditionals", topics: allTopics.slice(12, 14) },
    { day: 6, title: "Looping Constructs", topics: allTopics.slice(14, 16) },
    { day: 7, title: "Iterating Over Arrays", topics: allTopics.slice(16, 18) },
    { day: 8, title: "Introduction to Functions", topics: allTopics.slice(18, 21) },
    { day: 9, title: "Modern Function Features", topics: allTopics.slice(21, 24) },
    { day: 10, title: "Advanced Function Techniques", topics: allTopics.slice(24, 26) },
    { day: 11, title: "Introduction to Arrays", topics: allTopics.slice(26, 29) },
    { day: 12, title: "Functional Array Operations", topics: allTopics.slice(29, 32) },
    { day: 13, title: "Advanced Array Techniques", topics: allTopics.slice(32, 35) },
    { day: 14, title: "Introduction to OOP", topics: [allTopics[35], allTopics[36], allTopics[40]] },
    { day: 15, title: "Modern OOP Constructors & Properties", topics: allTopics.slice(37, 40) },
    { day: 16, title: "OOP Inheritance", topics: allTopics.slice(41, 44) },
    { day: 17, title: "Abstract Structures", topics: [allTopics[44], allTopics[45], allTopics[92]] },
    { day: 18, title: "Advanced OOP Concepts", topics: allTopics.slice(46, 49) },
    { day: 19, title: "Enums", topics: allTopics.slice(49, 51) },
    { day: 20, title: "Magic Methods", topics: [allTopics[51], allTopics[95], allTopics[96]] },
    { day: 21, title: "Object Cloning & Comparison", topics: [allTopics[93], allTopics[94], allTopics[97]] },
    { day: 22, title: "Advanced Type System", topics: allTopics.slice(52, 55) },
    { day: 23, title: "More Advanced Types", topics: allTopics.slice(55, 59) },
    { day: 24, title: "Web Input & Forms", topics: [allTopics[59], allTopics[60], allTopics[63]] },
    { day: 25, title: "State Management & APIs", topics: allTopics.slice(61, 67) },
    { day: 26, title: "Error and Exception Handling", topics: allTopics.slice(67, 71) },
    { day: 27, title: "Database Foundations (PDO)", topics: [allTopics[71], allTopics[72], allTopics[75]] },
    { day: 28, title: "Secure Database Operations (PDO)", topics: [allTopics[73], allTopics[74], allTopics[76], allTopics[77]] },
    { day: 29, title: "Filesystem and Security", topics: allTopics.slice(78, 82) },
    { day: 30, title: "Miscellaneous & Advanced Features", topics: allTopics.slice(82, 100) },
];
