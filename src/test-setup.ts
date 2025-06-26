import "@testing-library/jest-dom";
import { configure } from "@testing-library/dom";

// Configure testing library
configure({
  testIdAttribute: "data-testid",
});
