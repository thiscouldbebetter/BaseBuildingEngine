 
function ControlContainer(name, pos, size, children)
{
	this.name = name;
	this.pos = pos;	
	this.size = size;
	this.children = children;
 
	for (var i = 0; i < this.children.length; i++)
	{
		var child = this.children[i];
		child.parent = this;
	}
}

{
	ControlContainer.prototype.containsPos = function(posToCheck)
	{
		return Control.doesControlContainPos(this, posToCheck);
	}
 
	ControlContainer.prototype.draw = function(display)
	{
		var posAbsolute = this.posAbsolute();
		display.drawRectangle
		(
			posAbsolute,
			this.size,
			display.colorFore, // border
			display.colorBack // fill
		);
 
		var children = this.children;
		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.draw(display);
		}
	}
 
	ControlContainer.prototype.mouseClick = function(mouseClickPosAbsolute)
	{
		if (this.containsPos(mouseClickPosAbsolute) == true)
		{
			for (var i = 0; i < this.children.length; i++)
			{
				var child = this.children[i];
				child.mouseClick(mouseClickPosAbsolute);
			}
		}
	}
 
	ControlContainer.prototype.posAbsolute = function()
	{
		return Control.controlPosAbsolute(this);
	}
}
