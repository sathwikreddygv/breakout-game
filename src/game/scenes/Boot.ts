import { Scene } from 'phaser';

export class Boot extends Scene
{   
    ball:any
    cursors:any
    paddle:any
    gameOverText:any
    restartButton:any
    isGameOver = false
    private moveLeft: boolean = false;
    private moveRight: boolean = false;
    private leftZone: any;
    private rightZone: any;

    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        // this.load.image('background', 'assets/bg.png');
        
    }

    update() {
        if (this.isGameOver) return;

        // const PADDLE_SPEED = 500;
        // Combined input check for both keyboard and touch
        if (this.cursors.left.isDown || this.moveLeft) {
            this.paddle.x -= 10;
            this.paddle.body.position.x = this.paddle.x - this.paddle.width/2;  // Update physics body
        }
        else if (this.cursors.right.isDown || this.moveRight) {
            this.paddle.x += 10;
            this.paddle.body.position.x = this.paddle.x - this.paddle.width/2;  // Update physics body
        }


        // Keep paddle within the screen bounds
        this.paddle.x = Phaser.Math.Clamp(this.paddle.x, 50, 1000);

        // Check if ball is below paddle (game over condition)
        if (this.ball.y > this.paddle.y) {
            this.gameOver();
        }
    }

    create ()
    {
        this.physics.world.setBoundsCollision(true, true, true, false); // disable bottom boundary
        this.physics.world.setFPS(120); // Higher FPS for better collision detection

        // Create the ball
        this.ball = this.add.circle(400, 250, 10, 0xffffff);
        this.physics.add.existing(this.ball);
        
        // Set initial ball velocity and physics properties
        this.ball.body.setVelocity(400, 400);
        this.ball.body.setBounce(1);
        this.ball.body.setCollideWorldBounds(true);

        // Create the paddle
        this.paddle = this.add.rectangle(400, 750, 100, 20, 0xffffff);
        this.physics.add.existing(this.paddle, true);
        // this.paddle.body.setImmovable(true);
        // Enable paddle updates
        this.paddle.body.moves = false;  // Don't move with physics
        this.paddle.body.allowGravity = false;

        this.physics.world.setFPS(120);
        
        // Add collision with proper callback
        this.physics.add.collider(
            this.ball, 
            this.paddle,
            // (ball, paddle) => {
            //     // Optionally adjust ball velocity on hit to prevent straight up-down loops
            //     const velocity = ball.body.velocity;
            //     const paddleCenter = paddle.x;
            //     const diff = ball.x - paddleCenter;
            //     ball.body.setVelocityX(diff * 5); // Adds horizontal velocity based on hit position
            // },
            undefined,
            undefined,
            this
        );
        
        this.cursors = this.input.keyboard?.createCursorKeys();

        // Create game over text (hidden initially)
        this.gameOverText = this.add.text(500, 300, 'GAME OVER', {
            fontSize: '64px',
            color: '#ffffff',
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.gameOverText.setVisible(false);

        // Create restart button (hidden initially)
        this.restartButton = this.add.rectangle(500, 400, 200, 50, 0x00ff00);
        const buttonText = this.add.text(500, 400, 'RESTART', {
            fontSize: '32px',
            color: '#000000'
        }).setOrigin(0.5);
        
        // Make button interactive
        this.restartButton.setInteractive();
        this.restartButton.on('pointerdown', () => this.restartGame());
        
        // Group button and text together
        this.restartButton.buttonText = buttonText;
        this.restartButton.setVisible(false);
        buttonText.setVisible(false);

        // Enable both touch and mouse input
        this.input.addPointer(1); // Ensure we track at least 2 pointers for multi-touch

        // Add touch zones only for mobile screens
        // if (this.scale.width <= 768) {  // Common mobile breakpoint
            this.leftZone = this.add.rectangle(0, 0, this.scale.width / 2, this.scale.height)
                .setOrigin(0, 0)
                .setInteractive()
                .setAlpha(1);  // Start invisible
            
            this.rightZone = this.add.rectangle(this.scale.width / 2, 0, this.scale.width / 2, this.scale.height)
                .setOrigin(0, 0)
                .setInteractive()
                .setAlpha(1);  // Start invisible

            this.leftZone.on('pointerdown', () => {
                this.moveLeft = true;
                console.log('leftZone');
            });

            this.leftZone.on('pointerup', () => {
                this.moveLeft = false;
            });

            this.rightZone.on('pointerdown', () => {
                this.moveRight = true;
                console.log('rightZone');
            });

            this.rightZone.on('pointerup', () => {
                this.moveRight = false;
            });
        // }
    }

    gameOver() {
        this.isGameOver = true;
        this.ball.body.setVelocity(0, 0);
        this.gameOverText.setVisible(true);
        this.restartButton.setVisible(true);
        this.restartButton.buttonText.setVisible(true);
        if (this.leftZone) this.leftZone.disableInteractive();
        if (this.rightZone) this.rightZone.disableInteractive();
    }

    restartGame() {
        this.isGameOver = false;
        this.ball.setPosition(400, 250);
        this.ball.body.setVelocity(400, 400);
        this.paddle.setPosition(400, 750);
        this.gameOverText.setVisible(false);
        this.restartButton.setVisible(false);
        this.restartButton.buttonText.setVisible(false);
        if (this.leftZone) this.leftZone.setInteractive();
        if (this.rightZone) this.rightZone.setInteractive();
    }
}