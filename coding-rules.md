<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  

<h2 align="center">BALANCE FrontEnd Coding Rules</h2>
</div>


## Inline CSS styles
Static properties should be set in the SCSS, dynamic ones in JS.

```css
.Foo {
    background-color: #ff0;
}
```

```javascript
class Foo extends React.Component {
    render() {
        
        const styles = {
            'transform': 'translateX(' + this.state.position + ' + px)'
        };
    
        return (
            <div className="Foo" styles={classes}>Foo Header</div>
        )
    };
}
```




## Use "classnames" to set CSS classes

Use the [classnames](https://www.npmjs.com/package/classnames) node module for setting CSS classes on an element.

```javascript
import React from 'react';
import classnames from 'classnames';
class Foo extends React.Component {
    render() {
        
        const classes = classnames('FooHeader', {
            'is-fixed': this.state.fixed,
            'is-visible': this.state.visible
        });
    
        return (
            <div className={classes}>Foo Header</div>
        )
    };
}
```



<br>

## Naming Conventions

* Use lowerCamelCase for identifier names : variables, properties and function names. All names start with a letter.

    Right:
    ```sh
    let projectName = 'balance';
    ```

    Wrong:
    ```sh
    let project_name = "balance";
    let ProjectName  = "balance";
    ```

* Use UpperCamelCase for class names

    Right:
    ```sh
    class Rectangle {
        constructor(height, width) {
            this.height = height;
            this.width = width;
        }
    }
    ```

    Wrong:
    ```sh
    class rectangle {
        constructor(height, width) {
            this.height = height;
            this.width = width;
        }
    }
    ```
* Use UPPERCASE for Constants and Global variables


    Right:
    ```sh
    const PI = 3.14;
    ```

    Wrong:
    ```sh
    const pi = 3.14;
    ```


* Use lowercase for file names

    Most web servers (Apache, Unix) are case sensitive about file names other web servers (Microsoft , IIS) ase not. If you mover from a case insensitive server to sensitive server, even small errors can break your server. To avoid these problems, always use lowercase file names.


## Formatting

* Code Indentation

    Always use 4 spaces for indentation of code blocks:
  ```sh
  function caculateHeight(height) {
      return height;
  }
  ```

* 80-100 characters per line

* Use single quotes

    Use single quotes, unless you are writing JSON. This helps you separate your objects’ strings from normal strings.

    Right:
    ```sh
    let name = 'balance';
    ```

    Wrong:
    ```sh
    let name = "balance";
    ```

* Spaces Around Operators
    
    Always put spaces around operators ( = + - * /)
    ```sh
    let x = y + z;
    ```


* Declare one variable per var statement
    
    Declare one variable per var statement, it makes it easier to re-order the lines.
   
    Right:
    ```sh
    let name = 'balance';
    let values = [23, 42];
    ```

    Wrong:
    ```sh
    let keys = [‘foo’, ‘bar’],
    values = [23, 42],
    object = {},
    key;
    ```

* Braces

    The opening braces go on the same line as the statement. Also, notice the use of white space before and after the condition statement. What if you want to write ‘else’ or ‘else if’ along with your ‘if’…


    Right:
    ```sh
    if (true) {
        console.log(‘winning’);
    } else if (false) {
        console.log(‘this is good’);
    } else {
        console.log(‘finally’);
    }
    ```
    Wrong:
    ```sh
    if (true)
    {
        console.log(‘losing’);
    }
    else if (false)
    {
        console.log(‘this is bad’);
    }
    else
    {
        console.log(‘not good’);
    }
    ```
 * Use semicolons
## Variables
* Array
    Use trailing commas and put short declarations on a single line.
    Right:
    ```sh
    let a = ['hello', 'world'];
    ```
    Wrong:
    ```sh
   var a = [
    'hello', 'world'
    ];
    ```
* Objects
    - Place the opening bracket on the same line as the object name.
    - Use colon plus one space between each property and its value.
    - Use quotes around string values, not around numeric values.
    - Do not add a comma after the last property-value pair.
    - Place the closing bracket on a new line, without leading spaces.
    - Always end an object definition with a semicolon.
    Example:
    ```sh
    const person = {
        firstName: "John",
        lastName: "Doe",
        age: 50,
        eyeColor: "blue"
    };
    ```
    Short objects can be written compressed, on one line, using spaces only between properties, like this:
    ```sh
    const person = {firstName:"John", lastName:"Doe", age:50, eyeColor:"blue"};
    ```
## Statement
General rules for complex (compound) statements:
* Put the opening bracket at the end of the first line.
* Use one space before the opening bracket.
* Put the closing bracket on a new line, without leading spaces.
* Do not end a complex statement with a semicolon.
    Function:
    ```sh
    function toCelsius(fahrenheit) {
    return (5 / 9) * (fahrenheit - 32);
    }
    ```
    Loops:
    ```sh
    for (let i = 0; i < 5; i++) {
    x += i;
    }
    ```
    Conditionals:
    ```sh
    if (time < 20) {
    greeting = "Good day";
    } else {
    greeting = "Good evening";
    }
    ```
## Conditionals 
* Use the === operator
* Use descriptive conditions
    Right:
    ```sh
        var isValidPassword = password.length >= 4 && /^(?=.*\d).{4,}$/.test(password);
        if (isValidPassword) {
            console.log('winning');
        }
    ```
    Wrong:
    ```sh
    if (password.length >= 4 && /^(?=.*\d).{4,}$/.test(password)) {
        console.log('losing');
    }
    ```
## Functions
* Write small functions
* Return early from functions
    
    To avoid deep nesting of if-statements, always return a function’s value as early as possible.
    Right:
    ```sh
    function isPercentage(val) {
        if (val < 0) {
            return false;
        }
        if (val > 100) {
            return false;
        }
        return true;
    }
    ```
    Wrong:
    ```sh
    function isPercentage(val) {
        if (val >= 0) {
            if (val < 100) {
            return true;
            } else {
            return false;
            }
        } else {
            return false;
        }
    }
    ```
* Method chaining
    One method per line should be used to chain methods.Should also indent these methods so it’s easier to tell they are part of the same chain.
    Right:
    ```sh
    User
    .findOne({ name: ‘foo’ })
    .populate(‘bar’)
    .exec(function(err, user) {
        return true;
    });
    ```
    Wrong:
    ```sh
    User.findOne({ name: 'foo' }).populate('bar')
    .exec(function(err, user) {
    return true;
    });
    ```
## Comments
* Use slashes for comments
    Use slashes for both single line and multi line comments. Try to write comments that explain higher level mechanisms or clarify difficult segments of your code. Don’t use comments to restate trivial things.
    
    Example:
    ```sh
    // This value has a nasty side effect where a failure to 
    // increment a redis counter used for statistics will 
    // cause an exception. This needs to be fixed in a later iteration.
    Const  COUNT = 10;
    ```
   
* Function comments use /** ...*/
   Example:
     ```sh
    /**
    * 
    * @description this is func to check permission access role customer
    * @param transactionManager  this is transaction to rollback database if have error
    * @param requestRoleDto  input roleId to get data from database
    * @param userId  id to get current user 
    * @returns return code 201 & message : 'Request accepted, establish organization successfully.'
   */
    async requestRole(
        transactionManager: EntityManager,
        requestRoleDto: RequestRoleDto,
        userId: number,
    ) {
        const { roleId } = requestRoleDto;
        let addRequestRoleDto: AddRequestRoleDto;
        const existsRequestPending = await getRepository(RequestRoles)
        .findOne({
            userId,
            status: UserRoleStatus.PENDING,
        });
    }
    
    ```