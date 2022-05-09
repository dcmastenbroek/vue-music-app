describe("Audio Player", { defaultCommandTimeout: 5000 }, () => {
  it("plays audio", () => {
    cy.visit("/");
    cy.get("a.composition-name:first").click();

    cy.get("#play-button").click();
    cy.contains("Music");

    cy.get("#player-play-button").click();
  });
});
