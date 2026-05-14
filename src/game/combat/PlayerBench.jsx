import { playerBoneheads } from '../state/boneheads.js'

function PlayerBench() {
    return (
        <div className="player-bench">
            {playerBoneheads.map((bonehead, index) => (
                <div key={index} className="bench-bonehead">
                    <img className="bonehead-image" src={bonehead.image} alt={bonehead.boneheadName} />
                    {bonehead.boneheadName}
                </div>
                )
            )}
        </div>
    );
}

export default PlayerBench;