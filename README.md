# [MandleGrot 0.1.2](https://github.com/chrisdenman/mandlegrot)

A React application for calculating familiar Mandlebrot sets images.

The following images were created using the tool:

![B&W Mandlebrot Set](./public/samples/1200x1200_b&w.png)
![Red Mandlebrot Set](./public/samples/1200x1200_red.png)
![Odd Mandlebrot Set](./public/samples/1200x1200_odd.png)
![Random Mandlebrot Set](./public/samples/1200x1200_random.png)

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

- Add a history of renders: (thumbnail, renderinfo, palette, maxIterationsPalette) so that a user can switch back easily
    - A scrollable pane of thumbnail (images)
    - tooltip for renderinfo
    - maybe a name/tag
- Change the iteration data buffer to use 16 bit words?
    - This would reduce the memory requirements by half for the iteration data but slow the memory
    - copy operations for colouring, is it worth it?
- Triggering query parameters?
- Create a decent UI.
    - Maybe full screen (scrollable) image with floating controls?
    - Improve the colour management: editable colours, add/remove functionality.
- User-friendly image saving (with details on the extents maybe).

## ToDo

- Sort out the publication of the dependencies and host it.
- Validate the region boundaries for integral and continuous ranges, make sure endpoints are correct
- Improve the project structure
- Input validation could be better, still render the canvas when max modulus is erroneous e.g.
    - perhaps a separate states for dimensions and other validity?
- Handle failures properly: memory and worker construction in particular.
- Sort out the NaN state transition issue when inputs are not valid.

## Queries

- In App.#windowCursorLocation, why do we need to use the min function?

## Version History

See [Version History](./VERSIONS.md)

## Licensing

The [Unlicense](https://unlicense.org/)
