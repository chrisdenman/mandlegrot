# [MandleGrot 0.2.0](https://github.com/chrisdenman/mandlegrot)

A React application for calculating familiar Mandlebrot sets images.

The following images were created using the tool:

![B&W Mandlebrot Set](./public/samples/1200x1200_b&w.png)
![Red Mandlebrot Set](./public/samples/1200x1200_red.png)
![Odd Mandlebrot Set](./public/samples/1200x1200_odd.png)
![Random Mandlebrot Set](./public/samples/1200x1200_random.png)
![Sophisticated Mandlebrot Set](./public/samples/1200x1200_sophisticated.png)

## Technical Details

The images are generated in two phases:

1. Iteration data calculation - a pool of web workers (threads) is constructed. Each worker calculates the iteration
   data for a given line of the final image at a time. The workers delegate to functions written in WebAssembly script
   and write their results to shared memory.
2. Colourisation - a WebAssembly non-shared memory is constructed to back an ImageData object. The iteration data is
   copied into this memory and colourised by another WebAssembly based function. The ImageData object is rendered
   directly onto an HTML canvas.

This two phase implementation allows the re-colourisation of images without needing to regenerate them at the expense of
approximately twice the memory overhead.

## Running (development)

### `npm start`

## Running (optimised production build)

### `npm run serve`

## Testing

### `npm test`

## Links

- The [WebAssembly scripts](https://github.com/chrisdenman/mandlebrot-wot) that implement: the Mandlebrot calculations
  and, colourisation.

## Future Work

- Add some other fractals: Newton, ....
- Cursor keys for movement (ditch the inputs?).
- Implementing BigInts in WASM for 'infinite' scrolling?
- Optimised rendering using the simply connected property of the Mandlebrot set.
- More interesting colourisation methods.
- Improve the UI:
    - Maybe full screen (scrollable) image with floating controls (if we keep them at all)?
- Free hosting.
- User-friendly image saving (with details on the extents maybe).
- Publish the WebAssembly script modules as proper dependencies.
- Handle (resource construction) errors conditions properly

## Queries

- In CanvasHelper.canvasCursorLocation, why do we need to use the min and floor function?

## Version History

See [Version History](./VERSIONS.md)

## Licensing

The [Unlicense](https://unlicense.org/)
