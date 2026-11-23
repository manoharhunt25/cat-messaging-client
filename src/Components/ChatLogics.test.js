import {
  addMessage,
  getSender,
  getSenderFull,
  isLastMessage,
  isSameSender,
  isSameUser,
} from "./ChatLogics";

const me = { _id: "me", name: "Me" };
const alice = { _id: "alice", name: "Alice" };

const msg = (id, sender) => ({ _id: id, sender, content: id });

describe("getSender / getSenderFull", () => {
  test("returns the other user in a one-to-one chat", () => {
    expect(getSender(me, [me, alice])).toBe("Alice");
    expect(getSender(me, [alice, me])).toBe("Alice");
    expect(getSenderFull(me, [me, alice])).toBe(alice);
  });
});

describe("message grouping helpers", () => {
  const messages = [
    msg("1", alice),
    msg("2", alice),
    msg("3", me),
    msg("4", alice),
  ];

  test("isSameSender is true on the last of a run from another user", () => {
    expect(isSameSender(messages, messages[0], 0, me._id)).toBe(false);
    expect(isSameSender(messages, messages[1], 1, me._id)).toBe(true);
    expect(isSameSender(messages, messages[2], 2, me._id)).toBe(false);
  });

  test("isLastMessage is truthy only for the final message from someone else", () => {
    expect(isLastMessage(messages, 3, me._id)).toBeTruthy();
    expect(isLastMessage(messages, 2, me._id)).toBeFalsy();
  });

  test("isSameUser compares with the previous message", () => {
    expect(isSameUser(messages, messages[0], 0)).toBe(false);
    expect(isSameUser(messages, messages[1], 1)).toBe(true);
    expect(isSameUser(messages, messages[2], 2)).toBe(false);
  });
});

describe("addMessage", () => {
  const at = (id, iso) => ({ _id: id, createdAt: iso, sender: me });

  test("appends a newer message at the end", () => {
    const list = [at("1", "2026-01-01T10:00:00Z")];
    expect(addMessage(list, at("2", "2026-01-01T10:00:05Z")).map((m) => m._id))
      .toEqual(["1", "2"]);
  });

  test("puts a message whose reply arrived late in time order", () => {
    const list = [at("1", "2026-01-01T10:00:00Z"), at("3", "2026-01-01T10:00:10Z")];
    expect(addMessage(list, at("2", "2026-01-01T10:00:05Z")).map((m) => m._id))
      .toEqual(["1", "2", "3"]);
  });

  test("ignores a message that is already in the list", () => {
    const list = [at("1", "2026-01-01T10:00:00Z")];
    expect(addMessage(list, at("1", "2026-01-01T10:00:00Z"))).toBe(list);
  });
});
