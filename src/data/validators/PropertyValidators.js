import Validator from "./Validator";
import StringPredicates from "../../helpers/StringPredicates";
import TextTemplate from "./TextTemplate";

const NOT_BLANK = "notBlank";
const IS_NUMBER = "isNumber";
const IS_POSITIVE_INTEGER = "isPositiveInteger";
const IS_POSITIVE_NUMBER = "isPositiveNumber";
const IS_STRICTLY_LESS = "isStrictlyLess;"

const VALIDATORS = {
    [NOT_BLANK]:
        new Validator(
            StringPredicates.isTrimmedNotEmpty,
            new TextTemplate("A value is needed here.")
        ),
    [IS_NUMBER]:
        new Validator(
            StringPredicates.isNumber,
            new TextTemplate("This must be a number.")
        ),
    [IS_POSITIVE_INTEGER]:
        new Validator(
            StringPredicates.isPositiveInteger,
            new TextTemplate("This must be a whole number greater than zero.")
        ),
    [IS_POSITIVE_NUMBER]:
        new Validator(
            StringPredicates.isPositiveNumberValue,
            new TextTemplate("This must be a number greater than zero.")
        ),
    [IS_STRICTLY_LESS]:
        new Validator(
            StringPredicates.isStrictlyLessIfNumbers,
            new TextTemplate("The {{0}} must be less than {{1}}.")
        ),
};

export {NOT_BLANK, IS_NUMBER, IS_POSITIVE_INTEGER, IS_POSITIVE_NUMBER, IS_STRICTLY_LESS, VALIDATORS};
