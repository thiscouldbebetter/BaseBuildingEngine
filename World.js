
function World(improvementDefns, moverDefns, map, base)
{
	this.improvementDefns = improvementDefns;
	this.moverDefns = moverDefns;
	this.map = map;
	this.base = base;
	
	this.buildableDefns = 
		[].concat(this.improvementDefns).concat(this.moverDefns);
 
	this.improvementDefns.addLookups("name");
	this.moverDefns.addLookups("name");
	this.buildableDefns.addLookups("name");
}
{
 	World.prototype.initialize = function()
	{
		var displaySize = Globals.Instance.display.viewSize;
		this.base.initialize(this);		
		this.update();
	}
 
	World.prototype.update = function()
	{
		this.update_Input();
		this.draw(Globals.Instance.display);
	}
 
	World.prototype.update_Input = function()
	{
		var inputHelper = Globals.Instance.inputHelper;
		if (inputHelper.isMouseClicked == true)
		{
			inputHelper.isMouseClicked = false;
			this.toControl().mouseClick
			(
				inputHelper.mousePos
			);
		}
		else if (inputHelper.keyPressed != null)
		{
			var keyPressed = inputHelper.keyPressed;
			// todo
		}
	}
	
	// controls
	
	World.prototype.toControl = function()
	{
		var displaySize = Globals.Instance.display.viewSize;
		return this.base.toControl(new Coords(0, 0), displaySize, this);		
	}
	
	// drawable
	
	World.prototype.draw = function()
	{
		var display = Globals.Instance.display;
		display.clear();
		this.toControl().draw(display, this.map);
	}
}
