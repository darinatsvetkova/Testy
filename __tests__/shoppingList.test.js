const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

jest.setTimeout(10000);

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/shoppinglist_test");
});

afterAll(async () => {
  await mongoose.connection.close();
});

let testListId;
const loggedUser = "testUser";
const otherUser = "otherUser";

// ================== LIST ==================
test("LIST – success scenario", async () => {
  const response = await request(app)
    .get("/shoppingList/list")
    .query({ member: loggedUser, page: 1, pageSize: 10 });

  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body.shoppingLists)).toBe(true);
  expect(response.body.pageInfo).toBeDefined();
});

test("LIST – alternative scenario (filtering works)", async () => {
  const response = await request(app)
    .get("/shoppingList/list")
    .query({ member: loggedUser });

  expect(response.statusCode).toBe(200);
  response.body.shoppingLists.forEach(list => {
    expect(list.members.includes(loggedUser) || list.owner === loggedUser).toBe(true);
  });
});

// ================== CREATE ==================
test("CREATE – success scenario", async () => {
  const response = await request(app)
    .post("/shoppingList/create")
    .send({ name: "Test shopping list", owner: loggedUser }); // simulate loggedUser

  expect(response.statusCode).toBe(200);
  expect(response.body.shoppingList).toBeDefined();
  expect(response.body.shoppingList.name).toBe("Test shopping list");
  expect(response.body.shoppingList.owner).toBe(loggedUser);
  expect(response.body.shoppingList.members).toContain(loggedUser);

  testListId = response.body.shoppingList._id;
});

test("CREATE – alternative scenario (missing name)", async () => {
  const response = await request(app)
    .post("/shoppingList/create")
    .send({ owner: loggedUser });

  expect(response.statusCode).toBe(400);
});

// ================== GET ==================
test("GET – success scenario", async () => {
  const response = await request(app).get(`/shoppingList/get/${testListId}`);

  expect(response.statusCode).toBe(200);
  expect(response.body.shoppingList).toBeDefined();
  expect(response.body.shoppingList._id).toBe(testListId);
});

test("GET – alternative scenario (non-existent ID)", async () => {
  const response = await request(app).get("/shoppingList/get/123456789012345678901234");
  expect(response.statusCode).toBe(404);
});

// ================== UPDATE ==================
test("UPDATE – success scenario", async () => {
  const response = await request(app)
    .put("/shoppingList/update")
    .send({ id: testListId, name: "Updated name" });

  expect(response.statusCode).toBe(200);
  expect(response.body.shoppingList.name).toBe("Updated name");
});

test("UPDATE – alternative scenario (missing ID)", async () => {
  const response = await request(app)
    .put("/shoppingList/update")
    .send({ name: "No ID" });

  expect(response.statusCode).toBe(400);
});

// ================== DELETE ==================
test("DELETE – forbidden for non-owner", async () => {
  const response = await request(app)
    .delete("/shoppingList/delete")
    .send({ id: testListId, owner: otherUser });

  expect(response.statusCode).toBe(403);
  expect(response.body.error).toBe("Owner může smazat seznam pouze sám sebe");
});

test("DELETE – success scenario", async () => {
  const response = await request(app)
    .delete("/shoppingList/delete")
    .send({ id: testListId, owner: loggedUser });

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("Seznam odstraněn");
});

test("DELETE – alternative scenario (missing ID)", async () => {
  const response = await request(app)
    .delete("/shoppingList/delete")
    .send({});

  expect(response.statusCode).toBe(400);
});
