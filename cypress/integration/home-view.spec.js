// cy.fixture("songs.json").as("songData");

describe("The Home Page", () => {
  it("successfully loads", () => {
    cy.visit("/");
    cy.contains("h1", "Listen to Great Music!");
  });
});
