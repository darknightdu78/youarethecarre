game.TitleScreen = me.ScreenObject.extend({
    onResetEvent : function() {
    me.game.world.addChild(
      new me.Sprite (
        0,0,
        me.loader.getImage('title_screen')
      ),
      1
    );
 

  }
});

game.TitlePressEnterScreen = me.ScreenObject.extend({
  onResetEvent : function() {
      me.game.world.addChild(
      new me.Sprite (
        0,0,
        me.loader.getImage('title_screen_press')
      ),
      1
    );
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
        if (action === "enter") {
          me.state.change(me.state.PLAY);
        }
      }); 
      me.audio.setVolume(0.5);
      me.audio.playTrack("title");

  }
});