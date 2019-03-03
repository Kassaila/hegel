const HegelError = require("../build/utils/errors").default;
const prepareAST = require("./preparation");
const createTypeGraph = require("../build/type-graph/type-graph").default;
const { Type } = require("../build/type-graph/types/type");
const { UnionType } = require("../build/type-graph/types/union-type");
const { ObjectType } = require("../build/type-graph/types/object-type");
const { FunctionType } = require("../build/type-graph/types/function-type");
const { VariableInfo } = require("../build/type-graph/variable-info");
const { UNDEFINED_TYPE, TYPE_SCOPE } = require("../build/type-graph/constants");

describe("Variable declrataion and assignment", () => {
  test("Simple typed const declaration with number literal type", async () => {
    const sourceAST = prepareAST(`
      const a: 2 = 2; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(0);
  });
  test("Simple typed const declaration with number literal type should throw error", async () => {
    const sourceAST = prepareAST(`
      const a: 2 = 4; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual('Type "4" is incompatible with type "2"');
    expect(errors[0].loc).toEqual({
      end: { column: 20, line: 2 },
      start: { column: 12, line: 2 }
    });
  });
  test("Simple typed const declaration with string literal type", async () => {
    const sourceAST = prepareAST(`
      const a: "" = ""; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(0);
  });
  test("Simple typed const declaration with string literal type should throw error", async () => {
    const sourceAST = prepareAST(`
      const a: "" = "test"; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      "Type \"'test'\" is incompatible with type \"''\""
    );
    expect(errors[0].loc).toEqual({
      start: { line: 2, column: 12 },
      end: { line: 2, column: 26 }
    });
  });
  test("Simple typed const declaration with boolean literal type", async () => {
    const sourceAST = prepareAST(`
      const a: true = true; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(0);
  });
  test("Simple typed const declaration with true literal type should throw error", async () => {
    const sourceAST = prepareAST(`
      const a: true = false; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "false" is incompatible with type "true"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 27, line: 2 },
      start: { column: 12, line: 2 }
    });
  });
  test("Simple typed const declaration with number type", async () => {
    const sourceAST = prepareAST(`
      const a: number = ""; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "\'\'" is incompatible with type "number"'
    );
    expect(errors[0].loc).toEqual({
      start: { line: 2, column: 12 },
      end: { line: 2, column: 26 }
    });
  });
  test("Simple typed const declaration with string type", async () => {
    const sourceAST = prepareAST(`
      const a: string = 2; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "2" is incompatible with type "string"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 25, line: 2 },
      start: { column: 12, line: 2 }
    });
  });
  test("Simple typed const declaration with boolean type", async () => {
    const sourceAST = prepareAST(`
      const a: boolean = 2; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "2" is incompatible with type "boolean"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 26, line: 2 },
      start: { column: 12, line: 2 }
    });
  });
  test("Simple typed const declaration with null type", async () => {
    const sourceAST = prepareAST(`
      const a: null = 2; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "2" is incompatible with type "null"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 23, line: 2 },
      start: { column: 12, line: 2 }
    });
  });
  test("Simple typed const declaration with undefined type", async () => {
    const sourceAST = prepareAST(`
      const a: undefined = 2; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "2" is incompatible with type "undefined"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 28, line: 2 },
      start: { column: 12, line: 2 }
    });
  });
  test("Simple typed const declaration with union type", async () => {
    const sourceAST = prepareAST(`
      const a: number | string = true; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "true" is incompatible with type "number | string"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 37, line: 2 },
      start: { column: 12, line: 2 }
    });
  });
  test("Simple typed const declaration with tuple type", async () => {
    const sourceAST = prepareAST(`
      const a: [number, string] = [2, 2]; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "[number, number]" is incompatible with type "[number, string]"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 40, line: 2 },
      start: { column: 12, line: 2 }
    });
  });
  test("Simple typed const declaration with tuple type without error", async () => {
    const sourceAST = prepareAST(`
      const a: [number, string] = [2, '2']; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(0);
  });
  test("Simple typed const declaration with type alias", async () => {
    const sourceAST = prepareAST(`
      type A = number;
      const a: A = "2"; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "\'2\'" is incompatible with type "number"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 22, line: 3 },
      start: { column: 12, line: 3 }
    });
  });
  test("Simple typed const declaration with generic type alias", async () => {
    const sourceAST = prepareAST(`
      type A<T> = T;
      const a: A<number> = "2"; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "\'2\'" is incompatible with type "number"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 30, line: 3 },
      start: { column: 12, line: 3 }
    });
  });
  test("Simple typed const declaration with array type", async () => {
    const sourceAST = prepareAST(`
      const a: Array<number> = [2, "2"]; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "[number, string]" is incompatible with type "{ [key: number]: number }"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 39, line: 2 },
      start: { column: 12, line: 2 }
    });
  });
  test("Simple typed const declaration with array type without error", async () => {
    const sourceAST = prepareAST(`
      const a: Array<number> = [2]; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(0);
  });
  test("Simple typed const declaration with object type without required property", async () => {
    const sourceAST = prepareAST(`
      const a: { a: number } = {}; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "{  }" is incompatible with type "{ a: number }"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 33, line: 2 },
      start: { column: 12, line: 2 }
    });
  });
  test("Simple typed const declaration with object type without optional property", async () => {
    const sourceAST = prepareAST(`
      const a: { a: ?number } = {}; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(0);
  });
  test("Simple typed const declaration with object type with additional property", async () => {
    const sourceAST = prepareAST(`
      const a: { a: ?number } = { a: 2 }; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(0);
  });
  test("Simple typed const declaration with object type without property", async () => {
    const sourceAST = prepareAST(`
      const a: { a: ?number } = { b: 3 }; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(0);
  });
  test("Simple typed const declaration with function type without argument", async () => {
    const sourceAST = prepareAST(`
      const a: number => void = () => {}; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "() => void" is incompatible with type "(number) => void"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 40, line: 2 },
      start: { column: 12, line: 2 }
    });
  });
  test("Simple typed const declaration with function type with wrong argument", async () => {
    const sourceAST = prepareAST(`
      const a: number => void = (a: ?number) => 2; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "(number | void) => number" is incompatible with type "(number) => void"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 49, line: 2 },
      start: { column: 12, line: 2 }
    });
  });
  test("Simple typed const declaration with function type with wrong return", async () => {
    const sourceAST = prepareAST(`
      const a: number => void = (a: number) => a; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "(number) => number" is incompatible with type "(number) => void"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 48, line: 2 },
      start: { column: 12, line: 2 }
    });
  });
  test("Simple typed const declaration with function type with non-princiapl return by right", async () => {
    const sourceAST = prepareAST(`
      const a: number => ?number = (a: number) => a; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(0);
  });
  test("Simple typed const declaration with function type with non-princiapl return by left", async () => {
    const sourceAST = prepareAST(`
      const a: number => number = (a: number) => a == 2 ? a : undefined; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "(number) => number | undefined" is incompatible with type "(number) => number"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 71, line: 2 },
      start: { column: 12, line: 2 }
    });
  });
  test("Simple typed const declaration with function type with non-princiapl return", async () => {
    const sourceAST = prepareAST(`
      const a: number => number = (a: number) => a; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(0);
  });
  test("Simple typed const declaration with function type with wrong argument", async () => {
    const sourceAST = prepareAST(`
      const a: ?number => void = (a: number) => 2; 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "(number) => number" is incompatible with type "(number | void) => void"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 49, line: 2 },
      start: { column: 12, line: 2 }
    });
  });
});

describe("Test calls meta for operatos and functions in globals scope", () => {
  test("Unary operator call with literal", async () => {
    const sourceAST = prepareAST(`
      !2;
    `);
    const [[actual], , globals] = await createTypeGraph([sourceAST]);
    const actualCall = actual.calls[0];
    const expectedCall = expect.objectContaining({
      target: globals.body.get("!"),
      arguments: [new Type(2, { isLiteralOf: new Type("number") })]
    });
    expect(actualCall).toEqual(expectedCall);
  });
  test("Unary operator call with variable", async () => {
    const sourceAST = prepareAST(`
      const a:number = 2;
      !a;
    `);
    const [[actual], , globals] = await createTypeGraph([sourceAST]);
    const actualCall = actual.calls[1];
    const expectedCall = expect.objectContaining({
      target: globals.body.get("!"),
      arguments: [actual.body.get("a")]
    });
    expect(actualCall).toEqual(expectedCall);
  });
  test("Double unary operator call", async () => {
    const sourceAST = prepareAST(`
      !!2;
    `);
    const [[actual], , globals] = await createTypeGraph([sourceAST]);
    const firstActualCall = actual.calls[0];
    const secondActualCall = actual.calls[1];
    const firstExpectedCall = expect.objectContaining({
      target: globals.body.get("!"),
      arguments: [new Type(2, { isLiteralOf: new Type("number") })]
    });
    const secondExpectedCall = expect.objectContaining({
      target: globals.body.get("!"),
      arguments: [new Type("boolean")]
    });
    expect(firstActualCall).toEqual(firstExpectedCall);
    expect(secondActualCall).toEqual(secondExpectedCall);
  });
  test("Binary operator call with literal", async () => {
    const sourceAST = prepareAST(`
      2 - 2;
    `);
    const [[actual], , globals] = await createTypeGraph([sourceAST]);
    const actualCall = actual.calls[0];
    const expectedCall = expect.objectContaining({
      target: globals.body.get("-"),
      arguments: [
        new Type(2, { isLiteralOf: new Type("number") }),
        new Type(2, { isLiteralOf: new Type("number") })
      ]
    });
    expect(actualCall).toEqual(expectedCall);
  });
  test("Binary operator call with variable", async () => {
    const sourceAST = prepareAST(`
      const a:number = 2;
      a - 2;
    `);
    const [[actual], , globals] = await createTypeGraph([sourceAST]);
    const actualCall = actual.calls[1];
    const expectedCall = expect.objectContaining({
      target: globals.body.get("-"),
      arguments: [
        actual.body.get("a"),
        new Type(2, { isLiteralOf: new Type("number") })
      ]
    });
    expect(actualCall).toEqual(expectedCall);
  });
  test("Double binary operator call", async () => {
    const sourceAST = prepareAST(`
      2 - 2 - 2;
    `);
    const [[actual], , globals] = await createTypeGraph([sourceAST]);
    const firstActualCall = actual.calls[0];
    const secondActualCall = actual.calls[1];
    const firstExpectedCall = expect.objectContaining({
      target: globals.body.get("-"),
      arguments: [
        new Type(2, { isLiteralOf: new Type("number") }),
        new Type(2, { isLiteralOf: new Type("number") })
      ]
    });
    const secondExpectedCall = expect.objectContaining({
      target: globals.body.get("-"),
      arguments: [
        new Type("number"),
        new Type(2, { isLiteralOf: new Type("number") })
      ]
    });
    expect(firstActualCall).toEqual(firstExpectedCall);
    expect(secondActualCall).toEqual(secondExpectedCall);
  });
  test("Call function with wrong count of arguments", async () => {
    const sourceAST = prepareAST(`
       function fn(a: number) {}
       fn();
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual("1 arguments are required. Given 0.");
    expect(errors[0].loc).toEqual({
      end: { column: 11, line: 3 },
      start: { column: 7, line: 3 }
    });
  });
  test("Call function with right count of arguments", async () => {
    const sourceAST = prepareAST(`
       function fn(a: ?number) {}
       fn();
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(0);
  });
  test("Function declaration with signed argument will throw error", async () => {
    const sourceAST = prepareAST(`
       function fn(a?: number) {}
       fn();
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      "The optional argument syntax is not allowed. Please use maybe type syntax."
    );
    expect(errors[0].loc).toEqual({
      end: { column: 29, line: 2 },
      identifierName: "a",
      start: { column: 19, line: 2 }
    });
  });
  test("Call function with different type", async () => {
    const sourceAST = prepareAST(`
       function fn(a: number) {}
       fn("string");
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "string" is incompatible with type "number"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 19, line: 3 },
      start: { column: 7, line: 3 }
    });
  });
  test("Call if statement with non-boolean type", async () => {
    const sourceAST = prepareAST(`
       if(2) {

       } 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "2" is incompatible with type "boolean"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 8, line: 4 },
      start: { column: 7, line: 2 }
    });
  });
  test("Call while statement with non-boolean type", async () => {
    const sourceAST = prepareAST(`
       while(2) {

       } 
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "2" is incompatible with type "boolean"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 8, line: 4 },
      start: { column: 7, line: 2 }
    });
  });
  test("Call do-while statement with non-boolean type", async () => {
    const sourceAST = prepareAST(`
       do {
       } while(2);
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "2" is incompatible with type "boolean"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 18, line: 3 },
      start: { column: 7, line: 2 }
    });
  });
  test("Call for statement with non-boolean type", async () => {
    const sourceAST = prepareAST(`
       for(let i = 5; i--;);
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "number" is incompatible with type "boolean"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 28, line: 2 },
      start: { column: 7, line: 2 }
    });
  });
  test("Call ternary expression with non-boolean type", async () => {
    const sourceAST = prepareAST(`
       2 ? true : false;
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Type "2" is incompatible with type "boolean"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 23, line: 2 },
      start: { column: 7, line: 2 }
    });
  });
});

describe("Object and collection properties", () => {
  test("Get undefined property in object", async () => {
    const sourceAST = prepareAST(`
       const a = { a: 1 };
       a.b;
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(1);
    expect(errors[0].constructor).toEqual(HegelError);
    expect(errors[0].message).toEqual(
      'Property "b" are not exists in "{ a: number }"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 10, line: 3 },
      start: { column: 7, line: 3 }
    });
  });
  test("Get existed property in object", async () => {
    const sourceAST = prepareAST(`
       const a = { a: 1 };
       a.a;
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toEqual(0);
  });
  test("Get undefined property in nested object", async () => {
    const sourceAST = prepareAST(`
       const a = { a: { b: 2 } };
       a.a.c;
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors[0].message).toEqual(
      'Property "c" are not exists in "{ b: number }"'
    );
    expect(errors[0].loc).toEqual({
      end: { column: 12, line: 3 },
      start: { column: 7, line: 3 }
    });
  });
  test("Object with literal type should finish without error", async () => {
    const sourceAST = prepareAST(`
      const a: { a: true } = { a: true };
    `);
    const [, errors] = await createTypeGraph([sourceAST]);
    expect(errors.length).toBe(0);
  });
});