// tslint:disable-next-line
///<reference path="../../node_modules/cypress/types/index.d.ts"/>

const mainSelector = "#app"
const DOM = {
    vinInput: `${mainSelector} input`,
    decodeButton: `${mainSelector} button`,
    errorText: `${mainSelector} .VinInput__Error`,
    carInfoPreview: `${mainSelector} .CarInfoPreview`
}

const APP_URL = "http://localhost:4000"

describe("App", () => {
    it("filters VIN, so I cannot type O, Q and I letter", () => {
        cy.visit(APP_URL)
        cy.wait(2000)
        const input = cy.get(DOM.vinInput)
        input.type("FOQIF")
        input.should("have.value", "FF")
        cy.screenshot("010-with-value-typed")
    })
    it("uppercase letters, so I cannot type small letters", () => {
        cy.visit(APP_URL)
        const input = cy.get(DOM.vinInput)
        input.type("ff")
        input.should("have.value", "FF")
    })

    it("shows validation error when vin length is less then 17 characters", () => {
        cy.visit(APP_URL)
        cy.get(DOM.errorText).should("be.empty")
        cy.get(DOM.vinInput).type("abc")
        cy.get(DOM.decodeButton).click()
        cy.get(DOM.errorText).contains("17 chars expected")
        cy.screenshot("030-with-validation-error")
    })

    it("hides validation error when I start typing again", () => {
        cy.visit(APP_URL)
        cy.get(DOM.decodeButton).click()
        cy.get(DOM.errorText).contains("17 chars expected")
        cy.get(DOM.vinInput).type("f")
        cy.get(DOM.errorText).should("be.empty")
    })

    it("Gets make year and model for typed BMW VIN", () => {
        cy.visit(APP_URL)
        cy.get(DOM.vinInput).type("WBAFR1C52BC745487")
        cy.get(DOM.errorText).should("be.empty")
        cy
            .get(DOM.decodeButton)
            .click()
            .should("be.disabled")
        cy.screenshot("040-with-spinner-while-decoding")
        cy.get(DOM.carInfoPreview).contains("Make BMW")
        cy.get(DOM.carInfoPreview).contains("Year 2011")
        cy.get(DOM.carInfoPreview).contains("Model 528i")
        cy.screenshot("041-with-results-after-decoding")
    })
})
