import Point from "../Point";

describe(
    "Point Tests",
    () => {
        it(
            "The x and y coordinates used in construction are accessible from the x, y properties respectively",
            () => {
                const [x, y] = [2, -3];
                const subject = new Point(x, y);
                expect(subject.x).toBe(x);
                expect(subject.y).toBe(y);
            }
        );

        it(
            "The x and y coordinates used with the static 'at' constructor are accessible from the x, y properties respectively",
            () => {
                const [x, y] = [-2, 3];
                const subject = Point.at(x, y);
                expect(subject.x).toBe(x);
                expect(subject.y).toBe(y);
            }
        );

        it(
            "That Point.ORIGIN has x and y components of 0, 0 respectively",
            () => {
                expect(Point.ORIGIN.x).toBe(0);
                expect(Point.ORIGIN.y).toBe(0);
            }
        );
    }
);
