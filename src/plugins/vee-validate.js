import { defineRule, configure } from "vee-validate";
import {
  required,
  email,
  min,
  max,
  alpha_spaces as alphaSpaces,
  min_value as minValue,
  max_value as maxValue,
  confirmed,
  not_one_of as excluded,
} from "@vee-validate/rules";
import { localize } from "@vee-validate/i18n";

import en from "@vee-validate/i18n/dist/locale/en.json";
import nl from "@vee-validate/i18n/dist/locale/nl.json";

// Rules
defineRule("required", required);
defineRule("tos", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);
defineRule("alpha_spaces", alphaSpaces);
defineRule("min_value", minValue);
defineRule("max_value", maxValue);
defineRule("confirmed", confirmed);
defineRule("excluded", excluded);

// Translations
configure({
  generateMessage: localize({
    en: {
      messages: {
        ...en.messages,
        tos: "The terms of service have to be accepted.",
      },
    },
    nl: {
      messages: {
        ...nl.messages,
        tos: "De algemene voorwaarden moeten geaccepteerd worden.",
      },
    },
  }),

  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
});
