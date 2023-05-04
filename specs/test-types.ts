export const typeTestCases = [
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
        roll(numRolls: Int!): [Int]
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
    `//$$11TESTCOMMENT##
        Type
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
    `////$$ABC##
        UserRole enum
        ////$$FGH##
        ADMIN
        ////$$IJK##
        | USER | GUEST
      `,
  ],
  [
    'DateTime',
    `//The \`DateTime\` scalar represents an ISO-8601 compliant date time type.
        DateTime DateTime
      `,
  ],
];
