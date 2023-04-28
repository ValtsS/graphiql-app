import * as fs from 'fs';
import * as path from 'path';
import { generateBook } from './sdl-docs-generator';
import { DocumentBook } from './sdl-docs';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DocumentContent, SDLDocument } from '@/components/sdl-document/sdl-document';
import fuzzball from 'fuzzball';

describe('Book generator test', () => {
  let book: DocumentBook;

  beforeAll(() => {
    const currentPath = path.resolve(__dirname);
    const testSchema = fs.readFileSync(path.join(currentPath, 'test.sdl'));
    book = generateBook(testSchema.toString());
  });

  it.each(['/', '/404', '/query', '/mutate', '/subscribe'])(
    'Expect to contain page %s',
    (page: string) => {
      expect(book[page]).toBeTruthy();
    }
  );

  it('should render correct root', () => {
    renderPage('/');
    expect(screen.getByText('Queries')).toHaveAttribute('href');
    expect(screen.getByText('Mutations')).toHaveAttribute('href');
    expect(screen.getByText('Subscriptions')).toHaveAttribute('href');
  });

  it('should render query page', () => {
    renderPage('/query');
    const funcs = screen.getAllByTestId('doc_function');
    expect(funcs.length).toBe(20);
  });

  it.each([
    'getLanguageSpecification():LanguageSpecification',
    'getString():String',
    'getInt():Int',
    'getFloat():Float',
    'getBoolean():Boolean',
    'getID():ID',
    'getObjectType():ObjectType',
    'getFields():[Field]',
    'getInputType():InputType',
    'getInputFields():[InputField]',
    'getEnumType():EnumType',
    'getEnumValues():[EnumValue]',
    'getInterfaceType():InterfaceType',
    'getInterfaceFields():[Field]',
    'getUnionType():UnionType',
    'getUnionTypes():[ObjectType]',
    'getDirectives():[Directive]',
    'getRoles():UserRole',
    'getDefaults(a:Int=4b:Float=3.3c:String="TestValue"d:Boolean=falsee:Boolean=truef:Int=NULLg:UserRole=ADMIN):Int',
  ])('check query function %s', (expected: string) => {
    renderPage('/query');
    const funcs = screen.getAllByTestId('doc_function');
    expect(funcs.some((val) => val.textContent == expected)).toBe(true);
  });

  it.each([
    [
      'LanguageSpecification',
      `LanguageSpecification
        schemaDefinition: String!
        scalarTypes: [ScalarType!]!
        objectTypes: [ObjectType!]
        inputTypes: [InputType!]
        enumTypes: [EnumType!]
        interfaceTypes: [InterfaceType!]
        unionTypes: [UnionType!]
        directives: [Directive!]
      `,
    ],
    [
      'ScalarType',
      `ScalarType
      name: String
      description: String`,
    ],
    [
      'ObjectType',
      `ObjectType
      name: String
      description: String
      fields: [Field]
      interfaces: [InterfaceType]
      `,
    ],
    [
      'Field',
      `Field
      name: String
      description: String
      args: [InputField]
      type: Type
      isDeprecated: Boolean
      deprecationReason: String
    `,
    ],
    [
      'InputType',
      `InputType
      name: String
      description: String
      inputFields: [InputField]
    `,
    ],
    [
      'InputField',
      `InputField
      name: String
      description: String
      type: Type
      defaultValue: String
    `,
    ],
    [
      'EnumType',
      `EnumType
      name: String
      description: String
      enumValues: [EnumValue]
      `,
    ],
    [
      'EnumValue',
      `EnumValue
      name: String
      description: String
      isDeprecated: Boolean
      deprecationReason: String
    `,
    ],
    [
      'InterfaceType',
      `InterfaceType
      name: String
      description: String
      fields: [Field]
    `,
    ],
    [
      'UnionType',
      `UnionType
      name: String
      description: String
      possibleTypes: [ObjectType]
    `,
    ],
    [
      'Directive',
      `Directive
      name: String
      description: String
      locations: [String]
      args: [InputField]
    `,
    ],
    [
      'Type',
      `Type
      ScalarType | ObjectType | InputType | EnumType | InterfaceType | UnionType | ListType`,
    ],
    [
      'ListType',
      `ListType
      ofType: Type`,
    ],
    [
      'GraphQLSchema',
      `GraphQLSchema
      queryType: ObjectType
      mutationType: ObjectType
      subscriptionType: ObjectType
      types: [Type]
      directives: [Directive]
    `,
    ],
    [
      'UserRole',
      `UserRole enum
      ADMIN |USER | GUEST
    `,
    ],
  ])('check type presence %s', (typeName: string, expected: string) => {
    renderPage(typeName);
    expect(
      fuzzball.ratio(screen.getByTestId('doc_type').textContent ?? '', expected, {
        collapseWhitespace: true,
      })
    ).toBeGreaterThan(96);
  });

  function renderPage(uuid: string) {
    const c = new DocumentContent(uuid);
    c.parts = book[uuid].parts;
    render(<SDLDocument content={c} onClick={jest.fn()} />);
  }
});
