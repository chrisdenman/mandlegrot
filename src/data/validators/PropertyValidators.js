import Validator from "./Validator";
import StringPredicates from "../../misc/predicates/StringPredicates";
import TextTemplate from "./TextTemplate";

const NOT_BLANK = "notBlank";
const IS_NUMBER = "isNumber";
const IS_POSITIVE_INTEGER = "isPositiveInteger";
const IS_POSITIVE_NUMBER = "isPositiveNumber";
const IS_STRICTLY_LESS = "isStrictlyLess;"

const VALIDATORS = {
    [NOT_BLANK]:
        new Validator(
            NOT_BLANK,
            StringPredicates.isTrimmedNotEmpty,
            new TextTemplate("A value is needed here.")
        ),
    [IS_NUMBER]:
        new Validator(
            IS_NUMBER,
            StringPredicates.isNumber,
            new TextTemplate("This must be a number.")
        ),
    [IS_POSITIVE_INTEGER]:
        new Validator(
            IS_POSITIVE_INTEGER,
            StringPredicates.isPositiveInteger,
            new TextTemplate("This must be a whole number greater than zero.")
        ),
    [IS_POSITIVE_NUMBER]:
        new Validator(
            IS_POSITIVE_NUMBER,
            StringPredicates.isPositiveNumberValue,
            new TextTemplate("This must be a number greater than zero.")
        ),
    [IS_STRICTLY_LESS]:
        new Validator(
            IS_STRICTLY_LESS,
            StringPredicates.isStrictlyLessIfNumbers,
            new TextTemplate("The {{0}} must be less than {{1}}.")
        ),
};

export {NOT_BLANK, IS_NUMBER, IS_POSITIVE_INTEGER, IS_POSITIVE_NUMBER, IS_STRICTLY_LESS, VALIDATORS};


