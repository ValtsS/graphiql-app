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
    expect(funcs.length).toBe(18);
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
  ])('check query function %s', (expected: string) => {
    renderPage('/query');
    const funcs = screen.getAllByTestId('doc_function');
    expect(funcs.length).toBe(18);
    expect(funcs.some((val) => val.textContent == expected)).toBe(true);
  });

  function renderPage(uuid: string) {
    const c = new DocumentContent(uuid);
    c.parts = book[uuid].parts;
    render(<SDLDocument content={c} onClick={jest.fn()} />);
  }
});
