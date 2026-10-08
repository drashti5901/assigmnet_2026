const storage = new Map();

const asyncStorageMock = {
  getItem: jest.fn(async key => storage.get(key) ?? null),
  setItem: jest.fn(async (key, value) => {
    storage.set(key, value);
  }),
  removeItem: jest.fn(async key => {
    storage.delete(key);
  }),
  clear: jest.fn(async () => {
    storage.clear();
  }),
};

export default asyncStorageMock;
