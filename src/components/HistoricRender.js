import PropTypes from "prop-types";

/**
 *
 * @param {number} index
 * @param {HistoricRender} historicRender
 * @param {React.Ref<HTMLCanvasElement>} canvasRef
 * @param {number} canvasWidthPixels
 * @param {number} canvasHeightPixels
 * @param {function} onDoubleClick
 * @return {JSX.Element}
 */
const HistoricRender = ({
                            index,
                            historicRender,
                            canvasRef,
                            canvasWidthPixels,
                            canvasHeightPixels,
                            onDoubleClick,
}) => (
    <div key={index} onDoubleClick={onDoubleClick}>
        <canvas
            className="historicRender"
            width={canvasWidthPixels}
            height={canvasHeightPixels}
            ref={canvasRef}
        />
    </div>
);

HistoricRender.propTypes = {
    index: PropTypes.number.isRequired,
    historicRender: PropTypes.object.isRequired,
    canvasWidthPixels: PropTypes.number.isRequired,
    canvasHeightPixels: PropTypes.number.isRequired,
    canvasRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(HTMLCanvasElement) })
    ]),
    onDoubleClick: PropTypes.func.isRequired,
};

export default HistoricRender