
game.HeroEntity = me.Entity.extend({
  
  init: function(x, y, settings) {
    settings.image = 'hero';
    settings.spritewidth = 32;
    // call the constructor
    this._super(me.Entity, 'init', [x, y, settings]);
    
    this.color = 'red';

    // set the default horizontal & vertical speed (accel vector)
    this.body.setVelocity(3, 12);
 
    // set the display to follow our position on both axis
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
 
    // ensure the player is updated even when outside of the viewport
    this.alwaysUpdate = true;
 
    this.renderable.addAnimation("white_red",  [0]);
    this.renderable.addAnimation("white_blue",  [1]);
    this.renderable.addAnimation("white_yellow",  [2]);
    this.renderable.addAnimation("red_red",  [3]);
    this.renderable.addAnimation("red_blue",  [4]);
    this.renderable.addAnimation("red_yellow",  [5]);
    this.renderable.addAnimation("blue_red",  [6]);
    this.renderable.addAnimation("blue_blue",  [7]);
    this.renderable.addAnimation("blue_yellow",  [8]);
    this.renderable.addAnimation("yellow_red",  [9]);
    this.renderable.addAnimation("yellow_blue",  [10]);
    this.renderable.addAnimation("yellow_yellow",  [11]);

    this.canChange = false;
    this.canChangeWhileJumping = false;

    this.base = 'white';

    this.renderable.setCurrentAnimation(this.base + '_' + this.color);
  },
  setBonusType: function(color) {
    switch(color) {
        case 'blue':
            this.base = 'blue';
            this.body.setVelocity(7.5, 13);
        break;
        case 'red':
            this.base = 'red';
            this.body.setVelocity(1.7, 21);
        break;
        case 'yellow':
            this.base = 'yellow';
            this.body.setVelocity(3.7, 16);
        break;        
    }
    this.shouldUpdateAnimation = true;     
  },
  update: function(dt) {
    this.hasUpdated = false;
    if (me.input.isKeyPressed('left')) {
      // flip the sprite on horizontal axis
      this.renderable.flipX(true);
      // update the entity velocity
      this.body.vel.x -= this.body.accel.x * me.timer.tick;

    } else if (me.input.isKeyPressed('right')) {
      // unflip the sprite
      this.renderable.flipX(false);
      // update the entity velocity
      this.body.vel.x += this.body.accel.x * me.timer.tick;
    
    } else {
      this.body.vel.x = 0;
    }
    if (me.input.isKeyPressed('jump')) {
      // make sure we are not already jumping or falling
      if (!this.body.jumping && !this.body.falling) {
        // set current vel to the maximum defined value
        // gravity will then do the rest
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
        // set the jumping flag
        this.body.jumping = true;
      }
 
    }
g    if (me.input.isKeyPressed('reload')) {
        me.game.viewport.fadeIn('#000', 150, function() {
            if (game.level != 5) {
                me.levelDirector.reloadLevel();                
            }
            else {
                game.level = 0;
                me.levelDirector.loadLevel('area0');
            }
        });
    }

    if (me.input.isKeyPressed('change_color')) {
        if (!this.canChange) 
            return false;
        if ((!this.body.jumping && !this.body.falling) || this.canChangeWhileJumping) {
            this.old_color = this.color;
            switch (this.color) {
                case 'red':
                    this.color = 'blue';
                break;
                case 'blue':
                    this.color = 'yellow';
                break;
                case 'yellow':
                    this.color = 'red';
                break;
            }            
        }
        me.audio.play("changecolor", false);
        this.shouldUpdateAnimation = true;     
    }

    if (this.shouldUpdateAnimation) {
        this.renderable.setCurrentAnimation(this.base + '_' + this.color);
        this.hasUpdated = true;
        this.shouldUpdateAnimation = false;        
    }

    // apply physics to the body (this moves the entity)
    this.body.update(dt);
 
    // handle collisions against other shapes
    me.collision.check(this);
 
    // return true if we moved or if the renderable was updated
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0 || this.old_color != this.color || this.hasUpdated);
  },
  onCollision : function (response, other) {
        switch (other.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                if (colors.indexOf(other.type) != -1 && colors_components[other.type].indexOf(this.color) != -1) {
                    if (this.body.falling &&
                        !me.input.isKeyPressed('down') &&
                        // Shortest overlap would move the player upward
                        (response.overlapV.y > 0) &&
                        // The velocity is reasonably fast enough to have penetrated to the overlap depth
                        (~~this.body.vel.y >= ~~response.overlapV.y)
                    ) {
                        // Disable collision on the x axis
                        response.overlapV.x = 0;
                        // Repond to the platform (it is solid)
                        return true;
                    }
                    // Do not respond to the platform (pass through)
                    return false;
                }
                else if (colors.indexOf(other.type) != -1) {
                    return false;
                }
                else if (other.type == 'bonus') {
                    return false;
                }
                return true;
                break;
        }
        return false;
    }
});

