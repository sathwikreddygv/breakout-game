import { Boot } from './scenes/Boot';
// import { GameOver } from './scenes/GameOver';
// import { Game as MainGame } from './scenes/Game';
import { AUTO, Game, Scale } from 'phaser';
// import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y : 0, x:0}
        }
    },
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        // Optional: set minimum and maximum dimensions
        min: {
            width: 320,
            height: 240
        },
        max: {
            width: 1600,
            height: 1200
        },
        zoom: 1
    }
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;