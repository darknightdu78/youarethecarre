
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0
    },


    // Run on page load.
    "onload" : function () {
    // Initialize the video.
    if (!me.video.init("screen",  me.video.CANVAS, 960, 640, true, 'auto')) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // add "#debug" to the URL to enable the debug Panel
    if (document.location.hash === "#debug") {
        window.onReady(function () {
            me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
        });
    }

    // Initialize the audio.
    me.audio.init("mp3,ogg");

    // Set a callback to run when loading is complete.
    me.loader.onload = this.loaded.bind(this);

    // Load the resources.
    me.loader.preload(game.resources);

    me.state.set(me.state.LOADING, new game.TitleScreen());
    // Initialize melonJS and display a loading screen.
    me.state.change(me.state.LOADING)
    ;

    this.level = 0;
},

    // Run on game resources loaded.
    "loaded" : function () {
        me.state.set(me.state.MENU, new game.TitlePressEnterScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // Add entities to the entity pool
        me.pool.register("hero", game.HeroEntity);
        me.pool.register("end_of_level", game.EndOfTheLevelEntity);
        me.pool.register("red_bonus", game.BonusEntity);
        me.pool.register("blue_bonus", game.BonusEntity);
        me.pool.register("yellow_bonus", game.BonusEntity);
        me.pool.register("color_change", game.ColorChangeBonusEntity);
        me.pool.register("jump_color_change", game.JumpColorChangeBonusEntity);

        // keyboard handling
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP, "jump", true);
        me.input.bindKey(me.input.KEY.DOWN,  "change_color", true);
        me.input.bindKey(me.input.KEY.Z,  "cheat", true);
        me.input.bindKey(me.input.KEY.R,  "reload", true);
        // Start the game.
        me.state.change(me.state.MENU);
    }
};
