// Adapted from https://gist.github.com/gbalbuena/3ec499535d435712ce16c1eced9f5502
let mockDelay: boolean;
let mockError: Error;
let mockResponse = {
  status: () => {
    return 200;
  },
  body: "",
  text: "{}",
  ok: true,
  get: jest.fn(),
  toError: jest.fn(),
};

const Request = {
  text: JSON.stringify(mockResponse),
  body: mockResponse,

  // leave these as non-spies so we can inspect the call counts
  // and have them get cleaned up without issue
  post: function () {
    return this;
  },
  get: function () {
    return this;
  },
  send: function () {
    return this;
  },
  query: jest.fn().mockReturnThis(),
  field: jest.fn().mockReturnThis(),
  type: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  accept: jest.fn().mockReturnThis(),
  timeout: jest.fn().mockReturnThis(),
  then: jest.fn().mockImplementation((callback) => {
    return new Promise((resolve, reject) => {
      if (mockError) {
        return reject(mockError);
      }
      return resolve(callback(mockResponse));
    });
  }),

  __setMockDelay: (boolValue: boolean) => {
    mockDelay = boolValue;
  },
  __setMockResponse: (mockRes: any) => {
    mockResponse = mockRes;
  },
  __setMockError: (mockErr: Error) => {
    mockError = mockErr;
  },
  __setMockResponseBody: (body: string) => {
    mockResponse.body = body;
  },
};

export = Request;
