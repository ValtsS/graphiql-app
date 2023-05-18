import { v4 as uuidv4 } from 'uuid';
import { FirebaseApp, initializeApp } from '@firebase/app';
import { FirebaseAuthReal } from './firebase';
import {
  User,
  UserCredential,
} from '@firebase/auth';
import { waitRender } from '@/../__mocks__/test-utils';
import { waitFor } from '@testing-library/react';

const mockAuth = jest.fn();
const mockSignin = jest.fn();
const mockSignout = jest.fn();
const mocktriggerChange = jest.fn();
const mockCreateUser = jest.fn();
const mocktriggerUploadOnNext = jest.fn();
const mocktriggerUploadOnComplete = jest.fn();
const mocktriggerUploadOnError = jest.fn();

jest.mock('@firebase/auth', () => ({
  ...jest.requireActual('@firebase/auth'),
  getAuth: jest.fn().mockImplementation((...args) => {
    return mockAuth(...args);
  }),
  signInWithEmailAndPassword: jest.fn().mockImplementation((...args) => {
    return mockSignin(...args);
  }),
  createUserWithEmailAndPassword: jest.fn().mockImplementation((...args) => {
    return mockCreateUser(...args);
  }),
  signOut: jest.fn().mockImplementation((...args) => {
    mockSignout(args);
  }),
  onAuthStateChanged: jest
    .fn()
    .mockImplementation((auth: unknown, nextOrObserver: (user: unknown) => void) => {
      mocktriggerChange.mockImplementation((value: unknown) => {
        nextOrObserver(value);
      });
    }),
  updateProfile: jest.fn(),
}));

jest.mock('@firebase/firestore', () => ({
  ...jest.requireActual('@firebase/firestore'),
  getFirestore: jest.fn().mockImplementation((...args) => {
    return { type: 'firestore' };
  }),
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock('@firebase/storage', () => ({
  ...jest.requireActual('@firebase/storage'),
  getStorage: jest.fn().mockImplementation((...args) => {
    return { type: 'storage' };
  }),
  ref: jest.fn(),
  getDownloadURL: jest.fn().mockResolvedValue('https://localhost/'),
  uploadBytesResumable: jest.fn().mockReturnValue({
    on: jest
      .fn()
      .mockImplementation(
        (
          event: unknown,
          next: (value: unknown) => void,
          err: (value: unknown) => void,
          complete: (value: unknown) => void
        ) => {
          mocktriggerUploadOnNext.mockImplementation((value: unknown) => {
            next(value);
          });
          mocktriggerUploadOnComplete.mockImplementation((value: unknown) => {
            complete(value);
          });

          mocktriggerUploadOnError.mockImplementation((value: unknown) => {
            err(value);
          });
        }
      ),
    snapshot: {
      ref: '',
    },
  }),
  doc: jest.fn(),
}));

describe('Firebase Auth Real', () => {
  const app: FirebaseApp = initializeApp({});
  const target = new FirebaseAuthReal(app);

  beforeAll(() => {
    mockAuth.mockReturnValue({ type: 'getAuth object' });
    mockSignin.mockImplementation((auth: unknown, user: string, password: string) => {
      if (user === 'good') return { type: 'user credentials' };
      throw new Error('Invalid user');
    });
    const creds: UserCredential = {
      providerId: 'JestMock',
      user: {
        displayName: 'JohnDoe',
        uid: 'superUId',
        photoURL: 'https://localhost/',
      } as User,
      operationType: 'signIn',
    };
    mockCreateUser.mockReturnValue(creds);
  });

  afterAll(() => jest.resetAllMocks());

  it.each([
    ['good', null],
    ['Bad', 'Invalid user'],
  ])('Should handle login as %s to be %s', async (user: string, expected: string | null) => {
    const result = await target.signInWithEmailAndPassword(user, '');
    expect(result).toBe(expected);
    expect(mockAuth).toBeCalled();
    expect(mockSignin).toBeCalled();
  });

  it('Should handle login with an non specific error', async () => {
    mockSignin.mockImplementationOnce(() => {
      throw new Error();
    });
    const result = await target.signInWithEmailAndPassword('good', '');
    expect(result).toBe('Unknown error during sign-in');
    expect(mockAuth).toBeCalled();
    expect(mockSignin).toBeCalled();
  });

  it('Should handle signout', async () => {
    const result = await target.logout();
    expect(result).toBeNull();
    expect(mockAuth).toBeCalled();
    expect(mockSignout).toBeCalled();
  });

  it.each([
    [undefined, 'Unknown error during logout'],
    ['Bad stuff', 'Bad stuff'],
  ])(
    'Expect error message during signout %s to be %s',
    async (message: string | undefined, expected: string | null) => {
      mockSignout.mockImplementationOnce(() => {
        throw new Error(message);
      });
      const result = await target.logout();
      expect(result).toBe(expected);
      expect(mockAuth).toBeCalled();
      expect(mockSignout).toBeCalled();
    }
  );

  it('Should handle state changes', async () => {
    const callback = jest.fn();
    target.onAuthStateChange(callback);
    expect(mockAuth).toBeCalled();
    expect(callback).not.toBeCalled();
    const dummy = { type: uuidv4() };
    mocktriggerChange(dummy);
    expect(callback).toBeCalled();
    expect(target.lastUser).toBe(dummy);
  });

  it.each([
    [undefined, 'Unknown error during register'],
    ['Bad stuff', 'Bad stuff'],
  ])(
    'Expect error message during register %s to be %s',
    async (message: string | undefined, expected: string | null) => {
      mockCreateUser.mockImplementationOnce(async () => {
        throw new Error(message);
      });
      const uploadResult = jest.fn();
      const result = await target.registerWithEmailAndPassword(
        'name',
        'v@v',
        'pass',
        null,
        uploadResult
      );
      expect(result).toBe(expected);
      expect(mockAuth).toBeCalled();
      await waitRender();
      expect(uploadResult).not.toBeCalled();
    }
  );

  it('Should handle normal registration', async () => {
    const uploadResult = jest.fn();
    const file = new File(['test.png'], 'test.png', { type: 'image/png' });
    const result = await target.registerWithEmailAndPassword(
      'name',
      'v@v',
      'pass',
      file,
      uploadResult
    );
    mocktriggerUploadOnNext();
    mocktriggerUploadOnComplete();
    expect(result).toBeNull();
    expect(mockAuth).toBeCalled();
    await waitFor(() => {
      expect(uploadResult).toHaveBeenLastCalledWith(null);
    });
  });

  it('Should handle image upload failure during normal registration', async () => {
    const uploadResult = jest.fn();
    const file = new File(['test.png'], 'test.png', { type: 'image/png' });
    const result = await target.registerWithEmailAndPassword(
      'name',
      'v@v',
      'pass',
      file,
      uploadResult
    );
    const brokenText = 'broken';
    mocktriggerUploadOnError(new Error(brokenText));
    expect(result).toBeNull();
    expect(mockAuth).toBeCalled();
    await waitFor(() => {
      expect(uploadResult).toHaveBeenLastCalledWith(brokenText);
    });
  });
});
