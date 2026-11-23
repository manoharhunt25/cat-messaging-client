const ORIGINAL = process.env.REACT_APP_API_URL;

afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.REACT_APP_API_URL;
  else process.env.REACT_APP_API_URL = ORIGINAL;
  jest.resetModules();
});

test("defaults to the local backend", () => {
  delete process.env.REACT_APP_API_URL;
  expect(require("./config").API_URL).toBe("http://localhost:4000");
});

test("uses REACT_APP_API_URL and drops a trailing slash", () => {
  process.env.REACT_APP_API_URL = "https://chat.example.com/";
  expect(require("./config").API_URL).toBe("https://chat.example.com");
});