game.BonusEntity = me.CollectableEntity.extend({
  init: function(x, y, settings) {
    settings.image = settings.name;
    settings.spritewidth = 32;

    this._super(me.CollectableEntity, 'init', [x, y , settings]);
    this.bonus_type = settings.bonus_type;

    this.anchorPoint.set(0.5, 0.5);
    this.color = settings.name.substr(0, settings.name.indexOf('_'));
    this.type = 'bonus';
  },
 
  onCollision : function (response, other) {
    if (this.color == other.color) {
        me.audio.play("cling", false);
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.game.world.removeChild(this);
        other.setBonusType(this.color);
    } 
    return false;
  }
});
game.ColorChangeBonusEntity = me.CollectableEntity.extend({
  init: function(x, y, settings) {
    settings.image = 'first_bonus';
    settings.spritewidth = 32;
    this._super(me.CollectableEntity, 'init', [x, y , settings]);
    this.bonus_type = settings.bonus_type;

    this.anchorPoint.set(0.5, 0.5);
 
  },
 
  onCollision : function (response, other) {
    me.audio.play("bonus", false);
    // make sure it cannot be collected "again"
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
    // remove it
    me.game.world.removeChild(this);
    // add the bonus to the player
    other.canChange = true;
 
    return false;
  }
});

game.JumpColorChangeBonusEntity = me.CollectableEntity.extend({
  init: function(x, y, settings) {
    settings.image = 'second_bonus';
    settings.spritewidth = 32;
    this._super(me.CollectableEntity, 'init', [x, y , settings]);
    this.bonus_type = settings.bonus_type;

    this.anchorPoint.set(0.5, 0.5);
 
  },
 
  onCollision : function (response, other) {
    // do something when collected
    me.audio.play("bonus", false);
    // make sure it cannot be collected "again"
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
    // remove it
    me.game.world.removeChild(this);
    // add the bonus to the player
    other.canChangeWhileJumping = true;
 
    return false;
  }
});

game.EndOfTheLevelEntity = me.CollectableEntity.extend({
  init: function(x, y, settings) {
    settings.image = "end_of_level";
    settings.spritewidth = 32;

    this._super(me.CollectableEntity, 'init', [x, y , settings]);
    this.bonus_type = settings.bonus_type;

    this.anchorPoint.set(0.5, 0.5);
    this.color = settings.name.substr(0, settings.name.indexOf('_'));
    this.type = 'bonus';
  },
 
  onCollision : function (response, other) {
    me.game.viewport.fadeIn('#fff', 150, function(){
        game.level++;
        if (game.level > 1) {
            me.audio.stopTrack();            
            me.audio.playTrack("track2");            
        }
        me.levelDirector.loadLevel('area' + game.level);

    });
    me.audio.play("endoflevel", false);
    me.game.world.removeChild(this);
    return false;
  }
});

