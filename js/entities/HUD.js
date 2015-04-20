TIME_BET = 2500;


/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new game.HUD.QuestTextItem(5, 5));
    }
});


game.HUD.QuestTextItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {
        this.currentText = -1;
        this._super(me.Renderable, 'init', [x, y, 10, 10]);
        this.gameFont = new me.Font('gamefont', 32, '#FFFFFF');
        this.mselapsed = TIME_BET;
        this.text = level_texts[game.level][this.currentText];
        this.currentLevel = game.level;
    },

    /**
     * update function
     */
    update : function (dt) {
        if (this.currentLevel != game.level) {
            this.currentLevel = game.level;
            this.currentText = -1;
            this.mselapsed = TIME_BET;
            this.text = '';
        }
        this.mselapsed += dt;
        if (this.mselapsed > TIME_BET) {
            this.currentText++;
            if (level_texts[game.level].length > this.currentText) {
                this.text = level_texts[game.level][this.currentText];                
            }
            else {
                this.text = "";
            }
            console.log(game.level);
            console.log(this.currentText);
            console.log(level_texts[game.level]);
            console.log(this.text);            
            this.mselapsed -= TIME_BET; 
            return true;
        }
        return false;
    },

    draw : function (renderer) {
        var context = renderer.getContext();
        this.gameFont.draw(context, this.text, this.pos.x, this.pos.y);
    }

});
