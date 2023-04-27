import { ConstValueNode, Kind, TypeNode } from 'graphql';

export function getTypeName(type: TypeNode): [string, string?] {
  switch (type.kind) {
    case Kind.NAMED_TYPE:
      const v = type.name.value;
      return [v, v];
    case Kind.LIST_TYPE:
      const [listType, listTypeName] = getTypeName(type.type);
      return [`[${listType}]`, listTypeName];
    case Kind.NON_NULL_TYPE:
      const [nonNullType, nonNullTypeName] = getTypeName(type.type);
      return [nonNullType, nonNullTypeName];
    default:
      throw new Error(`Unsupported TypeNode kind: ${(type as TypeNode)?.kind}`);
  }
}

export function getConstValue(value: ConstValueNode): string {
  switch (value.kind) {
    case Kind.INT:
    case Kind.FLOAT:
    case Kind.STRING:
    case Kind.BOOLEAN:
    case Kind.ENUM:
      return value.value.toString();
    case Kind.NULL:
      return 'NULL';
    case Kind.LIST:
      return (
        '[' +
        value.values.map((v) => getConstValue(v)).reduce((prev, curr) => prev + ', ' + curr) +
        ']'
      );
    case Kind.OBJECT: {
      let objstr = '';
      value.fields.forEach((f) => {
        const fieldValue = getConstValue(f.value);
        objstr += '\n' + f.name.value + ' = ' + fieldValue;
      });

      return objstr;
    }

    default:
      throw new Error(`Unsupported ConstValueNode kind: ${(value as ConstValueNode).kind}`);
  }
}
