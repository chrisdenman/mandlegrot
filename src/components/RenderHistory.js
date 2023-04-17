import PropTypes from "prop-types";
import HistoricRender from "./HistoricRender";

/**
 *
 * @param {HistoricRender[]} history
 * @param {number} thumbnailWidthPixels
 * @param {number} thumbnailHeightPixels
 * @param {React.Ref<HTMLCanvasElement>[]} canvasRefs
 * @param {function} onDoubleClick
 * @return {JSX.Element}
 */
const RenderHistory = ({
                           history,
                           thumbnailWidthPixels,
                           thumbnailHeightPixels,
                           canvasRefs,
                           onDoubleClick
                       }) => (
    history.slice().reverse().map((historicRender, index) =>
        <HistoricRender key={index}
                        index={index}
                        historicRender={historicRender}
                        canvasRef={canvasRefs[index]}
                        canvasWidthPixels={thumbnailWidthPixels}
                        canvasHeightPixels={thumbnailHeightPixels}
                        onDoubleClick={(event) => onDoubleClick(history.length - 1 - index, event)}
        />
    )
);

RenderHistory.propTypes = {
    history: PropTypes.array.isRequired,
    thumbnailWidthPixels: PropTypes.number.isRequired,
    thumbnailHeightPixels: PropTypes.number.isRequired,
    canvasRefs: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({current: PropTypes.instanceOf(HTMLCanvasElement)})
    ])),
    onDoubleClick: PropTypes.func.isRequired,
};

export default RenderHistory;