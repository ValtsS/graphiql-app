import * as fs from 'fs';
import * as path from 'path';
import { generateBook } from './sdl-docs-generator';
import { DocumentBook } from './sdl-docs';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DocumentContent, SDLDocument } from '@/components/sdl-document/sdl-document';
import fuzzball from 'fuzzball';
import { typeTestCases } from '@/../specs/test-types';

describe('Book generator test', () => {
  let book: DocumentBook;

  beforeAll(() => {
    const currentPath = path.resolve(__dirname);
    const testSchema = fs.readFileSync(path.join(currentPath, '../../../specs', 'test.sdl'));
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
  describe('API documentation pages', () => {
    it.each([
      ['/query', 23],
      ['/mutate', 1],
      ['/subscribe', 1],
    ])('should render %s page with correct functions', (path, expectedFuncCount) => {
      renderPage(path);
      const funcs = screen.queryAllByTestId('doc_function');
      expect(funcs.length).toBe(expectedFuncCount);
    });
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
    'getDefaults(//$$2##a:Int=4//$$3##b:Float=3.3//$$4##c:String="TestValue"//$$5##d:Boolean=false//$$6##e:Boolean=true//$$7##f:Int=NULL//$$8##g:UserRole=ADMIN):Int',
    'getDefaultsList(g:[UserRole]=[USER, GUEST]):Int',
    'getDefaultsObject(h:InputObject={name: "12345" , description: "5678"}):Int',
    'getCurrentTime():DateTime',
  ])('check query function %s', (expected: string) => {
    renderPage('/query');
    const funcs = screen.getAllByTestId('doc_function');
    expect(funcs.some((val) => val.textContent == expected)).toBe(true);
  });

  it('should render comments in query', () => {
    renderPage('/query');
    const funcs = screen.getAllByTestId('doc_comment');
    expect(funcs.length).toBe(8);
  });

  it.each(typeTestCases)('check type presence %s', (typeName: string, expected: string) => {
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
