import BattleZone from './BattleZone';
import OpponentBench from './OpponentBench';
import PlayerBench from './PlayerBench';

function Arena() {
  return (
    <div className="arena">
      <div className="opponent">
        <OpponentBench />
      </div>

      <BattleZone />
      
      <div className="player">
        <PlayerBench />
      </div>
      
    </div>
  );
}

export default Arena;